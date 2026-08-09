const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

router.get('/', authenticateToken, requireAdmin, clientController.getClients);
router.get('/:id', authenticateToken, clientController.getClientById);
router.post('/', authenticateToken, requireAdmin, clientController.createClient);
router.put('/:id', authenticateToken, requireAdmin, clientController.updateClient);
router.delete('/:id', authenticateToken, requireAdmin, clientController.deleteClient);

module.exports = router;

