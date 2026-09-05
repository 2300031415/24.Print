import React, { useState } from 'react';
import { X, Touchpad, QrCode, Usb, CheckCircle, ArrowRight, Printer, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LivePrintModal({ isOpen, onClose }) {
  // 1: Touch / Start, 2: Upload (QR / USB), 3: Customize Print Settings, 4: UPI Payment, 5: Print Done & Dispensed
  const [step, setStep] = useState(1);
  const [uploadType, setUploadType] = useState('qr');
  const [selectedFileName, setSelectedFileName] = useState('Project_Presentation_Final.pdf');
  const [pages, setPages] = useState(4);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('bw'); // 'bw' or 'color'
  const [isDuplex, setIsDuplex] = useState(true); // true = double-sided (both sides), false = single-sided
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'
  const [isDispensing, setIsDispensing] = useState(false);

  if (!isOpen) return null;

  const pricePerPage = colorMode === 'color' ? 10 : 2;
  const totalPrice = pages * copies * pricePerPage;
  const totalSheets = isDuplex ? Math.ceil(pages / 2) * copies : pages * copies;

  const handleChooseFile = (fileName) => {
    setSelectedFileName(fileName);
    setStep(3); // Go to Customize
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setStep(3);
    }
  };

  const handleProceedToPayment = () => {
    setStep(4); // Go to UPI Payment
  };

  const handleCompleteUPIPayment = () => {
    setStep(5); // Go to Dispensing Print
    setIsDispensing(true);
    setTimeout(() => {
      setIsDispensing(false);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 }
      });
    }, 2000);
  };

  const handleReset = () => {
    setStep(1);
    setCopies(1);
    setColorMode('bw');
    setIsDispensing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 text-white w-full max-w-xl rounded-3xl border-2 border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header Bar */}
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-xs sm:text-sm tracking-wide text-white">
              EASYXEROX SMART KIOSK SIMULATOR
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Step Progress Bar on Top */}
        <div className="grid grid-cols-5 border-b border-neutral-800 bg-neutral-900/40 text-[10px] sm:text-xs text-center font-bold">
          <div className={`py-2.5 px-1 border-r border-neutral-800 ${step === 1 ? 'bg-[#0C3D97] text-white' : step > 1 ? 'text-emerald-400' : 'text-gray-500'}`}>
            Touch
          </div>
          <div className={`py-2.5 px-1 border-r border-neutral-800 ${step === 2 ? 'bg-[#0C3D97] text-white' : step > 2 ? 'text-emerald-400' : 'text-gray-500'}`}>
            Upload
          </div>
          <div className={`py-2.5 px-1 border-r border-neutral-800 ${step === 3 ? 'bg-[#0C3D97] text-white' : step > 3 ? 'text-emerald-400' : 'text-gray-500'}`}>
            Select
          </div>
          <div className={`py-2.5 px-1 border-r border-neutral-800 ${step === 4 ? 'bg-[#0C3D97] text-white' : step > 4 ? 'text-emerald-400' : 'text-gray-500'}`}>
            Pay
          </div>
          <div className={`py-2.5 px-1 ${step === 5 ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>
            Print
          </div>
        </div>

        {/* Modal Body Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Touch Screen to Start */}
          {step === 1 && (
            <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-500/40 rounded-3xl flex items-center justify-center text-blue-400 mx-auto shadow-lg shadow-blue-900/30">
                <Touchpad className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Smart Touchscreen Kiosk</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1">
                  No app download. No OTP verification. Simply touch the screen to start printing your documents.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0C3D97] via-blue-600 to-[#0C3D97] hover:brightness-110 text-white font-extrabold text-base shadow-xl flex items-center justify-center space-x-2 mx-auto transform hover:scale-105 active:scale-95 transition-all"
                >
                  <span>👆 Touch Screen to Begin</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Upload Method */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center">
                <h4 className="text-lg font-bold text-white">Step 2: Upload Your Document</h4>
                <p className="text-xs text-gray-400">Choose phone camera QR upload or plug in USB / Type-C</p>
              </div>

              {/* Upload Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                <button
                  onClick={() => setUploadType('qr')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    uploadType === 'qr' ? 'bg-[#0C3D97] text-white shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Option A — Phone QR</span>
                </button>
                <button
                  onClick={() => setUploadType('usb')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    uploadType === 'usb' ? 'bg-[#0C3D97] text-white shadow-md' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Usb className="w-4 h-4" />
                  <span>Option B — USB / Type-C</span>
                </button>
              </div>

              {uploadType === 'qr' ? (
                <div className="bg-neutral-900/90 rounded-2xl p-5 border border-neutral-800 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  <div className="w-28 h-28 bg-white rounded-2xl p-2 flex-shrink-0 shadow-lg ring-2 ring-blue-500/30">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://easyxerox.in/touch-upload&color=0C3D97" 
                      alt="Upload QR" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="font-bold text-sm text-white">Scan with Camera or WhatsApp</h5>
                    <p className="text-xs text-gray-400">
                      Point phone camera at this QR code. Supported formats: <strong className="text-blue-300">PDF • PNG • JPG</strong>
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <label className="cursor-pointer bg-[#0C3D97] hover:bg-[#082e75] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                        <span>Select Test Document</span>
                        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleCustomFileUpload} className="hidden" />
                      </label>
                      <button
                        onClick={() => handleChooseFile('College_Assignment_Final.pdf')}
                        className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-700"
                      >
                        Sample PDF (4 Pgs)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900/90 rounded-2xl p-5 border border-neutral-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
                    <Usb className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">USB / Type-C Storage Device Detected</h5>
                    <p className="text-xs text-gray-400 mt-0.5">Select the file directly from storage on screen</p>
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <div 
                      onClick={() => handleChooseFile('Project_Presentation_Final.pdf')}
                      className="p-3 bg-neutral-950 border border-neutral-800 hover:border-blue-500 rounded-xl flex items-center justify-between cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-center space-x-2 text-left">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="font-bold text-white">Project_Presentation_Final.pdf</p>
                          <p className="text-[10px] text-gray-500">4 Pages • 2.4 MB</p>
                        </div>
                      </div>
                      <span className="text-[#0C3D97] font-bold">Select →</span>
                    </div>
                    <div 
                      onClick={() => handleChooseFile('Government_ID_Proof.jpg')}
                      className="p-3 bg-neutral-950 border border-neutral-800 hover:border-blue-500 rounded-xl flex items-center justify-between cursor-pointer transition-all text-xs"
                    >
                      <div className="flex items-center space-x-2 text-left">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <div>
                          <p className="font-bold text-white">Government_ID_Proof.jpg</p>
                          <p className="text-[10px] text-gray-500">1 Page • 850 KB</p>
                        </div>
                      </div>
                      <span className="text-[#0C3D97] font-bold">Select →</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Customize Print Settings (Touchscreen UI) */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <div>
                  <h4 className="text-base font-bold text-white">Step 3: Customize Print Settings</h4>
                  <p className="text-xs text-blue-300 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{selectedFileName}</span>
                  </p>
                </div>
                <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-gray-400">
                  {pages} Pages
                </span>
              </div>

              {/* Settings Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* Color Selection */}
                <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                  <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">1. Color Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setColorMode('bw')}
                      className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${
                        colorMode === 'bw'
                          ? 'bg-white text-gray-950 border-white shadow'
                          : 'bg-neutral-800 text-gray-400 border-neutral-700'
                      }`}
                    >
                      <span>Black & White</span>
                      <span className="block text-[10px] font-normal text-gray-500">₹2 / page</span>
                    </button>
                    <button
                      onClick={() => setColorMode('color')}
                      className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${
                        colorMode === 'color'
                          ? 'bg-[#0C3D97] text-white border-blue-400 shadow'
                          : 'bg-neutral-800 text-gray-400 border-neutral-700'
                      }`}
                    >
                      <span>Full Color</span>
                      <span className="block text-[10px] font-normal text-blue-200">₹10 / page</span>
                    </button>
                  </div>
                </div>

                {/* Duplex / Print Sides (Both sides) */}
                <div className="bg-neutral-900 p-3 rounded-2xl border border-blue-500/30 ring-1 ring-blue-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-blue-300 uppercase">2. Sides (Duplex)</label>
                    <span className="text-[9px] bg-blue-900/80 text-blue-200 px-1.5 py-0.5 rounded font-mono">DUPLEX</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsDuplex(false)}
                      className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${
                        !isDuplex
                          ? 'bg-[#0C3D97] text-white border-blue-400 shadow'
                          : 'bg-neutral-800 text-gray-400 border-neutral-700'
                      }`}
                    >
                      <span>1-Sided</span>
                      <span className="block text-[10px] font-normal text-gray-400">Single Side</span>
                    </button>
                    <button
                      onClick={() => setIsDuplex(true)}
                      className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${
                        isDuplex
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                          : 'bg-neutral-800 text-gray-400 border-neutral-700'
                      }`}
                    >
                      <span>Both Sides</span>
                      <span className="block text-[10px] font-normal text-emerald-200">2-Sided Duplex</span>
                    </button>
                  </div>
                </div>

                {/* Orientation */}
                <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                  <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">3. Orientation</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setOrientation('portrait')}
                      className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${
                        orientation === 'portrait'
                          ? 'bg-[#0C3D97] text-white border-blue-400'
                          : 'bg-neutral-800 text-gray-400 border-neutral-700'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => setOrientation('landscape')}
                      className={`p-2 rounded-xl border text-center transition-all text-xs font-bold ${
                        orientation === 'landscape'
                          ? 'bg-[#0C3D97] text-white border-blue-400'
                          : 'bg-neutral-800 text-gray-400 border-neutral-700'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Copies Counter */}
                <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800">
                  <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">4. Copies & Output</label>
                  <div className="flex items-center justify-between bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
                    <button
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-base flex items-center justify-center"
                    >
                      -
                    </button>
                    <div className="text-center">
                      <span className="text-lg font-black font-mono text-white block leading-none">{copies}</span>
                      <span className="text-[9px] text-gray-400">{totalSheets} {totalSheets === 1 ? 'Sheet' : 'Sheets'}</span>
                    </div>
                    <button
                      onClick={() => setCopies(copies + 1)}
                      className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-base flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-neutral-900 p-3 rounded-2xl border border-neutral-800 col-span-1 sm:col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase block">5. Calculated Total</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-2xl font-black text-emerald-400 font-mono">₹{totalPrice}.00</span>
                      {isDuplex && (
                        <span className="text-[10px] bg-emerald-950 border border-emerald-700/60 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                          Duplex Print (Both Sides)
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {pages} pages • {totalSheets} {totalSheets === 1 ? 'sheet' : 'sheets'}
                  </span>
                </div>
              </div>

              {/* Proceed to UPI Button */}
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 rounded-2xl bg-[#0C3D97] hover:bg-[#082e75] text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <span>Proceed to UPI Payment (₹{totalPrice}.00)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 4: UPI Payment */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300 text-center">
              <div>
                <h4 className="text-lg font-bold text-white">Step 4: Scan UPI QR to Pay</h4>
                <p className="text-xs text-gray-400">Use PhonePe, Google Pay, Paytm, or any UPI app</p>
              </div>

              <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 max-w-sm mx-auto flex flex-col items-center space-y-4">
                <div className="w-40 h-40 bg-white rounded-2xl p-2 shadow-xl ring-2 ring-emerald-500/40">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=easyxerox@upi&am=${totalPrice}.00&color=0C3D97`} 
                    alt="UPI Payment QR" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <span className="text-xs font-mono text-gray-400 block">Total Payable Amount</span>
                  <span className="text-3xl font-black text-emerald-400 font-mono">₹{totalPrice}.00</span>
                  <p className="text-[11px] text-blue-300 mt-1 font-mono">
                    {pages} Pages ({isDuplex ? 'Duplex Double-Sided' : 'Single-Sided'})
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-300 font-semibold">
                  <span className="bg-purple-900/60 border border-purple-600/40 text-purple-300 px-2 py-0.5 rounded-md">PhonePe</span>
                  <span className="bg-blue-900/60 border border-blue-600/40 text-blue-300 px-2 py-0.5 rounded-md">Google Pay</span>
                  <span className="bg-cyan-900/60 border border-cyan-600/40 text-cyan-300 px-2 py-0.5 rounded-md">Paytm</span>
                </div>
              </div>

              <button
                onClick={handleCompleteUPIPayment}
                className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <span>Simulate UPI Payment Success →</span>
              </button>
            </div>
          )}

          {/* STEP 5: Instant Laser Print & Dispense */}
          {step === 5 && (
            <div className="text-center py-5 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-9 h-9 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Payment Received & Print Ready!</h3>
                <p className="text-sm text-blue-200 mt-1">
                  Your {pages}-page {isDuplex ? 'Duplex (Both-Sided)' : 'Single-Sided'} document is being dispensed ({totalSheets} {totalSheets === 1 ? 'Sheet' : 'Sheets'}).
                </p>
              </div>

              {/* Simulated Paper Ejection graphic */}
              <div className="max-w-xs mx-auto bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
                <div className="h-3 bg-black rounded-full border border-neutral-700 shadow-inner mb-2"></div>
                <div className="bg-white text-gray-900 rounded-b-xl p-3 shadow-2xl border border-gray-200 text-left space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#0C3D97] border-b border-gray-100 pb-1">
                    <span>EasyXerox Verified {isDuplex ? 'Duplex' : ''} Print</span>
                    <span className="text-emerald-600 font-mono">100% COMPLETE</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-gray-200 rounded"></div>
                    <div className="w-4/5 h-1.5 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-1.5 bg-blue-100 rounded"></div>
                  </div>
                  <div className="text-[9px] text-gray-500 text-center font-semibold pt-1">
                    Collect from tray below ↓ ({totalSheets} {totalSheets === 1 ? 'sheet' : 'sheets'} front & back)
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-bold text-xs transition-colors"
                >
                  Print Another Document
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
