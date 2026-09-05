import React, { useState } from 'react';
import { Touchpad, QrCode, Usb, Sliders, CheckCircle2, Shield, Smartphone, FileText, Check, ArrowRight, Printer, Sparkles, RefreshCw } from 'lucide-react';

export default function TouchscreenExperience({ onOpenPrintModal }) {
  const [activeUpload, setActiveUpload] = useState('qr'); // 'qr' or 'usb'
  const [colorMode, setColorMode] = useState('bw'); // 'bw' or 'color'
  const [isDuplex, setIsDuplex] = useState(true); // true = double-sided (both sides), false = single-sided
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'
  const [copies, setCopies] = useState(1);
  const [pageRange, setPageRange] = useState('all'); // 'all' or 'custom'
  const [simulatedPrint, setSimulatedPrint] = useState(false);

  const pricePerPage = colorMode === 'color' ? 10 : 2;
  const totalAmount = copies * pricePerPage * 4; // simulated 4 pages
  const physicalSheets = isDuplex ? Math.ceil(4 / 2) * copies : 4 * copies;

  const handlePrintClick = () => {
    setSimulatedPrint(true);
    setTimeout(() => {
      setSimulatedPrint(false);
    }, 3000);
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Pill Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/30 text-[#0C3D97] text-xs font-bold shadow-xs">
          <Touchpad className="w-3.5 h-3.5 text-[#0C3D97]" />
          <span>Interactive Touchscreen UI</span>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight">
          Everything You Need. <br className="hidden sm:inline" />
          <span className="text-[#0C3D97]">Right On Screen.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          No separate app to download. No OTPs to wait for. Control your document upload, single or double-sided (duplex) print settings, UPI payment, and instant print directly on the touchscreen display.
        </p>
      </div>

      {/* Kiosk Touchscreen Mockup Container */}
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-3xl p-4 sm:p-7 border-4 border-neutral-800 shadow-2xl relative overflow-hidden">
        {/* Screen Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-blue-600/15 blur-3xl pointer-events-none"></div>

        {/* Top Kiosk OS Bar */}
        <div className="flex justify-between items-center pb-3 border-b border-neutral-800 text-xs text-gray-400 font-mono mb-5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white tracking-wider">EASYXEROX TOUCHSCREEN OS v2.4</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="hidden sm:inline bg-neutral-800 px-2 py-0.5 rounded text-blue-300">DUPLEX ENABLED</span>
            <span className="text-emerald-400 font-bold">● SYSTEM READY</span>
          </div>
        </div>

        {/* Touchscreen Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT: Upload & Document Selector */}
          <div className="lg:col-span-5 bg-neutral-900/90 rounded-2xl p-4 sm:p-5 border border-neutral-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                1. Select Document Source
              </span>

              {/* Upload Method Tabs */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setActiveUpload('qr')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 transition-all text-xs font-bold ${
                    activeUpload === 'qr'
                      ? 'bg-[#0C3D97] border-blue-400 text-white shadow-md shadow-blue-900/30'
                      : 'bg-neutral-800/80 border-neutral-700 text-gray-300 hover:border-neutral-600'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Upload</span>
                </button>
                <button
                  onClick={() => setActiveUpload('usb')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 transition-all text-xs font-bold ${
                    activeUpload === 'usb'
                      ? 'bg-[#0C3D97] border-blue-400 text-white shadow-md shadow-blue-900/30'
                      : 'bg-neutral-800/80 border-neutral-700 text-gray-300 hover:border-neutral-600'
                  }`}
                >
                  <Usb className="w-4 h-4" />
                  <span>USB / Type-C</span>
                </button>
              </div>

              {/* Upload Content Box */}
              {activeUpload === 'qr' ? (
                <div className="bg-neutral-950 rounded-2xl p-3.5 border border-neutral-800 flex items-center space-x-3.5">
                  <div className="w-20 h-20 bg-white rounded-xl p-1.5 flex-shrink-0 shadow-md">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://easyxerox.in/touch-upload&color=0C3D97" 
                      alt="Scan to Upload" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <h5 className="text-xs font-bold text-white">Scan with Camera</h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">Open phone camera or browser to upload.</p>
                    <div className="mt-2 inline-flex items-center space-x-1 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded text-[10px] text-blue-300 font-semibold">
                      <span>PDF • PNG • JPG</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto mb-2">
                    <Usb className="w-6 h-6 animate-pulse" />
                  </div>
                  <h5 className="text-xs font-bold text-white">USB / Type-C Port Ready</h5>
                  <p className="text-[11px] text-gray-400 mt-1">Plug your drive directly into the kiosk bezel.</p>
                  <div className="mt-2.5 bg-neutral-900 border border-neutral-800 rounded-lg p-2 flex items-center justify-between text-[11px] text-left">
                    <div className="flex items-center space-x-2 text-white">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span className="font-semibold truncate max-w-[140px]">Project_Report.pdf</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Selected</span>
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Guarantee Note */}
            <div className="bg-neutral-950/60 rounded-xl p-2.5 border border-neutral-800/80 flex items-center space-x-2 text-[11px] text-gray-400">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% Secure • Auto-purged after printing</span>
            </div>
          </div>

          {/* RIGHT: Print Configuration & Touch Controls */}
          <div className="lg:col-span-7 bg-neutral-900/90 rounded-2xl p-4 sm:p-5 border border-neutral-800 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3">
                2. Customize Print Settings
              </span>

              {/* Print Controls Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3.5">
                
                {/* Color Mode */}
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Color Mode
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setColorMode('bw')}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                        colorMode === 'bw'
                          ? 'bg-white text-gray-950 shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      B&W (₹2)
                    </button>
                    <button
                      onClick={() => setColorMode('color')}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                        colorMode === 'color'
                          ? 'bg-[#0C3D97] text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Color (₹10)
                    </button>
                  </div>
                </div>

                {/* Duplex / Print Sides (Both sides) */}
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-blue-500/30 ring-1 ring-blue-500/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                      Sides (Duplex)
                    </label>
                    <span className="text-[8px] bg-blue-900/80 text-blue-200 px-1 py-0.2 rounded font-mono">2-SIDED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setIsDuplex(false)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                        !isDuplex
                          ? 'bg-[#0C3D97] text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      1-Sided
                    </button>
                    <button
                      onClick={() => setIsDuplex(true)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                        isDuplex
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Both Sides
                    </button>
                  </div>
                </div>

                {/* Orientation */}
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setOrientation('portrait')}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                        orientation === 'portrait'
                          ? 'bg-[#0C3D97] text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation('landscape')}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all text-center ${
                        orientation === 'landscape'
                          ? 'bg-[#0C3D97] text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Copies Counter */}
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Copies
                  </label>
                  <div className="flex items-center justify-between bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
                    <button
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="w-6 h-6 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-bold text-sm flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-black text-white font-mono">{copies}</span>
                    <button
                      onClick={() => setCopies(copies + 1)}
                      className="w-6 h-6 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-bold text-sm flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Page Selection */}
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 col-span-2 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Print Range & Paper Output
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setPageRange('all')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                        pageRange === 'all'
                          ? 'bg-[#0C3D97] text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      All (4 Pages • {physicalSheets} {physicalSheets === 1 ? 'Sheet' : 'Sheets'})
                    </button>
                    <button
                      onClick={() => setPageRange('custom')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                        pageRange === 'custom'
                          ? 'bg-[#0C3D97] text-white shadow'
                          : 'bg-neutral-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      Custom (Pages 1-2)
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Price & UPI Payment Bar */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400 uppercase font-mono">Calculated Total</span>
                    {isDuplex && (
                      <span className="text-[9px] bg-emerald-950 border border-emerald-700/60 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                        Duplex (Both Sides)
                      </span>
                    )}
                  </div>
                  <span className="text-xl font-black text-emerald-400 font-mono">₹{totalAmount}.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block mb-0.5">Pay with Any UPI App</span>
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-300 font-semibold">
                    <span className="bg-purple-900/60 border border-purple-600/40 text-purple-300 px-1.5 py-0.5 rounded">PhonePe</span>
                    <span className="bg-blue-900/60 border border-blue-600/40 text-blue-300 px-1.5 py-0.5 rounded">GPay</span>
                    <span className="bg-cyan-900/60 border border-cyan-600/40 text-cyan-300 px-1.5 py-0.5 rounded">Paytm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Action Button */}
            <button
              onClick={handlePrintClick}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all transform active:scale-98 shadow-xl ${
                simulatedPrint
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#0C3D97] via-blue-600 to-[#0C3D97] hover:brightness-110 text-white shadow-blue-900/40'
              }`}
            >
              {simulatedPrint ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span>Printing {isDuplex ? 'Duplex (Both Sides)' : 'Single Sided'} & Ejecting...</span>
                </>
              ) : (
                <>
                  <Printer className="w-5 h-5" />
                  <span>TAP TO PRINT (₹{totalAmount}.00)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
