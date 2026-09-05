import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MarqueeRibbon() {
  const ribbon1Items = [
    "Contactless Prints",
    "Instant Print Under 60s",
    "Zero Queues",
    "Self-Service Vending",
    "100% Encrypted",
    "Smart Xerox",
    "Direct Phone Upload",
    "UPI & Cards Enabled",
  ];

  const ribbon2Items = [
    "24/7 Available Service",
    "Encrypted Safe Printing",
    "EasyXerox Kiosks",
    "Automated B&W & Color",
    "No Sign-Up Required",
    "Single & Duplex Xerox",
    "Cloud & WhatsApp Upload",
    "Zero File Retention",
  ];

  return (
    <div className="relative py-14 sm:py-20 overflow-hidden my-6 select-none">
      {/* Top Ribbon (White/Light Slanted Ribbon) */}
      <div className="relative z-10 w-[110%] -left-[5%] bg-white/95 border-y border-gray-200 py-3.5 sm:py-4 shadow-lg slant-ribbon-white backdrop-blur-md">
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee-slow items-center text-sm sm:text-base font-extrabold text-gray-900 tracking-wide uppercase">
            {[...ribbon1Items, ...ribbon1Items].map((item, idx) => (
              <div key={idx} className="flex items-center mx-6 sm:mx-8">
                <span>{item}</span>
                <span className="text-[#0C3D97] text-lg ml-6 sm:ml-8">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Ribbon (Vivid Blue Slanted Ribbon Crisscrossing) */}
      <div className="relative z-20 w-[110%] -left-[5%] bg-gradient-to-r from-[#1b56c4] via-[#0C3D97] to-[#07235b] py-3.5 sm:py-4 shadow-xl slant-ribbon-blue mt-[-22px]">
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee-reverse items-center text-sm sm:text-base font-extrabold text-white tracking-wide uppercase">
            {[...ribbon2Items, ...ribbon2Items].map((item, idx) => (
              <div key={idx} className="flex items-center mx-6 sm:mx-8">
                <span>{item}</span>
                <span className="text-white/80 text-lg ml-6 sm:ml-8">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
