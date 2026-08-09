const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Absolute path to backend/uploads directory
const uploadsDir = path.resolve(__dirname, '../../uploads');
const adsDir = path.resolve(__dirname, '../../uploads/ads');

// Ensure upload directories exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(adsDir)) {
    fs.mkdirSync(adsDir, { recursive: true });
}

// Storage for PDF Documents
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `pdf-${uniqueSuffix}${ext || '.pdf'}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF documents are allowed for printing!'), false);
    }
};

const uploadPdf = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max file size requirement
    },
    fileFilter: fileFilter
});

// Storage for Advertisement Media (Images, Videos, GIFs)
const adStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(adsDir)) {
            fs.mkdirSync(adsDir, { recursive: true });
        }
        cb(null, adsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `ad-${uniqueSuffix}${ext}`);
    }
});

const uploadAdMedia = multer({
    storage: adStorage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Only Images (JPG, PNG, GIF, WEBP) and Videos (MP4, WEBM) are allowed for Ads!'), false);
        }
    }
});

module.exports = {
    uploadPdf,
    uploadAdMedia
};
