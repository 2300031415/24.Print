const { sendInquiryNotification } = require('../services/emailService');
const logger = require('../services/logger');

/**
 * Handle new franchise / contact inquiry form submissions
 */
async function submitInquiry(req, res) {
    try {
        const { fullName, phone, email, city, venueType, message, partnerModel } = req.body;

        if (!fullName || !phone || !email || !city) {
            return res.status(400).json({
                success: false,
                message: 'Full name, phone, email, and city are required.'
            });
        }

        const inquiryData = {
            fullName: fullName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            city: city.trim(),
            venueType: venueType || 'College / University',
            message: message || '',
            partnerModel: partnerModel || 'Kiosk Partnership',
            submittedAt: new Date().toISOString()
        };

        logger.info(`[InquiryController] New lead submitted: ${inquiryData.fullName} (${inquiryData.phone})`);

        // Send email in background asynchronously
        sendInquiryNotification(inquiryData).catch(err => {
            logger.error(`[InquiryController] Email send async error: ${err.message}`);
        });

        return res.status(200).json({
            success: true,
            message: 'Inquiry received successfully! Our expansion manager will contact you within 24 hours.'
        });
    } catch (error) {
        logger.error(`[InquiryController] Error processing inquiry: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to process inquiry. Please try again or contact info@futureforbes.in directly.'
        });
    }
}

module.exports = { submitInquiry };
