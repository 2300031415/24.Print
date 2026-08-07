const QRCode = require('qrcode');
const db = require('../config/db');

const getMachines = async (req, res, next) => {
    try {
        let queryStr = `
            SELECT m.*, c.business_name as client_name,
                   (SELECT COUNT(*) FROM print_jobs WHERE machine_id = m.id AND status = 'completed')::int as total_jobs_printed
            FROM machines m
            JOIN clients c ON m.client_id = c.id
        `;
        const params = [];

        // If client, restrict to client's machines only
        if (req.user && req.user.role === 'client') {
            queryStr += ` WHERE m.client_id = $1`;
            params.push(req.user.client_id);
        }

        queryStr += ` ORDER BY m.created_at DESC`;

        const result = await db.query(queryStr, params);
        res.json({ success: true, machines: result.rows });
    } catch (err) {
        next(err);
    }
};

const getMachineByCode = async (req, res, next) => {
    try {
        const { machineCode } = req.params;
        const result = await db.query(
            `SELECT m.*, c.business_name 
             FROM machines m 
             JOIN clients c ON m.client_id = c.id 
             WHERE m.machine_code = $1 OR m.id::text = $1`,
            [machineCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }

        const machine = result.rows[0];

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
        const { machine_code, name, client_id, location_address, city, state, pincode, default_printer_name } = req.body;

        if (!machine_code || !name || !client_id) {
            return res.status(400).json({ success: false, message: 'Machine code, name, and client ID are required.' });
        }

        const domain = process.env.PUBLIC_DOMAIN || 'http://localhost:5173';
        const uploadUrl = `${domain}/upload/${machine_code}`;
        const qrDataUrl = await QRCode.toDataURL(uploadUrl);

        const result = await db.query(
            `INSERT INTO machines (machine_code, name, client_id, location_address, city, state, pincode, qr_code_url, default_printer_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [machine_code.toUpperCase(), name, client_id, location_address || '', city || '', state || '', pincode || '', qrDataUrl, default_printer_name || 'Kiosk_Printer_Default']
        );

        res.status(201).json({ success: true, machine: result.rows[0] });
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
        const result = await db.query(
            `SELECT a.* 
             FROM advertisements a
             JOIN machine_ads ma ON a.id = ma.advertisement_id
             JOIN machines m ON ma.machine_id = m.id
             WHERE (m.machine_code = $1 OR m.id::text = $1)
               AND a.status = 'approved'`,
            [machineCode]
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
    updatePrinterStatus,
    getMachineAds
};
