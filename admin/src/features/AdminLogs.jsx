import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/reports/activity-logs');
        if (res.data.success) setLogs(res.data.logs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <PortalLayout title="System Audit Logs">
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl text-slate-950">
          <h3 className="text-2xl font-black text-slate-950 font-heading mb-6 flex items-center gap-3 border-b border-blue-100 pb-4">
            <Activity className="w-7 h-7 text-blue-600" />
            <span>Security & System Action Audit Logs</span>
          </h3>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-between text-xs font-bold hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 font-black uppercase rounded-lg border border-blue-300">
                    {log.category}
                  </span>
                  <div>
                    <p className="font-black text-slate-950 text-sm">{log.action}</p>
                    <p className="text-slate-600 font-bold mt-0.5">By: {log.full_name || 'System'} ({log.email || 'Automated'})</p>
                  </div>
                </div>
                <span className="text-slate-600 font-mono font-bold">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminLogs;
