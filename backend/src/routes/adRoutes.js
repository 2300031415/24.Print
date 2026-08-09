const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { uploadAdMedia } = require('../middlewares/upload');

router.get('/', authenticateToken, adController.getAds);
router.post('/upload', authenticateToken, uploadAdMedia.single('media'), adController.uploadAd);
router.post('/assign', authenticateToken, requireAdmin, adController.assignAdsToMachine);
router.delete('/:id', authenticateToken, adController.deleteAd);

module.exports = router;
