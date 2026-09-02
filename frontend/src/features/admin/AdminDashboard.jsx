import React, { useEffect, useState } from 'react';
import { Users, Monitor, DollarSign, Printer, TrendingUp } from 'lucide-react';

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
      <div className="w-full max-w-7xl mx-auto space-y-8 select-none font-sans">
        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Revenue */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Gross Platform Revenue</span>
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-emerald-600 mt-4 font-mono">
              ₹{(stats?.totalRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-700 font-extrabold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Today: ₹{(stats?.todayRevenue || 0).toLocaleString()}
            </p>
          </div>

          {/* Card 2: Kiosk Machines */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Active Kiosks</span>
              <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl border border-blue-200">
                <Monitor className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-950 mt-4 font-mono">
              {stats?.onlineMachines || 0} / {stats?.totalMachines || 0}
            </h3>
            <p className="text-xs text-blue-700 font-extrabold mt-2">
              Online Hardware Pings Active
            </p>
          </div>

          {/* Card 3: Pages Printed */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Pages Printed</span>
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl border border-indigo-200">
                <Printer className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-indigo-600 mt-4 font-mono">
              {(stats?.totalPagesPrinted || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-indigo-700 font-extrabold mt-2">
              Pages Delivered Silently
            </p>
          </div>

          {/* Card 4: Registered Clients */}
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Client Shops</span>
              <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl border border-purple-200">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-purple-600 mt-4 font-mono">
              {stats.totalClients}
            </h3>
            <p className="text-xs text-purple-700 font-extrabold mt-2">
              Active Xerox Partners
            </p>
          </div>
        </div>

        {/* RECENT PRINT TRANSACTIONS TABLE */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-4">
            <h3 className="text-xl font-black text-slate-950 font-heading">
              Recent Kiosk Print Activity
            </h3>
            <span className="text-xs font-bold text-slate-600">Live Hardware Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="bg-blue-50/80 text-xs uppercase font-black text-blue-900 border-b border-blue-200">
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
              <tbody className="divide-y divide-blue-100 font-bold">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-950">{job.machine_name}</td>
                      <td className="py-3.5 px-4 text-blue-700 font-bold truncate max-w-[200px]">
                        {job.original_filename}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-950">{job.copies}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-800">{job.total_pages}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">₹{job.total_amount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          job.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500 font-bold">
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
