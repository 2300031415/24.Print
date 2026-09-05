import React from 'react';
import { HelpCircle, Lock, Clock, Calendar, Star, Touchpad, Usb, Smartphone, Tv, ShieldCheck, Printer } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: Touchpad,
      title: "Interactive Touchscreen Display",
      description: "Operate everything directly on the high-response kiosk display. Choose Color/B&W, single or double-sided (duplex) prints, and trigger laser outputs.",
    },
    {
      icon: Usb,
      title: "QR & USB / Type-C Uploads",
      description: "Scan the on-screen static QR with your phone camera or plug in a USB / Type-C drive directly. Supports PDF, PNG, JPG and more.",
    },
    {
      icon: Star,
      title: "No App. No OTP. Zero Friction.",
      description: "No app downloads, no SMS OTP delays, and no account registrations. Walk up, touch the screen, and print in under 60 seconds.",
    },
    {
      icon: Smartphone,
      title: "Instant Cashless UPI Payment",
      description: "Pay securely in seconds by scanning the on-screen dynamic QR with PhonePe, Google Pay, Paytm, or any UPI banking app.",
    },
    {
      icon: Lock,
      title: "100% Privacy & Auto-Purge",
      description: "Documents are processed in temporary volatile memory and permanently wiped immediately after the sheets are ejected.",
    },
    {
      icon: Tv,
      title: "Dual-Use Idle Screen Ads",
      description: "Monetize idle screen time with high-definition digital advertisements for brands, colleges, and local businesses.",
    },
  ];

  return (
    <section id="features-section" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Pill Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/30 text-[#0C3D97] text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-[#0C3D97]" />
          <span>Features</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          So, Why <span className="text-[#0C3D97]">EasyXerox</span> is the best way to print?
        </h2>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Smarter Printing for a Busy World!
        </p>
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-gray-200/90 shadow-sm glass-card-hover flex flex-col justify-start relative group overflow-hidden"
            >
              {/* Top left subtle icon container with blue tint */}
              <div className="w-12 h-12 rounded-2xl bg-[#0C3D97]/10 border border-blue-500/20 flex items-center justify-center text-[#0C3D97] mb-6 group-hover:bg-[#0C3D97] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-950 mb-3 tracking-tight group-hover:text-[#0C3D97] transition-colors">
                {feat.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
