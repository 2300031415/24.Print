const Razorpay = require('razorpay');
const crypto = require('crypto');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_TNCk8rRk35J4aS';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'BGFv2PHnNW9GG5KnymqrfWie';


let instance = null;

try {
    instance = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log(`✅ Razorpay SDK Initialized successfully with Key ID: ${RAZORPAY_KEY_ID}`);
} catch (err) {
    console.warn('Razorpay SDK initialization warning:', err.message);
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
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
};
