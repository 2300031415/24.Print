import React from 'react';
import { GraduationCap, Briefcase, Train, Building2, Home, Coffee } from 'lucide-react';

export default function WhereItFits({ onOpenFranchise }) {
  const venues = [
    {
      icon: GraduationCap,
      title: "Colleges & Universities",
      description: "For last-minute lab manuals, assignments, thesis submissions, and exam hall tickets available 24/7.",
      tag: "High Daily Volume",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: Briefcase,
      title: "IT Parks & Corporate Offices",
      description: "Fast, contactless printing of agreements, boarding passes, reports, and tax documents without printer maintenance.",
      tag: "Enterprise Ready",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: Train,
      title: "Metro & Transit Hubs",
      description: "Grab emergency travel tickets, government IDs, and visa forms on the go without missing a train or flight.",
      tag: "24/7 Commuter Hub",
      image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: Building2,
      title: "Hospitals & Healthcare",
      description: "Instant 24/7 printing of patient records, lab test reports, insurance claim forms, prescriptions, and ID proofs.",
      tag: "24/7 Healthcare Essential",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: Home,
      title: "Hostels & PG Accommodations",
      description: "Late-night urgent printing for students and young professionals when all traditional xerox shops are closed.",
      tag: "Midnight Printing",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: Coffee,
      title: "Co-Working Cafes & Spaces",
      description: "Monetize free footfall and offer members instant color & B/W printing with zero staff overhead.",
      tag: "Zero Staff Required",
      image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&q=80"
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          Where does <span className="text-[#0C3D97]">EasyXerox</span> fit?
        </h2>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Compact footprint, high revenue potential, and zero maintenance headaches for venue hosts.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue, idx) => {
          const Icon = venue.icon;
          return (
            <div
              key={idx}
              className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between glass-card-hover"
            >
              {/* Image Header with Badge */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={venue.image} 
                  alt={venue.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-gray-900 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-sm">
                  {venue.tag}
                </span>

                <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white">
                  <div className="w-8 h-8 rounded-xl bg-[#0C3D97] flex items-center justify-center text-white shadow-md">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-lg drop-shadow">{venue.title}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {venue.description}
                </p>

                <button
                  onClick={onOpenFranchise}
                  className="w-full py-2.5 rounded-xl border border-blue-500/30 hover:border-[#0C3D97] bg-blue-50/50 hover:bg-[#0C3D97] text-[#0C3D97] hover:text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>Host a Kiosk Here</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
