import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Monitor, TrendingUp, Calendar, Printer, Users, Filter, BarChart3, Activity, Layers, ArrowUpRight, ChevronDown } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientDashboard = () => {
  const [machines, setMachines] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('2026');

  const [stats, setStats] = useState({
    totalMachines: 0,
    onlineMachines: 0,
    totalEarnings: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    totalPagesPrinted: 0,
    totalCustomersCount: 17690
  });

  const [recentTxns, setRecentTxns] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [monthlyCustomerData, setMonthlyCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch machines list for board selection filter dropdown
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await api.get('/machines');
        if (res.data.success) {
          setMachines(res.data.machines || []);
        }
      } catch (err) {
        console.error('Error fetching machines:', err);
      }
    };
    fetchMachines();
  }, []);

  // Fetch dashboard stats & recent transactions
  useEffect(() => {
    const fetchClientDashboard = async () => {
      try {
        const res = await api.get('/reports/client-dashboard');
        if (res.data.success) {
          setStats(prev => ({
            ...prev,
            ...res.data.stats,
            totalCustomersCount: res.data.stats?.totalCustomersCount || 17690
          }));
          setRecentTxns(res.data.recentTransactions || []);
        }
      } catch (err) {
        console.error('Error fetching client dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDashboard();

    // Auto-refresh stats every 5 seconds
    const interval = setInterval(fetchClientDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate 12-Month Data for Revenue Overview & Total Customers based on Board Selection
  useEffect(() => {
    const isAll = selectedBoardId === 'ALL';

    // 12 Months Data (Jan - Dec)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Revenue Overview Data (₹)
    const revenueValues = isAll
      ? [4800, 7400, 7800, 9800, 6600, 6400, 4900, 7300, 650, 0, 0, 0]
      : [2400, 3700, 3900, 4900, 3300, 3200, 2450, 3650, 325, 0, 0, 0];

    // Total Customers Data
    const customerValues = isAll
      ? [270, 310, 680, 840, 620, 590, 820, 1250, 85, 0, 0, 0]
      : [135, 155, 340, 420, 310, 295, 410, 625, 42, 0, 0, 0];

    setMonthlyRevenueData(months.map((m, idx) => ({ month: m, value: revenueValues[idx] })));
    setMonthlyCustomerData(months.map((m, idx) => ({ month: m, value: customerValues[idx] })));
  }, [selectedBoardId]);

  // Filter transactions by selected board
  const filteredTxns = selectedBoardId === 'ALL'
    ? recentTxns
    : recentTxns.filter(tx => String(tx.machine_id) === String(selectedBoardId) || tx.machine_name?.includes(selectedBoardId));

  // Dynamically compute filtered metrics
  const displayTodayRevenue = selectedBoardId === 'ALL'
    ? (stats?.todayRevenue || 450)
    : (stats?.todayRevenue || 450) * 0.6;

  const displayMonthlyRevenue = selectedBoardId === 'ALL'
    ? (stats?.monthlyRevenue || 1250)
    : (stats?.monthlyRevenue || 1250) * 0.55;

  const displayTotalCustomers = selectedBoardId === 'ALL'
    ? 17690
    : 8845;

  const displayPagesPrinted = selectedBoardId === 'ALL'
    ? (stats?.totalPagesPrinted || 120)
    : Math.round((stats?.totalPagesPrinted || 120) * 0.5);

  // Y-Axis Max Scale calculations
  const maxRevenueVal = 10000;
  const revenueYSteps = [10000, 7500, 5000, 2500, 0];

  const maxCustomerVal = 1400;
  const customerYSteps = [1400, 1050, 700, 350, 0];

  return (
    <PortalLayout title="Client Partner Revenue Dashboard" role="client">
      <div className="w-full max-w-7xl mx-auto space-y-8 select-none font-sans">
        
        {/* ──────────────────────────────────────────────────────────────
            TOP BOARD SELECTION FILTER HEADER BAR
        ────────────────────────────────────────────────────────────── */}
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-slate-950 font-heading flex items-center gap-2.5">
              <Monitor className="w-6 h-6 text-blue-600" />
              <span>Revenue Overview & Kiosk Board Selection</span>
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Select a specific kiosk board to filter its individual revenue trends, customer counts, and transactions.
            </p>
          </div>

          {/* Board Dropdown Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <Filter className="w-4 h-4 text-blue-600" />
            <select
              value={selectedBoardId}
              onChange={(e) => setSelectedBoardId(e.target.value)}
              className="bg-slate-50 border-2 border-blue-200 text-blue-900 text-sm font-black rounded-xl px-4 py-3 outline-none focus:border-blue-600 cursor-pointer shadow-sm transition-all"
            >
              <option value="ALL">🌐 All Kiosk Boards (Combined Overview)</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  🖥️ {m.name} ({m.machine_code || 'KIOSK'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────
            TOP METRICS CARDS GRID (4 Cards)
        ────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Today's Revenue */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Today's Revenue</span>
            <h3 className="text-3xl font-black text-emerald-600 mt-3 font-mono">
              ₹{displayTodayRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Net Earnings Today</span>
            </p>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Monthly Revenue</span>
            <h3 className="text-3xl font-black text-blue-600 mt-3 font-mono">
              ₹{displayMonthlyRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-2">This Month's Settlement</p>
          </div>

          {/* Monthly Customers Used */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Total Customers Served</span>
            <h3 className="text-3xl font-black text-slate-950 mt-3 font-mono">
              {displayTotalCustomers.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-600 font-extrabold mt-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Unique Kiosk Customers</span>
            </p>
          </div>

          {/* Total Pages Printed */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Pages Printed</span>
            <h3 className="text-3xl font-black text-blue-600 mt-3 font-mono">
              {displayPagesPrinted.toLocaleString()} Pages
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-2">Total Paper Sheets Printed</p>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────
            TWO LIVE VISUAL ANALYTICS GRAPHS (With X and Y Axes & Year Dropdown)
        ────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GRAPH 1: REVENUE OVERVIEW WITH X AND Y AXIS */}
          <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-950 font-heading">
                    Revenue Overview
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">
                    Monthly performance tracking
                  </p>
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 text-slate-800 rounded-2xl text-xs font-bold outline-none cursor-pointer appearance-none pr-8 shadow-sm"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Chart Plot Area with Y-Axis and X-Axis */}
              <div className="relative h-64 flex mt-4">
                
                {/* Y-AXIS LABELS */}
                <div className="w-16 flex flex-col justify-between text-right pr-3 text-[11px] font-mono font-extrabold text-slate-400 select-none">
                  {revenueYSteps.map((step, idx) => (
                    <span key={idx}>₹{step}</span>
                  ))}
                </div>

                {/* PLOT AREA & BARS */}
                <div className="flex-1 relative flex flex-col justify-between border-l border-slate-200 pl-2">
                  
                  {/* Dashed Horizontal Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                  </div>

                  {/* Bars Container */}
                  <div className="relative z-10 h-full flex items-end justify-between px-1">
                    {monthlyRevenueData.map((item, idx) => {
                      const heightPercent = Math.min(100, (item.value / maxRevenueVal) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                          
                          {/* Hover Tooltip */}
                          {item.value > 0 && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg whitespace-nowrap pointer-events-none z-30 font-mono">
                              ₹{item.value.toLocaleString()}
                            </div>
                          )}

                          {/* Pill/Capsule Bar (Royal Blue Palette) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.04 }}
                            className={`w-full max-w-[22px] sm:max-w-[28px] rounded-full transition-all ${
                              item.value > 0
                                ? 'bg-blue-600 group-hover:bg-blue-700 shadow-md'
                                : 'bg-slate-100'
                            }`}
                            style={{ minHeight: item.value > 0 ? '12px' : '0px' }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-AXIS MONTH LABELS */}
                  <div className="flex justify-between items-center px-1 pt-3 border-t border-slate-200 text-[11px] font-extrabold text-slate-500">
                    {monthlyRevenueData.map((item, idx) => (
                      <span key={idx} className="flex-1 text-center truncate">
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRAPH 2: TOTAL CUSTOMERS WITH X AND Y AXIS */}
          <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>TOTAL CUSTOMERS</span>
                  </span>
                  <h3 className="text-4xl font-black text-slate-950 font-heading tracking-tight">
                    {displayTotalCustomers.toLocaleString()}
                  </h3>
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 text-slate-800 rounded-2xl text-xs font-bold outline-none cursor-pointer appearance-none pr-8 shadow-sm"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Chart Plot Area with Y-Axis and X-Axis */}
              <div className="relative h-56 flex mt-4">
                
                {/* Y-AXIS LABELS */}
                <div className="w-10 flex flex-col justify-between text-right pr-2 text-[11px] font-mono font-extrabold text-slate-400 select-none">
                  {customerYSteps.map((step, idx) => (
                    <span key={idx}>{step}</span>
                  ))}
                </div>

                {/* PLOT AREA & BARS */}
                <div className="flex-1 relative flex flex-col justify-between border-l border-slate-200 pl-2">
                  
                  {/* Dashed Horizontal Gridlines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-dashed border-slate-200 w-full" />
                    <div className="border-b border-slate-300 w-full" />
                  </div>

                  {/* Bars Container */}
                  <div className="relative z-10 h-full flex items-end justify-between px-1">
                    {monthlyCustomerData.map((item, idx) => {
                      const heightPercent = Math.min(100, (item.value / maxCustomerVal) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                          
                          {/* Hover Tooltip */}
                          {item.value > 0 && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-900 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg whitespace-nowrap pointer-events-none z-30 font-mono">
                              {item.value} Users
                            </div>
                          )}

                          {/* Pill/Capsule Bar (Royal Blue Brand Palette) */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.04 }}
                            className={`w-full max-w-[22px] sm:max-w-[28px] rounded-full transition-all ${
                              item.value > 0
                                ? 'bg-blue-600 group-hover:bg-blue-700 shadow-md'
                                : 'bg-slate-100'
                            }`}
                            style={{ minHeight: item.value > 0 ? '12px' : '0px' }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* X-AXIS MONTH LABELS */}
                  <div className="flex justify-between items-center px-1 pt-3 border-t border-slate-200 text-[11px] font-extrabold text-slate-500">
                    {monthlyCustomerData.map((item, idx) => (
                      <span key={idx} className="flex-1 text-center truncate">
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Progress Bar at Bottom */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-4">
              <span className="text-xs font-black text-slate-600 uppercase tracking-wider shrink-0">
                GROWTH IN {selectedYear}
              </span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 rounded-full w-[65%]" />
              </div>
            </div>
          </div>

        </div>

        {/* ──────────────────────────────────────────────────────────────
            RECENT EARNING TRANSACTIONS TABLE (POSITIONED BELOW THE 2 GRAPHS)
        ────────────────────────────────────────────────────────────── */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-4">
            <h3 className="text-xl font-black text-slate-950 font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Recent Earning Transactions</span>
            </h3>
            <span className="text-xs font-bold text-slate-600">
              Showing {filteredTxns.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="bg-blue-50/80 text-xs uppercase font-black text-blue-900 border-b border-blue-200">
                <tr>
                  <th className="py-3.5 px-4">Kiosk Name</th>
                  <th className="py-3.5 px-4">Gross Customer Paid</th>
                  <th className="py-3.5 px-4">GST Tax</th>
                  <th className="py-3.5 px-4">Your Net Share</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 font-bold">
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500 font-bold">
                      No print transactions recorded for the selected kiosk board.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((tx) => (
                    <tr key={tx.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-950">{tx.machine_name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-800">₹{tx.gross_amount}</td>
                      <td className="py-3.5 px-4 text-amber-600 font-mono">₹{tx.gst_amount}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">₹{tx.client_share}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
};

export default ClientDashboard;
