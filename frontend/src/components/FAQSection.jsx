import React, { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is EasyXerox?",
      answer: "EasyXerox is a smart self-service printing kiosk with a built-in touchscreen display. Users interact directly with the kiosk screen to upload documents, customize settings, pay via UPI, and collect laser prints in under 60 seconds."
    },
    {
      question: "Do I need to download an app or verify with an OTP?",
      answer: "No! EasyXerox requires NO app download, NO OTP verification, and NO user account registration. You do not need to install anything or use a separate app to operate the kiosk. Everything happens directly through the kiosk's interactive touchscreen display."
    },
    {
      question: "How do I provide my document to the kiosk?",
      answer: "EasyXerox gives you two simple upload options directly on the touchscreen: 1) Option A (QR Upload): Scan the on-screen QR code with your phone camera to upload PDF, PNG, JPG, or other document formats. 2) Option B (USB / Type-C): Connect your USB flash drive or Type-C device directly into the kiosk and select your document on screen."
    },
    {
      question: "How does the printing and payment process work?",
      answer: "It is a fast 5-step journey: 1) Touch the smart touchscreen to wake the kiosk. 2) Upload your document via QR or USB/Type-C. 3) Select your print options (Color/B&W, Single or Double-Sided Duplex, copies, orientation). 4) Pay securely via UPI (PhonePe, Google Pay, Paytm). 5) Tap Print and collect your pages instantly from the dedicated output slot."
    },
    {
      question: "Does EasyXerox support double-sided (duplex) printing?",
      answer: "Yes! EasyXerox kiosks fully support both single-sided and double-sided (duplex) printing. You can select both-sided printing directly on the kiosk touchscreen with one tap, saving paper and making project reports neat and compact."
    },
    {
      question: "Are my uploaded documents safe and private?",
      answer: "Yes, 100%! EasyXerox uses bank-grade 256-bit encryption. Documents are processed exclusively in temporary volatile memory for the duration of the print job and are automatically and permanently deleted immediately after the paper is ejected."
    },
    {
      question: "Can I display advertisements on the kiosk screen?",
      answer: "Yes! When nobody is actively printing, the kiosk's high-definition touchscreen display serves as dynamic digital advertising space for brands, colleges, and local businesses, generating additional automated revenue for franchise hosts."
    },
    {
      question: "How can I start an EasyXerox franchise or host a kiosk?",
      answer: "You can apply through our Franchise section! We provide plug-and-play smart kiosks with automated cloud monitoring, supply refills, anti-jam optical sensors, and dual revenue from prints & advertising."
    }
  ];

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          Frequently Asked <span className="text-[#0C3D97]">Questions</span>
        </h2>
        <p className="mt-3 text-base text-gray-600 font-medium">
          Everything you need to know about using and partnering with EasyXerox.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#0C3D97]/50 shadow-md ring-1 ring-[#0C3D97]/20'
                  : 'bg-white/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
              >
                <span className="font-bold text-base sm:text-lg text-gray-900 leading-snug">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isOpen ? 'bg-[#0C3D97] text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100/80 animate-in fade-in duration-200">
                  <p className="mt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
