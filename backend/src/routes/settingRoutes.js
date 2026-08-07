const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

router.get('/pricing', settingController.getPricing);
router.post('/pricing', authenticateToken, requireAdmin, settingController.updatePricing);
router.get('/gst', settingController.getGst);
router.post('/gst', authenticateToken, requireAdmin, settingController.updateGst);
router.get('/', settingController.getSettings);

module.exports = router;
