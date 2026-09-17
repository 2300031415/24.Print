import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';

export default function ROICalculator({ onOpenFranchise }) {
  const [dailyPages, setDailyPages] = useState(350);
  const [colorRatio, setColorRatio] = useState(20); // 20% color, 80% bw

  // Pricing assumptions:
  // B&W sale: ₹2.50, cost: ₹0.60 -> Margin ₹1.90
  // Color sale: ₹10.00, cost: ₹2.50 -> Margin ₹7.50
  const bwPages = Math.round(dailyPages * (1 - colorRatio / 100));
  const colorPages = Math.round(dailyPages * (colorRatio / 100));

  const dailyRevenue = (bwPages * 2.5) + (colorPages * 10);
  const dailyCost = (bwPages * 0.6) + (colorPages * 2.5);
  const dailyProfit = dailyRevenue - dailyCost;

  const monthlyProfit = Math.round(dailyProfit * 30);
  const annualProfit = Math.round(monthlyProfit * 12);
  const machineCost = 140000; // EasyXerox MINI base
  const paybackMonths = (machineCost / monthlyProfit).toFixed(1);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#041639] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-neutral-800 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0C3D97]/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive ROI & Earnings Simulator</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Calculate Your <span className="text-blue-400">Passive Monthly Profit</span>
            </h2>

            <p className="text-sm text-gray-300">
              Adjust estimated daily footfall and document volume to calculate your net earnings from an EasyXerox kiosk.
            </p>

            {/* Slider 1: Daily Pages */}
            <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Estimated Prints Per Day
                </span>
                <span className="text-xl font-black text-blue-400 font-mono">
                  {dailyPages} pages
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={dailyPages}
                onChange={(e) => setDailyPages(Number(e.target.value))}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#0C3D97]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>50 / day (Low Footfall)</span>
                <span>500 / day (Campus)</span>
                <span>1500 / day (Metro/HQ)</span>
              </div>
            </div>

            {/* Slider 2: Color Mix % */}
            <div className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Color Print Share
                </span>
                <span className="text-xl font-black text-blue-400 font-mono">
                  {colorRatio}% Color
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={colorRatio}
                onChange={(e) => setColorRatio(Number(e.target.value))}
                className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#0C3D97]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>5% (Mostly Text)</span>
                <span>20% (Typical)</span>
                <span>60% (Projects/Photos)</span>
              </div>
            </div>
          </div>

          {/* Right Output Box */}
          <div className="lg:col-span-5 bg-neutral-900/95 border-2 border-blue-500/40 rounded-3xl p-7 shadow-2xl flex flex-col justify-between space-y-6 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="text-xs text-gray-400 uppercase font-bold">Estimated Net Profit</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono font-bold">
                  PASSIVE INCOME
                </span>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-1">Monthly Net Earnings:</span>
                <div className="text-4xl sm:text-5xl font-black text-blue-400 tracking-tight">
                  ₹{monthlyProfit.toLocaleString('en-IN')}
                  <span className="text-xs text-gray-400 font-normal ml-1">/ month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/60">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Annual Profit</span>
                  <span className="text-lg font-black text-white">₹{annualProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/60">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Payback Period</span>
                  <span className="text-lg font-black text-blue-400">~{paybackMonths} Months</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-gray-400 pt-1">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Calculated after paper and toner cost</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>Zero staff salary expenses</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenFranchise}
              className="w-full py-3.5 rounded-full bg-[#0C3D97] hover:bg-[#082e75] text-white font-bold text-sm flex items-center justify-center space-x-2 brand-glow transition-all transform hover:scale-[1.02]"
            >
              <span>Apply for Franchise in My City</span>
              <span>→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
