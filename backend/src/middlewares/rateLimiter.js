let rateLimit;
try {
    rateLimit = require('express-rate-limit');
} catch (e) {
    rateLimit = null;
}

const passThrough = (req, res, next) => next();

const apiLimiter = rateLimit ? rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // High limit to allow continuous user interaction
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
}) : passThrough;

const uploadLimiter = rateLimit ? rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200, // High limit to prevent false-positive upload blocks on mobile
    message: {
        success: false,
        message: 'Upload frequency limit reached. Please wait a minute before uploading another document.'
    }
}) : passThrough;

module.exports = {
    apiLimiter,
    uploadLimiter
};
