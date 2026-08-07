import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Monitor, DollarSign, Printer, ArrowUpRight, TrendingUp, Tv, Clock } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalMachines: 0,
    onlineMachines: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalPagesPrinted: 0,
    pendingAdsCount: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/reports/admin-dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentJobs(res.data.recentJobs);
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <PortalLayout title="Super Admin Dashboard" role="admin">
      <div className="space-y-8">
        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Revenue */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</span>
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-4 font-mono">
              ₹{stats.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Today: ₹{stats.todayRevenue.toLocaleString()}
            </p>
          </div>

          {/* Card 2: Kiosk Machines */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Kiosks</span>
              <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
                <Monitor className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-4 font-mono">
              {stats.onlineMachines} / {stats.totalMachines}
            </h3>
            <p className="text-xs text-cyan-400 font-semibold mt-2">
              Online Hardware Pings Active
            </p>
          </div>

          {/* Card 3: Pages Printed */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pages Printed</span>
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <Printer className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-4 font-mono">
              {stats.totalPagesPrinted.toLocaleString()}
            </h3>
            <p className="text-xs text-indigo-400 font-semibold mt-2">
              Pages Delivered Silently
            </p>
          </div>

          {/* Card 4: Registered Clients */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Shops</span>
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-4 font-mono">
              {stats.totalClients}
            </h3>
            <p className="text-xs text-purple-400 font-semibold mt-2">
              {stats.pendingAdsCount} Ads Pending Review
            </p>
          </div>
        </div>

        {/* RECENT PRINT TRANSACTIONS TABLE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white font-heading">
              Recent Kiosk Print Activity
            </h3>
            <span className="text-xs text-slate-400">Live Hardware Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Kiosk Name</th>
                  <th className="py-3.5 px-4">Filename</th>
                  <th className="py-3.5 px-4">Copies</th>
                  <th className="py-3.5 px-4">Pages</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="py-3.5 px-4 font-bold text-white">{job.machine_name}</td>
                      <td className="py-3.5 px-4 text-cyan-400 font-medium truncate max-w-[200px]">
                        {job.original_filename}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{job.copies}</td>
                      <td className="py-3.5 px-4">{job.total_pages}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{job.total_amount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          job.status === 'completed'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500">
                      No print transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
