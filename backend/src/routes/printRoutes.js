const express = require('express');
const router = express.Router();
const printController = require('../controllers/printController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/history', authenticateToken, printController.getPrintJobs);
router.put('/job/:printJobId/status', printController.updatePrintJobStatus);

module.exports = router;
