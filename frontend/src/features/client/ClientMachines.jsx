import React, { useEffect, useState } from 'react';
import { Monitor, Printer, QrCode, MapPin } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientMachines = () => {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const fetchClientMachines = async () => {
      try {
        const res = await api.get('/machines');
        if (res.data.success) setMachines(res.data.machines);
      } catch (err) {
        console.error('Error fetching client machines:', err);
      }
    };
    fetchClientMachines();
  }, []);

  return (
    <PortalLayout title="My Registered Kiosks & Printers" role="client">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <div key={machine.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                {machine.machine_code}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                machine.status === 'online' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {machine.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-heading">{machine.name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{machine.location_address}</span>
            </p>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Printer Status</span>
                <span className="text-emerald-400 font-bold capitalize">{machine.printer_status || 'ready'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Printer Model</span>
                <span className="text-white font-mono">{machine.default_printer_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
};

export default ClientMachines;
