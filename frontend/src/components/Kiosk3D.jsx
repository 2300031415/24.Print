import React, { useState, useEffect, useRef } from 'react';
import { QrCode, ShieldCheck, Zap, CheckCircle, Smartphone, ArrowDown, FileText, Check, Usb, Touchpad, DollarSign, Sliders, Play } from 'lucide-react';

export default function Kiosk3D({ onInteract }) {
  // 0: Idle Ad, 1: Upload (QR/USB), 2: Customize Settings, 3: UPI Pay, 4: Print Done & Dispense
  const [screenState, setScreenState] = useState(0);
  const [uploadTab, setUploadTab] = useState('qr'); // 'qr' or 'usb'
  const [colorMode, setColorMode] = useState('bw'); // 'bw' or 'color'
  const [copies, setCopies] = useState(1);
  const [paperEjected, setPaperEjected] = useState(false);
  const [paperCollected, setPaperCollected] = useState(false);
  const timerRef = useRef(null);

  // Auto cycle through the kiosk demonstration
  useEffect(() => {
    if (paperCollected) return;

    if (screenState === 0) {
      setPaperEjected(false);
      timerRef.current = setTimeout(() => {
        setScreenState(1);
      }, 4000);
    } else if (screenState === 1) {
      setPaperEjected(false);
      timerRef.current = setTimeout(() => {
        setScreenState(2);
      }, 3500);
    } else if (screenState === 2) {
      setPaperEjected(false);
      timerRef.current = setTimeout(() => {
        setScreenState(3);
      }, 3500);
    } else if (screenState === 3) {
      setPaperEjected(false);
      timerRef.current = setTimeout(() => {
        setScreenState(4);
      }, 2500);
    } else if (screenState === 4) {
      // Small 200ms mechanical delay before paper physically slides out of slot
      const ejectTimer = setTimeout(() => {
        setPaperEjected(true);
      }, 200);

      timerRef.current = setTimeout(() => {
        setScreenState(0);
      }, 4500);

      return () => {
        clearTimeout(timerRef.current);
        clearTimeout(ejectTimer);
      };
    }

    return () => clearTimeout(timerRef.current);
  }, [screenState, paperCollected]);

  const handleManualTrigger = () => {
    if (screenState === 4) {
      // Simulate taking the paper
      setPaperCollected(true);
      setTimeout(() => {
        setPaperCollected(false);
        setScreenState(0);
      }, 800);
    } else {
      setScreenState((prev) => (prev + 1) % 5);
    }
  };

  const handleCollectPaper = (e) => {
    e.stopPropagation();
    setPaperCollected(true);
    setTimeout(() => {
      setPaperCollected(false);
      setScreenState(0);
    }, 800);
  };

  return (
    <div className="relative mx-auto flex items-center justify-center select-none py-4">
      {/* Realistic 3D Kiosk Stand */}
      <div 
        onClick={handleManualTrigger}
        className="relative group cursor-pointer transition-transform duration-500 hover:scale-[1.02] kiosk-shadow"
      >
        {/* Main Front Facing Body */}
        <div className="w-[300px] sm:w-[350px] bg-gradient-to-b from-[#1b56c4] via-[#0C3D97] to-[#07235b] rounded-3xl p-4 sm:p-5 border-2 border-blue-400/40 text-white relative shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* Top Gloss Highlight */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/20 to-transparent rounded-t-3xl pointer-events-none"></div>

          {/* Interactive Digital Touchscreen Interface */}
          <div className="w-full h-48 sm:h-52 bg-neutral-950 rounded-2xl p-2.5 border-2 border-neutral-800 shadow-inner relative overflow-hidden flex flex-col justify-between mt-0.5">
            {/* Scanline effect */}
            <div className="absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-[#0C3D97]/30 to-transparent animate-scanline pointer-events-none"></div>

            {/* Screen Top Bar */}
            <div className="flex justify-between items-center text-[9px] text-gray-400 border-b border-neutral-800/90 pb-1 px-1">
              <div className="flex items-center space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${screenState === 4 ? 'bg-emerald-400 animate-ping' : screenState === 0 ? 'bg-amber-400 animate-pulse' : 'bg-[#0C3D97] animate-ping'}`}></div>
                <span className={`font-mono font-bold ${screenState === 4 ? 'text-emerald-400' : screenState === 0 ? 'text-amber-400' : 'text-blue-400'}`}>
                  {screenState === 0 && 'AD MODE • TOUCH TO START'}
                  {screenState === 1 && 'STEP 1 • UPLOAD DOCUMENT'}
                  {screenState === 2 && 'STEP 2 • PRINT SETTINGS'}
                  {screenState === 3 && 'STEP 3 • UPI PAYMENT'}
                  {screenState === 4 && 'STEP 4 • DISPENSING PRINT'}
                </span>
              </div>
              <span className="font-mono text-[8px] text-gray-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">24/7 ONLINE</span>
            </div>

            {/* SCREEN STATE 0: Idle Advertisement Mode */}
            {screenState === 0 && (
              <div className="my-auto text-center flex flex-col items-center justify-center animate-in fade-in duration-300 relative px-2">
                <div className="w-full bg-gradient-to-r from-blue-900/60 via-[#0C3D97]/80 to-blue-900/60 border border-blue-400/30 rounded-xl p-2.5 shadow-md flex flex-col items-center justify-center">
                  <div className="flex items-center space-x-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[7px] font-bold uppercase px-2 py-0.5 rounded-full mb-1">
                    <span>📢 Sponsor Space • 24/7 Footfall</span>
                  </div>
                  <h4 className="text-[11px] font-extrabold text-white tracking-tight leading-snug">
                    Promote Your Brand Here
                  </h4>
                  <p className="text-[8px] text-blue-200 mt-0.5">High-impact HD display seen by thousands daily</p>
                </div>
                
                <div className="mt-2 inline-flex items-center space-x-1 bg-white text-gray-900 px-3 py-1 rounded-full text-[9px] font-bold shadow-md animate-bounce">
                  <span>👆</span>
                  <span>Touch Screen to Start Printing</span>
                </div>
              </div>
            )}

            {/* SCREEN STATE 1: Upload (QR or USB/Type-C) */}
            {screenState === 1 && (
              <div className="my-auto text-center flex flex-col items-center justify-center animate-in fade-in duration-300 w-full">
                {/* Mode Selector Tabs */}
                <div className="flex space-x-1 mb-1.5 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-[8px]">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUploadTab('qr'); }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${uploadTab === 'qr' ? 'bg-[#0C3D97] text-white' : 'text-gray-400'}`}
                  >
                    📱 Phone QR Upload
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUploadTab('usb'); }}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${uploadTab === 'usb' ? 'bg-[#0C3D97] text-white' : 'text-gray-400'}`}
                  >
                    💾 USB / Type-C
                  </button>
                </div>

                {uploadTab === 'qr' ? (
                  <div className="flex items-center space-x-2.5 bg-neutral-900/90 border border-neutral-800 p-1.5 rounded-xl w-full max-w-[240px]">
                    <div className="w-13 h-13 bg-white rounded-lg p-1 flex-shrink-0 shadow-sm">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://easyxerox.in/touch-upload&color=0C3D97" 
                        alt="QR Upload" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-[9.5px] font-bold text-white leading-tight">Scan with Camera</p>
                      <p className="text-[7.5px] text-blue-300 mt-0.5">Upload PDF • PNG • JPG</p>
                      <p className="text-[7px] text-emerald-400 font-semibold mt-0.5">✓ No App • No OTP Needed</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-neutral-900/90 border border-neutral-800 p-2 rounded-xl w-full max-w-[240px]">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                      <Usb className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-[9.5px] font-bold text-white">USB / Type-C Connected</p>
                      <p className="text-[7.5px] text-gray-400 mt-0.5">Select file directly on screen</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCREEN STATE 2: Customize Print Settings (Touch UI) */}
            {screenState === 2 && (
              <div className="my-auto text-center flex flex-col items-center justify-center animate-in fade-in duration-300 w-full px-1">
                <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl p-2 text-left space-y-1">
                  {/* Color Mode Toggle */}
                  <div className="flex justify-between items-center text-[8px]">
                    <span className="text-gray-400 font-medium">Color:</span>
                    <div className="flex space-x-1">
                      <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-bold ${colorMode === 'bw' ? 'bg-[#0C3D97] text-white' : 'bg-neutral-800 text-gray-400'}`}>
                        B&W (₹2)
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-bold ${colorMode === 'color' ? 'bg-[#0C3D97] text-white' : 'bg-neutral-800 text-gray-400'}`}>
                        Color (₹10)
                      </span>
                    </div>
                  </div>

                  {/* Duplex / Both Sides Print */}
                  <div className="flex justify-between items-center text-[8px]">
                    <span className="text-gray-400 font-medium">Sides:</span>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.5 rounded font-bold text-[7.5px]">
                      Duplex (Both Sides)
                    </span>
                  </div>

                  {/* Orientation & Copies */}
                  <div className="flex justify-between items-center text-[8px]">
                    <span className="text-gray-400 font-medium">Layout:</span>
                    <span className="bg-neutral-800 text-blue-300 px-1.5 py-0.5 rounded font-mono text-[7.5px]">Portrait • 1 Copy</span>
                  </div>

                  <div className="flex justify-between items-center text-[8px] pt-1 border-t border-neutral-800">
                    <span className="text-[7.5px] text-gray-400">4 Pgs (2 Sheets)</span>
                    <span className="text-emerald-400 font-bold text-[9px]">Total: ₹8.00</span>
                  </div>
                </div>

                <div className="mt-1 w-full bg-blue-600 text-white rounded-lg py-1 text-[8.5px] font-bold flex items-center justify-center space-x-1 shadow-sm">
                  <span>Confirm Duplex & Pay UPI</span>
                </div>
              </div>
            )}

            {/* SCREEN STATE 3: UPI Cashless Payment */}
            {screenState === 3 && (
              <div className="my-auto text-center flex flex-col items-center justify-center animate-in fade-in duration-300 w-full px-1">
                <div className="flex items-center space-x-2 bg-neutral-900/95 border border-neutral-800 p-2 rounded-xl w-full max-w-[240px]">
                  <div className="w-13 h-13 bg-white rounded-lg p-1 flex-shrink-0 shadow-sm ring-1 ring-blue-500/30">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=easyxerox@upi&am=2.00&color=0C3D97" 
                      alt="UPI QR" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-extrabold text-emerald-400">Scan & Pay ₹2.00</p>
                    <p className="text-[7.5px] text-gray-400 mt-0.5">PhonePe • GPay • Paytm</p>
                    <div className="w-full bg-neutral-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN STATE 4: Print Completed */}
            {screenState === 4 && (
              <div className="my-auto text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-1 text-emerald-400">
                  <CheckCircle className="w-5 h-5 animate-bounce" />
                </div>
                <p className="text-[11px] font-bold text-emerald-300">Print Completed!</p>
                <p className="text-[8.5px] text-blue-200 flex items-center justify-center space-x-1 mt-0.5">
                  <span>Collect sheets from tray below</span>
                  <ArrowDown className="w-2.5 h-2.5 text-emerald-400 animate-bounce inline" />
                </p>
              </div>
            )}

            {/* Screen Footer */}
            <div className="flex justify-between items-center text-[8px] text-gray-400 bg-neutral-900/90 rounded px-2 py-0.5 border border-neutral-800/80">
              <span className="text-gray-300 font-mono">Touchscreen Kiosk OS</span>
              <span className="text-blue-400 font-semibold">EasyXerox v2.4</span>
            </div>
          </div>

          {/* EasyXerox Brand Emblem (Integrated Chassis Logo) */}
          <div className="my-2 py-1.5 px-3 bg-black/25 rounded-xl border border-white/10 flex items-center justify-center space-x-2.5 relative z-10">
            {/* Brand Emblem Icon */}
            <div className="w-7 h-7 rounded-lg bg-[#0C3D97] border border-blue-300/40 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
              <span>E</span>
            </div>

            {/* Brand Typography */}
            <div className="text-left">
              <div className="flex items-baseline space-x-0.5">
                <span className="font-extrabold text-base tracking-tight text-white">Easy</span>
                <span className="font-extrabold text-base tracking-tight text-blue-300">Xerox</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-0.5"></div>
              </div>
              <p className="text-[7.5px] font-bold text-blue-200/80 tracking-widest uppercase">Smart Self-Service Kiosk</p>
            </div>
          </div>

          {/* Paper Output Slot & Dispensing Area */}
          <div className="mt-2 relative z-20">
            {/* Slot Outer Housing & Bezel */}
            <div className="relative z-30 bg-neutral-900 border border-neutral-700/90 rounded-full h-4 px-2.5 flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  screenState === 4 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-blue-400/50'
                }`} />
                <span className="text-[6.5px] font-mono font-bold text-gray-400 tracking-wider">
                  {screenState === 4 ? 'DISPENSING' : 'SLOT'}
                </span>
              </div>

              {/* Physical Ejection Slit */}
              <div className="w-28 sm:w-36 h-1.5 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border border-neutral-800"></div>

              <div className="text-[6.5px] text-gray-500 font-mono">TRAY #1</div>
            </div>

            {/* Paper Ejection Chamber with Masking Overflow */}
            <div className="relative -mt-2 z-20 overflow-hidden pt-2 pb-1 flex justify-center min-h-[74px] transition-all">
              {/* The Realistic Emerging Paper */}
              <div 
                onClick={handleCollectPaper}
                className={`w-44 sm:w-52 bg-gradient-to-b from-white via-slate-50 to-white rounded-b-lg border border-gray-300 shadow-2xl transition-all duration-1000 ease-out transform p-2 flex flex-col justify-between cursor-pointer hover:border-blue-400 hover:shadow-blue-500/20 ${
                  screenState === 4 && paperEjected && !paperCollected
                    ? 'translate-y-0 opacity-100 h-[72px] scale-100 pointer-events-auto' 
                    : paperCollected
                    ? '-translate-y-4 opacity-0 scale-95 pointer-events-none'
                    : '-translate-y-full opacity-0 h-0 scale-95 pointer-events-none'
                }`}
                style={{
                  boxShadow: screenState === 4 && paperEjected
                    ? '0 16px 28px -4px rgba(0, 0, 0, 0.5), 0 6px 10px -2px rgba(0, 0, 0, 0.3)' 
                    : 'none'
                }}
              >
                {/* Paper Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-0.5">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0C3D97]"></div>
                    <span className="text-[7.5px] font-bold text-[#0C3D97] tracking-tight">EasyXerox Document</span>
                  </div>
                  <span className="text-[6px] font-mono text-gray-400">DOC #0042</span>
                </div>
                
                {/* Printed Document Simulation Content */}
                <div className="space-y-1 my-0.5">
                  <div className="w-full h-1 bg-gray-200 rounded"></div>
                  <div className="w-4/5 h-1 bg-gray-200 rounded"></div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1/2 h-1 bg-blue-100 rounded"></div>
                    <div className="w-1/3 h-1 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Paper Footer Badge */}
                <div className="flex items-center justify-between pt-0.5 border-t border-gray-100 text-[6.5px]">
                  <span className="text-emerald-600 font-bold flex items-center space-x-0.5">
                    <Check className="w-2 h-2 inline" /> <span>PRINT READY</span>
                  </span>
                  <span className="text-blue-500 font-medium text-[6px]">Click to Take 📄</span>
                </div>
              </div>

              {/* Paper Collected Notification Pop */}
              {paperCollected && (
                <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Collected!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Collect Prints Here Text Banner */}
            <div className="flex items-center justify-center space-x-1 text-center text-[8.5px] font-semibold tracking-wide transition-colors mt-0.5">
              {screenState === 4 && (
                <ArrowDown className="w-2.5 h-2.5 text-emerald-400 animate-bounce" />
              )}
              <p className={`${
                screenState === 4 
                  ? 'text-emerald-300 font-bold animate-pulse' 
                  : 'text-blue-100/90'
              }`}>
                {screenState === 4 ? 'PULL YOUR PRINT FROM SLOT' : 'COLLECT PRINTS HERE'}
              </p>
              {screenState === 4 && (
                <ArrowDown className="w-2.5 h-2.5 text-emerald-400 animate-bounce" />
              )}
            </div>
          </div>

          {/* 5 Step Indicator at Bottom */}
          <div className="mt-2 pt-1.5 border-t border-blue-400/30 grid grid-cols-5 gap-1 text-center text-[7.5px] font-semibold relative z-10">
            <div className={`rounded py-0.5 px-0.5 transition-all ${screenState === 0 ? 'bg-amber-400/30 ring-1 ring-amber-300 font-bold' : 'bg-white/10'}`}>
              <span>Ad</span>
            </div>
            <div className={`rounded py-0.5 px-0.5 transition-all ${screenState === 1 ? 'bg-white/25 ring-1 ring-white/50 font-bold' : 'bg-white/10'}`}>
              <span>Touch</span>
            </div>
            <div className={`rounded py-0.5 px-0.5 transition-all ${screenState === 2 ? 'bg-white/25 ring-1 ring-white/50 font-bold' : 'bg-white/10'}`}>
              <span>Select</span>
            </div>
            <div className={`rounded py-0.5 px-0.5 transition-all ${screenState === 3 ? 'bg-white/25 ring-1 ring-white/50 font-bold' : 'bg-white/10'}`}>
              <span>Pay</span>
            </div>
            <div className={`rounded py-0.5 px-0.5 transition-all ${screenState === 4 ? 'bg-emerald-500/40 ring-1 ring-emerald-300 font-bold' : 'bg-white/10'}`}>
              <span>Print</span>
            </div>
          </div>
        </div>

        {/* Interactive Click Tip */}
        <div className="text-center mt-2.5">
          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-gray-500 bg-white/90 px-3 py-1 rounded-full border border-gray-200 shadow-xs group-hover:text-[#0C3D97] group-hover:border-blue-300 transition-colors">
            <span>
              {screenState === 4 
                ? '📄 Click paper or machine to collect print' 
                : '👆 Touch machine to step through kiosk experience'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

