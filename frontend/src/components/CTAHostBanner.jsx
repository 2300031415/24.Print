import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function CTAHostBanner({ onOpenFranchise }) {
  return (
    <section className="pt-4 pb-2 px-4 max-w-5xl mx-auto">
      <div className="bg-[#0d0d0d] rounded-2xl sm:rounded-3xl overflow-hidden text-white relative shadow-xl border border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          
          {/* Left Text */}
          <div className="p-6 sm:p-8 md:col-span-7 lg:col-span-8 z-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
              Want to offer <span className="text-blue-400">24/7</span> printing to students, employees, or visitors?
            </h2>
            
            <p className="mt-2.5 text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-lg">
              Host an EasyXerox smart touchscreen kiosk in your college campus, hostel, co-working space, hospital, or tech park with zero overhead.
            </p>

            <div className="mt-5">
              <button
                onClick={onOpenFranchise}
                className="px-6 py-2.5 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-xs sm:text-sm inline-flex items-center space-x-2 brand-glow transition-all transform hover:scale-105"
              >
                <span>Request Installation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="md:col-span-5 lg:col-span-4 h-48 sm:h-56 md:h-full min-h-[190px] relative flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
              alt="Happy customer using mobile print"
              className="w-full h-full object-cover object-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0d0d0d] md:via-transparent md:to-transparent"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
