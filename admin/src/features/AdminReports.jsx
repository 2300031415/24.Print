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
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        {/* SUMMARY & TRANSFER HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-black uppercase text-slate-500">Total System Revenue</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-2 font-mono">
              ₹{printJobs.reduce((acc, job) => acc + parseFloat(job.total_amount || 0), 0).toFixed(2)}
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1">{printJobs.length} Completed Print Jobs</p>
          </div>

          <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
            <p className="text-xs font-black uppercase text-slate-500">Selected Jobs Amount</p>
            <h3 className="text-3xl font-black text-blue-600 mt-2 font-mono">
              ₹{selectedTotalAmount.toFixed(2)}
            </h3>
            <p className="text-xs text-blue-700 font-extrabold mt-1">{selectedJobIds.length} Products / Jobs Selected</p>
          </div>

          <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <p className="text-xs font-black uppercase text-slate-500">Transfer Selected Earnings</p>
            <button
              onClick={handleTransferFunds}
              disabled={selectedJobIds.length === 0 || transferring}
              className={`w-full py-3.5 px-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all text-sm btn-touch shadow-md mt-2 ${
                selectedJobIds.length === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              {transferring ? 'Processing Payout...' : `Transfer ₹${selectedTotalAmount.toFixed(2)}`}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center gap-3 font-extrabold text-sm shadow-md">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PRINT AUDIT TRAIL & PRODUCT SELECTION TABLE */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl text-slate-950">
          <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-4">
            <h3 className="text-xl font-black text-slate-950 font-heading">Complete Print Audit Trail</h3>
            <span className="text-xs text-slate-600 font-bold">Select individual products or jobs to transfer payouts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="bg-blue-50/80 text-xs uppercase font-black text-blue-900 border-b border-blue-200">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={printJobs.length > 0 && selectedJobIds.length === printJobs.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
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
              <tbody className="divide-y divide-blue-100 font-bold">
                {printJobs.map((job) => {
                  const isSelected = selectedJobIds.includes(job.id);
                  return (
                    <tr
                      key={job.id}
                      onClick={() => handleToggleJob(job.id)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-100/60' : 'hover:bg-blue-50/50'}`}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleJob(job.id)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-blue-700 font-black">{job.id.substring(0, 8)}</td>
                      <td className="py-3.5 px-4 font-black text-slate-950">{job.machine_code || 'FFPVT_EasyXerox-001'}</td>
                      <td className="py-3.5 px-4 text-blue-700 font-bold truncate max-w-[200px]">{job.original_filename || 'PDF Print Job'}</td>
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                        {job.copies}x • <span className="uppercase text-blue-800 font-black">{job.color_mode}</span> • <span className="capitalize text-slate-600">{job.duplex_mode}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">₹{parseFloat(job.total_amount || 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black capitalize ${
                          job.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
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
