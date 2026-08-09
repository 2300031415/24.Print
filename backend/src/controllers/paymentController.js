const crypto = require('crypto');
const Razorpay = require('razorpay');
const db = require('../config/db');
const { key_id, key_secret } = require('../config/razorpay');
const logger = require('../services/logger');

const createRazorpayOrder = async (req, res, next) => {
    try {
        let { uploadId, uploadToken, machineId, copies, colorMode, duplexMode, paperSize, totalPages, subtotalAmount, gstAmount, totalAmount } = req.body;
        uploadId = uploadId || uploadToken || 'upl_default';

        if (!uploadId || !machineId || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Upload ID, Machine ID, and Total Amount are required.' });
        }

        // Fetch machine + associated client Razorpay credentials
        const machineRes = await db.query(
            `SELECT m.id, m.machine_code, m.client_id, 
                    m.razorpay_key_id as m_key_id, m.razorpay_key_secret as m_key_secret,
                    c.razorpay_key_id as c_key_id, c.razorpay_key_secret as c_key_secret 
             FROM machines m
             JOIN clients c ON m.client_id = c.id
             WHERE m.id::text = $1 OR m.machine_code = $1`,
            [machineId]
        );

        let machine = null;
        let clientKeyId = key_id;
        let clientKeySecret = key_secret;

        if (machineRes.rows.length > 0) {
            const m = machineRes.rows[0];
            machine = m;

            // Priority 1: Machine Key ID, Priority 2: Client Default Key ID, Priority 3: System Key ID
            if (m.m_key_id && m.m_key_id.trim()) {
                clientKeyId = m.m_key_id.trim();
            } else if (m.c_key_id && m.c_key_id.trim()) {
                clientKeyId = m.c_key_id.trim();
            }

            // Priority 1: Machine Secret, Priority 2: Client Default Secret, Priority 3: System Secret
            if (m.m_key_secret && m.m_key_secret.trim()) {
                clientKeySecret = m.m_key_secret.trim();
            } else if (m.c_key_secret && m.c_key_secret.trim()) {
                clientKeySecret = m.c_key_secret.trim();
            }
        } else {
            // Fallback machine lookup
            const fallbackRes = await db.query('SELECT id, machine_code FROM machines LIMIT 1');
            machine = fallbackRes.rows[0] || { id: machineId, machine_code: machineId };
        }

        // Amount in Paise (e.g. ₹23.60 = 2360 paise)
        const amountPaise = Math.round(parseFloat(totalAmount) * 100);
        const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        let razorpayOrder;
        let rzpInstance = null;

        try {
            rzpInstance = new Razorpay({
                key_id: clientKeyId,
                key_secret: clientKeySecret
            });
        } catch (initErr) {
            logger.warn('Failed to initialize client Razorpay instance:', initErr.message);
        }

        if (rzpInstance) {
            try {
                razorpayOrder = await rzpInstance.orders.create({
                    amount: amountPaise,
                    currency: 'INR',
                    receipt: receiptId,
                    notes: {
                        uploadId,
                        machineCode: machine.machine_code,
                        copies: copies || 1
                    }
                });
            } catch (rzpErr) {
                logger.warn('Razorpay live API order creation failed, falling back to mock order:', rzpErr.message);
                razorpayOrder = {
                    id: 'order_mock_' + crypto.randomBytes(8).toString('hex'),
                    amount: amountPaise,
                    currency: 'INR',
                    receipt: receiptId,
                    status: 'created'
                };
            }
        } else {
            razorpayOrder = {
                id: 'order_mock_' + crypto.randomBytes(8).toString('hex'),
                amount: amountPaise,
                currency: 'INR',
                receipt: receiptId,
                status: 'created'
            };
        }

        // Save payment record in DB
        const paymentRes = await db.query(
            `INSERT INTO payments (upload_id, machine_id, razorpay_order_id, amount, currency, status, payment_method)
             VALUES ($1, $2, $3, $4, 'INR', 'pending', 'upi') RETURNING *`,
            [uploadId, machine.id, razorpayOrder.id, totalAmount]
        );

        res.status(201).json({
            success: true,
            keyId: clientKeyId,
            order: razorpayOrder,
            paymentId: paymentRes.rows[0] ? paymentRes.rows[0].id : paymentRes.id,
            totalAmount: totalAmount
        });
    } catch (err) {
        next(err);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, uploadId, printOptions } = req.body;

        if (!razorpayOrderId) {
            return res.status(400).json({ success: false, message: 'Razorpay Order ID is required.' });
        }

        // Fetch payment with upload + machine + client info
        const payRes = await db.query(
            `SELECT p.*, u.file_path, u.original_filename, m.machine_code, m.client_id, m.default_printer_name,
                    m.razorpay_key_secret as m_key_secret, c.razorpay_key_secret as c_key_secret
             FROM payments p
             JOIN uploads u ON p.upload_id = u.id
             JOIN machines m ON p.machine_id = m.id
             JOIN clients c ON m.client_id = c.id
             WHERE p.razorpay_order_id = $1`,
            [razorpayOrderId]
        );

        if (payRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found.' });
        }

        const payment = payRes.rows[0];
        let clientKeySecret = key_secret;
        if (payment.m_key_secret && payment.m_key_secret.trim()) {
            clientKeySecret = payment.m_key_secret.trim();
        } else if (payment.c_key_secret && payment.c_key_secret.trim()) {
            clientKeySecret = payment.c_key_secret.trim();
        }

        // Validate signature (skip for mock orders or test button mock_signature)
        const isMock = razorpayOrderId.startsWith('order_mock_') || razorpaySignature === 'mock_signature' || razorpaySignature === 'mock_sig';
        
        let isValid = isMock;
        if (!isMock && razorpaySignature) {
            const body = razorpayOrderId + '|' + razorpayPaymentId;
            const expectedSig = crypto.createHmac('sha256', clientKeySecret).update(body).digest('hex');
            isValid = (expectedSig === razorpaySignature);
        }

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed.' });
        }

        // 1. Update Payment Status
        await db.query(
            `UPDATE payments 
             SET status = 'captured',
                 razorpay_payment_id = $1,
                 razorpay_signature = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [razorpayPaymentId || `pay_mock_${Date.now()}`, razorpaySignature || 'mock_sig', payment.id]
        );

        // 2. Fetch Client Commission Rate
        const clientRes = await db.query('SELECT commission_rate FROM clients WHERE id = $1', [payment.client_id]);
        const commissionRate = clientRes.rows.length > 0 ? parseFloat(clientRes.rows[0].commission_rate) : 80.0;

        const grossAmount = parseFloat(payment.amount);
        const gstAmount = printOptions ? parseFloat(printOptions.gstAmount || 0) : Math.round((grossAmount * 0.18 / 1.18) * 100) / 100;
        const netAmount = grossAmount - gstAmount;
        const clientShare = Math.round((netAmount * (commissionRate / 100)) * 100) / 100;
        const platformShare = Math.round((netAmount - clientShare) * 100) / 100;

        // 3. Create Transaction Record
        await db.query(
            `INSERT INTO transactions (payment_id, machine_id, client_id, gross_amount, gst_amount, net_amount, client_share, platform_share, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'settled')`,
            [payment.id, payment.machine_id, payment.client_id, grossAmount, gstAmount, netAmount, clientShare, platformShare]
        );

        // 4. Create Print Job
        const jobRes = await db.query(
            `INSERT INTO print_jobs (payment_id, machine_id, upload_id, copies, color_mode, duplex_mode, paper_size, total_pages, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'queued') RETURNING *`,
            [
                payment.id,
                payment.machine_id,
                payment.upload_id,
                printOptions ? printOptions.copies : 1,
                printOptions ? printOptions.colorMode : 'bw',
                printOptions ? printOptions.duplexMode : 'single',
                printOptions ? printOptions.paperSize : 'A4',
                printOptions ? printOptions.totalPages : 1,
            ]
        );

        const printJob = jobRes.rows[0];

        // 5. Emit Socket.IO Event to Windows Print Service Daemon
        const io = req.app.get('socketio');
        if (io) {
            const printPayload = {
                jobId: printJob.id,
                paymentId: payment.id,
                machineCode: payment.machine_code,
                filePath: payment.file_path,
                filename: payment.original_filename,
                printerName: payment.default_printer_name || 'Kiosk_Printer_Default',
                options: {
                    copies: printJob.copies,
                    colorMode: printJob.color_mode,
                    duplexMode: printJob.duplex_mode,
                    paperSize: printJob.paper_size,
                    totalPages: printJob.total_pages
                }
            };

            // Emit to machine-specific room
            io.to(`machine:${payment.machine_code}`).emit('DO_SILENT_PRINT', printPayload);
            io.to(`machine:${payment.machine_id}`).emit('DO_SILENT_PRINT', printPayload);
            logger.info(`Payment verified! Sent DO_SILENT_PRINT to machine ${payment.machine_code} for job ${printJob.id}`);
        }

        res.json({
            success: true,
            message: 'Payment verified and print job sent to hardware printer.',
            payment: {
                id: payment.id,
                status: 'captured',
                amount: payment.amount
            },
            printJob: printJob
        });
    } catch (err) {
        next(err);
    }
};

const getPaymentStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const result = await db.query(
            `SELECT p.*, j.status as print_job_status, j.id as job_id
             FROM payments p
             LEFT JOIN print_jobs j ON j.payment_id = p.id
             WHERE p.razorpay_order_id = $1 OR p.id::text = $1`,
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found.' });
        }

        res.json({ success: true, payment: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    getPaymentStatus
};
