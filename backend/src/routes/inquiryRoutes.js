const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/inquiryController');

// POST /api/v1/inquiries
router.post('/', submitInquiry);

module.exports = router;
