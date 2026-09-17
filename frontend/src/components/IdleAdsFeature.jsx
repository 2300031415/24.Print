import React, { useState, useEffect } from 'react';
import { Tv, Sparkles, TrendingUp, Users, Target, ArrowRight, CheckCircle2, Touchpad, Play, Zap, QrCode, Usb, FileText } from 'lucide-react';

export default function IdleAdsFeature({ onOpenFranchise }) {
  const [activeView, setActiveView] = useState('ad'); // 'ad' or 'print'
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const ads = [
    {
      id: 1,
      badge: "Campus Event",
      badgeColor: "bg-amber-400 text-gray-950",
      title: "National Tech Fest 2026",
      subtitle: "Win ₹5,00,000 in Prizes • Join 5,000+ Hackers",
      offerLabel: "Special Partner Offer",
      offerText: "Scan QR for Free Student Pass",
      qrData: "TechFest-2026-Pass",
      bgGradient: "from-indigo-950 via-[#0C3D97] to-blue-900",
      accentBorder: "border-blue-500/40",
    },
    {
      id: 2,
      badge: "Exclusive Food & Drinks",
      badgeColor: "bg-emerald-400 text-gray-950",
      title: "Campus Cafe & Brews",
      subtitle: "Flat 50% Off on Cold Brews, Wraps & Combos",
      offerLabel: "Instant Student Discount",
      offerText: "Scan QR for 50% Coupon Code",
      qrData: "Campus-Cafe-50-Off",
      bgGradient: "from-stone-900 via-amber-950 to-neutral-950",
      accentBorder: "border-amber-500/40",
    },
    {
      id: 3,
      badge: "Career & Placements",
      badgeColor: "bg-fuchsia-400 text-gray-950",
      title: "Summer Tech Internships",
      subtitle: "Hiring Software, AI & Design Interns for 2026",
      offerLabel: "Fast-Track Application",
      offerText: "Scan QR to Submit Resume Direct",
      qrData: "Internships-Drive-2026",
      bgGradient: "from-purple-950 via-indigo-950 to-neutral-950",
      accentBorder: "border-fuchsia-500/40",
    },
    {
      id: 4,
      badge: "Academic Partner",
      badgeColor: "bg-cyan-400 text-gray-950",
      title: "Campus Mega Book Fair",
      subtitle: "Up to 40% Off on Engineering & Medical Textbooks",
      offerLabel: "Digital Catalog Access",
      offerText: "Scan QR for Instant Book Catalog",
      qrData: "BookFair-Discount-40",
      bgGradient: "from-cyan-950 via-sky-950 to-slate-950",
      accentBorder: "border-cyan-500/40",
    },
  ];

  // Auto-cycle through ads every 3.5 seconds when in 'ad' mode
  useEffect(() => {
    if (activeView !== 'ad') return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [activeView, ads.length]);

  const currentAd = ads[currentAdIndex];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Container Card */}
      <div className="bg-gradient-to-br from-[#0C3D97] via-[#082e75] to-[#041639] rounded-3xl p-6 sm:p-12 text-white border-2 border-blue-400/30 shadow-2xl relative overflow-hidden">
        {/* Background Decorative Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold backdrop-blur-md">
              <Tv className="w-3.5 h-3.5 text-yellow-300" />
              <span>Smart Screen Monetization</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Screen. <br />
              <span className="text-cyan-300">Your Advertising Space.</span>
            </h2>

            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed font-normal">
              Turn idle kiosk screen time into a valuable advertising opportunity for brands, businesses, and local promotions. When nobody is printing, the high-definition display dynamically rotates sponsor visual campaigns.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dynamic Auto-Sliding Campaigns</h4>
                  <p className="text-xs text-blue-200/80">Displays rotating high-resolution campaigns with interactive QR promo redemptions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                  <Touchpad className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Instant Touch-to-Wake Transition</h4>
                  <p className="text-xs text-blue-200/80">Switches seamlessly from ad mode to print interface the millisecond a user taps the screen.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Additional Passive Revenue Stream</h4>
                  <p className="text-xs text-blue-200/80">Kiosk franchise owners earn automated income from both print jobs and dynamic screen impressions.</p>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <div className="pt-3">
              <button
                onClick={onOpenFranchise}
                className="px-6 py-3 rounded-full bg-white hover:bg-blue-50 text-[#0C3D97] font-bold text-sm shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                <span>Partner or Advertise With Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Column: Interactive Ad vs Print Display */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Mode Switcher Toggle */}
            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 mb-4 shadow-lg">
              <button
                onClick={() => setActiveView('ad')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeView === 'ad'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-950 shadow-md scale-105'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>1. Idle Ad Display Mode</span>
              </button>
              <button
                onClick={() => setActiveView('print')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeView === 'print'
                    ? 'bg-[#0C3D97] text-white shadow-md scale-105 border border-blue-300/40'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Touchpad className="w-3.5 h-3.5" />
                <span>2. Touch to Print Mode</span>
              </button>
            </div>

            {/* Simulated Kiosk Screen Frame */}
            <div 
              onClick={() => setActiveView(activeView === 'ad' ? 'print' : 'ad')}
              className="w-full max-w-md bg-neutral-950 rounded-3xl p-4 border-4 border-neutral-800 shadow-2xl relative cursor-pointer group transition-transform hover:scale-[1.01]"
            >
              {/* Screen Top Status */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-neutral-800 pb-2 mb-3">
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2 h-2 rounded-full ${activeView === 'ad' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></div>
                  <span className="font-mono text-gray-300">
                    {activeView === 'ad' ? `KIOSK AD NETWORK • SLIDE ${currentAdIndex + 1}/${ads.length}` : 'EASYXEROX SMART PRINT'}
                  </span>
                </div>
                <span className="text-[9px] bg-neutral-900 text-gray-400 px-2 py-0.5 rounded border border-neutral-800 font-mono">
                  {activeView === 'ad' ? 'AUTO-PLAYING' : 'ACTIVE'}
                </span>
              </div>

              {/* Screen Interactive Content */}
              {activeView === 'ad' ? (
                <div className="relative">
                  {/* Dynamic Ad Progress Bars (Top of Ad) */}
                  <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                    {ads.map((ad, idx) => (
                      <button
                        key={ad.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentAdIndex(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentAdIndex
                            ? 'bg-amber-400 shadow-xs shadow-amber-400/50'
                            : 'bg-neutral-800 hover:bg-neutral-700'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Ad Banner Card with Smooth Transition */}
                  <div 
                    key={currentAd.id}
                    className={`h-72 sm:h-80 bg-gradient-to-br ${currentAd.bgGradient} rounded-2xl p-5 flex flex-col justify-between text-center relative overflow-hidden border ${currentAd.accentBorder} animate-in fade-in duration-500`}
                  >
                    {/* Decorative Ambient Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>

                    {/* Top Ad Header */}
                    <div className="relative z-10">
                      <span className={`${currentAd.badgeColor} text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm inline-block`}>
                        {currentAd.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-2.5 leading-tight tracking-tight">
                        {currentAd.title}
                      </h3>
                      <p className="text-xs text-blue-100/90 mt-1 font-medium max-w-[280px] mx-auto">
                        {currentAd.subtitle}
                      </p>
                    </div>

                    {/* Bottom Promo Box */}
                    <div className="relative z-10 bg-black/50 backdrop-blur-md rounded-xl p-2.5 border border-white/15 flex items-center justify-between shadow-lg">
                      <div className="text-left">
                        <p className="text-[10px] text-gray-300 font-mono">{currentAd.offerLabel}</p>
                        <p className="text-xs font-bold text-amber-300">{currentAd.offerText}</p>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-lg p-1 flex-shrink-0 shadow-sm ml-2">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(currentAd.qrData)}&color=0C3D97`} 
                          alt="Promo QR" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Touch to Print Callout Bar */}
                    <div className="relative z-10 pt-1">
                      <div className="bg-white/95 text-gray-950 px-3 py-1.5 rounded-full text-[10px] font-extrabold shadow-lg flex items-center justify-center space-x-1.5 hover:bg-white transition-colors">
                        <span>👆</span>
                        <span>Touch Screen Anywhere to Start Printing</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-72 sm:h-80 bg-neutral-900 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between text-center border border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <div className="flex items-center space-x-2 text-left">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Touchpad className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Select Upload Method</h4>
                        <p className="text-[9px] text-gray-400">Touchscreen Kiosk OS</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                      NO APP • NO OTP
                    </span>
                  </div>

                  {/* 1. Phone QR Code Upload */}
                  <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex items-center space-x-3 text-left">
                    <div className="w-14 h-14 bg-white rounded-lg p-1 flex-shrink-0 shadow-sm">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://easyxerox.in/touch-upload&color=0C3D97" 
                        alt="Upload QR" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1.5">
                        <QrCode className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold text-white">Scan QR with Phone</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">Open camera to upload files</p>
                      <span className="inline-block mt-1 bg-blue-950/80 border border-blue-800/60 text-blue-300 text-[9px] px-1.5 py-0.2 rounded font-semibold">
                        PDF • PNG • JPG
                      </span>
                    </div>
                  </div>

                  {/* OR Divider */}
                  <div className="relative flex items-center justify-center my-0.5">
                    <div className="border-t border-neutral-800 w-full"></div>
                    <span className="bg-neutral-900 px-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest absolute">
                      OR
                    </span>
                  </div>

                  {/* 2. USB / Type-C Direct Drive Upload */}
                  <div className="bg-neutral-950 p-2 rounded-xl border border-neutral-800 flex items-center justify-between text-left">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Usb className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Plug USB / Type-C Drive</span>
                        <span className="text-[9px] text-gray-400">Direct storage access on kiosk</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-neutral-800 text-gray-300 border border-neutral-700 px-2 py-0.5 rounded font-medium">
                      Port Ready
                    </span>
                  </div>

                  {/* Continue Button */}
                  <div className="w-full bg-[#0C3D97] hover:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-1.5 transition-colors">
                    <span>Select Document & Print Settings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Click instruction caption */}
              <p className="text-[10px] text-center text-gray-400 mt-2">
                Tap anywhere on screen to see it transition instantly to the print interface.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
