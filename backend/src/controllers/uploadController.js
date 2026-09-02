const crypto = require('crypto');
const path = require('path');
const db = require('../config/db');
const { getPdfPageCount } = require('../services/pdfService');
const logger = require('../services/logger');

const uploadPdfHandler = async (req, res, next) => {
    try {
        const { machineId } = req.body; // Can be machine_code or machine UUID
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
        }

        if (!machineId) {
            return res.status(400).json({ success: false, message: 'Machine ID is required.' });
        }

        // Verify machine existence
        const machineRes = await db.query(
            'SELECT id, machine_code, name FROM machines WHERE machine_code = $1 OR id::text = $1',
            [machineId]
        );

        if (machineRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid or unregistered Machine ID.' });
        }

        const machine = machineRes.rows[0];

        // Extract total PDF pages
        const totalPages = await getPdfPageCount(file.path);
        const uploadToken = 'UPL-' + crypto.randomBytes(6).toString('hex').toUpperCase();
        const relativeFilePath = `/uploads/${path.basename(file.path)}`;

        const uploadRes = await db.query(
            `INSERT INTO uploads (upload_token, machine_id, original_filename, file_path, file_size_bytes, total_pages, mime_type, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
            [uploadToken, machine.id, file.originalname, relativeFilePath, file.size, totalPages, file.mimetype]
        );

        const uploadRecord = uploadRes.rows[0];

        // Access Socket.IO instance attached to app
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

            // Broadcast to machine socket room & globally
            io.to(`machine:${machine.machine_code}`).emit('FILE_UPLOADED', payload);
            io.to(`machine:${machine.id}`).emit('FILE_UPLOADED', payload);
            io.emit('FILE_UPLOADED', payload);
            logger.info(`Notified Kiosk Room machine:${machine.machine_code} for upload token ${uploadToken}`);
        }

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully! Kiosk notified instantly.',
            upload: uploadRecord
        });
    } catch (err) {
        next(err);
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

/**
 * USB Upload Handler — called by the Windows print daemon when user selects a
 * file from a pendrive. Mirrors the standard uploadPdfHandler but:
 * - Accepts `machineCode` (from daemon, not browser)
 * - Marks `source = 'usb'` in the upload record
 * - Emits FILE_UPLOADED to machine room so kiosk navigates automatically
 */
const uploadUsbHandler = async (req, res, next) => {
    try {
        const { machineCode, source } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        if (!machineCode) {
            return res.status(400).json({ success: false, message: 'machineCode is required.' });
        }

        // Verify machine
        const machineRes = await db.query(
            'SELECT id, machine_code, name FROM machines WHERE machine_code = $1 OR id::text = $1',
            [machineCode]
        );

        if (machineRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }

        const machine = machineRes.rows[0];

        // Page count (only works for PDFs, fallback to 1 for images)
        let totalPages = 1;
        if (file.mimetype === 'application/pdf') {
            try {
                totalPages = await getPdfPageCount(file.path);
            } catch (_) {
                totalPages = 1;
            }
        }

        const uploadToken = 'USB-' + crypto.randomBytes(6).toString('hex').toUpperCase();
        const relativeFilePath = `/uploads/${path.basename(file.path)}`;

        const uploadRes = await db.query(
            `INSERT INTO uploads (upload_token, machine_id, original_filename, file_path, file_size_bytes, total_pages, mime_type, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
            [uploadToken, machine.id, file.originalname, relativeFilePath, file.size, totalPages, file.mimetype]
        );

        const uploadRecord = uploadRes.rows[0];

        // Emit FILE_UPLOADED to kiosk screen — triggers automatic navigation to preview
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
                source: source || 'usb',
                uploadedAt: uploadRecord.created_at
            };
            io.to(`machine:${machine.machine_code}`).emit('FILE_UPLOADED', payload);
            io.to(`machine:${machine.id}`).emit('FILE_UPLOADED', payload);
            logger.info(`USB upload notified kiosk machine:${machine.machine_code} — token ${uploadToken}`);
        }

        res.status(201).json({
            success: true,
            message: 'USB file uploaded. Kiosk will open preview now.',
            uploadToken: uploadRecord.upload_token,
            upload: uploadRecord
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    uploadPdfHandler,
    getUploadByToken,
    uploadUsbHandler
};
