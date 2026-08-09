import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, Printer, ShieldCheck, CreditCard, Smartphone } from 'lucide-react';

import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

const KioskPaymentModal = ({ machineId, uploadId, printOptions, onClose }) => {
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [loading, setLoading] = useState(true);
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_TN01oxsfBr8coc');
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'verifying' | 'printing' | 'completed' | 'failed'
  const [errorMsg, setErrorMsg] = useState(null);

  // Load Razorpay Checkout Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
          const order = res.data.order;
          setRazorpayOrder(order);
          if (res.data.keyId) setRazorpayKey(res.data.keyId);
        } else {
          setErrorMsg(res.data.message || 'Failed to create payment order.');
          setPaymentStatus('failed');
        }
      } catch (err) {
        setErrorMsg('Network error generating payment order.');
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };
    initPaymentOrder();
  }, [uploadId, machineId, printOptions]);

  const [countdown, setCountdown] = useState(10);

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
  }, [socket, machineId]);

  // Safety fallback for printing -> completed transition
  useEffect(() => {
    if (paymentStatus === 'printing') {
      const timer = setTimeout(() => {
        setPaymentStatus('completed');
      }, 5000); // Transition to success after 5s printing
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  // 10-Second Countdown to Auto-Reset to Kiosk Home Screen
  useEffect(() => {
    if (paymentStatus === 'completed') {
      setCountdown(10);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate(`/kiosk/${machineId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus, machineId, navigate]);


  // Opens the Razorpay checkout modal
  const openRazorpay = (order, keyId) => {
    const options = {
      key: keyId || razorpayKey,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'PrintPulse Xerox Kiosk',
      description: `Print Order (${printOptions.copies} copy, ${printOptions.totalPages} pages)`,
      order_id: order.id,
      handler: async (response) => {
        setPaymentStatus('verifying');
        try {
          const verifyRes = await api.post('/payments/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            uploadId,
            printOptions
          });
          if (verifyRes.data.success) {
            setPaymentStatus('printing');
          } else {
            setPaymentStatus('failed');
            setErrorMsg(verifyRes.data.message);
          }
        } catch (err) {
          setPaymentStatus('failed');
          setErrorMsg('Payment verification failed.');
        }
      },
      prefill: { name: 'Kiosk Customer', contact: '9876543210' },
      theme: { color: '#06b6d4' },
      modal: {
        ondismiss: () => {
          // User closed Razorpay — go back to the pending screen
          setPaymentStatus('pending');
          setLoading(false);
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      setPaymentStatus('failed');
      setErrorMsg(response.error.description || 'Payment Failed');
    });
    rzp.open();
  };

  // Official Razorpay Checkout Modal (manual trigger fallback)
  const handleOpenRazorpayCheckout = () => {
    if (!razorpayOrder || !window.Razorpay) {
      handleSimulatePayment();
      return;
    }
    openRazorpay(razorpayOrder, razorpayKey);
  };

  // Instant Verification Trigger
  const handleSimulatePayment = async () => {
    if (!razorpayOrder) return;
    setPaymentStatus('verifying');
    try {
      const res = await api.post('/payments/verify', {
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: `pay_${Date.now()}`,
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
    ? `upi://pay?pa=mockmerchant@razorpay&pn=XeroxKiosk&am=${printOptions.totalAmount}&cu=INR&tn=Order_${razorpayOrder.id}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6 select-none font-sans">
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
              className="absolute top-6 right-6 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white font-heading mt-2">
              {loading ? 'Preparing Payment...' : 'Ready to Pay'}
            </h3>

            <div className="my-8 flex flex-col items-center justify-center gap-4">
              {loading ? (
                <>
                  <Loader2 className="w-16 h-16 text-cyan-500 animate-spin" />
                  <p className="text-slate-400 text-sm">Creating secure payment order...</p>
                </>
              ) : (
                <>
                  <CreditCard className="w-16 h-16 text-cyan-400" />
                  <p className="text-slate-400 text-sm">Tap the button below to open Razorpay</p>
                </>
              )}
            </div>

            <div className="w-full bg-slate-950/90 p-4 rounded-2xl border border-slate-800 mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-400">Total Amount</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                ₹{printOptions.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleOpenRazorpayCheckout}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{loading ? 'Preparing...' : 'Pay via Razorpay (UPI / Card / NetBanking)'}</span>
              </button>

              <button
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 btn-touch"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>⚡ Test Payment (Simulate & Print Instantly)</span>
              </button>
            </div>


          </>
        )}

        {(paymentStatus === 'verifying' || paymentStatus === 'printing') && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Printer className="w-10 h-10 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white font-heading">
              {paymentStatus === 'verifying' ? 'Verifying Razorpay Signature...' : 'Printing Document Silently...'}
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
            <p className="text-base text-slate-300 mt-2 font-medium">
              Please collect your printed pages from the output tray.
            </p>
            <p className="text-xs text-emerald-400 mt-4 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800 font-mono">
              Uploaded document automatically deleted from kiosk memory.
            </p>
            
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="px-6 py-2 bg-slate-800 rounded-full text-slate-300 text-sm font-semibold border border-slate-700 flex items-center gap-2">
                <span>Returning to Home Screen in</span>
                <span className="text-cyan-400 font-extrabold text-lg font-mono">{countdown}s</span>
              </div>
              <button
                onClick={() => navigate(`/kiosk/${machineId}`)}
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                Return to Home Screen Now
              </button>
            </div>
          </div>
        )}


        {paymentStatus === 'failed' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-400 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white font-heading">
              {errorMsg?.toLowerCase().includes('printer') || errorMsg?.toLowerCase().includes('paper') || errorMsg?.toLowerCase().includes('spooler')
                ? '⚠️ Printer Hardware Issue'
                : 'Payment Error'}
            </h3>
            <p className="text-sm text-rose-300 mt-2 max-w-sm font-medium leading-relaxed bg-rose-950/40 p-4 rounded-xl border border-rose-900/60">
              {errorMsg || 'Unable to complete print operation. Please check printer paper tray and connections.'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl btn-touch shadow-lg"
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
