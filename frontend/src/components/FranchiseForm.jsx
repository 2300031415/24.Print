import React, { useState } from 'react';
import { Rocket, MapPin, Building, ArrowRight, CheckCircle, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FranchiseForm({ initialModel = 'own', embedded = false }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState(initialModel);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    state: 'Tamil Nadu',
    venueType: 'College / University',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const partnerOptions = [
    {
      id: 'own',
      icon: Rocket,
      title: 'I want to own an EasyXerox kiosk',
      badge: 'Recommended',
      desc: 'Own an EasyXerox machine and earn automated revenue from every single print.',
    },
    {
      id: 'host',
      icon: MapPin,
      title: 'I have a location and want to host a kiosk',
      badge: null,
      desc: 'Let us install and operate an EasyXerox kiosk at your college, hostel, or venue.',
    },
    {
      id: 'custom',
      icon: Building,
      title: 'I need a custom enterprise solution',
      badge: null,
      desc: 'For universities, IT parks, export inquiries, distributors, or multi-kiosk bulk deployments.',
    },
  ];

  return (
    <div id="franchise-form-section" className={embedded ? "w-full" : "py-20 px-4 max-w-5xl mx-auto"}>
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl relative overflow-hidden">
        
        {/* Step Indicator Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div>
            <span className="text-xs text-gray-500 font-bold block mb-1">Ready to Join Us?</span>
            <h2 className="text-3xl font-extrabold text-gray-950">Get in Touch With Us</h2>
          </div>

          {!submitted && (
            <div className="flex items-center space-x-3">
              {/* Step 1 */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 1 ? 'bg-[#0C3D97] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className={`text-xs font-semibold ${currentStep === 1 ? 'text-[#0C3D97]' : 'text-gray-400'}`}>
                  Model
                </span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>

              {/* Step 2 */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 2 ? 'bg-[#0C3D97] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`text-xs font-semibold ${currentStep === 2 ? 'text-[#0C3D97]' : 'text-gray-400'}`}>
                  Details
                </span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>

              {/* Step 3 */}
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= 3 ? 'bg-[#0C3D97] text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  3
                </div>
                <span className={`text-xs font-semibold ${currentStep === 3 ? 'text-[#0C3D97]' : 'text-gray-400'}`}>
                  Final
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Forms */}
        <div className="pt-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0C3D97] mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Application Received!</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you, <span className="font-bold text-gray-900">{formData.fullName || 'Partner'}</span>. Our expansion manager will contact you at <span className="font-bold text-[#0C3D97]">{formData.phone || 'your phone'}</span> within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleNext} className="space-y-6">
              
              {/* STEP 1: Select Option */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-lg font-bold text-gray-900">How would you like to partner with EasyXerox?</h3>
                  
                  <div className="space-y-3">
                    {partnerOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedOption(opt.id)}
                          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-4 ${
                            isSelected
                              ? 'border-[#0C3D97] bg-blue-50/60 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-[#0C3D97] text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm sm:text-base font-bold text-gray-900">{opt.title}</h4>
                              {opt.badge && (
                                <span className="text-[10px] font-extrabold bg-[#0C3D97] text-white px-2 py-0.5 rounded-full uppercase">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-sm flex items-center space-x-2 brand-glow"
                    >
                      <span>Proceed to Step 2</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Contact Info */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-lg font-bold text-gray-900">Your Contact & Location Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0C3D97] focus:ring-1 focus:ring-[#0C3D97] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0C3D97] focus:ring-1 focus:ring-[#0C3D97] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0C3D97] focus:ring-1 focus:ring-[#0C3D97] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">City / Region *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chennai / Bengaluru"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0C3D97] focus:ring-1 focus:ring-[#0C3D97] text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-sm flex items-center space-x-2 brand-glow"
                    >
                      <span>Proceed to Final Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Venue & Requirements */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-lg font-bold text-gray-900">Location Type & Additional Requirements</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Proposed Location Type</label>
                      <select
                        value={formData.venueType}
                        onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0C3D97] text-sm"
                      >
                        <option>College / University Campus</option>
                        <option>IT Park / Corporate Office Building</option>
                        <option>Hostel / PG Building</option>
                        <option>Transit Hub / Metro Station / Bus Terminal</option>
                        <option>Library / Reading Hall / Coaching Center</option>
                        <option>Retail Shop / Mall Entrance</option>
                        <option>Other Public High-Footfall Space</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Specific Notes / Number of Kiosks</label>
                      <textarea
                        rows="3"
                        placeholder="Tell us about your estimated footfall or preferred deployment timeline..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0C3D97] text-sm"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-sm flex items-center space-x-2 brand-glow"
                    >
                      <span>Submit Franchise Enquiry</span>
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
