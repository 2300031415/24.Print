const bcrypt = require('bcryptjs');
const db = require('../config/db');

const getClients = async (req, res, next) => {
    try {
        const queryStr = `
            SELECT c.*, u.email, u.full_name, u.status as user_status,
                   COUNT(m.id)::int as total_machines,
                   COALESCE(SUM(t.client_share), 0)::numeric as total_earnings
            FROM clients c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN machines m ON m.client_id = c.id
            LEFT JOIN transactions t ON t.client_id = c.id
            GROUP BY c.id, u.id
            ORDER BY c.created_at DESC
        `;
        const result = await db.query(queryStr);
        res.json({ success: true, clients: result.rows });
    } catch (err) {
        next(err);
    }
};

const getClientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            `SELECT c.*, u.email, u.full_name, u.phone 
             FROM clients c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }

        res.json({ success: true, client: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const createClient = async (req, res, next) => {
    const clientDb = await db.pool.connect();
    try {
        await clientDb.query('BEGIN');

        const { email, password, full_name, phone, business_name, address, city, state, pincode, commission_rate } = req.body;

        if (!email || !password || !business_name) {
            return res.status(400).json({ success: false, message: 'Email, password, and business name are required.' });
        }

        // Check existing user
        const existing = await clientDb.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email is already registered.' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const userRes = await clientDb.query(
            `INSERT INTO users (email, password_hash, full_name, phone, role, status) 
             VALUES ($1, $2, $3, $4, 'client', 'active') RETURNING id`,
            [email.toLowerCase().trim(), password_hash, full_name || business_name, phone]
        );

        const userId = userRes.rows[0].id;

        const clientRes = await clientDb.query(
            `INSERT INTO clients (user_id, business_name, contact_phone, address, city, state, pincode, commission_rate)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [userId, business_name, phone || '', address || '', city || '', state || '', pincode || '', commission_rate || 80.00]
        );

        await clientDb.query('COMMIT');
        res.status(211).json({ success: true, client: clientRes.rows[0] });
    } catch (err) {
        await clientDb.query('ROLLBACK');
        next(err);
    } finally {
        clientDb.release();
    }
};

const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { business_name, contact_phone, address, city, state, pincode, commission_rate, status } = req.body;

        const result = await db.query(
            `UPDATE clients 
             SET business_name = COALESCE($1, business_name),
                 contact_phone = COALESCE($2, contact_phone),
                 address = COALESCE($3, address),
                 city = COALESCE($4, city),
                 state = COALESCE($5, state),
                 pincode = COALESCE($6, pincode),
                 commission_rate = COALESCE($7, commission_rate),
                 status = COALESCE($8, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 RETURNING *`,
            [business_name, contact_phone, address, city, state, pincode, commission_rate, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }

        res.json({ success: true, client: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getClients,
    getClientById,
    createClient,
    updateClient
};
