const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit to 10 uploads per minute per IP
    message: {
        success: false,
        message: 'Upload frequency limit reached. Please wait a minute before uploading another document.'
    }
});

module.exports = {
    apiLimiter,
    uploadLimiter
};
