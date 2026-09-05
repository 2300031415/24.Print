import React from 'react';
import { Star, ArrowUpRight, Lock, Clock, Calendar, Printer, ShieldCheck, Touchpad, Usb, Smartphone, Sparkles, MapPin } from 'lucide-react';
import Kiosk3D from './Kiosk3D';

export default function Hero({ onOpenPrintModal, onOpenFranchise }) {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Top Differentiator Badge */}
      <div className="flex justify-center mb-5">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-[#0C3D97]/30 text-[#0C3D97] text-xs sm:text-sm font-bold shadow-xs hover:border-[#0C3D97] transition-all backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#0C3D97] animate-ping"></span>
          <span>No App. No OTP. Just Touch, Pay & Print.</span>
        </div>
      </div>

      {/* Clean Premium Headline */}
      <div className="text-center max-w-4xl mx-auto mb-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-950 leading-[1.12] sm:leading-[1.1]">
          Print Smarter. <span className="text-[#0C3D97]">Live Better.</span>
        </h1>
        <p className="mt-4 text-base sm:text-xl text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed">
          A self-service smart printing kiosk that lets you upload, customize, pay and print — directly from the touchscreen.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
        <button
          onClick={onOpenPrintModal}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2 brand-glow transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <Printer className="w-4 h-4" />
          <span>Try Live Simulator</span>
        </button>
        <button
          onClick={onOpenFranchise}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-blue-400/40 hover:border-[#0C3D97] font-bold text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 shadow-xs"
        >
          <span>Start a Franchise</span>
          <ArrowUpRight className="w-4 h-4 ml-1.5 inline text-gray-500" />
        </button>
      </div>

      {/* Hero Showcase Centerpiece with Surrounding Floating Badges */}
      <div className="relative max-w-5xl mx-auto flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
        {/* LEFT FLOATING BADGES (Desktop) */}
        <div className="hidden lg:flex flex-col space-y-12 absolute left-4 xl:-left-4 z-20">
          {/* Badge 1 */}
          <div className="animate-float-slow delay-1 flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 hover:border-blue-400 transition-all hover:scale-105">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97]">
              <Touchpad className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">Smart Touchscreen</p>
              <p className="text-xs text-gray-500">Direct Touch Interface</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="animate-float-medium delay-3 flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 hover:border-blue-400 transition-all hover:scale-105 -ml-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97]">
              <Usb className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">QR & USB / Type-C</p>
              <p className="text-xs text-gray-500">Dual Upload Methods</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="animate-float-reverse delay-5 flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 hover:border-blue-400 transition-all hover:scale-105">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">100% Privacy</p>
              <p className="text-xs text-gray-500">Zero Retention Memory</p>
            </div>
          </div>
        </div>

        {/* 3D KIOSK CENTER PIECE */}
        <div className="z-10 w-full flex justify-center">
          <Kiosk3D onInteract={onOpenPrintModal} />
        </div>

        {/* RIGHT FLOATING BADGES (Desktop) */}
        <div className="hidden lg:flex flex-col space-y-12 absolute right-4 xl:-right-4 z-20">
          {/* Badge 4 */}
          <div className="animate-float-medium delay-2 flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 hover:border-blue-400 transition-all hover:scale-105">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">Under 60 Seconds</p>
              <p className="text-xs text-gray-500">Walk-Up & Print</p>
            </div>
          </div>

          {/* Badge 5 */}
          <div className="animate-float-slow delay-4 flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 hover:border-blue-400 transition-all hover:scale-105 ml-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">Laser Output</p>
              <p className="text-xs text-gray-500">Color & Black/White</p>
            </div>
          </div>

          {/* Badge 6 */}
          <div className="animate-float-reverse delay-6 flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 hover:border-blue-400 transition-all hover:scale-105">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-snug">Cashless UPI</p>
              <p className="text-xs text-gray-500">PhonePe, GPay & Paytm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Badge Grid (Visible on smaller screens below machine) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 lg:hidden">
        <div className="bg-white/90 p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] flex-shrink-0">
            <Touchpad className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900">Smart Touchscreen</span>
        </div>
        <div className="bg-white/90 p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] flex-shrink-0">
            <Usb className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900">QR & USB Input</span>
        </div>
        <div className="bg-white/90 p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900">&lt; 60s Fast Print</span>
        </div>
        <div className="bg-white/90 p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] flex-shrink-0">
            <Printer className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900">Laser Quality</span>
        </div>
        <div className="bg-white/90 p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900">Cashless UPI</span>
        </div>
        <div className="bg-white/90 p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-900">100% Privacy</span>
        </div>
      </div>
    </section>
  );
}
