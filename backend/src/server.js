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
// Disable browser caching on API endpoints
app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Static uploads serving (PDF files & Ad Media)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// Root & Health Check
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>EasyXerox Backend API</title>
            <style>
                body { font-family: system-ui, sans-serif; background: #fff9ee; color: #0F172A; text-align: center; padding: 50px; }
                .card { background: white; padding: 40px; border-radius: 20px; border: 2px solid #0066FF; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,102,255,0.15); }
                h1 { color: #0066FF; }
                a { display: inline-block; margin-top: 15px; padding: 12px 24px; background: #0066FF; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; }
                a:hover { background: #0052CC; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>EasyXerox Backend API</h1>
                <p>This is the backend API server running on <b>Port 5000</b>.</p>
                <p>To view the <b>Kiosk Web App UI</b>, open:</p>
                <a href="http://localhost:8501/kiosk/KIOSK-001">Go to Kiosk UI (Port 8501)</a>
            </div>
        </body>
        </html>
    `);
});

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
