import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, Printer, ShieldCheck } from 'lucide-react';

import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

const KioskPaymentModal = ({ machineId, uploadId, printOptions, onClose }) => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [loading, setLoading] = useState(true);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'verifying' | 'printing' | 'completed' | 'failed'
  const [errorMsg, setErrorMsg] = useState(null);

  // Create Razorpay Order on Mount
  useEffect(() => {
    const initPaymentOrder = async () => {
      try {
        const res = await api.post('/payments/create-order', {
          uploadId,
          machineId,
          ...printOptions
        });

        if (res.data.success) {
          setRazorpayOrder(res.data.order);
        } else {
          setErrorMsg(res.data.message || 'Failed to create payment order.');
          setPaymentStatus('failed');
        }
      } catch (err) {
        setErrorMsg('Network error generating payment QR.');
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    initPaymentOrder();
  }, [uploadId, machineId, printOptions]);

  // Listen to Socket.IO for PAYMENT_SUCCESS & PRINT_STATUS_UPDATE
  useEffect(() => {
    if (!socket) return;

    const handlePaymentSuccess = (payload) => {
      console.log('⚡ Realtime Payment Success Event Received:', payload);
      setPaymentStatus('printing');
    };

    const handlePrintStatusUpdate = (payload) => {
      console.log('⚡ Realtime Print Status Update:', payload);
      if (payload.status === 'completed') {
        setPaymentStatus('completed');
        // Auto reset to Kiosk Home Screen after 5 seconds
        setTimeout(() => {
          navigate(`/kiosk/${machineId}`);
        }, 5000);
      } else if (payload.status === 'failed') {
        setPaymentStatus('failed');
        setErrorMsg(payload.errorMessage || 'Silent print execution failed on local printer daemon.');
      }
    };

    socket.on('PAYMENT_SUCCESS', handlePaymentSuccess);
    socket.on('PRINT_STATUS_UPDATE', handlePrintStatusUpdate);

    return () => {
      socket.off('PAYMENT_SUCCESS', handlePaymentSuccess);
      socket.off('PRINT_STATUS_UPDATE', handlePrintStatusUpdate);
    };
  }, [socket, machineId, navigate]);

  // Simulated Instant Payment Trigger for Demonstration / Testing
  const handleSimulatePayment = async () => {
    if (!razorpayOrder) return;
    setPaymentStatus('verifying');
    try {
      const res = await api.post('/payments/verify', {
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: `pay_sim_${Date.now()}`,
        razorpaySignature: 'mock_signature',
        uploadId,
        printOptions
      });

      if (res.data.success) {
        setPaymentStatus('printing');
      } else {
        setPaymentStatus('failed');
        setErrorMsg(res.data.message);
      }
    } catch (err) {
      setPaymentStatus('failed');
      setErrorMsg('Payment verification failed.');
    }
  };

  const paymentUpiUrl = razorpayOrder
    ? `upi://pay?pa=mockmerchant@razorpay&pn=XeroxKiosk&am=${printOptions.totalAmount}&cu=INR&tn=PrintOrder_${razorpayOrder.id}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative flex flex-col items-center text-center"
      >
        {paymentStatus === 'pending' && (
          <>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white font-heading mt-2">
              Scan UPI QR Code to Pay
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Use Google Pay, PhonePe, Paytm, or any UPI App
            </p>

            <div className="my-6 p-5 bg-white rounded-3xl shadow-2xl shadow-cyan-500/20 border-4 border-cyan-400">
              {loading ? (
                <div className="w-56 h-56 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-2" />
                  <span className="text-xs text-slate-700 font-semibold">Generating Razorpay QR...</span>
                </div>
              ) : (
                <QRCodeSVG value={paymentUpiUrl} size={220} level="M" />
              )}
            </div>

            <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">Amount Due</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                ₹{printOptions.totalAmount.toFixed(2)}
              </span>
            </div>

            {/* DEMO FAST SIMULATION BUTTON */}
            <button
              onClick={handleSimulatePayment}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-2xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Simulate Successful UPI Payment</span>
            </button>
          </>
        )}

        {(paymentStatus === 'verifying' || paymentStatus === 'printing') && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Printer className="w-10 h-10 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white font-heading">
              {paymentStatus === 'verifying' ? 'Verifying Payment...' : 'Printing Document Silently...'}
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">
              Sending silent print job directly to local Windows printer spooler queue.
            </p>
          </div>
        )}

        {paymentStatus === 'completed' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-extrabold text-white font-heading">
              Print Job Completed!
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Please collect your printed pages from the output tray.
            </p>
            <p className="text-xs text-emerald-400 mt-4 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800">
              Uploaded PDF has been automatically deleted from system for privacy.
            </p>
            <span className="text-xs text-slate-500 mt-6">Returning to Home Screen in 5 seconds...</span>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-400 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white font-heading">
              Transaction Error
            </h3>
            <p className="text-sm text-rose-300 mt-2 max-w-xs">{errorMsg || 'Payment verification failed.'}</p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl btn-touch"
            >
              Close & Try Again
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default KioskPaymentModal;
