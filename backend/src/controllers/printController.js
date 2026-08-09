const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const logger = require('../services/logger');

const updatePrintJobStatus = async (req, res, next) => {
    try {
        const { printJobId } = req.params;
        const { status, error_message } = req.body;

        const jobRes = await db.query(
            `UPDATE print_jobs 
             SET status = $1,
                 error_message = $2,
                 started_at = CASE WHEN $1 = 'printing' THEN CURRENT_TIMESTAMP ELSE started_at END,
                 completed_at = CASE WHEN $1 IN ('completed', 'failed') THEN CURRENT_TIMESTAMP ELSE completed_at END
             WHERE id = $3 RETURNING *`,
            [status, error_message || null, printJobId]
        );

        if (jobRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Print job not found.' });
        }

        const job = jobRes.rows[0];

        // Notify Kiosk HMI via Socket.IO across all machine rooms
        const io = req.app.get('socketio');
        if (io) {
            const updatePayload = {
                printJobId: job.id,
                status: job.status,
                errorMessage: job.error_message
            };
            io.to(`machine:${job.machine_id}`).emit('PRINT_STATUS_UPDATE', updatePayload);
            io.to(`machine:${job.machine_code || 'KIOSK-001'}`).emit('PRINT_STATUS_UPDATE', updatePayload);
            io.to(`machine:KIOSK-001`).emit('PRINT_STATUS_UPDATE', updatePayload);
            logger.info(`📢 Broadcasted PRINT_STATUS_UPDATE [${job.status}] for job ${job.id}`);
        }


        // If completed or failed, cleanup local PDF file per workflow rules
        if (status === 'completed' || status === 'failed') {
            const uploadRes = await db.query('SELECT file_path FROM uploads WHERE id = $1', [job.upload_id]);
            if (uploadRes.rows.length > 0) {
                const relativePath = uploadRes.rows[0].file_path;
                const absolutePath = path.join(__dirname, '../../', relativePath);
                if (fs.existsSync(absolutePath)) {
                    fs.unlink(absolutePath, (err) => {
                        if (err) logger.warn(`File cleanup failed for ${absolutePath}: ${err.message}`);
                        else logger.info(`Deleted uploaded file after print execution: ${absolutePath}`);
                    });
                }
                await db.query("UPDATE uploads SET status = 'deleted' WHERE id = $1", [job.upload_id]);
            }
        }

        res.json({ success: true, printJob: job });
    } catch (err) {
        next(err);
    }
};

const getPrintJobs = async (req, res, next) => {
    try {
        let queryStr = `
            SELECT pj.*, m.name as machine_name, m.machine_code, u.original_filename
            FROM print_jobs pj
            JOIN machines m ON pj.machine_id = m.id
            JOIN uploads u ON pj.upload_id = u.id
        `;
        const params = [];

        if (req.user && req.user.role === 'client') {
            queryStr += ` WHERE m.client_id = $1`;
            params.push(req.user.client_id);
        }

        queryStr += ` ORDER BY pj.created_at DESC LIMIT 100`;

        const result = await db.query(queryStr, params);
        res.json({ success: true, printJobs: result.rows });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    updatePrintJobStatus,
    getPrintJobs
};
