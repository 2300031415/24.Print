import React, { useEffect, useState } from 'react';
import { DollarSign, FileText } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientTransactions = () => {
  const [printJobs, setPrintJobs] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/print/history');
        if (res.data.success) setPrintJobs(res.data.printJobs);
      } catch (err) {
        console.error('Error fetching print jobs:', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <PortalLayout title="Client Print History & Earnings" role="client">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Kiosk Code</th>
                <th className="py-3.5 px-4">Filename</th>
                <th className="py-3.5 px-4">Copies</th>
                <th className="py-3.5 px-4">Pages</th>
                <th className="py-3.5 px-4">Gross Revenue</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {printJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-bold text-white">{job.machine_code}</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-medium truncate max-w-[200px]">{job.original_filename}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{job.copies}</td>
                  <td className="py-3.5 px-4">{job.total_pages}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{job.total_amount}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold">
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
    </PortalLayout>
  );
};

export default ClientTransactions;
