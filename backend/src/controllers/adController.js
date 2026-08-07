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
            queryStr += ` WHERE a.client_id = $1`;
            params.push(req.user.client_id);
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
        const { title, duration_seconds } = req.body;
        const file = req.file;

        if (!file || !title) {
            return res.status(400).json({ success: false, message: 'Ad media file and title are required.' });
        }

        let media_type = 'image';
        if (file.mimetype.startsWith('video/')) media_type = 'video';
        else if (file.mimetype === 'image/gif') media_type = 'gif';

        const media_url = `/uploads/ads/${path.basename(file.path)}`;
        const clientId = req.user && req.user.role === 'client' ? req.user.client_id : null;
        // Admins uploading ads are auto-approved, client uploaded ads start as pending
        const status = req.user && req.user.role === 'admin' ? 'approved' : 'pending';

        const result = await db.query(
            `INSERT INTO advertisements (client_id, title, media_url, media_type, duration_seconds, status)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [clientId, title, media_url, media_type, duration_seconds || 10, status]
        );

        res.status(201).json({ success: true, advertisement: result.rows[0] });
    } catch (err) {
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

        res.json({ success: true, advertisement: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const assignAdsToMachine = async (req, res, next) => {
    const clientDb = await db.pool.connect();
    try {
        await clientDb.query('BEGIN');
        const { machineId, adIds } = req.body; // adIds array of advertisement UUIDs

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
        res.json({ success: true, message: 'Advertisements assigned to machine successfully.' });
    } catch (err) {
        await clientDb.query('ROLLBACK');
        next(err);
    } finally {
        clientDb.release();
    }
};

module.exports = {
    getAds,
    uploadAd,
    updateAdStatus,
    assignAdsToMachine
};
