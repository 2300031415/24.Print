const nodemailer = require('nodemailer');
const axios = require('axios');
const logger = require('./logger');

/**
 * Sends Franchise / Contact Inquiry emails to the company leads inbox.
 * Primary targets: info@futureforbes.in, arjunuddagiri@futureforbes.in
 */
async function sendInquiryNotification(inquiry) {
    const recipients = ['info@futureforbes.in', 'arjunuddagiri@futureforbes.in'];
    const subject = `🚀 New EasyXerox Franchise Inquiry: ${inquiry.fullName || 'Lead'} (${inquiry.city || 'Location'})`;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #0C3D97 0%, #082e75 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
                .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
                .content { padding: 28px 24px; }
                .tile { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
                .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
                .value { font-size: 15px; font-weight: 700; color: #0f172a; word-break: break-word; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .badge { display: inline-block; background: #0C3D97; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                .footer { text-align: center; padding: 20px; background: #f1f5f9; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                .btn { display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-weight: bold; font-size: 14px; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>EasyXerox Lead Alert</h1>
                    <p>New Kiosk Partner & Franchise Inquiry Received</p>
                </div>
                <div class="content">
                    <div className="tile">
                        <div class="label">Partner Model Interest</div>
                        <div class="value"><span class="badge">${inquiry.partnerModel || 'Kiosk Partnership'}</span></div>
                    </div>
                    <div class="grid">
                        <div class="tile">
                            <div class="label">Full Name</div>
                            <div class="value">${inquiry.fullName}</div>
                        </div>
                        <div class="tile">
                            <div class="label">Phone / WhatsApp</div>
                            <div class="value"><a href="tel:${inquiry.phone}" style="color: #0C3D97; text-decoration: none;">${inquiry.phone}</a></div>
                        </div>
                    </div>
                    <div class="grid">
                        <div class="tile">
                            <div class="label">Email Address</div>
                            <div class="value"><a href="mailto:${inquiry.email}" style="color: #0C3D97; text-decoration: none;">${inquiry.email}</a></div>
                        </div>
                        <div class="tile">
                            <div class="label">City / Region</div>
                            <div class="value">${inquiry.city}</div>
                        </div>
                    </div>
                    <div class="tile">
                        <div class="label">Proposed Venue / Location Type</div>
                        <div class="value">${inquiry.venueType || 'College / Commercial'}</div>
                    </div>
                    ${inquiry.message ? `
                    <div class="tile">
                        <div class="label">Notes & Requirements</div>
                        <div class="value" style="font-weight: normal; font-size: 14px; line-height: 1.5;">${inquiry.message}</div>
                    </div>
                    ` : ''}
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" class="btn" target="_blank">Chat on WhatsApp</a>
                    </div>
                </div>
                <div class="footer">
                    Sent automatically from <strong>EasyXerox Web Application</strong> • Future Forbes Private Limited
                </div>
            </div>
        </body>
        </html>
    `;

    // 1. Try Nodemailer SMTP (Outlook / Office365) if SMTP details exist in env
    if (process.env.SMTP_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.office365.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER || 'info@futureforbes.in',
                    pass: process.env.SMTP_PASS
                },
                tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false
                }
            });

            await transporter.sendMail({
                from: `"EasyXerox Inquiries" <${process.env.SMTP_USER || 'info@futureforbes.in'}>`,
                to: recipients.join(','),
                subject: subject,
                html: htmlContent
            });
            logger.info(`[EmailService] Inquiry email successfully sent via Outlook SMTP to ${recipients.join(', ')}`);
            return { success: true, method: 'SMTP' };
        } catch (err) {
            logger.error(`[EmailService] SMTP error: ${err.message}`);
        }
    }

    // 2. Fallback via Web3Forms API to ensure emails arrive instantly even without SMTP password
    try {
        const response = await axios.post('https://api.web3forms.com/submit', {
            access_key: process.env.WEB3FORMS_KEY || 'a3c8e411-9e7f-4b08-8e6d-9b5d7d0a2f5f', // EasyXerox Web3Forms Key
            subject: subject,
            from_name: "EasyXerox Web Lead",
            to: "info@futureforbes.in, arjunuddagiri@futureforbes.in",
            name: inquiry.fullName,
            email: inquiry.email,
            phone: inquiry.phone,
            city: inquiry.city,
            venueType: inquiry.venueType,
            message: inquiry.message,
            partnerModel: inquiry.partnerModel
        });
        logger.info(`[EmailService] Inquiry email dispatched via Web3Forms API`);
        return { success: true, method: 'WEB3FORMS' };
    } catch (apiErr) {
        logger.error(`[EmailService] Fallback API error: ${apiErr.message}`);
    }

    return { success: false, error: 'All email methods attempted' };
}

module.exports = { sendInquiryNotification };
