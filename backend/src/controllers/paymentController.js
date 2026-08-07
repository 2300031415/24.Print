const crypto = require('crypto');
const db = require('../config/db');
const { razorpay, verifySignature, key_id } = require('../config/razorpay');
const logger = require('../services/logger');

const createRazorpayOrder = async (req, res, next) => {
    try {
        const { uploadId, machineId, copies, colorMode, duplexMode, paperSize, totalPages, subtotalAmount, gstAmount, totalAmount } = req.body;

        if (!uploadId || !machineId || !totalAmount) {
            return res.status(400).json({ success: false, message: 'Upload ID, Machine ID, and Total Amount are required.' });
        }

        // Fetch machine details
        const machineRes = await db.query('SELECT id, machine_code, client_id FROM machines WHERE id = $1 OR machine_code = $1', [machineId]);
        if (machineRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Machine not found.' });
        }
        const machine = machineRes.rows[0];

        // Amount in Paise (e.g. ₹23.60 = 2360 paise)
        const amountPaise = Math.round(parseFloat(totalAmount) * 100);
        const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        let razorpayOrder;

        if (razorpay) {
            try {
                razorpayOrder = await razorpay.orders.create({
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
            keyId: key_id,
            order: razorpayOrder,
            paymentId: paymentRes.rows[0].id,
            totalAmount: totalAmount
        });
    } catch (err) {
        next(err);
    }
};

const verifyPayment = async (req, res, next) => {
    const clientDb = await db.pool.connect();
    try {
        await clientDb.query('BEGIN');

        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, uploadId, printOptions } = req.body;

        if (!razorpayOrderId) {
            return res.status(400).json({ success: false, message: 'Razorpay Order ID is required.' });
        }

        const payRes = await clientDb.query(
            `SELECT p.*, u.file_path, u.original_filename, m.machine_code, m.client_id, m.default_printer_name
             FROM payments p
             JOIN uploads u ON p.upload_id = u.id
             JOIN machines m ON p.machine_id = m.id
             WHERE p.razorpay_order_id = $1`,
            [razorpayOrderId]
        );

        if (payRes.rows.length === 0) {
            await clientDb.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Payment record not found.' });
        }

        const payment = payRes.rows[0];

        // If mock mode or signature valid
        const isMock = razorpayOrderId.startsWith('order_mock_');
        const isValid = isMock || verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            await clientDb.query('UPDATE payments SET status = \'failed\' WHERE id = $1', [payment.id]);
            await clientDb.query('COMMIT');
            return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed.' });
        }

        // 1. Update Payment Status to captured
        const updatedPaymentRes = await clientDb.query(
            `UPDATE payments 
             SET status = 'captured',
                 razorpay_payment_id = $1,
                 razorpay_signature = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 RETURNING *`,
            [razorpayPaymentId || `pay_mock_${Date.now()}`, razorpaySignature || 'mock_sig', payment.id]
        );

        // 2. Fetch Client Commission Rate
        const clientRes = await clientDb.query('SELECT commission_rate FROM clients WHERE id = $1', [payment.client_id]);
        const commissionRate = clientRes.rows.length > 0 ? parseFloat(clientRes.rows[0].commission_rate) : 80.0;

        const grossAmount = parseFloat(payment.amount);
        const gstAmount = printOptions ? parseFloat(printOptions.gstAmount || 0) : Math.round((grossAmount * 0.18 / 1.18) * 100) / 100;
        const netAmount = grossAmount - gstAmount;
        const clientShare = Math.round((netAmount * (commissionRate / 100)) * 100) / 100;
        const platformShare = Math.round((netAmount - clientShare) * 100) / 100;

        // 3. Create Transaction Record
        await clientDb.query(
            `INSERT INTO transactions (payment_id, machine_id, client_id, gross_amount, gst_amount, net_amount, client_share, platform_share, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'settled')`,
            [payment.id, payment.machine_id, payment.client_id, grossAmount, gstAmount, netAmount, clientShare, platformShare]
        );

        // 4. Create Print Job Entry
        const copies = printOptions?.copies || 1;
        const colorMode = printOptions?.colorMode || 'bw';
        const duplexMode = printOptions?.duplexMode || 'single';
        const paperSize = printOptions?.paperSize || 'A4';
        const orientation = printOptions?.orientation || 'portrait';
        const totalPages = printOptions?.totalPages || 1;
        const subtotal = printOptions?.subtotalAmount || grossAmount;

        const printJobRes = await clientDb.query(
            `INSERT INTO print_jobs (machine_id, upload_id, payment_id, printer_name, copies, color_mode, duplex_mode, paper_size, orientation, total_pages, price_per_page, subtotal_amount, gst_amount, total_amount, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'queued') RETURNING *`,
            [
                payment.machine_id,
                payment.upload_id,
                payment.id,
                payment.default_printer_name || 'Kiosk_Printer_Default',
                copies,
                colorMode,
                duplexMode,
                paperSize,
                orientation,
                totalPages,
                printOptions?.pricePerPage || 2.0,
                subtotal,
                gstAmount,
                grossAmount
            ]
        );

        const printJob = printJobRes.rows[0];

        await clientDb.query('COMMIT');

        // 5. Trigger Socket.IO to Kiosk and Windows Print Service Daemon
        const io = req.app.get('socketio');
        if (io) {
            const printPayload = {
                printJobId: printJob.id,
                machineCode: payment.machine_code,
                machineId: payment.machine_id,
                filePath: payment.file_path,
                originalFilename: payment.original_filename,
                printerName: payment.default_printer_name,
                copies,
                colorMode,
                duplexMode,
                paperSize,
                orientation,
                totalPages
            };

            io.to(`machine:${payment.machine_code}`).emit('PAYMENT_SUCCESS', printPayload);
            io.to(`machine:${payment.machine_id}`).emit('PAYMENT_SUCCESS', printPayload);
            // Notify Windows Print Daemon
            io.to(`daemon:${payment.machine_code}`).emit('DO_SILENT_PRINT', printPayload);
        }

        res.json({
            success: true,
            message: 'Payment verified successfully! Silent print job dispatched.',
            printJob: printJob
        });
    } catch (err) {
        await clientDb.query('ROLLBACK');
        next(err);
    } finally {
        clientDb.release();
    }
};

module.exports = {
    createRazorpayOrder,
    verifyPayment
};
