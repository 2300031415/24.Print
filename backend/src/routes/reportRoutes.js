const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, requireAdmin, requireClient } = require('../middlewares/auth');

router.get('/admin-dashboard', authenticateToken, requireAdmin, reportController.getAdminDashboard);
router.get('/client-dashboard', authenticateToken, requireClient, reportController.getClientDashboard);
router.get('/activity-logs', authenticateToken, requireAdmin, reportController.getActivityLogs);

module.exports = router;
