import React, { useState } from 'react';
import { MessageCircle, Phone, X, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function FloatingWhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const phonePrimary = "+918885600899";
  const phoneSecondary = "+919908849889";
  const whatsappUrl = `https://wa.me/918885600899?text=${encodeURIComponent("Hello Future Forbes / EasyXerox team! I am interested in knowing more about your smart printing kiosks and franchise models.")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Quick Action Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white/95 backdrop-blur-xl border-2 border-blue-200 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200 text-slate-950 relative overflow-hidden">
          
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-3">
            <div className="flex items-center space-x-2.5">
              <img src="/future-forbes-logo.png" alt="Future Forbes" className="w-7 h-7 object-contain rounded" />
              <div>
                <h4 className="text-xs font-black text-slate-950 font-heading">EasyXerox Support</h4>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Online • Future Forbes Pvt Ltd</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-950 transition-colors rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 font-semibold mb-4 leading-relaxed">
            Have questions about hosting an EasyXerox kiosk or starting a franchise? Speak with our team directly!
          </p>

          {/* Action 1: WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mb-2.5 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Action 2: Direct Call */}
          <a
            href={`tel:${phonePrimary}`}
            className="w-full p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#0C3D97] border border-blue-200 font-extrabold text-xs flex items-center justify-between transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#0C3D97]" />
              <span>Call +91 88856 00899</span>
            </div>
            <span className="text-[10px] bg-blue-200/80 px-2 py-0.5 rounded-full font-bold">24/7</span>
          </a>

          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-center text-slate-400 font-bold">
            A Flagship Product of Future Forbes Pvt Ltd
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center space-x-2 bg-[#0C3D97] hover:bg-[#082e75] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-blue-900/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/40"
        title="Contact Future Forbes Support"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
        </div>
        <span className="hidden sm:inline-block text-xs font-black tracking-wide">
          Instant Inquiry
        </span>
      </button>

    </div>
  );
}
