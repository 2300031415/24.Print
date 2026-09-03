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
    totalCustomersCount: 0
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

  // Fetch dashboard stats & recent transactions from live backend
  useEffect(() => {
    const fetchClientDashboard = async () => {
      try {
        const res = await api.get('/reports/client-dashboard');
        if (res.data.success) {
          setStats({
            totalMachines: res.data.stats?.totalMachines || 0,
            onlineMachines: res.data.stats?.onlineMachines || 0,
            totalEarnings: res.data.stats?.totalEarnings || 0,
            todayRevenue: res.data.stats?.todayRevenue || 0,
            monthlyRevenue: res.data.stats?.monthlyRevenue || 0,
            totalPagesPrinted: res.data.stats?.totalPagesPrinted || 0,
            totalCustomersCount: res.data.stats?.totalCustomersCount || 0
          });
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

  // 12-Month Data for Revenue Overview & Total Customers (Defaults to 0 for Clean Slate)
  useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    setMonthlyRevenueData(months.map(m => ({ month: m, value: 0 })));
    setMonthlyCustomerData(months.map(m => ({ month: m, value: 0 })));
  }, [selectedBoardId, machines, selectedYear]);

  // Filter transactions by selected board
  const filteredTxns = (selectedBoardId === 'ALL' || machines.length <= 1)
    ? recentTxns
    : recentTxns.filter(tx => String(tx.machine_id) === String(selectedBoardId) || tx.machine_name?.includes(selectedBoardId));

  const displayTodayRevenue = stats.todayRevenue || 0;
  const displayMonthlyRevenue = stats.monthlyRevenue || 0;
  const displayTotalCustomers = stats.totalCustomersCount || 0;
  const displayPagesPrinted = stats.totalPagesPrinted || 0;

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
              <option value="ALL">All Kiosk Boards</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.machine_code || m.name || 'Kiosk Board'}
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

          {/* Pages Printed */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Pages Printed</span>
            <h3 className="text-3xl font-black text-blue-600 mt-3 font-mono">
              {displayPagesPrinted.toLocaleString()} <span className="text-base text-slate-500">Pages</span>
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-2 flex items-center gap-1">
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Total Paper Sheets Printed</span>
            </p>
          </div>

        </div>

        {/* ──────────────────────────────────────────────────────────────
            REVENUE & CUSTOMER BAR CHARTS ROW (Side-by-Side)
        ────────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Revenue Overview Chart */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-950 font-heading">Revenue Overview</h3>
                <p className="text-xs font-bold text-slate-600 mt-1">Monthly performance tracking</p>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-50 border-2 border-blue-200 text-slate-950 text-xs font-black rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-600"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="relative pt-6 pb-2">
              <div className="flex h-64 items-end gap-2 sm:gap-3 justify-between px-2 border-b-2 border-slate-100">
                {monthlyRevenueData.map((item, idx) => {
                  const barHeight = maxRevenueVal > 0 ? (item.value / maxRevenueVal) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-full flex items-end relative overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${barHeight}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.04 }}
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg shadow-md group-hover:from-blue-500 group-hover:to-cyan-400 transition-all"
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Total Customers Chart */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-950 font-heading flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Total Customers</span>
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1">Monthly customer volume</p>
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-50 border-2 border-blue-200 text-slate-950 text-xs font-black rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-blue-600"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="relative pt-6 pb-2">
              <div className="flex h-64 items-end gap-2 sm:gap-3 justify-between px-2 border-b-2 border-slate-100">
                {monthlyCustomerData.map((item, idx) => {
                  const barHeight = maxCustomerVal > 0 ? (item.value / maxCustomerVal) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-full flex items-end relative overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${barHeight}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.04 }}
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg shadow-md group-hover:from-blue-500 group-hover:to-cyan-400 transition-all"
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ──────────────────────────────────────────────────────────────
            RECENT TRANSACTIONS TABLE
        ────────────────────────────────────────────────────────────── */}
        <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950 font-heading">Recent Kiosk Transactions</h3>
              <p className="text-xs font-bold text-slate-600 mt-1">Live payments captured across your active Xerox kiosks.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-[11px] font-black uppercase text-blue-700 tracking-wider bg-slate-50/80">
                  <th className="py-4 px-6 rounded-l-xl">Kiosk Machine</th>
                  <th className="py-4 px-6">Payment Method</th>
                  <th className="py-4 px-6">Your Commission Share</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 rounded-r-xl">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                {filteredTxns.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 font-extrabold text-sm">
                      No print transactions recorded yet for this client account.
                    </td>
                  </tr>
                ) : (
                  filteredTxns.map((tx) => (
                    <tr key={tx.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-6 font-black text-slate-950">
                        {tx.machine_name || tx.machine_code || 'Kiosk Board'}
                      </td>
                      <td className="py-4 px-6 uppercase text-slate-600">{tx.payment_method || 'UPI QR'}</td>
                      <td className="py-4 px-6 font-mono font-black text-emerald-600 text-sm">
                        ₹{parseFloat(tx.client_share || tx.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold uppercase">
                          {tx.status || 'settled'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-[11px]">
                        {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'Just Now'}
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
