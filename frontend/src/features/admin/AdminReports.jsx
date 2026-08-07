import React, { useEffect, useState } from 'react';
import { BarChart3, Download, Calendar } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminReports = () => {
  const [printJobs, setPrintJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <PortalLayout title="Platform Revenue & Print History Reports" role="admin">
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white font-heading mb-4">Complete Print Audit Trail</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Job ID</th>
                  <th className="py-3.5 px-4">Kiosk Code</th>
                  <th className="py-3.5 px-4">Filename</th>
                  <th className="py-3.5 px-4">Copies / Mode</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {printJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono text-xs text-cyan-400 font-bold">{job.id.substring(0, 8)}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{job.machine_code}</td>
                    <td className="py-3.5 px-4 text-slate-300 truncate max-w-[200px]">{job.original_filename}</td>
                    <td className="py-3.5 px-4 text-xs">
                      {job.copies}x • <span className="uppercase text-cyan-300">{job.color_mode}</span> • <span className="capitalize text-slate-400">{job.duplex_mode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{job.total_amount}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminReports;
