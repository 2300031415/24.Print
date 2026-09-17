import React, { useState } from 'react';
import { Touchpad, QrCode, Usb, Sliders, CheckCircle2, Shield, Plus, Minus, FileText, Check, ArrowRight, Smartphone, ArrowDown, Sparkles } from 'lucide-react';

export default function HowItWorks({ onOpenPrintModal }) {
  const [activeStep, setActiveStep] = useState(1);
  const [demoCopies, setDemoCopies] = useState(2);
  const [demoColor, setDemoColor] = useState('bw');

  const steps = [
    {
      num: '01',
      title: 'TOUCH',
      subtitle: 'Smart Touchscreen',
      desc: 'Walk up to any EasyXerox kiosk. Tap the high-response touchscreen to instantly switch from idle ad mode to the printing workflow.',
      badge: 'Touch to Wake',
      icon: Touchpad,
      highlight: 'No App • No Login'
    },
    {
      num: '02',
      title: 'UPLOAD',
      subtitle: 'QR or USB / Type-C',
      desc: 'Scan the on-screen QR with your phone camera to upload PDF, PNG, JPG files, or plug your USB / Type-C flash drive directly into the kiosk.',
      badge: 'Dual Upload',
      icon: QrCode,
      highlight: 'PDF • PNG • JPG'
    },
    {
      num: '03',
      title: 'SELECT',
      subtitle: 'Smart Touch Settings',
      desc: 'Customize your print job in seconds: Color vs B&W, single or double-sided (duplex) printing, orientation, and copies with simple taps.',
      badge: 'Duplex & Color',
      icon: Sliders,
      highlight: 'Color / B&W • Duplex (Both Sides)'
    },
    {
      num: '04',
      title: 'PAY',
      subtitle: 'Cashless UPI',
      desc: 'Pay in under 2 seconds by scanning the on-screen dynamic UPI QR with PhonePe, Google Pay, Paytm, BHIM, or any UPI banking app.',
      badge: 'Instant QR Pay',
      icon: Smartphone,
      highlight: 'PhonePe • GPay • Paytm'
    },
    {
      num: '05',
      title: 'PRINT',
      subtitle: 'Collect from Slot',
      desc: 'Tap PRINT and collect your high-speed, crisp laser printed documents right from the illuminated paper output slot below.',
      badge: 'High-Speed Output',
      icon: CheckCircle2,
      highlight: 'Under 60 Seconds'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Pill Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/30 text-[#0C3D97] text-xs font-bold shadow-xs">
          <Touchpad className="w-3.5 h-3.5 text-[#0C3D97]" />
          <span>The 5-Step Smart Journey</span>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          How <span className="text-[#0C3D97]">EasyXerox</span> Works
        </h2>
        <p className="mt-3 text-base sm:text-lg text-gray-600 font-medium">
          No App. No OTP. Walk up, touch the screen, and print in 5 simple steps.
        </p>
      </div>

      {/* 5-Step Grid Cards with Clean Connector Line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#0C3D97]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Step Number Pill & Icon */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0C3D97] text-white tracking-wider">
                    {step.num}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0C3D97] group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-gray-950 tracking-tight mb-1 group-hover:text-[#0C3D97] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-bold text-[#0C3D97] mb-2.5">
                  {step.subtitle}
                </p>
                <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Feature Tag */}
              <div className="pt-3 border-t border-gray-100">
                <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg w-full justify-center">
                  <span>{step.highlight}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
