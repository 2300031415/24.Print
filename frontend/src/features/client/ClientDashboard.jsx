import React, { useEffect, useState } from 'react';
import { DollarSign, Monitor, TrendingUp, Calendar, Printer } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    totalMachines: 0,
    onlineMachines: 0,
    totalEarnings: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    totalPagesPrinted: 0
  });
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDashboard = async () => {
      try {
        const res = await api.get('/reports/client-dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentTxns(res.data.recentTransactions);
        }
      } catch (err) {
        console.error('Error fetching client dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClientDashboard();

    // Live Auto-Refresh every 5 seconds
    const interval = setInterval(fetchClientDashboard, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <PortalLayout title="Client Partner Revenue Dashboard" role="client">
      <div className="space-y-8">
        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Today's Revenue</span>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-3 font-mono">
              ₹{(stats?.todayRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-2">Client Net Earnings Today</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monthly Revenue</span>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-3 font-mono">
              ₹{(stats?.monthlyRevenue || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-2">This Month's Settlement</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">My Kiosks</span>
            <h3 className="text-3xl font-extrabold text-white mt-3 font-mono">
              {stats?.onlineMachines || 0} / {stats?.totalMachines || 0}
            </h3>
            <p className="text-xs text-emerald-400 mt-2 font-semibold">Online & Operational</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pages Printed</span>
            <h3 className="text-3xl font-extrabold text-indigo-400 mt-3 font-mono">
              {(stats?.totalPagesPrinted || 0).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-2">Total Pages Printed</p>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white font-heading mb-4">Recent Earning Transactions</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Kiosk Name</th>
                  <th className="py-3.5 px-4">Gross Customer Paid</th>
                  <th className="py-3.5 px-4">GST Tax</th>
                  <th className="py-3.5 px-4">Your Net Share</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(recentTxns || []).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white">{tx.machine_name}</td>
                    <td className="py-3.5 px-4 font-mono">₹{tx.gross_amount}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-mono">₹{tx.gst_amount}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{tx.client_share}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ClientDashboard;
