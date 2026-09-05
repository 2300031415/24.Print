import React from 'react';
import { Check, ArrowRight, ShieldCheck, DollarSign, Building, Sparkles } from 'lucide-react';

export default function FranchiseModels({ onSelectModel }) {
  const models = [
    {
      id: "franchise-owned",
      title: "Franchise-Owned",
      tag: "Most Popular",
      tagColor: "bg-[#0C3D97] text-white",
      borderColor: "border-[#0C3D97]",
      subtitle: "You own the kiosk. EasyXerox runs the platform.",
      yourRole: [
        "No staff or manual labor required",
        "Provide dedicated 3 sq.ft space, power & Wi-Fi",
        "Handle paper ream and consumable refilling",
      ],
      ourRole: [
        "Order flow and UPI payment processing",
        "24/7 Remote customer support & diagnostics",
        "Software, cloud backend, and system monitoring",
      ],
      bestFor: "Entrepreneurs, Individuals, Startups, Retailers, Investors",
    },
    {
      id: "space-partner",
      title: "Space Partner Model",
      tag: "Zero Capex",
      tagColor: "bg-orange-500 text-white",
      borderColor: "border-orange-300",
      subtitle: "You provide the space. EasyXerox handles everything else.",
      yourRole: [
        "Provide prime space, power, and internet",
        "Ensure basic accessibility and safety of location",
        "Earn fixed monthly rent or rev-share payout",
      ],
      ourRole: [
        "Complete kiosk hardware & printer deployment",
        "Order flow and payment processing",
        "Full machine maintenance, paper & ink refilling",
      ],
      bestFor: "Colleges, Malls, Offices, Hostels, Transit Hubs, Government",
    },
    {
      id: "custom-partnership",
      title: "Custom Partnership",
      tag: "Enterprise",
      tagColor: "bg-blue-600 text-white",
      borderColor: "border-blue-300",
      subtitle: "Tailored multi-kiosk deployments for campuses & enterprises.",
      yourRole: [
        "Institution-wide deployment approvals",
        "Custom billing / student RFID ID card integration",
        "Multi-floor or multi-branch strategic placement",
      ],
      ourRole: [
        "White-label or co-branded kiosk designs",
        "Single Sign-On (SSO) and ERP integration",
        "Dedicated account manager & SLA guarantee",
      ],
      bestFor: "Enterprises, Universities, Government Institutions, Smart Cities",
    },
  ];

  return (
    <section id="franchise-section" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          Flexible <span className="text-[#0C3D97]">Partnership Models</span>
        </h2>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Choose how you want to partner with India’s fastest-growing automated printing network.
        </p>
      </div>

      {/* 3 Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {models.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-3xl border-2 ${m.borderColor} p-7 shadow-lg flex flex-col justify-between relative overflow-hidden glass-card-hover`}
          >
            {/* Tag */}
            <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${m.tagColor}`}>
              {m.tag}
            </span>

            <div>
              <h3 className="text-2xl font-black text-gray-950 mb-1">{m.title}</h3>
              <p className="text-xs text-gray-500 mb-6">{m.subtitle}</p>

              {/* Your Role */}
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Your Role
                </span>
                <ul className="space-y-2">
                  {m.yourRole.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0C3D97] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Role */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  EasyXerox Role
                </span>
                <ul className="space-y-2">
                  {m.ourRole.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-[#0C3D97] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For & CTA */}
            <div>
              <div className="pt-4 border-t border-gray-100 mb-5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Best Suited For
                </span>
                <p className="text-xs font-medium text-gray-800">{m.bestFor}</p>
              </div>

              <button
                onClick={() => onSelectModel(m.title)}
                className="w-full py-3 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-xs flex items-center justify-center space-x-2 brand-glow transition-all transform hover:scale-[1.02]"
              >
                <span>Select {m.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4-Step Partnership Roadmap */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-md">
        <h3 className="text-2xl font-extrabold text-gray-950 text-center mb-8">
          4 Simple Steps to Launch Your Kiosk
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Submit Enquiry", desc: "Fill out the quick franchise form with your preferred city & location." },
            { step: "02", title: "Feasibility Check", desc: "Our team assesses footfall, power availability, and network speed." },
            { step: "03", title: "Kiosk Dispatch", desc: "Your plug-and-play EasyXerox machine arrives pre-configured in 7 days." },
            { step: "04", title: "Plug In & Earn", desc: "Connect power and start generating passive income on every print 24/7." },
          ].map((item, i) => (
            <div key={i} className="relative p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between">
              <span className="text-3xl font-black text-[#0C3D97]/30 mb-2 block">{item.step}</span>
              <div>
                <h4 className="font-bold text-base text-gray-900 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
