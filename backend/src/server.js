const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
require('dotenv').config();

const logger = require('./services/logger');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const initSocketIO = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const machineRoutes = require('./routes/machineRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const printRoutes = require('./routes/printRoutes');
const adRoutes = require('./routes/adRoutes');
const reportRoutes = require('./routes/reportRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.set('socketio', io);
initSocketIO(io);

// Security & Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads serving (PDF files & Ad Media)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString(), service: 'Xerox Kiosk API' });
});

// API Routes
app.use('/api/v1/auth', apiLimiter, authRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/machines', machineRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/print', printRoutes);
app.use('/api/v1/ads', adRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/settings', settingRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    logger.info(`🚀 Xerox Kiosk Express Backend running on port ${PORT}`);
});
