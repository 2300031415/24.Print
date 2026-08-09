const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadPdf, uploadDocument } = require('../middlewares/upload');
const { uploadLimiter } = require('../middlewares/rateLimiter');

// Mobile / web browser upload (PDF via QR scan)
router.post('/', uploadLimiter, uploadPdf.single('file'), uploadController.uploadPdfHandler);

// USB drive upload — supports PDF, Word, Images, Text files
router.post('/usb', uploadDocument.single('file'), uploadController.uploadUsbHandler);

router.get('/:token', uploadController.getUploadByToken);

module.exports = router;
