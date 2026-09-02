const path = require('path');
const db = require('../config/db');
const logger = require('../services/logger');
const { getPdfPageCount } = require('../services/pdfService');

const uploadPdfHandler = async (req, res, next) => {
    try {
        const { machineCode, uploadToken } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No document file uploaded.' });
        }

        if (!machineCode || !uploadToken) {
            return res.status(400).json({ success: false, message: 'machineCode and uploadToken are required.' });
        }

        // Verify target kiosk machine exists
        const machineRes = await db.query(
            'SELECT id, machine_code, name FROM machines WHERE machine_code = $1 OR id::text = $1',
            [machineCode]
        );

        if (machineRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid kiosk machine code.' });
        }

        const machine = machineRes.rows[0];

        // Page count calculation (only for PDF, fallback to 1 for images)
        let totalPages = 1;
        if (file.mimetype === 'application/pdf') {
            try {
                totalPages = await getPdfPageCount(file.path);
            } catch (_) {
                totalPages = 1;
            }
        }

        // Save upload record into database
        const uploadResult = await db.query(
            `INSERT INTO uploads (upload_token, machine_id, original_filename, file_path, file_size_bytes, total_pages, mime_type, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
            [
                uploadToken,
                machine.id,
                file.originalname,
                `/uploads/${path.basename(file.path)}`,
                file.size,
                totalPages,
                file.mimetype
            ]
        );

        const uploadRecord = uploadResult.rows[0];

        // Realtime Socket Notification to Kiosk Display
        const io = req.app.get('socketio');
        if (io) {
            const payload = {
                uploadToken: uploadRecord.upload_token,
                uploadId: uploadRecord.id,
                machineId: machine.id,
                machineCode: machine.machine_code,
                filename: uploadRecord.original_filename,
                filePath: uploadRecord.file_path,
                fileSize: uploadRecord.file_size_bytes,
                totalPages: uploadRecord.total_pages,
                uploadedAt: uploadRecord.created_at
            };

            // Broadcast ONLY to target machine socket room
            io.to(`machine:${machine.machine_code}`).emit('FILE_UPLOADED', payload);
            io.to(`machine:${machine.id}`).emit('FILE_UPLOADED', payload);
            if (machine.machine_code) {
                io.to(`machine:${machine.machine_code.toUpperCase()}`).emit('FILE_UPLOADED', payload);
            }
            logger.info(`Notified Kiosk Room machine:${machine.machine_code} for upload token ${uploadToken}`);
        }

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully! Kiosk notified instantly.',
            upload: uploadRecord
        });
    } catch (err) {
        logger.error(`Upload Pdf Error: ${err.message}`);
        res.status(500).json({
            success: false,
            message: err.message || 'Error uploading document. Please try again.'
        });
    }
};

const getUploadByToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const result = await db.query(
            `SELECT u.*, m.machine_code, m.name as machine_name 
             FROM uploads u
             JOIN machines m ON u.machine_id = m.id
             WHERE u.upload_token = $1 OR u.id::text = $1`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Upload record not found or expired.' });
        }

        res.json({ success: true, upload: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

const deleteUpload = async (req, res, next) => {
    try {
        const { token } = req.params;
        await db.query('DELETE FROM uploads WHERE upload_token = $1 OR id::text = $1', [token]);
        res.json({ success: true, message: 'Upload record removed.' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    uploadPdfHandler,
    getUploadByToken,
    deleteUpload
};
