const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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
const adsDir = path.join(__dirname, '../../uploads/ads');
if (!fs.existsSync(adsDir)) {
    fs.mkdirSync(adsDir, { recursive: true });
}

const adStorage = multer.diskStorage({
    destination: (req, file, cb) => {
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
