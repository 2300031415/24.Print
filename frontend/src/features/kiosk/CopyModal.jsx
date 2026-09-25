import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Plus, Minus, CheckCircle, ArrowRight, X, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import KioskPaymentModal from './KioskPaymentModal';

const CopyModal = ({ isOpen, onClose, machine, pricing = {}, onPrintSuccess }) => {
  const { t } = useLanguage();
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw'); // 'bw' | 'color'
  const [duplexMode, setDuplexMode] = useState('single'); // 'single' | 'duplex'
  const [step, setStep] = useState('configure'); // 'configure' | 'payment' | 'processing' | 'done'
  const [progressMsg, setProgressMsg] = useState('');

  if (!isOpen) return null;

  // Calculate pricing based on machine config
  const unitPrice = colorMode === 'color'
    ? (duplexMode === 'duplex' ? Number(pricing.color_duplex_page_price || 18) : Number(pricing.color_single_page_price || 10))
    : (duplexMode === 'duplex' ? Number(pricing.bw_duplex_page_price || 3.5) : Number(pricing.bw_single_page_price || 2));

  const subtotal = copies * unitPrice;
  const gstRate = 0.18;
  const gstAmount = Number((subtotal * gstRate).toFixed(2));
  const totalAmount = Number((subtotal + gstAmount).toFixed(2));

  const handleStartPayment = () => {
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    setStep('processing');
    setProgressMsg(t('copy_flow.scanning', 'Scanning original document...'));

    setTimeout(() => {
      setProgressMsg(t('copy_flow.printing', 'Printing physical copy...'));
      setTimeout(() => {
        setStep('done');
        if (typeof onPrintSuccess === 'function') onPrintSuccess();
      }, 3000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white border-2 border-blue-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-heading tracking-wide">
                {t('copy_flow.heading', 'Instant Photocopy')}
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                {t('copy_flow.place_document', 'Place original document face down on scanner glass')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Step 1: Configure Options */}
        {step === 'configure' && (
          <div className="p-8 flex flex-col gap-6">
            {/* Number of Copies Stepper */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider block">
                  {t('copy_flow.num_copies', 'Number of Copies')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Select quantity of physical prints
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCopies(c => Math.max(1, c - 1))}
                  className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center text-slate-800 font-black text-xl hover:bg-slate-100 active:scale-90 transition-all"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-3xl font-black font-mono text-blue-600 w-12 text-center">
                  {copies}
                </span>
                <button
                  onClick={() => setCopies(c => Math.min(50, c + 1))}
                  className="w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md flex items-center justify-center font-black text-xl hover:bg-blue-700 active:scale-90 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Color Mode Options */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                {t('copy_flow.color_mode', 'Color Mode')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setColorMode('bw')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-between transition-all ${
                    colorMode === 'bw'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-900" />
                    {t('copy_flow.bw', 'Black & White')}
                  </span>
                  <span className="font-mono text-xs font-black text-blue-600">
                    ₹{pricing.bw_single_page_price || '2.00'}/pg
                  </span>
                </button>

                <button
                  onClick={() => setColorMode('color')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-between transition-all ${
                    colorMode === 'color'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                    {t('copy_flow.color', 'Full Color')}
                  </span>
                  <span className="font-mono text-xs font-black text-blue-600">
                    ₹{pricing.color_single_page_price || '10.00'}/pg
                  </span>
                </button>
              </div>
            </div>

            {/* Side Mode: Single vs Duplex */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">
                {t('copy_flow.sides', 'Print Sides')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDuplexMode('single')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                    duplexMode === 'single'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('copy_flow.single_sided', 'Single Sided (1-Side)')}
                </button>

                <button
                  onClick={() => setDuplexMode('duplex')}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                    duplexMode === 'duplex'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('copy_flow.double_sided', 'Double Sided (Duplex)')}
                </button>
              </div>
            </div>

            {/* Price Breakdown Banner */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t('copy_flow.total_price', 'Total Price (incl. GST)')}
                </span>
                <span className="text-xs text-blue-700 font-semibold">
                  {copies} {copies === 1 ? 'copy' : 'copies'} • {colorMode.toUpperCase()} • {duplexMode.toUpperCase()}
                </span>
              </div>
              <span className="text-4xl font-black font-mono text-blue-700">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartPayment}
              className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg tracking-wider shadow-lg flex items-center justify-center gap-3 active:scale-98 transition-all"
            >
              <span>{t('copy_flow.proceed_payment', 'Proceed to Payment')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Payment Modal Integration */}
        {step === 'payment' && (
          <div className="p-8 flex flex-col items-center">
            <KioskPaymentModal
              isOpen={true}
              onClose={() => setStep('configure')}
              onSuccess={handlePaymentSuccess}
              amount={totalAmount}
              jobData={{
                machineId: machine?.machine_code || 'KIOSK-001',
                copies,
                colorMode,
                duplexMode,
                totalAmount
              }}
            />
          </div>
        )}

        {/* Step 3: Hardware Processing State */}
        {step === 'processing' && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h3 className="text-2xl font-black text-slate-900 font-heading mb-2">
              {progressMsg}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Please do not lift the scanner lid or remove paper while printing is in progress.
            </p>
          </div>
        )}

        {/* Step 4: Done Completion Screen */}
        {step === 'done' && (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 font-heading mb-2">
              Copies Printed Successfully!
            </h3>
            <p className="text-base text-slate-600 max-w-md mb-8">
              Please collect your original document from the glass and your printed copies from the output tray.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-md"
            >
              Finish & Return to Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CopyModal;
