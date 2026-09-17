import React from 'react';
import { Cpu, Check, Layers, Zap, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function KioskSpecs({ onOpenFranchise }) {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          Engineered for <span className="text-[#0C3D97]">Reliability & Scale</span>
        </h2>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Choose between our high-throughput flagship PRO kiosk or space-saving MINI kiosk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* EasyXerox PRO */}
        <div className="bg-white rounded-3xl border-2 border-[#0C3D97]/40 p-7 sm:p-9 shadow-xl relative overflow-hidden flex flex-col justify-between glass-card-hover">
          <div className="absolute top-0 right-0 bg-[#0C3D97] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-2xl shadow-sm">
            FLAGSHIP MODEL
          </div>

          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-300 flex items-center justify-center text-[#0C3D97]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">EasyXerox <span className="text-[#0C3D97]">PRO</span></h3>
                <p className="text-xs text-gray-500">Built for Universities, Metro Stations & High-Footfall Zones</p>
              </div>
            </div>

            {/* Price & ROI */}
            <div className="my-5 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold block">Franchise Price</span>
                <span className="text-3xl font-black text-gray-900">₹2.96 L</span>
                <span className="text-xs text-gray-500 font-semibold ml-1">+ GST</span>
              </div>
              <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
                ROI: ~6-9 Months
              </span>
            </div>

            {/* Key Specs Quick Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <span className="text-[10px] font-bold text-[#0C3D97] uppercase block">Touch Display</span>
                <span className="text-base font-black text-gray-900">15-inch Full HD</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <span className="text-[10px] font-bold text-[#0C3D97] uppercase block">Paper Capacity</span>
                <span className="text-base font-black text-gray-900">1,500 Sheets</span>
              </div>
            </div>

            {/* Spec Highlights */}
            <ul className="space-y-3 mb-8">
              {[
                "High-speed laser printing with auto-duplex (double-sided printing)",
                "Dual high-capacity trays: 1,500 sheets paper capacity",
                "Industrial-grade 15-inch Full HD capacitive touchscreen display",
                "High-res integrated QR scanner & optical camera",
                "Automated document jam recovery & remote diagnostics",
                "Heavy-duty powder-coated anti-vandalism steel chassis",
                "Integrated UPS battery backup (up to 2 hours of power outage)",
              ].map((spec, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0C3D97] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onOpenFranchise}
            className="w-full py-3.5 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-sm flex items-center justify-center space-x-2 brand-glow transition-all transform hover:scale-[1.02]"
          >
            <span>Order EasyXerox PRO</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* EasyXerox MINI */}
        <div className="bg-white rounded-3xl border border-gray-200 p-7 sm:p-9 shadow-lg relative overflow-hidden flex flex-col justify-between glass-card-hover">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-800">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">EasyXerox <span className="text-gray-700">MINI</span></h3>
                <p className="text-xs text-gray-500">Compact Footprint for Hostels, Cafes & Co-working Lounges</p>
              </div>
            </div>

            {/* Price & ROI */}
            <div className="my-5 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-500 uppercase font-bold block">Franchise Price</span>
                <span className="text-3xl font-black text-gray-900">₹1.40 L</span>
                <span className="text-xs text-gray-500 font-semibold ml-1">+ GST</span>
              </div>
              <span className="text-xs font-bold text-gray-700 bg-gray-200 px-2.5 py-1 rounded-full">
                ROI: ~5-7 Months
              </span>
            </div>

            {/* Key Specs Quick Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 bg-gray-100/70 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-600 uppercase block">Touch Display</span>
                <span className="text-base font-black text-gray-900">10-inch HD</span>
              </div>
              <div className="p-3 bg-gray-100/70 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-600 uppercase block">Paper Capacity</span>
                <span className="text-base font-black text-gray-900">650 Sheets</span>
              </div>
            </div>

            {/* Spec Highlights */}
            <ul className="space-y-3 mb-8">
              {[
                "Moderate print speed with auto-duplex (double-sided print)",
                "Standard paper capacity: 650 sheets",
                "Compact 10-inch interactive touchscreen display",
                "Direct QR upload (Phone) & USB / Type-C storage access",
                "Desktop / Countertop or Standalone column mount",
                "Low energy consumption (less than standard desktop PC)",
                "Fully cloud-managed with automatic telemetry alerts",
              ].map((spec, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onOpenFranchise}
            className="w-full py-3.5 rounded-full border-2 border-gray-800 hover:bg-gray-900 text-gray-900 hover:text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
          >
            <span>Order EasyXerox MINI</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
