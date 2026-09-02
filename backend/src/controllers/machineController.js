const QRCode = require('qrcode');
const db = require('../config/db');

const getMachines = async (req, res, next) => {
    try {
        let queryStr = `
            SELECT m.*, c.business_name as client_name, c.status as client_status,
                   (SELECT COUNT(*) FROM print_jobs WHERE machine_id = m.id AND status = 'completed')::int as total_jobs_printed
            FROM machines m
            JOIN clients c ON m.client_id = c.id
        `;
        const params = [];

        // If client, restrict to client's machines only
        if (req.user && req.user.role === 'client') {
            let clientId = req.user.client_id;
            if (!clientId && req.user.id) {
                const clientRes = await db.query('SELECT id FROM clients WHERE user_id::text = $1::text OR id::text = $1::text', [req.user.id]);
                if (clientRes.rows.length > 0) {
                    clientId = clientRes.rows[0].id;
                } else {
                    clientId = req.user.id;
                }
            }
            queryStr += ` WHERE m.client_id::text = $1::text OR c.user_id::text = $1::text`;
            params.push(clientId);
        }

        queryStr += ` ORDER BY m.created_at DESC`;

        const result = await db.query(queryStr, params);
        
        // If client partner is disabled/suspended, force machine operational status to maintenance
        const machines = result.rows.map(m => {
            if (m.client_status === 'suspended' || m.client_status === 'inactive' || m.client_status === 'disabled') {
                return { ...m, status: 'maintenance' };
            }
            return m;
        });

        res.json({ success: true, machines });
    } catch (err) {
        next(err);
    }
};

const getMachineByCode = async (req, res, next) => {
    try {
        const { machineCode } = req.params;

        const machineRes = await db.query(
            `SELECT m.*, c.business_name as client_name, c.status as client_status 
             FROM machines m
             JOIN clients c ON m.client_id = c.id
             WHERE m.machine_code = $1 OR m.id::text = $1`,
            [machineCode]
        );

        if (machineRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Kiosk machine not found.' });
        }

        const machine = machineRes.rows[0];

        // Override status if client account is suspended/disabled
        if (machine.client_status === 'suspended' || machine.client_status === 'inactive' || machine.client_status === 'disabled') {
            machine.status = 'maintenance';
        }

        // Fetch pricing for this machine (or default fallback)
        const pricingRes = await db.query(
            `SELECT * FROM pricing 
             WHERE machine_id = $1 OR is_default = true 
             ORDER BY machine_id IS NOT NULL DESC, is_default DESC 
             LIMIT 1`,
            [machine.id]
        );

        const pricing = pricingRes.rows[0] || {
            bw_single_page_price: '2.00',
            color_single_page_price: '10.00',
            bw_duplex_page_price: '3.50',
            color_duplex_page_price: '18.00',
            paper_size: 'A4'
        };

        // Fetch active GST rates
        const gstRes = await db.query('SELECT * FROM gst WHERE is_active = true LIMIT 1');
        const gst = gstRes.rows[0] || { percentage: '18.00' };

        res.json({
            success: true,
            machine,
            pricing,
            gst
        });
    } catch (err) {
        next(err);
    }
};

const createMachine = async (req, res, next) => {
    try {
        const { machine_code, name, client_id, location_address, city, state, pincode, default_printer_name, razorpay_key_id, razorpay_key_secret } = req.body;

        if (!machine_code || !client_id) {
            return res.status(400).json({ success: false, message: 'Machine Code and Client Owner are required.' });
        }

        // Check duplicate code
        const existing = await db.query('SELECT id FROM machines WHERE machine_code = $1', [machine_code.toUpperCase().trim()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Machine Code already exists.' });
        }

        const publicDomain = process.env.PUBLIC_DOMAIN || 'https://easyxerox.com';
        const qrUrl = `${publicDomain}/upload/${machine_code.toUpperCase().trim()}`;
        const qrCodeBase64 = await QRCode.toDataURL(qrUrl);

        const result = await db.query(
            `INSERT INTO machines (machine_code, name, client_id, location_address, city, state, pincode, qr_code_url, default_printer_name, razorpay_key_id, razorpay_key_secret, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'online') RETURNING *`,
            [
                machine_code.toUpperCase().trim(),
                name || machine_code.toUpperCase().trim(),
                client_id,
                location_address || '',
                city || '',
                state || '',
                pincode || '',
                qrCodeBase64,
                default_printer_name || 'Brother DCP-T820DW Printer',
                razorpay_key_id || null,
                razorpay_key_secret || null
            ]
        );

        res.status(201).json({
            success: true,
            machine: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
};

const updateMachineStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['online', 'offline', 'maintenance'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value.' });
        }

        const result = await db.query(
            'UPDATE machines SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }

        const machine = result.rows[0];

        // Broadcast status change via Socket.IO
        const io = req.app.get('socketio');
        if (io) {
            io.emit('MACHINE_STATUS_CHANGED', { machineId: machine.id, machineCode: machine.machine_code, status });
        }

        res.json({ success: true, machine });
    } catch (err) {
        next(err);
    }
};

const getMachineAds = async (req, res, next) => {
    try {
        const { machineCode } = req.params;

        // Fetch machine ID
        const mRes = await db.query('SELECT id FROM machines WHERE machine_code = $1 OR id::text = $1', [machineCode]);
        if (mRes.rows.length === 0) {
            return res.json({ success: true, ads: [] });
        }

        const machineId = mRes.rows[0].id;

        const result = await db.query(
            `SELECT a.* 
             FROM advertisements a
             JOIN machine_ads ma ON a.id = ma.advertisement_id
             WHERE ma.machine_id = $1 AND a.status = 'approved'
             ORDER BY a.created_at DESC`,
            [machineId]
        );

        res.json({ success: true, ads: result.rows });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMachines,
    getMachineByCode,
    createMachine,
    updateMachineStatus,
    getMachineAds
};
