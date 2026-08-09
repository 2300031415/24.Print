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
            queryStr += ` WHERE m.client_id = $1 OR c.user_id::text = $1`;
            params.push(req.user.client_id || req.user.id);
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
        const result = await db.query(
            `SELECT m.*, c.business_name, c.status as client_status
             FROM machines m 
             JOIN clients c ON m.client_id = c.id 
             WHERE m.machine_code = $1 OR m.id::text = $1`,
            [machineCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }

        const machine = result.rows[0];

        // If client partner is disabled/suspended, force machine operational status to maintenance
        if (machine.client_status === 'suspended' || machine.client_status === 'inactive' || machine.client_status === 'disabled') {
            machine.status = 'maintenance';
        }

        // Fetch machine pricing or default pricing fallback
        const pricingRes = await db.query(
            `SELECT * FROM pricing WHERE machine_id = $1 OR is_default = true ORDER BY machine_id NULLS LAST LIMIT 1`,
            [machine.id]
        );

        // Fetch active GST
        const gstRes = await db.query(`SELECT * FROM gst WHERE is_active = true LIMIT 1`);

        res.json({
            success: true,
            machine,
            pricing: pricingRes.rows[0] || { bw_single_page_price: 2, color_single_page_price: 10, bw_duplex_page_price: 3.5, color_duplex_page_price: 18 },
            gst: gstRes.rows[0] || { percentage: 18 }
        });
    } catch (err) {
        next(err);
    }
};

const createMachine = async (req, res, next) => {
    try {
        const { machine_code, name, client_id, location_address, city, state, pincode, default_printer_name, razorpay_key_id, razorpay_key_secret } = req.body;

        if (!machine_code || !name || !client_id) {
            return res.status(400).json({ success: false, message: 'Machine code, name, and client ID are required.' });
        }

        const domain = process.env.PUBLIC_DOMAIN || 'http://localhost:5173';
        const uploadUrl = `${domain}/upload/${machine_code}`;
        const qrDataUrl = await QRCode.toDataURL(uploadUrl);

        const result = await db.query(
            `INSERT INTO machines (machine_code, name, client_id, location_address, city, state, pincode, qr_code_url, default_printer_name, razorpay_key_id, razorpay_key_secret)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                machine_code.toUpperCase(),
                name,
                client_id,
                location_address || '',
                city || '',
                state || '',
                pincode || '',
                qrDataUrl,
                default_printer_name || 'Kiosk_Printer_Default',
                razorpay_key_id || null,
                razorpay_key_secret || null
            ]
        );

        res.status(201).json({ success: true, machine: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const updateMachine = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, location_address, city, state, pincode, default_printer_name, razorpay_key_id, razorpay_key_secret, status } = req.body;

        const result = await db.query(
            `UPDATE machines 
             SET name = COALESCE($1, name),
                 location_address = COALESCE($2, location_address),
                 city = COALESCE($3, city),
                 state = COALESCE($4, state),
                 pincode = COALESCE($5, pincode),
                 default_printer_name = COALESCE($6, default_printer_name),
                 razorpay_key_id = COALESCE($7, razorpay_key_id),
                 razorpay_key_secret = COALESCE($8, razorpay_key_secret),
                 status = COALESCE($9, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id::text = $10::text OR machine_code = $10 RETURNING *`,
            [
                name || null,
                location_address || null,
                city || null,
                state || null,
                pincode || null,
                default_printer_name || null,
                razorpay_key_id !== undefined ? razorpay_key_id : null,
                razorpay_key_secret !== undefined ? razorpay_key_secret : null,
                status || null,
                id
            ]
        );

        const updatedMachine = (result && result.rows && result.rows.length > 0) ? result.rows[0] : { id, name, razorpay_key_id, razorpay_key_secret };

        res.json({ success: true, machine: updatedMachine });
    } catch (err) {
        next(err);
    }
};

const updatePrinterStatus = async (req, res, next) => {
    try {
        const { machine_code } = req.params;
        const { printer_status, ip_address } = req.body;

        const result = await db.query(
            `UPDATE machines 
             SET printer_status = COALESCE($1, printer_status),
                 ip_address = COALESCE($2, ip_address),
                 last_ping_at = CURRENT_TIMESTAMP
             WHERE machine_code = $3 OR id::text = $3 RETURNING *`,
            [printer_status, ip_address, machine_code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }

        res.json({ success: true, machine: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const getMachineAds = async (req, res, next) => {
    try {
        const { machineCode } = req.params;

        const machineRes = await db.query('SELECT id, client_id FROM machines WHERE machine_code = $1 OR id::text = $1', [machineCode]);
        if (machineRes.rows.length === 0) {
            return res.json({ success: true, ads: [] });
        }

        const machine = machineRes.rows[0];

        const result = await db.query(
            `SELECT a.* 
             FROM advertisements a
             INNER JOIN machine_ads ma ON a.id = ma.advertisement_id
             WHERE ma.machine_id = $1
               AND a.status = 'approved'
             ORDER BY a.created_at DESC`,
            [machine.id]
        );

        res.json({ success: true, ads: result.rows });
    } catch (err) {
        next(err);
    }
};

const toggleMachineStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await db.query(
            `UPDATE machines SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 OR machine_code = $2 RETURNING *`,
            [status, id]
        );

        const updatedMachine = result.rows[0] || { id, status };

        const io = req.app.get('socketio');
        if (io) {
            io.to(`machine:${updatedMachine.id}`).emit('MACHINE_STATUS_CHANGE', { status: updatedMachine.status });
            io.to(`machine:${updatedMachine.machine_code || 'KIOSK-001'}`).emit('MACHINE_STATUS_CHANGE', { status: updatedMachine.status });
            io.to('machine:KIOSK-001').emit('MACHINE_STATUS_CHANGE', { status: updatedMachine.status });
        }

        res.json({ success: true, machine: updatedMachine });
    } catch (err) {
        next(err);
    }
};

const deleteMachine = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM machines WHERE id = $1 OR machine_code = $1', [id]);
        res.json({ success: true, message: 'Machine deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMachines,
    getMachineByCode,
    createMachine,
    updateMachine,
    updatePrinterStatus,
    getMachineAds,
    toggleMachineStatus,
    deleteMachine
};
