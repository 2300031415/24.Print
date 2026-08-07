const db = require('../config/db');

const getPricing = async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT p.*, m.name as machine_name, m.machine_code 
            FROM pricing p 
            LEFT JOIN machines m ON p.machine_id = m.id 
            ORDER BY p.is_default DESC, p.created_at DESC
        `);
        res.json({ success: true, pricingList: result.rows });
    } catch (err) {
        next(err);
    }
};

const updatePricing = async (req, res, next) => {
    try {
        const { id, machine_id, bw_single_page_price, color_single_page_price, bw_duplex_page_price, color_duplex_page_price, paper_size, is_default } = req.body;

        let result;
        if (id) {
            result = await db.query(
                `UPDATE pricing 
                 SET bw_single_page_price = $1,
                     color_single_page_price = $2,
                     bw_duplex_page_price = $3,
                     color_duplex_page_price = $4,
                     paper_size = $5,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $6 RETURNING *`,
                [bw_single_page_price, color_single_page_price, bw_duplex_page_price, color_duplex_page_price, paper_size || 'A4', id]
            );
        } else {
            result = await db.query(
                `INSERT INTO pricing (machine_id, bw_single_page_price, color_single_page_price, bw_duplex_page_price, color_duplex_page_price, paper_size, is_default)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [machine_id || null, bw_single_page_price, color_single_page_price, bw_duplex_page_price, color_duplex_page_price, paper_size || 'A4', is_default || false]
            );
        }

        res.json({ success: true, pricing: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const getGst = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM gst ORDER BY is_active DESC, created_at DESC');
        res.json({ success: true, gstList: result.rows });
    } catch (err) {
        next(err);
    }
};

const updateGst = async (req, res, next) => {
    try {
        const { tax_name, percentage, cgst_percentage, sgst_percentage, igst_percentage } = req.body;

        // Deactivate old active GST
        await db.query('UPDATE gst SET is_active = false');

        const result = await db.query(
            `INSERT INTO gst (tax_name, percentage, cgst_percentage, sgst_percentage, igst_percentage, is_active)
             VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
            [tax_name || `GST ${percentage}%`, percentage, cgst_percentage || percentage / 2, sgst_percentage || percentage / 2, igst_percentage || percentage]
        );

        res.json({ success: true, gst: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const getSettings = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM settings');
        const settingsObj = {};
        result.rows.forEach(row => {
            settingsObj[row.setting_key] = row.setting_value;
        });
        res.json({ success: true, settings: settingsObj });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPricing,
    updatePricing,
    getGst,
    updateGst,
    getSettings
};
