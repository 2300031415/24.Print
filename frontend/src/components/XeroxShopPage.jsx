import React from 'react';
import { Store, TrendingUp, Clock, Users, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import KioskSpecs from './KioskSpecs';

export default function XeroxShopPage({ onOpenFranchise }) {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      
      {/* Hero Section for Xerox Shop Owners */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/30 text-[#0C3D97] text-xs font-semibold mb-4">
          <Store className="w-3.5 h-3.5 text-[#0C3D97]" />
          <span>For Xerox & Printing Shop Owners</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-[1.15]">
          Upgrade Your Xerox Shop to an <span className="text-[#0C3D97]">Automated 24/7 Powerhouse</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          Stop losing business during night hours, lunch breaks, and peak queue congestion. Deploy an EasyXerox kiosk outside or inside your shop!
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onOpenFranchise}
            className="px-8 py-3.5 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-base brand-glow transition-all transform hover:scale-105"
          >
            <span>Partner as a Xerox Shop</span>
            <span className="ml-2">↗</span>
          </button>
        </div>
      </div>

      {/* Comparison: Old Traditional Shop vs EasyXerox Automated Shop */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm mb-20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 text-center mb-10">
          Traditional Xerox Shop vs <span className="text-[#0C3D97]">EasyXerox Smart Kiosk</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Old Way */}
          <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-3">
              ❌ Traditional Xerox Shop
            </span>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Restricted to 9 AM - 9 PM opening hours</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>High staff salary & manual paper handling</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Pen drive virus infections & customer data leaks</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Long queues cause frustrated customers to walk away</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-red-500 font-bold">✕</span>
                <span>Zero income when shop shutters are closed</span>
              </li>
            </ul>
          </div>

          {/* New EasyXerox Way */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border-2 border-blue-500/40 shadow-sm">
            <span className="text-xs font-bold text-[#0C3D97] uppercase tracking-wider block mb-3">
              ✅ EasyXerox Smart Shop Partner
            </span>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-800 font-medium">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0C3D97] font-bold" />
                <span>Earn money 24/7/365 even while you sleep</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0C3D97] font-bold" />
                <span>100% self-service: zero staff intervention</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0C3D97] font-bold" />
                <span>Instant QR & USB/Type-C upload with volatile auto-purge</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0C3D97] font-bold" />
                <span>Zero queues: 45-second lightning fast throughput</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#0C3D97] font-bold" />
                <span>Instant automated UPI payouts straight to your bank</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Embedded Hardware Showcase */}
      <KioskSpecs onOpenFranchise={onOpenFranchise} />
    </div>
  );
}
