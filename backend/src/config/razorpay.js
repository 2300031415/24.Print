const Razorpay = require('razorpay');
const crypto = require('crypto');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKey12345';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'mockSecret67890';

let instance = null;

try {
    instance = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    });
} catch (err) {
    console.warn('Razorpay SDK initialization warning (Mock mode active):', err.message);
}

const verifySignature = (orderId, paymentId, signature) => {
    if (!signature) return false;
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    return expectedSignature === signature;
};

const verifyWebhookSignature = (body, signature, webhookSecret) => {
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret || RAZORPAY_KEY_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
    return expectedSignature === signature;
};

module.exports = {
    razorpay: instance,
    verifySignature,
    verifyWebhookSignature,
    key_id: RAZORPAY_KEY_ID
};
