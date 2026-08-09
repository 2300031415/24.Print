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

// Storage & Filter for ALL Printable Documents (PDF, DOC, DOCX, TXT, Images)
const ALLOWED_DOCUMENT_EXTENSIONS = [
    '.pdf',
    '.doc', '.docx',
    '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'
];

const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `doc-${uniqueSuffix}${ext || '.pdf'}`);
    }
});

const documentFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_DOCUMENT_EXTENSIONS.includes(ext) || (file.mimetype && file.mimetype.startsWith('image/')) || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type (${ext}). Allowed: PDF, Word, Images, Text`), false);
    }
};

const uploadDocument = multer({
    storage: documentStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB max
    },
    fileFilter: documentFileFilter
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

const adFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid ad file type! Only JPG, PNG, GIF, MP4, and WEBM are allowed.'), false);
    }
};

const uploadAd = multer({
    storage: adStorage,
    limits: {
        fileSize: 200 * 1024 * 1024 // 200 MB for ad videos
    },
    fileFilter: adFileFilter
});

module.exports = {
    uploadPdf,
    uploadDocument,
    uploadAd
};
