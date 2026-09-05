const path = require('path');
const db = require('../config/db');

const getAds = async (req, res, next) => {
    try {
        let queryStr = `
            SELECT a.*, c.business_name as client_name
            FROM advertisements a
            LEFT JOIN clients c ON a.client_id = c.id
        `;
        const params = [];

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
            queryStr += ` WHERE a.client_id::text = $1::text`;
            params.push(clientId);
        }

        queryStr += ` ORDER BY a.created_at DESC`;

        const result = await db.query(queryStr, params);
        res.json({ success: true, ads: result.rows });
    } catch (err) {
        next(err);
    }
};

const uploadAd = async (req, res, next) => {
    try {
        const file = req.file;
        const title = req.body?.title || (file ? file.originalname : 'Promotional Ad');
        const duration_seconds = req.body?.duration_seconds || 10;

        if (!file) {
            return res.status(400).json({ success: false, message: 'Ad media file is required.' });
        }

        let media_type = 'image';
        if (file.mimetype.startsWith('video/')) media_type = 'video';
        else if (file.mimetype === 'image/gif') media_type = 'gif';

        const media_url = `/uploads/ads/${path.basename(file.path)}`;
        let clientId = req.user && req.user.role === 'client' ? req.user.client_id : null;

        // Fallback: If clientId is missing in JWT payload, look up from clients table
        if (!clientId && req.user && req.user.id) {
            const clientRes = await db.query('SELECT id FROM clients WHERE user_id::text = $1::text OR id::text = $1::text', [req.user.id]);
            if (clientRes.rows.length > 0) {
                clientId = clientRes.rows[0].id;
            }
        }

        // AUTO-APPROVED for all client and admin uploaded ads (No admin approval required)
        const status = 'approved';

        const result = await db.query(
            `INSERT INTO advertisements (client_id, title, media_url, media_type, duration_seconds, status)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [clientId, title, media_url, media_type, duration_seconds || 10, status]
        );

        const newAd = (result && result.rows && result.rows[0]) ? result.rows[0] : {
            id: `ad-${Date.now()}`,
            client_id: clientId,
            title: title,
            media_url: media_url,
            media_type: media_type,
            duration_seconds: duration_seconds || 10,
            status: 'approved'
        };

        // If target machine_ids were selected during upload, map them in machine_ads table
        const { machine_ids } = req.body;
        let targetMachines = [];
        if (machine_ids) {
            try {
                targetMachines = typeof machine_ids === 'string' ? JSON.parse(machine_ids) : machine_ids;
            } catch (e) {
                if (typeof machine_ids === 'string') targetMachines = [machine_ids];
            }
        }

        if (Array.isArray(targetMachines) && targetMachines.length > 0 && newAd.id) {
            for (const mId of targetMachines) {
                try {
                    await db.query(
                        'INSERT INTO machine_ads (machine_id, advertisement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                        [mId, newAd.id]
                    );
                } catch (mErr) {
                    console.warn('Machine mapping ignored:', mErr.message);
                }
            }
        }

        console.log('✅ Advertisement Saved & Auto-Approved:', newAd);
        const io = req.app.get('socketio');
        if (io) {
            io.emit('ADS_UPDATED');
        }
        res.status(201).json({ success: true, advertisement: newAd });
    } catch (err) {
        console.error('❌ Error uploading advertisement:', err);
        next(err);
    }
};

const updateAdStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, rejection_reason } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value.' });
        }

        const result = await db.query(
            `UPDATE advertisements 
             SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $3 RETURNING *`,
            [status, rejection_reason || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Advertisement not found.' });
        }

        const io = req.app.get('socketio');
        if (io) {
            io.emit('ADS_UPDATED');
        }

        res.json({ success: true, advertisement: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const assignAdsToMachine = async (req, res, next) => {
    const clientDb = await db.pool.connect();
    try {
        await clientDb.query('BEGIN');
        const { machineId, adIds } = req.body;

        if (!machineId || !Array.isArray(adIds)) {
            return res.status(400).json({ success: false, message: 'Machine ID and adIds array required.' });
        }

        await clientDb.query('DELETE FROM machine_ads WHERE machine_id = $1', [machineId]);

        for (const adId of adIds) {
            await clientDb.query(
                'INSERT INTO machine_ads (machine_id, advertisement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                [machineId, adId]
            );
        }

        await clientDb.query('COMMIT');
        const io = req.app.get('socketio');
        if (io) {
            io.emit('ADS_UPDATED');
        }
        res.json({ success: true, message: 'Advertisements assigned to machine successfully.' });
    } catch (err) {
        await clientDb.query('ROLLBACK');
        next(err);
    } finally {
        clientDb.release();
    }
};

const deleteAd = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM machine_ads WHERE advertisement_id = $1', [id]);
        await db.query('DELETE FROM advertisements WHERE id = $1', [id]);

        const io = req.app.get('socketio');
        if (io) {
            io.emit('ADS_UPDATED');
        }

        res.json({ success: true, message: 'Advertisement deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAds,
    uploadAd,
    updateAdStatus,
    assignAdsToMachine,
    deleteAd
};
