import React, { useState } from 'react';
import { MapPin, Building2, Landmark, CheckCircle, Navigation } from 'lucide-react';

export default function LocationsStats() {
  const [selectedCity, setSelectedCity] = useState('All');

  const stats = [
    {
      icon: MapPin,
      number: "45+",
      label: "Active Kiosks",
      sub: "Across major educational & tech hubs",
    },
    {
      icon: Building2,
      number: "10+",
      label: "Cities",
      sub: "Metro & Tier-1 cities in India",
    },
    {
      icon: Landmark,
      number: "7+",
      label: "States",
      sub: "Rapidly expanding national network",
    },
  ];

  const cities = [
    "All", "Chennai", "Bengaluru", "Hyderabad", "Mumbai", "Delhi NCR", "Pune", "Kolkata", "Coimbatore", "Kochi"
  ];

  const kioskLocations = [
    { city: "Chennai", area: "Anna University Campus", type: "College", status: "Active 24/7" },
    { city: "Chennai", area: "TIDEL Park Phase 1", type: "IT Park", status: "Active 24/7" },
    { city: "Chennai", area: "Anna Nagar Tower Metro", type: "Metro", status: "Active 24/7" },
    { city: "Bengaluru", area: "Koramangala 5th Block", type: "Co-working", status: "Active 24/7" },
    { city: "Bengaluru", area: "Whitefield ITPL Main Hub", type: "IT Park", status: "Active 24/7" },
    { city: "Bengaluru", area: "Christ University Road", type: "College", status: "Active 24/7" },
    { city: "Hyderabad", area: "Hitec City Cyber Towers", type: "IT Park", status: "Active 24/7" },
    { city: "Hyderabad", area: "Gachibowli Stadium Hub", type: "Hostel Zone", status: "Active 24/7" },
    { city: "Mumbai", area: "Andheri Metro Station", type: "Metro", status: "Active 24/7" },
    { city: "Mumbai", area: "Bandra Kurla Complex (BKC)", type: "Corporate", status: "Active 24/7" },
    { city: "Pune", area: "Viman Nagar Symbiosis Walk", type: "College", status: "Active 24/7" },
    { city: "Delhi NCR", area: "Noida Sector 62 Knowledge Park", type: "Tech Hub", status: "Active 24/7" },
  ];

  const filteredKiosks = selectedCity === 'All' 
    ? kioskLocations 
    : kioskLocations.filter(k => k.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      {/* Pill Badge */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/30 text-[#0C3D97] text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#0C3D97]" />
          <span>Where To Find Us</span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-950 tracking-tight">
          Across India, <span className="text-[#0C3D97]">Growing Every Day</span>
        </h2>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          EasyXerox is rapidly expanding across cities and states, bringing self-service instant printing closer to where people need it most.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200/90 shadow-sm glass-card-hover flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0C3D97] mb-6">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-gray-950 mb-1 tracking-tight">
                  {stat.number}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{stat.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive City Filter & Live Kiosks list */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Find an EasyXerox Kiosk Near You</h3>
            <p className="text-xs text-gray-500">Live operational vending stations</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-[#0C3D97] font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 w-fit">
            <span className="w-2 h-2 rounded-full bg-[#0C3D97] animate-ping"></span>
            <span>All Machines Operational</span>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCity === city
                  ? 'bg-[#0C3D97] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Kiosks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredKiosks.map((kiosk, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex items-center justify-between hover:bg-white hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-[#0C3D97] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#0C3D97] transition-colors">{kiosk.area}</h4>
                  <p className="text-[10px] text-gray-500">{kiosk.city} • <span className="text-[#0C3D97] font-medium">{kiosk.type}</span></p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-[#0C3D97] bg-blue-100/60 px-2 py-0.5 rounded-full">
                {kiosk.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
