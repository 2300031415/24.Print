const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadPdf } = require('../middlewares/upload');
const { uploadLimiter } = require('../middlewares/rateLimiter');

router.post('/', uploadLimiter, uploadPdf.single('file'), uploadController.uploadPdfHandler);
router.get('/:token', uploadController.getUploadByToken);

module.exports = router;
