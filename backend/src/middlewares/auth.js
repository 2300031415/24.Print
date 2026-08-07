const { verifyAccessToken } = require('../config/jwt');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required.' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }

    req.user = decoded;
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admin role required.' });
    }
    next();
};

const requireClient = (req, res, next) => {
    if (!req.user || (req.user.role !== 'client' && req.user.role !== 'admin')) {
        return res.status(403).json({ success: false, message: 'Access denied: Client role required.' });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireClient
};
