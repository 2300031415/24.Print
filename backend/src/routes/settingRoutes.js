const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticateToken, requireClient } = require('../middlewares/auth');

router.get('/pricing', settingController.getPricing);
router.post('/pricing', authenticateToken, requireClient, settingController.updatePricing);
router.get('/gst', settingController.getGst);
router.post('/gst', authenticateToken, requireClient, settingController.updateGst);
router.get('/', settingController.getSettings);

module.exports = router;
