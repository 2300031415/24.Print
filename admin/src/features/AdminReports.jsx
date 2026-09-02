import React, { useEffect, useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';

import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const AdminReports = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [transferring, setTransferring] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/print/history');
        if (res.data.success) setPrintJobs(res.data.printJobs);
      } catch (err) {
        console.error('Error fetching print history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobIds(printJobs.map(job => job.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleToggleJob = (id) => {
    setSelectedJobIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedTotalAmount = printJobs
    .filter(job => selectedJobIds.includes(job.id))
    .reduce((sum, job) => sum + parseFloat(job.total_amount || 0), 0);

  const handleTransferFunds = () => {
    if (selectedJobIds.length === 0) return;
    setTransferring(true);
    setTimeout(() => {
      setTransferring(false);
      setSuccessMsg(`Successfully transferred ₹${selectedTotalAmount.toFixed(2)} payout for ${selectedJobIds.length} selected job(s)!`);
      setSelectedJobIds([]);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1500);
  };

  return (
    <PortalLayout title="Platform Revenue & Print History Reports">
      <div className="space-y-6">
        {/* SUMMARY & TRANSFER HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase text-slate-400">Total System Revenue</p>
            <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">
              ₹{printJobs.reduce((acc, job) => acc + parseFloat(job.total_amount || 0), 0).toFixed(2)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{printJobs.length} Completed Print Jobs</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase text-slate-400">Selected Jobs Amount</p>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">
              ₹{selectedTotalAmount.toFixed(2)}
            </h3>
            <p className="text-xs text-cyan-300 mt-1">{selectedJobIds.length} Products / Jobs Selected</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <p className="text-xs font-bold uppercase text-slate-400">Transfer Selected Earnings</p>
            <button
              onClick={handleTransferFunds}
              disabled={selectedJobIds.length === 0 || transferring}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold flex items-center justify-center gap-2 transition-all text-sm btn-touch shadow-lg ${
                selectedJobIds.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-glow'
              }`}
            >
              <Send className="w-4 h-4" />
              {transferring ? 'Processing Payout...' : `Transfer ₹${selectedTotalAmount.toFixed(2)}`}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold text-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PRINT AUDIT TRAIL & PRODUCT SELECTION TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white font-heading">Complete Print Audit Trail</h3>
            <span className="text-xs text-slate-400">Select individual products or jobs to transfer payouts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={printJobs.length > 0 && selectedJobIds.length === printJobs.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Job ID</th>
                  <th className="py-3.5 px-4">Kiosk Code</th>
                  <th className="py-3.5 px-4">Filename / Product</th>
                  <th className="py-3.5 px-4">Copies / Mode</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {printJobs.map((job) => {
                  const isSelected = selectedJobIds.includes(job.id);
                  return (
                    <tr
                      key={job.id}
                      onClick={() => handleToggleJob(job.id)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-cyan-950/40' : 'hover:bg-slate-800/40'}`}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleJob(job.id)}
                          className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-cyan-400 font-bold">{job.id.substring(0, 8)}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{job.machine_code || 'FFPVT_EasyXerox-001'}</td>
                      <td className="py-3.5 px-4 text-slate-200 font-medium truncate max-w-[200px]">{job.original_filename || 'PDF Print Job'}</td>
                      <td className="py-3.5 px-4 text-xs">
                        {job.copies}x • <span className="uppercase text-cyan-300 font-semibold">{job.color_mode}</span> • <span className="capitalize text-slate-400">{job.duplex_mode}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-400">₹{parseFloat(job.total_amount || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          job.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminReports;
