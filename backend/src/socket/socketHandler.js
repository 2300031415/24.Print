const logger = require('../services/logger');

function initSocketIO(io) {
    io.on('connection', (socket) => {
        logger.info(`Socket client connected: ${socket.id}`);

        // Join machine room (for Kiosk HMI)
        socket.on('JOIN_MACHINE', (data) => {
            const machineId = data?.machineCode || data?.machineId || data;
            if (machineId) {
                const roomName = `machine:${machineId}`;
                socket.join(roomName);
                logger.info(`Socket ${socket.id} joined room ${roomName}`);
            }
        });

        // Register Windows Print Daemon
        socket.on('REGISTER_DAEMON', (data) => {
            const machineCode = data?.machineCode || data;
            if (machineCode) {
                const roomName = `daemon:${machineCode}`;
                socket.join(roomName);
                logger.info(`Windows Print Daemon registered for machine: ${machineCode}`);
                socket.emit('DAEMON_REGISTERED', { success: true, machineCode });
            }
        });

        // Printer status change sent from Windows Print Daemon
        socket.on('PRINTER_STATUS_CHANGE', (data) => {
            const { machineCode, status, details } = data;
            logger.info(`Printer status update from daemon [${machineCode}]: ${status}`);
            // Broadcast to machine room
            io.to(`machine:${machineCode}`).emit('PRINTER_STATUS_CHANGE', { status, details });
        });

        socket.on('disconnect', () => {
            logger.info(`Socket client disconnected: ${socket.id}`);
        });
    });
}

module.exports = initSocketIO;
