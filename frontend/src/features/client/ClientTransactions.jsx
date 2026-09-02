import React, { useEffect, useState } from 'react';
import { Monitor, DollarSign, FileText, Printer, Filter, Calendar } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientTransactions = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, machinesRes] = await Promise.all([
          api.get('/print/history'),
          api.get('/machines')
        ]);

        if (jobsRes.data.success) {
          setPrintJobs(jobsRes.data.printJobs || []);
        }
        if (machinesRes.data.success) {
          setMachines(machinesRes.data.machines || []);
        }
      } catch (err) {
        console.error('Error fetching transactions history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter jobs by selected kiosk machine board
  const filteredJobs = selectedMachineId === 'ALL'
    ? printJobs
    : printJobs.filter(job => job.machine_id === selectedMachineId || job.machine_code === selectedMachineId);

  // Compute Revenue & Metrics for Selected Board Filter
  const totalFilteredRevenue = filteredJobs.reduce((acc, job) => acc + (parseFloat(job.total_amount) || 0), 0);
  const totalFilteredPages = filteredJobs.reduce((acc, job) => acc + (parseInt(job.total_pages) || 0) * (parseInt(job.copies) || 1), 0);

  return (
    <PortalLayout title="Client Print History & Board Revenue" role="client">
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        
        {/* TOP FILTER & BOARD SELECTION BAR */}
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-slate-950 font-heading flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Kiosk Board Earning Statements
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-1">
              Select a specific kiosk board below to filter its individual print transactions and revenue breakdown.
            </p>
          </div>

          {/* Kiosk Board Selector Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <Filter className="w-4 h-4 text-blue-600" />
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="bg-slate-50 border-2 border-blue-200 text-blue-900 text-sm font-black rounded-xl px-4 py-3 outline-none focus:border-blue-600 cursor-pointer shadow-sm"
            >
              <option value="ALL">🌐 All Kiosk Boards (Combined Revenue)</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  🖥️ {m.name} ({m.machine_code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS FOR SELECTED BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Selected Board Earnings</span>
            <h3 className="text-3xl font-black text-emerald-600 mt-2 font-mono">
              ₹{totalFilteredRevenue.toFixed(2)}
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1">Gross Customer Collections</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Pages Delivered</span>
            <h3 className="text-3xl font-black text-blue-600 mt-2 font-mono">
              {totalFilteredPages.toLocaleString()} Pages
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1">Total Paper Sheets Printed</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md hover:border-blue-500 transition-all">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Completed Print Orders</span>
            <h3 className="text-3xl font-black text-indigo-600 mt-2 font-mono">
              {filteredJobs.length} Transactions
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-1">Total Customer Print Sessions</p>
          </div>
        </div>

        {/* DETAILED TRANSACTIONS TABLE */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-black text-slate-950 font-heading mb-4 flex items-center justify-between">
            <span>Transaction Logs</span>
            <span className="text-xs font-bold text-slate-600">
              Showing {filteredJobs.length} print records
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="bg-blue-50/80 text-xs uppercase font-black text-blue-900 border-b border-blue-200">
                <tr>
                  <th className="py-3.5 px-4">Kiosk Board Name</th>
                  <th className="py-3.5 px-4">Document Filename</th>
                  <th className="py-3.5 px-4">Copies</th>
                  <th className="py-3.5 px-4">Pages</th>
                  <th className="py-3.5 px-4">Gross Revenue</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 font-bold">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-slate-500 text-sm font-bold">
                      No print transactions found for the selected kiosk board.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-950">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <p className="text-sm font-black text-slate-950">{job.machine_name || 'Connaught Place Kiosk #1'}</p>
                            <span className="text-[10px] font-mono text-blue-700 uppercase font-black">{job.machine_code || 'KIOSK-001'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-blue-700 font-bold truncate max-w-[200px]" title={job.original_filename}>
                        {job.original_filename}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-950">{job.copies || 1}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-800">{job.total_pages || 1}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-emerald-600">₹{job.total_amount || 0}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black capitalize">
                          {job.status || 'completed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        {new Date(job.created_at || Date.now()).toLocaleString()}
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

export default ClientTransactions;
