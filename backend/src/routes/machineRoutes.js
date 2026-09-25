const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

router.get('/identify', machineController.identifyMachine);
router.get('/unregistered', authenticateToken, requireAdmin, machineController.getUnregisteredHardware);
router.get('/', authenticateToken, machineController.getMachines);
router.get('/code/:machineCode', machineController.getMachineByCode);
router.get('/code/:machineCode/ads', machineController.getMachineAds);
router.post('/', authenticateToken, requireAdmin, machineController.createMachine);
router.put('/:id', authenticateToken, machineController.updateMachine);
router.put('/:id/status', authenticateToken, machineController.toggleMachineStatus);
router.put('/code/:machine_code/printer-status', machineController.updatePrinterStatus);
router.delete('/:id', authenticateToken, requireAdmin, machineController.deleteMachine);

/* Phase 2 — Kiosk OS endpoints (no auth required; machine uses device_token) */
router.post('/register', machineController.registerMachine);
router.post('/code/:machineCode/heartbeat', machineController.machineHeartbeat);
router.post('/code/:machineCode/command', authenticateToken, machineController.machineCommand);

module.exports = router;
