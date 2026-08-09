const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

// Client's own settings (accessible by logged in Client Owner or Admin)
router.get('/my-settings', authenticateToken, clientController.getMySettings);
router.put('/my-settings', authenticateToken, clientController.updateMySettings);

// Admin-only management endpoints
router.get('/', authenticateToken, requireAdmin, clientController.getClients);
router.get('/:id', authenticateToken, clientController.getClientById);
router.post('/', authenticateToken, requireAdmin, clientController.createClient);
router.put('/:id', authenticateToken, requireAdmin, clientController.updateClient);
router.delete('/:id', authenticateToken, requireAdmin, clientController.deleteClient);

module.exports = router;
