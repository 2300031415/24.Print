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
  Check,
  Sliders,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_DOCS = [
  { id: 'doc1', name: 'University_Assignment_2026.pdf', pages: 4, size: '1.4 MB', icon: FileText, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'doc2', name: 'Government_Aadhaar_ID_Proof.pdf', pages: 2, size: '0.8 MB', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'doc3', name: 'Executive_Resume_Portfolio.pdf', pages: 3, size: '1.1 MB', icon: FileCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const InteractivePrintSimulator = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Options, 3: UPI Pay, 4: Printing, 5: Done
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_DOCS[0]);
  const [customFile, setCustomFile] = useState(null);
  
  // Print options
  const [colorMode, setColorMode] = useState('bw'); // 'bw' or 'color'
  const [duplex, setDuplex] = useState(true); // single or double sided
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
            setTimeout(() => {
              setStep(5);
              confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 }
              });
            }, 600);
            return 100;
          }
          return prev + 25;
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
        pages: Math.floor(Math.random() * 6) + 2,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        icon: FileText,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10'
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
    }, 1200);
  };

  const resetSim = () => {
    setStep(1);
    setSelectedDoc(SAMPLE_DOCS[0]);
    setCustomFile(null);
    setColorMode('bw');
    setDuplex(true);
    setCopies(1);
    setPaperSize('A4');
    setPrintProgress(0);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-4xl bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-slate-800 ring-1 ring-cyan-500/30 overflow-hidden text-slate-100 my-4"
        >
          {/* Top Kiosk Bezel & Status Bar */}
          <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between font-mono text-xs select-none">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-slate-200">EASYXEROX TOUCHSCREEN OS</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold text-[10px]">v2.4 LIVE</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">DUPLEX ENABLED</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SYSTEM READY
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Touchscreen Stepper Header */}
          <div className="bg-slate-900/90 border-b border-slate-800/80 px-6 py-3 flex items-center justify-between overflow-x-auto">
            {[
              { num: 1, label: 'Document Source' },
              { num: 2, label: 'Print Settings' },
              { num: 3, label: 'Razorpay UPI' },
              { num: 4, label: 'Laser Spooling' },
              { num: 5, label: 'Eject & Receipt' },
            ].map((st, idx) => (
              <React.Fragment key={st.num}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => st.num < step && setStep(st.num)}
                  className={`flex items-center gap-2.5 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-xl transition-all ${
                    step === st.num
                      ? 'text-cyan-400 font-black'
                      : step > st.num
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-500 font-medium'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      step === st.num
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400'
                        : step > st.num
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step > st.num ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                  </div>
                  <span className="text-xs tracking-tight">{st.label}</span>
                </motion.div>
                {idx < 4 && (
                  <div className="flex-1 min-w-[20px] h-0.5 mx-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: step > st.num ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Simulator Screen Content */}
          <div className="p-6 sm:p-8 min-h-[440px] flex flex-col justify-between bg-slate-900/60 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* STEP 1: SELECT DOCUMENT */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Step 01 of 03</span>
                    <h4 className="text-2xl font-black text-white font-heading">1. Select Document Source</h4>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 font-mono">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>Touchscreen Ready</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SAMPLE_DOCS.map((doc) => {
                    const IconComp = doc.icon;
                    const isSelected = selectedDoc.id === doc.id;
                    return (
                      <motion.div
                        key={doc.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-cyan-400 bg-gradient-to-br from-blue-900/50 via-slate-900 to-cyan-950/40 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/20'
                            : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-cyan-400 text-slate-950 rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                            ✓
                          </div>
                        )}
                        <div className={`w-12 h-12 rounded-xl ${doc.bg} flex items-center justify-center mb-4 border border-slate-700/50`}>
                          <IconComp className={`w-6 h-6 ${doc.color}`} />
                        </div>
                        <h5 className="text-sm font-bold text-white truncate mb-1">{doc.name}</h5>
                        <p className="text-xs text-slate-400 font-medium">{doc.pages} Pages • {doc.size}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Custom Upload Tile */}
                <div className="p-6 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50 text-center hover:border-cyan-500/50 transition-all">
                  <input
                    type="file"
                    id="simulator-file-input"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleCustomFileUpload}
                  />
                  <label
                    htmlFor="simulator-file-input"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-cyan-300 group-hover:underline">Upload Custom File / PDF</span>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Direct touchscreen file picker (PDF, DOCX, JPG)</p>
                    </div>
                  </label>
                  {customFile && (
                    <p className="mt-2 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/60 py-1 px-3 rounded-lg border border-emerald-800/60 inline-flex">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Selected: {customFile.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Print Settings</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PRINT OPTIONS */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Step 02 of 03</span>
                    <h4 className="text-2xl font-black text-white font-heading">2. Customize Print Settings</h4>
                  </div>
                  <div className="px-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-right">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Selected File</span>
                    <span className="text-xs font-black text-cyan-300 truncate max-w-[200px] block">
                      {selectedDoc.name} ({totalPages} pgs)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column Controls */}
                  <div className="lg:col-span-7 space-y-5">
                    
                    {/* Color Mode */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Color Mode</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setColorMode('bw')}
                          className={`p-3.5 rounded-xl border-2 text-xs font-extrabold transition-all flex items-center justify-between ${
                            colorMode === 'bw'
                              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md ring-1 ring-cyan-400/30'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>B&W (Monochrome)</span>
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-200 text-[10px] rounded border border-slate-700">₹2/pg</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setColorMode('color')}
                          className={`p-3.5 rounded-xl border-2 text-xs font-extrabold transition-all flex items-center justify-between ${
                            colorMode === 'color'
                              ? 'border-purple-400 bg-purple-950/40 text-purple-300 shadow-md ring-1 ring-purple-400/30'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>Full Color</span>
                          <span className="px-2 py-0.5 bg-purple-900/60 text-purple-200 text-[10px] rounded border border-purple-700">₹10/pg</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Print Sides (Duplex) */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Sides (Duplex)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setDuplex(false)}
                          className={`p-3.5 rounded-xl border-2 text-xs font-extrabold transition-all ${
                            !duplex
                              ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          1-Sided (Single)
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setDuplex(true)}
                          className={`p-3.5 rounded-xl border-2 text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                            duplex
                              ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span>Both Sides (Duplex)</span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">-10%</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Paper Size & Copies */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Paper Output</label>
                        <select
                          value={paperSize}
                          onChange={(e) => setPaperSize(e.target.value)}
                          className="w-full p-3.5 bg-slate-900 border-2 border-slate-800 rounded-xl text-xs font-extrabold text-white focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="A4">Standard A4 Sheet</option>
                          <option value="A3">Large A3 Sheet (+₹5)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Copies</label>
                        <div className="flex items-center border-2 border-slate-800 rounded-xl overflow-hidden bg-slate-900">
                          <button
                            onClick={() => setCopies(Math.max(1, copies - 1))}
                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 font-extrabold text-sm text-slate-200 transition-colors"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-black text-sm text-cyan-300">{copies}</span>
                          <button
                            onClick={() => setCopies(copies + 1)}
                            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 font-extrabold text-sm text-slate-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column Dynamic Cost Card */}
                  <div className="lg:col-span-5 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Calculated Total</span>
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/30">
                          Duplex Saved 10%
                        </span>
                      </div>

                      <div className="space-y-3 text-xs text-slate-300 font-medium">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Pages:</span>
                          <span className="font-extrabold text-white">{totalPages} Pages ({duplex ? Math.ceil(totalPages/2) + ' Sheets' : totalPages + ' Sheets'})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Page Rate:</span>
                          <span className="font-extrabold text-cyan-400">₹{pricePerPage}.00 / page</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Copies:</span>
                          <span className="font-extrabold text-white">{copies} Copy</span>
                        </div>
                        {duplex && (
                          <div className="flex justify-between text-emerald-400 font-bold">
                            <span>Duplex Discount:</span>
                            <span>-₹{discount}.00</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 mt-4">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Grand Total:</span>
                        <motion.div
                          key={finalPrice}
                          initial={{ scale: 1.2, color: "#38bdf8" }}
                          animate={{ scale: 1, color: "#22d3ee" }}
                          className="text-3xl font-black font-mono text-cyan-400"
                        >
                          ₹{finalPrice}.00
                        </motion.div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                        >
                          Back
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setStep(3)}
                          className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>TAP TO PRINT (₹{finalPrice}.00)</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 3: UPI PAY */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-6 text-center max-w-md mx-auto py-2"
              >
                <div>
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block mb-1">Step 03 of 03</span>
                  <h4 className="text-2xl font-black text-white font-heading">Scan with Any Phone Camera or UPI App</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Razorpay dynamic QR auto-generated on screen. No registration required.
                  </p>
                </div>

                {/* Animated QR Code Container with Laser Scanning Line */}
                <div className="bg-slate-950 p-6 rounded-3xl border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10 inline-block relative overflow-hidden group">
                  
                  {/* Laser Scanning Bar */}
                  <motion.div
                    animate={{ y: [0, 180, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] z-20 pointer-events-none"
                  />

                  <div className="w-52 h-52 bg-white rounded-2xl flex items-center justify-center p-3 relative border border-cyan-400/50">
                    <QrCode className="w-44 h-44 text-slate-950" />
                    
                    {/* Center Overlay Brand Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white p-1.5 rounded-xl border border-blue-400 shadow-lg">
                        <img src="/logo.png" alt="EasyXerox" className="h-6 w-auto object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-300">
                    <span className="px-2.5 py-1 bg-purple-950 text-purple-300 border border-purple-800/60 rounded-lg">PhonePe</span>
                    <span className="px-2.5 py-1 bg-blue-950 text-blue-300 border border-blue-800/60 rounded-lg">GPay</span>
                    <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-lg">Paytm</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Amount Payable</span>
                    <span className="text-xl font-black text-cyan-300 font-mono">₹{finalPrice}.00</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePayClick}
                    disabled={isPaying}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-slate-950" />
                        <span>Simulate Pay (₹{finalPrice})</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: KIOSK PRINTING SPOOLING ANIMATION */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center max-w-md mx-auto py-8"
              >
                <div className="relative inline-block">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 border-4 border-slate-900"
                  >
                    <Printer className="w-12 h-12" />
                  </motion.div>
                  <span className="absolute -top-2 -right-2 px-3 py-1 bg-cyan-400 text-slate-950 font-black text-[10px] rounded-full uppercase tracking-wider shadow-md animate-pulse">
                    Printing 30 Ppm
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-black text-white font-heading">Printing Your Document...</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Daemon dispatching file to hardware laser printer tray.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${printProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono font-bold text-cyan-400">
                    <span>Ejecting Page Output...</span>
                    <span>{printProgress}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: PRINT DISPATCHED & RECEIPT */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center max-w-lg mx-auto py-2"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-black uppercase tracking-wider rounded-full">
                    Print Ejected Successfully
                  </span>
                  <h4 className="text-3xl font-black text-white font-heading mt-3">Job Complete!</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Collect your printed sheets from the lower kiosk output tray.
                  </p>
                </div>

                {/* Digital Receipt Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-left shadow-2xl font-mono text-xs text-slate-300 relative">
                  <div className="border-b border-dashed border-slate-800 pb-3 mb-3 flex justify-between items-center font-sans">
                    <div className="flex items-center gap-2">
                      <img src="/logo.png" alt="EasyXerox" className="h-6 w-auto" />
                      <span className="font-black text-white text-sm">EasyXerox Kiosk</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">TXN-EX9821-OK</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Document Name:</span>
                      <span className="font-bold text-white truncate max-w-[200px]">{selectedDoc.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pages / Color:</span>
                      <span className="font-bold text-white">{totalPages} pgs • {colorMode.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duplex Sided:</span>
                      <span className="font-bold text-emerald-400">{duplex ? 'Yes (Both Sides)' : 'No (1-Sided)'}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-900">
                      <span className="text-slate-500">Total Paid:</span>
                      <span className="font-bold text-cyan-300 text-sm">₹{finalPrice}.00 (Razorpay UPI)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetSim}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Run Another Demo</span>
                  </motion.button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
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

