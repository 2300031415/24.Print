import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  FileText,
  Upload,
  QrCode,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
  CreditCard,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  FileCheck,
  Check
} from 'lucide-react';

const SAMPLE_DOCS = [
  { id: 'doc1', name: 'University_Assignment_2026.pdf', pages: 6, size: '1.4 MB', icon: FileText, color: 'text-blue-600' },
  { id: 'doc2', name: 'Government_Aadhaar_ID_Proof.pdf', pages: 2, size: '0.8 MB', icon: ShieldCheck, color: 'text-emerald-600' },
  { id: 'doc3', name: 'Professional_Executive_Resume.pdf', pages: 3, size: '1.1 MB', icon: FileCheck, color: 'text-purple-600' },
];

const InteractivePrintSimulator = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Options, 3: UPI Pay, 4: Printing, 5: Done
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_DOCS[0]);
  const [customFile, setCustomFile] = useState(null);
  
  // Print options
  const [colorMode, setColorMode] = useState('bw'); // 'bw' or 'color'
  const [duplex, setDuplex] = useState(false); // single or double sided
  const [copies, setCopies] = useState(1);
  const [paperSize, setPaperSize] = useState('A4');
  
  // Sim states
  const [isPaying, setIsPaying] = useState(false);
  const [printProgress, setPrintProgress] = useState(0);

  // Price Calculation
  const pricePerPage = colorMode === 'color' ? 10 : 2;
  const totalPages = selectedDoc ? selectedDoc.pages : 4;
  const baseCost = totalPages * pricePerPage * copies;
  const discount = duplex ? Math.round(baseCost * 0.1) : 0;
  const finalPrice = Math.max(1, baseCost - discount);

  useEffect(() => {
    if (step === 4) {
      setPrintProgress(0);
      const interval = setInterval(() => {
        setPrintProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(5), 600);
            return 100;
          }
          return prev + 20;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleCustomFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const customDoc = {
        id: 'custom',
        name: file.name,
        pages: Math.floor(Math.random() * 8) + 2,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        icon: FileText,
        color: 'text-blue-600'
      };
      setCustomFile(file);
      setSelectedDoc(customDoc);
    }
  };

  const handlePayClick = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setStep(4);
    }, 1500);
  };

  const resetSim = () => {
    setStep(1);
    setSelectedDoc(SAMPLE_DOCS[0]);
    setCustomFile(null);
    setColorMode('bw');
    setDuplex(false);
    setCopies(1);
    setPaperSize('A4');
    setPrintProgress(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden text-slate-900 my-8"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 px-3 rounded-xl border border-blue-400/50 shadow-md">
                <img src="/logo.png" alt="EasyXerox" className="h-7 w-auto object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-black font-heading text-white tracking-tight flex items-center gap-2">
                  <span>Interactive Kiosk Print Simulator</span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] uppercase tracking-wider rounded-md font-bold">
                    Live Demo
                  </span>
                </h3>
                <p className="text-xs text-blue-200 font-medium">Experience how fast self-printing works on EasyXerox kiosks</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-slate-50 border-b border-blue-100 px-6 py-3.5 flex items-center justify-between">
            {[
              { num: 1, label: 'Upload' },
              { num: 2, label: 'Print Options' },
              { num: 3, label: 'UPI Pay' },
              { num: 4, label: 'Kiosk Print' },
              { num: 5, label: 'Receipt' },
            ].map((st, idx) => (
              <React.Fragment key={st.num}>
                <div
                  onClick={() => st.num < step && setStep(st.num)}
                  className={`flex items-center gap-2 cursor-pointer transition-all ${
                    step === st.num
                      ? 'text-blue-600 font-black'
                      : step > st.num
                      ? 'text-emerald-600 font-bold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      step === st.num
                        ? 'bg-blue-600 text-white shadow-blue-glow ring-4 ring-blue-100'
                        : step > st.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step > st.num ? <Check className="w-4 h-4" /> : st.num}
                  </div>
                  <span className="hidden sm:inline text-xs">{st.label}</span>
                </div>
                {idx < 4 && (
                  <div className="flex-1 h-1 mx-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: step > st.num ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Modal Body */}
          <div className="p-6 md:p-8 min-h-[400px] flex flex-col justify-between bg-gradient-to-b from-white to-blue-50/30">
            
            {/* STEP 1: UPLOAD DOCUMENT SIMULATION */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-1">Step 01 of 03</span>
                  <h4 className="text-2xl font-black text-slate-950 font-heading">Select or Upload a Document</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    On a physical kiosk, you simply scan the screen QR code with your mobile camera to pick your document.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SAMPLE_DOCS.map((doc) => {
                    const IconComp = doc.icon;
                    const isSelected = selectedDoc.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/80 shadow-lg ring-2 ring-blue-500/20'
                            : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <IconComp className={`w-8 h-8 ${doc.color}`} />
                          {isSelected && (
                            <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                              ✓
                            </span>
                          )}
                        </div>
                        <h5 className="text-xs font-black text-slate-900 truncate mb-1">{doc.name}</h5>
                        <p className="text-[11px] text-slate-500 font-medium">{doc.pages} Pages • {doc.size}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Custom File Upload Option */}
                <div className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-white text-center">
                  <input
                    type="file"
                    id="simulator-file-input"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleCustomFileUpload}
                  />
                  <label
                    htmlFor="simulator-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-blue-700 hover:underline">Click to upload your own PDF / Document</span>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Supports PDF, DOCX, JPG up to 25MB</p>
                    </div>
                  </label>
                  {customFile && (
                    <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Selected: {customFile.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-blue-glow transition-all flex items-center gap-2 btn-touch"
                  >
                    <span>Next: Select Print Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PRINT OPTIONS CUSTOMIZER */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                  <div>
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">Step 02 of 03</span>
                    <h4 className="text-2xl font-black text-slate-950 font-heading">Customize Print Settings</h4>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Selected File</span>
                    <span className="text-xs font-black text-blue-900 truncate max-w-[200px] block">
                      {selectedDoc.name} ({totalPages} pgs)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Options Control Panel */}
                  <div className="space-y-5">
                    {/* Color Mode Switch */}
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                        Print Color
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setColorMode('bw')}
                          className={`p-3.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-2 ${
                            colorMode === 'bw'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>Black & White</span>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] rounded-md font-bold">₹2/pg</span>
                        </button>

                        <button
                          onClick={() => setColorMode('color')}
                          className={`p-3.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-2 ${
                            colorMode === 'color'
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>Full Color</span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] rounded-md font-bold">₹10/pg</span>
                        </button>
                      </div>
                    </div>

                    {/* Single / Duplex Sided */}
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
                        Print Sides
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDuplex(false)}
                          className={`p-3.5 rounded-xl border-2 text-xs font-black transition-all ${
                            !duplex
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          Single Sided
                        </button>

                        <button
                          onClick={() => setDuplex(true)}
                          className={`p-3.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                            duplex
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          <span>Double Sided (Duplex)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">-10%</span>
                        </button>
                      </div>
                    </div>

                    {/* Paper Size & Copies */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">Paper Size</label>
                        <select
                          value={paperSize}
                          onChange={(e) => setPaperSize(e.target.value)}
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="A4">Standard A4</option>
                          <option value="A3">Large A3 (+₹5)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">Number of Copies</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-white">
                          <button
                            onClick={() => setCopies(Math.max(1, copies - 1))}
                            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 font-black text-sm text-slate-700"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-black text-xs text-slate-900">{copies}</span>
                          <button
                            onClick={() => setCopies(copies + 1)}
                            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 font-black text-sm text-slate-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Cost Summary Box */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between border border-slate-800 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Estimation</span>
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/30">
                          Instant Spooling Ready
                        </span>
                      </div>

                      <div className="space-y-3 text-xs text-slate-300 font-medium">
                        <div className="flex justify-between">
                          <span>Document Pages:</span>
                          <span className="font-extrabold text-white">{totalPages} Pages</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate per page:</span>
                          <span className="font-extrabold text-cyan-300">₹{pricePerPage}.00 ({colorMode.toUpperCase()})</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Copies:</span>
                          <span className="font-extrabold text-white">{copies} Copy</span>
                        </div>
                        {duplex && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Duplex Paper Discount:</span>
                            <span className="font-extrabold">-₹{discount}.00</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 mt-4">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Amount:</span>
                        <div className="text-right">
                          <span className="text-3xl font-black font-heading text-cyan-400">₹{finalPrice}.00</span>
                          <span className="text-[10px] text-slate-400 block">Inc. GST & Paper</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2"
                        >
                          <span>Proceed to UPI Payment</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: UPI QR PAYMENT SIMULATION */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center max-w-md mx-auto">
                <div>
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-1">Step 03 of 03</span>
                  <h4 className="text-2xl font-black text-slate-950 font-heading">Scan UPI QR & Print</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    On the kiosk touch screen, a dynamic Razorpay UPI QR code is automatically generated for instant verification.
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-6 rounded-3xl border-2 border-blue-200 shadow-xl inline-block relative overflow-hidden group">
                  <div className="w-52 h-52 bg-slate-100 rounded-2xl flex items-center justify-center p-3 border border-slate-200 relative">
                    {/* Simulated QR Code Canvas */}
                    <div className="w-full h-full bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-between text-white select-none">
                      <div className="flex justify-between w-full">
                        <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white" />
                        <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white" />
                      </div>
                      <div className="text-center font-mono text-[10px] tracking-widest text-cyan-300 font-bold">
                        EASYXEROX UPI QR
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="w-8 h-8 bg-blue-500 rounded border-2 border-white" />
                        <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full" />
                      </div>
                    </div>

                    {/* Center Overlay Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white p-2 rounded-xl border border-blue-300 shadow-md">
                        <img src="/logo.png" alt="EasyXerox" className="h-6 w-auto object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-3 text-xs font-black text-slate-700">
                    <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">Google Pay</span>
                    <span className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-purple-700">PhonePe</span>
                    <span className="px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-700">Paytm</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Amount Payable</span>
                    <span className="text-xl font-black text-blue-900 font-heading">₹{finalPrice}.00</span>
                  </div>
                  <button
                    onClick={handlePayClick}
                    disabled={isPaying}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 btn-touch disabled:opacity-50"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying UPI...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Simulate Successful Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: KIOSK PRINT SPOOLING ANIMATION */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center max-w-md mx-auto py-8">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 border-4 border-white animate-bounce">
                    <Printer className="w-12 h-12" />
                  </div>
                  <span className="absolute -top-2 -right-2 px-3 py-1 bg-cyan-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider shadow-md animate-pulse">
                    Spooling
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-black text-slate-950 font-heading">Printing Document...</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    Silent daemon dispatching job to laser print tray at 30 Ppm.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${printProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-black text-slate-600">
                    <span>Processing Pages...</span>
                    <span>{printProgress}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: PRINT COMPLETE & DIGITAL RECEIPT */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center max-w-lg mx-auto">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider rounded-full border border-emerald-200">
                    Print Dispatched Successfully
                  </span>
                  <h4 className="text-3xl font-black text-slate-950 font-heading mt-3">Job Complete!</h4>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    Your printed pages have been ejected into the secure kiosk collection tray.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 text-left shadow-lg relative font-mono text-xs text-slate-800">
                  <div className="border-b border-dashed border-slate-300 pb-3 mb-3 flex justify-between items-center font-sans">
                    <div className="flex items-center gap-2">
                      <img src="/logo.png" alt="EasyXerox" className="h-6 w-auto" />
                      <span className="font-black text-blue-900 text-sm">EasyXerox Kiosk</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">TXN-EX8942-OK</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Document:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{selectedDoc.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pages / Color:</span>
                      <span className="font-bold text-slate-900">{totalPages} pgs • {colorMode.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Paid:</span>
                      <span className="font-bold text-emerald-600 text-sm">₹{finalPrice}.00 (UPI)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={resetSim}
                    className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 btn-touch"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Run Another Demo</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
                  >
                    Close Simulator
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InteractivePrintSimulator;
