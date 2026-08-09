const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadPdf } = require('../middlewares/upload');
const { uploadLimiter } = require('../middlewares/rateLimiter');

// Mobile / web browser upload (PDF via QR scan)
router.post('/', uploadLimiter, uploadPdf.single('file'), uploadController.uploadPdfHandler);

// USB drive upload — called by Windows print daemon when user selects a pendrive file
// No rate limiter since it's an internal daemon call from the same LAN/VPN
router.post('/usb', uploadPdf.single('file'), uploadController.uploadUsbHandler);

router.get('/:token', uploadController.getUploadByToken);

module.exports = router;
