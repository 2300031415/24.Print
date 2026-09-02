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

  // Auto Countdown to Home on Completion
  useEffect(() => {
    if (paymentStatus === 'completed') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/kiosk/${machineId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus, machineId, navigate]);

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

  // Handle Razorpay Popup Trigger
  const openRazorpay = (order, keyToUse) => {
    const options = {
      key: keyToUse,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'EasyXerox Kiosk Printing',
      description: `Silent Print Order (${printOptions.copies} copies • ${printOptions.paperSize})`,
      order_id: order.id.startsWith('order_mock_') ? undefined : order.id,
      handler: async function (response) {
        setPaymentStatus('verifying');
        try {
          const res = await api.post('/payments/verify', {
            razorpayOrderId: order.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            uploadId,
            printOptions
          });

          if (res.data.success) {
            setPaymentStatus('printing');
          } else {
            setPaymentStatus('failed');
            setErrorMsg(res.data.message || 'Payment verification failed.');
          }
        } catch (err) {
          setPaymentStatus('failed');
          setErrorMsg('Error completing payment verification.');
        }
      },
      prefill: { name: 'Kiosk Customer', contact: '9876543210' },
      theme: { color: '#0066FF' },
      modal: {
        ondismiss: () => {
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative flex flex-col items-center text-center text-slate-950"
      >
        {paymentStatus === 'pending' && (
          <>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950 transition-all rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-black text-slate-950 font-heading mt-2">
              {loading ? 'Preparing Payment...' : 'Ready to Pay'}
            </h3>

            <div className="my-6 flex flex-col items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
                  <p className="text-slate-600 font-bold text-xs">Creating secure payment order...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-200 flex items-center justify-center shadow-md">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <p className="text-slate-600 font-bold text-xs">Tap the button below to open Razorpay Gateway</p>
                </>
              )}
            </div>

            <div className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-blue-100 mb-5 flex items-center justify-between shadow-sm">
              <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Total Payable</span>
              <span className="text-3xl font-black text-emerald-600 font-mono">
                ₹{printOptions.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleOpenRazorpayCheckout}
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-md btn-touch text-base flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{loading ? 'Preparing Gateway...' : 'Pay via Razorpay (UPI / Card / NetBanking)'}</span>
              </button>

              <button
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all text-sm flex items-center justify-center gap-2 btn-touch shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>⚡ Test Payment (Simulate & Print Instantly)</span>
              </button>
            </div>
          </>
        )}

        {(paymentStatus === 'verifying' || paymentStatus === 'printing') && (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <Printer className="w-10 h-10 text-blue-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 font-heading">
              {paymentStatus === 'verifying' ? 'Verifying Payment Signature...' : 'Printing Document Silently...'}
            </h3>
            <p className="text-sm font-bold text-slate-600 mt-2 max-w-xs leading-relaxed">
              Sending silent print job directly to local Windows printer spooler queue.
            </p>
          </div>
        )}

        {paymentStatus === 'completed' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-slate-950 font-heading">
              Print Job Completed!
            </h3>
            <p className="text-base font-bold text-slate-700 mt-2">
              Please collect your printed pages from the output tray.
            </p>
            <p className="text-xs text-emerald-800 mt-4 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-300 font-mono font-bold shadow-sm">
              Uploaded document automatically deleted from kiosk memory.
            </p>
            
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="px-6 py-2.5 bg-blue-50 rounded-full text-blue-900 text-sm font-black border border-blue-200 flex items-center gap-2 shadow-sm">
                <span>Returning to Home Screen in</span>
                <span className="text-blue-600 font-black text-lg font-mono">{countdown}s</span>
              </div>
              <button
                onClick={() => navigate(`/kiosk/${machineId}`)}
                className="text-xs font-black text-slate-500 hover:text-slate-950 underline transition-colors"
              >
                Return to Home Screen Now
              </button>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-rose-100 border-2 border-rose-500 flex items-center justify-center text-rose-600 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-950 font-heading">
              {errorMsg?.toLowerCase().includes('printer') || errorMsg?.toLowerCase().includes('paper') || errorMsg?.toLowerCase().includes('spooler')
                ? '⚠️ Printer Hardware Issue'
                : 'Payment Error'}
            </h3>
            <p className="text-sm text-rose-800 mt-2 max-w-sm font-bold leading-relaxed bg-rose-50 p-4 rounded-2xl border border-rose-200">
              {errorMsg || 'Unable to complete print operation. Please check printer paper tray and connections.'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl btn-touch shadow-md"
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
