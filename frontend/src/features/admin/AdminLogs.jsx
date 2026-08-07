import React, { useEffect, useState } from 'react';
import { History, Shield, Activity } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

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
    <PortalLayout title="System Audit Logs" role="admin">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white font-heading mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Security & System Action Audit Logs</span>
        </h3>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-cyan-950 text-cyan-400 font-bold uppercase rounded-lg border border-cyan-800">
                  {log.category}
                </span>
                <div>
                  <p className="font-bold text-white text-sm">{log.action}</p>
                  <p className="text-slate-400 mt-0.5">By: {log.full_name || 'System'} ({log.email || 'Automated'})</p>
                </div>
              </div>
              <span className="text-slate-500 font-mono">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminLogs;
