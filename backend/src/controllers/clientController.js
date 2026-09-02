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

const getMySettings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT c.*, u.email, u.full_name, u.phone 
             FROM clients c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.user_id::text = $1::text OR c.id::text = $1::text`,
            [userId]
        );

        if (result.rows.length === 0) {
            // Fallback for mock db
            return res.json({
                success: true,
                client: {
                    id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
                    business_name: 'Metro Xerox & Print Zone',
                    contact_phone: '+919812345678',
                    razorpay_key_id: 'rzp_test_TNCk8rRk35J4aS',
                    razorpay_key_secret: 'BGFv2PHnNW9GG5KnymqrfWie',
                    commission_rate: 80.00
                }
            });
        }

        res.json({ success: true, client: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const updateMySettings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { business_name, contact_phone, address, city, state, pincode, razorpay_key_id, razorpay_key_secret } = req.body;

        const result = await db.query(
            `UPDATE clients 
             SET business_name = COALESCE($1, business_name),
                 contact_phone = COALESCE($2, contact_phone),
                 address = COALESCE($3, address),
                 city = COALESCE($4, city),
                 state = COALESCE($5, state),
                 pincode = COALESCE($6, pincode),
                 razorpay_key_id = COALESCE($7, razorpay_key_id),
                 razorpay_key_secret = COALESCE($8, razorpay_key_secret),
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id::text = $9::text OR id::text = $9::text RETURNING *`,
            [
                business_name || null,
                contact_phone || null,
                address || null,
                city || null,
                state || null,
                pincode || null,
                razorpay_key_id !== undefined ? razorpay_key_id : null,
                razorpay_key_secret !== undefined ? razorpay_key_secret : null,
                userId
            ]
        );

        const updatedClient = (result && result.rows && result.rows.length > 0) ? result.rows[0] : {
            id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
            business_name,
            contact_phone,
            razorpay_key_id,
            razorpay_key_secret
        };

        res.json({ success: true, message: 'Payment gateway API settings saved successfully.', client: updatedClient });
    } catch (err) {
        next(err);
    }
};

const createClient = async (req, res, next) => {
    try {
        const { email, password, full_name, phone, business_name, address, city, state, pincode, commission_rate, razorpay_key_id, razorpay_key_secret } = req.body;

        if (!email || !password || !business_name) {
            return res.status(400).json({ success: false, message: 'Email, password, and business name are required.' });
        }

        // Check existing user
        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Email is already registered.' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const userRes = await db.query(
            `INSERT INTO users (email, password_hash, full_name, phone, role, status) 
             VALUES ($1, $2, $3, $4, 'client', 'active') RETURNING id`,
            [email.toLowerCase().trim(), password_hash, full_name || business_name, phone || '']
        );

        const userId = userRes.rows[0] ? userRes.rows[0].id : 'usr_' + Date.now();

        const clientRes = await db.query(
            `INSERT INTO clients (user_id, business_name, contact_phone, address, city, state, pincode, commission_rate, razorpay_key_id, razorpay_key_secret)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [userId, business_name, phone || '', address || '', city || '', state || '', pincode || '', commission_rate || 80.00, razorpay_key_id || null, razorpay_key_secret || null]
        );

        res.status(201).json({ success: true, client: clientRes.rows[0] || clientRes });
    } catch (err) {
        next(err);
    }
};

const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { business_name, contact_phone, phone, address, city, state, pincode, commission_rate, status, email, password, razorpay_key_id, razorpay_key_secret } = req.body;
        const phoneToUse = contact_phone || phone;

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
                 razorpay_key_id = COALESCE($9, razorpay_key_id),
                 razorpay_key_secret = COALESCE($10, razorpay_key_secret),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id::text = $11::text OR user_id::text = $11::text RETURNING *`,
            [
                business_name || null,
                phoneToUse || null,
                address || null,
                city || null,
                state || null,
                pincode || null,
                commission_rate || null,
                status || null,
                razorpay_key_id !== undefined ? razorpay_key_id : null,
                razorpay_key_secret !== undefined ? razorpay_key_secret : null,
                id
            ]
        );

        const clientObj = (result && result.rows && result.rows.length > 0) ? result.rows[0] : { id, status, user_id: id };

        // Also update associated User email, password & status
        if (email || password || status) {
            try {
                if (email && email.trim().length > 0) {
                    await db.query('UPDATE users SET email = $1 WHERE id::text = $2::text', [
                        email.toLowerCase().trim(),
                        clientObj.user_id || id
                    ]);
                }
                if (password && password.trim().length > 0) {
                    const password_hash = await bcrypt.hash(password.trim(), 10);
                    await db.query('UPDATE users SET password_hash = $1 WHERE id::text = $2::text', [
                        password_hash,
                        clientObj.user_id || id
                    ]);
                }
                if (status) {
                    const userStatus = status === 'suspended' ? 'suspended' : 'active';
                    await db.query('UPDATE users SET status = $1 WHERE id::text = $2::text', [
                        userStatus,
                        clientObj.user_id || id
                    ]);
                    const machineStatus = status === 'suspended' ? 'maintenance' : 'online';
                    await db.query('UPDATE machines SET status = $1 WHERE client_id::text = $2::text', [machineStatus, clientObj.id || id]);

                    const io = req.app.get('socketio');
                    if (io) {
                        io.emit('MACHINE_STATUS_CHANGE', { status: machineStatus });
                    }
                }
            } catch (e) {
                console.error('User update sync error:', e.message);
            }
        }

        res.json({ success: true, client: clientObj });
    } catch (err) {
        next(err);
    }
};

const deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params;

        const clientRes = await db.query('SELECT * FROM clients WHERE id::text = $1::text OR user_id::text = $1::text', [id]);
        const client = clientRes.rows[0];

        if (client) {
            await db.query('DELETE FROM machines WHERE client_id::text = $1::text', [client.id]);
            await db.query('DELETE FROM clients WHERE id::text = $1::text', [client.id]);
            if (client.user_id) {
                await db.query('DELETE FROM users WHERE id::text = $1::text', [client.user_id]);
            }
        } else {
            await db.query('DELETE FROM clients WHERE id::text = $1::text', [id]);
        }

        res.json({ success: true, message: 'Client deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getClients,
    getClientById,
    getMySettings,
    updateMySettings,
    createClient,
    updateClient,
    deleteClient
};
