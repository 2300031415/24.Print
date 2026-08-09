const logger = require('../services/logger');

function initSocketIO(io) {
    io.on('connection', (socket) => {
        logger.info(`Socket client connected: ${socket.id}`);

        // ──────────────────────────────────────────────────────────
        // Kiosk screen joins machine room (receives real-time events)
        // ──────────────────────────────────────────────────────────
        socket.on('JOIN_MACHINE', (data) => {
            const machineId = data?.machineCode || data?.machineId || data;
            if (machineId) {
                const roomName = `machine:${machineId}`;
                socket.join(roomName);
                logger.info(`Socket ${socket.id} joined room ${roomName}`);
            }
        });

        // ──────────────────────────────────────────────────────────
        // Windows Print Daemon registers and joins daemon room
        // ──────────────────────────────────────────────────────────
        socket.on('REGISTER_DAEMON', (data) => {
            const machineCode = data?.machineCode || data;
            if (machineCode) {
                const roomName = `daemon:${machineCode}`;
                socket.join(roomName);
                logger.info(`Windows Print Daemon registered for machine: ${machineCode}`);
                socket.emit('DAEMON_REGISTERED', { success: true, machineCode });
            }
        });

        // ──────────────────────────────────────────────────────────
        // Printer status update from daemon → relay to kiosk screen
        // ──────────────────────────────────────────────────────────
        socket.on('PRINTER_STATUS_CHANGE', (data) => {
            const { machineCode, status, details } = data;
            logger.info(`Printer status update from daemon [${machineCode}]: ${status}`);
            io.emit('PRINTER_STATUS_CHANGE', { machineCode, status, details });
            io.to(`machine:${machineCode}`).emit('PRINTER_STATUS_CHANGE', { status, details });
        });

        // ──────────────────────────────────────────────────────────
        // USB DRIVE CONNECTED — daemon detected pendrive insertion
        // Broadcast to all sockets & room so room mismatches are impossible
        // ──────────────────────────────────────────────────────────
        socket.on('USB_DRIVE_CONNECTED', (data) => {
            const { machineCode, drive } = data;
            const driveData = drive || data;
            logger.info(`🔌 USB drive inserted on machine [${machineCode}]: ${driveData?.driveLetter} (${driveData?.volumeName})`);
            io.emit('USB_DRIVE_CONNECTED', { machineCode, drive: driveData });
            io.to(`machine:${machineCode}`).emit('USB_DRIVE_CONNECTED', { machineCode, drive: driveData });
        });

        // ──────────────────────────────────────────────────────────
        // USB DRIVE DISCONNECTED — relay pendrive removal to kiosk
        // ──────────────────────────────────────────────────────────
        socket.on('USB_DRIVE_DISCONNECTED', (data) => {
            const { machineCode, driveLetter } = data;
            logger.info(`🔌 USB drive removed from machine [${machineCode}]: ${driveLetter}`);
            io.emit('USB_DRIVE_DISCONNECTED', { machineCode, driveLetter });
            io.to(`machine:${machineCode}`).emit('USB_DRIVE_DISCONNECTED', { machineCode, driveLetter });
        });

        // ──────────────────────────────────────────────────────────
        // USB_LIST_FILES — kiosk screen asks daemon to list files
        // ──────────────────────────────────────────────────────────
        socket.on('USB_LIST_FILES', (data) => {
            const { machineCode, driveLetter } = data;
            logger.info(`📁 Kiosk requesting file list for ${driveLetter} on machine [${machineCode}]`);
            io.emit('USB_LIST_FILES', { machineCode, driveLetter });
            io.to(`daemon:${machineCode}`).emit('USB_LIST_FILES', { driveLetter });
        });

        // ──────────────────────────────────────────────────────────
        // USB_FILES_LIST — daemon responds with file list
        // ──────────────────────────────────────────────────────────
        socket.on('USB_FILES_LIST', (data) => {
            const { machineCode, driveLetter, files, error } = data;
            logger.info(`📁 Daemon returned ${files?.length || 0} files from ${driveLetter} for machine [${machineCode}]`);
            io.emit('USB_FILES_LIST', { machineCode, driveLetter, files, error });
            io.to(`machine:${machineCode}`).emit('USB_FILES_LIST', { driveLetter, files, error });
        });

        // ──────────────────────────────────────────────────────────
        // USB_SELECT_FILE — kiosk user picks a file
        // ──────────────────────────────────────────────────────────
        socket.on('USB_SELECT_FILE', (data) => {
            const { machineCode, filePath, fileName, driveLetter } = data;
            logger.info(`📄 Kiosk selected USB file [${fileName}] on machine [${machineCode}]`);
            io.emit('USB_SELECT_FILE', { machineCode, filePath, fileName, driveLetter });
            io.to(`daemon:${machineCode}`).emit('USB_SELECT_FILE', { filePath, fileName, driveLetter });
        });

        // ──────────────────────────────────────────────────────────
        // USB_UPLOAD_PROGRESS — daemon reports upload state
        // ──────────────────────────────────────────────────────────
        socket.on('USB_UPLOAD_PROGRESS', (data) => {
            const { machineCode, status, fileName, error } = data;
            logger.info(`📤 USB upload progress [${machineCode}] ${fileName}: ${status}`);
            io.emit('USB_UPLOAD_PROGRESS', { machineCode, status, fileName, error });
            io.to(`machine:${machineCode}`).emit('USB_UPLOAD_PROGRESS', { status, fileName, error });
        });

        // ──────────────────────────────────────────────────────────
        // DISCONNECT
        // ──────────────────────────────────────────────────────────
        socket.on('disconnect', () => {
            logger.info(`Socket client disconnected: ${socket.id}`);
        });
    });
}

module.exports = initSocketIO;
