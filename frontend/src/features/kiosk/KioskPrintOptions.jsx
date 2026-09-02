import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings2, Minus, Plus, Palette, Layers, FileSpreadsheet, RotateCcw, ArrowRight, ArrowLeft, CreditCard, Sparkles } from 'lucide-react';

import api from '../../services/api';
import KioskPaymentModal from './KioskPaymentModal';

const KioskPrintOptions = () => {
  const { machineId, uploadToken } = useParams();
  const navigate = useNavigate();

  const [upload, setUpload] = useState(null);
  const [pricing, setPricing] = useState({
    bw_single_page_price: 2.00,
    color_single_page_price: 10.00,
    bw_duplex_page_price: 3.50,
    color_duplex_page_price: 18.00
  });
  const [gst, setGst] = useState({ percentage: 18.00 });

  // Print Settings State
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw'); // 'bw' | 'color'
  const [duplexMode, setDuplexMode] = useState('single'); // 'single' | 'duplex'
  const [paperSize, setPaperSize] = useState('A4'); // 'A4' | 'A3' | 'Legal'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchUploadAndPricing = async () => {
      try {
        const uploadRes = await api.get(`/uploads/${uploadToken}`);
        if (uploadRes.data.success) {
          setUpload(uploadRes.data.upload);
        }

        const machineRes = await api.get(`/machines/code/${machineId}`);
        if (machineRes.data.success) {
          if (machineRes.data.pricing) setPricing(machineRes.data.pricing);
          if (machineRes.data.gst) setGst(machineRes.data.gst);
        }
      } catch (err) {
        console.error('Error fetching print options configuration:', err);
      }
    };

    fetchUploadAndPricing();
  }, [uploadToken, machineId]);

  // 60-Second Inactivity Auto-Reset to Standby Ads Home Screen (unless payment modal is open)
  useEffect(() => {
    if (showPaymentModal) return;
    const idleTimer = setTimeout(() => {
      navigate(`/kiosk/${machineId}`);
    }, 60000);
    return () => clearTimeout(idleTimer);
  }, [showPaymentModal, machineId, navigate]);

  if (!upload) return null;

  const totalPages = upload.total_pages || 1;

  // Price Calculation Logic
  let pricePerPage = 2.0;
  if (colorMode === 'bw' && duplexMode === 'single') pricePerPage = parseFloat(pricing.bw_single_page_price || 2.0);
  else if (colorMode === 'color' && duplexMode === 'single') pricePerPage = parseFloat(pricing.color_single_page_price || 10.0);
  else if (colorMode === 'bw' && duplexMode === 'duplex') pricePerPage = parseFloat(pricing.bw_duplex_page_price || 3.5);
  else if (colorMode === 'color' && duplexMode === 'duplex') pricePerPage = parseFloat(pricing.color_duplex_page_price || 18.0);

  // Paper Size multiplier if A3 / Legal
  let paperMultiplier = 1.0;
  if (paperSize === 'A3') paperMultiplier = 1.5;
  else if (paperSize === 'Legal') paperMultiplier = 1.2;

  const subtotalAmount = Math.round((totalPages * copies * pricePerPage * paperMultiplier) * 100) / 100;
  const gstRate = parseFloat(gst.percentage || 18.0) / 100;
  const gstAmount = Math.round((subtotalAmount * gstRate) * 100) / 100;
  const totalAmount = Math.round((subtotalAmount + gstAmount) * 100) / 100;

  const printOptionsSummary = {
    copies,
    colorMode,
    duplexMode,
    paperSize,
    orientation,
    totalPages,
    pricePerPage,
    subtotalAmount,
    gstAmount,
    totalAmount
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col p-4 md:p-6 select-none overflow-y-auto font-sans">
      {/* HEADER BAR */}
      <header className="flex items-center justify-between bg-white border-2 border-blue-100 rounded-3xl px-6 py-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950 font-heading">Configure Print Options</h1>
            <p className="text-xs text-slate-500 font-bold">Step 2 of 3: Select copies, color mode, and paper layout</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/kiosk/${machineId}/preview/${uploadToken}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-900 font-bold rounded-2xl border border-blue-200 transition-all text-sm btn-touch"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Preview</span>
        </button>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="grid grid-cols-12 gap-8 my-auto h-[calc(100vh-190px)] py-3">
        {/* LEFT COLUMN: TOUCH OPTIONS CONFIGURATOR */}
        <div className="col-span-8 bg-white border-2 border-blue-100 rounded-3xl p-6 overflow-y-auto space-y-6 shadow-xl">
          {/* 1. COPIES SELECTOR */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">
              Number of Copies
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCopies(Math.max(1, copies - 1))}
                className="w-14 h-14 bg-white hover:bg-blue-100 active:scale-90 text-blue-900 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 border-blue-200 btn-touch shadow-sm"
              >
                <Minus className="w-7 h-7 text-blue-600" />
              </button>
              <span className="text-3xl font-black text-blue-600 font-mono w-24 text-center bg-white py-2.5 rounded-2xl border-2 border-blue-200 shadow-sm">
                {copies}
              </span>
              <button
                onClick={() => setCopies(copies + 1)}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-700 active:scale-90 text-white rounded-2xl flex items-center justify-center font-bold text-2xl border-2 border-blue-600 btn-touch shadow-blue-glow"
              >
                <Plus className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* 2. COLOR / BW MODE */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>Color Output Mode</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setColorMode('bw')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all btn-touch ${
                  colorMode === 'bw'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-glow'
                    : 'bg-white border-blue-100 text-slate-700 hover:border-blue-300'
                }`}
              >
                <span className="text-lg font-black">Black & White (B&W)</span>
                <span className={`text-xs font-bold ${colorMode === 'bw' ? 'text-blue-100' : 'text-blue-600'}`}>
                  ₹{pricing.bw_single_page_price}/page
                </span>
              </button>

              <button
                onClick={() => setColorMode('color')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all btn-touch ${
                  colorMode === 'color'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-glow'
                    : 'bg-white border-blue-100 text-slate-700 hover:border-blue-300'
                }`}
              >
                <span className="text-lg font-black">Full Color Mode</span>
                <span className={`text-xs font-bold ${colorMode === 'color' ? 'text-blue-100' : 'text-blue-600'}`}>
                  ₹{pricing.color_single_page_price}/page
                </span>
              </button>
            </div>
          </div>

          {/* 3. DUPLEX / SINGLE SIDE */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Page Printing Sides</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDuplexMode('single')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all btn-touch ${
                  duplexMode === 'single'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-glow'
                    : 'bg-white border-blue-100 text-slate-700 hover:border-blue-300'
                }`}
              >
                <span className="text-lg font-black">Single-Sided</span>
                <span className={`text-xs font-bold ${duplexMode === 'single' ? 'text-blue-100' : 'text-slate-500'}`}>
                  1 Page per Sheet
                </span>
              </button>

              <button
                onClick={() => setDuplexMode('duplex')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all btn-touch ${
                  duplexMode === 'duplex'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-glow'
                    : 'bg-white border-blue-100 text-slate-700 hover:border-blue-300'
                }`}
              >
                <span className="text-lg font-black">Duplex (Both Sides)</span>
                <span className={`text-xs font-bold ${duplexMode === 'duplex' ? 'text-emerald-200' : 'text-emerald-600'}`}>
                  Save Paper Sheets
                </span>
              </button>
            </div>
          </div>

          {/* 4. PAPER SIZE & ORIENTATION */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
              <label className="text-xs font-black text-slate-500 uppercase block mb-3">Paper Size</label>
              <div className="flex gap-2">
                {['A4', 'Legal', 'A3'].map((size) => {
                  const isAvailable = size === 'A4';
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setPaperSize(size)}
                      className={`flex-1 py-3 font-black rounded-xl border text-sm transition-all flex flex-col items-center justify-center relative ${
                        paperSize === size
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : !isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                          : 'bg-white text-slate-700 border-blue-100 hover:border-blue-300 btn-touch'
                      }`}
                    >
                      <span>{size}</span>
                      {!isAvailable && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 -mt-0.5">N/A</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
              <label className="text-xs font-black text-slate-500 uppercase block mb-3">Orientation</label>
              <div className="flex gap-2">
                {['portrait', 'landscape'].map((orient) => (
                  <button
                    key={orient}
                    onClick={() => setOrientation(orient)}
                    className={`flex-1 py-3 font-black rounded-xl border text-sm capitalize transition-all btn-touch ${
                      orientation === orient
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-slate-700 border-blue-100 hover:border-blue-300'
                    }`}
                  >
                    {orient}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC PRICE CALCULATOR SUMMARY */}
        <div className="col-span-4 flex flex-col justify-between bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Realtime Cost Breakdown</span>
            </div>

            <h2 className="text-2xl font-black text-slate-950 font-heading">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3 bg-blue-50/60 p-5 rounded-2xl border border-blue-100 text-sm font-bold">
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-slate-500">Total PDF Pages</span>
                <span className="font-black text-slate-950">{totalPages} Pages</span>
              </div>

              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-slate-400">Copies Requested</span>
                <span className="font-black text-blue-600">{copies} Copy</span>
              </div>

              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-slate-500">Rate per Page</span>
                <span className="font-black text-slate-950">₹{pricePerPage.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-slate-500">Subtotal Amount</span>
                <span className="font-black text-slate-950">₹{subtotalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-slate-500">GST ({gst.percentage}%)</span>
                <span className="font-black text-amber-600">₹{gstAmount.toFixed(2)}</span>
              </div>

              {/* TOTAL AMOUNT HIGHLIGHT */}
              <div className="flex justify-between items-center py-3 pt-4 border-t border-blue-200">
                <span className="text-base font-black text-slate-950">Total Payable</span>
                <span className="text-3xl font-black text-emerald-600 font-mono">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* PROCEED TO PAYMENT BUTTON */}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-blue-glow btn-touch text-xl mt-6"
          >
            <CreditCard className="w-6 h-6" />
            <span>Pay & Print Document</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </main>

      {/* RAZORPAY PAYMENT MODAL */}
      {showPaymentModal && (
        <KioskPaymentModal
          machineId={machineId}
          uploadId={upload.id}
          printOptions={printOptionsSummary}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default KioskPrintOptions;
