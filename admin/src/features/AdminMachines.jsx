import React, { useEffect, useState } from 'react';
import { Monitor, Plus, QrCode, MapPin, Printer, Wifi, ShieldCheck, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const AdminMachines = () => {
  const [machines, setMachines] = useState([]);
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQrMachine, setSelectedQrMachine] = useState(null);

  const [formData, setFormData] = useState({
    machine_code: 'FFPVT_EasyXerox-002',
    name: 'Metro Station Entrance #2',
    client_id: '',
    location_address: 'Gate 2 Metro Complex',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    default_printer_name: 'Brother DCP-T820DW Printer'
  });

  const fetchData = async () => {
    try {
      const machRes = await api.get('/machines');
      if (machRes.data.success) setMachines(machRes.data.machines);

      const clientRes = await api.get('/clients');
      if (clientRes.data.success) {
        setClients(clientRes.data.clients);
        if (clientRes.data.clients.length > 0) {
          setFormData((prev) => ({ ...prev, client_id: clientRes.data.clients[0].id }));
        }
      }
    } catch (err) {
      console.error('Error loading machines:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/machines', formData);
      if (res.data.success) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering machine.');
    }
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    const publicDomain = import.meta.env.VITE_PUBLIC_DOMAIN || 'http://localhost:8501';
    const qrUrl = `${publicDomain}/upload/${selectedQrMachine.machine_code}`;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Kiosk QR Code - ${selectedQrMachine.machine_code}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .card { border: 3px solid #000; border-radius: 20px; padding: 30px; display: inline-block; }
            h1 { margin: 0 0 10px 0; font-size: 28px; }
            h2 { color: #0088cc; margin: 0 0 20px 0; font-size: 20px; }
            p { font-size: 14px; margin-top: 15px; color: #555; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="card">
            <h1>🖨️ SCAN TO PRINT</h1>
            <h2>${selectedQrMachine.name} (${selectedQrMachine.machine_code})</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}" width="250" height="250" />
            <p>Scan with Phone Camera or WhatsApp to Upload Document</p>
            <p><strong>${qrUrl}</strong></p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <PortalLayout title="Kiosk Machine Registry & QR Generator">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">Register new Windows 11 Touch Kiosks and generate unique machine QR codes.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow flex items-center gap-2 btn-touch text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Register New Kiosk</span>
          </button>
        </div>

        {/* MACHINES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div key={machine.id} className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                    {machine.machine_code}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    machine.status === 'online' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                  }`}>
                    {machine.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-heading mt-3">{machine.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{machine.location_address}, {machine.city}</span>
                </p>

                <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Partner Owner</span>
                    <span className="text-white font-semibold">{machine.client_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Default Printer</span>
                    <span className="text-cyan-400 font-mono">{machine.default_printer_name || 'Brother DCP-T820DW Printer'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Printed Jobs</span>
                    <span className="text-emerald-400 font-bold">{machine.total_jobs_printed || 0}</span>
                  </div>
                </div>
              </div>

              {/* View QR Code Button */}
              <button
                onClick={() => setSelectedQrMachine(machine)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 btn-touch"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>View & Print QR Code</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW QR MODAL */}
      {selectedQrMachine && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center">
            <button onClick={() => setSelectedQrMachine(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-white font-heading">{selectedQrMachine.name}</h3>
            <p className="text-xs text-cyan-400 font-mono mt-1 mb-4">{selectedQrMachine.machine_code}</p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl mb-4">
              <QRCodeSVG
                value={`${import.meta.env.VITE_PUBLIC_DOMAIN || 'http://localhost:8501'}/upload/${selectedQrMachine.machine_code}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Scan URL: <br />
              <span className="text-cyan-300 font-mono text-[11px]">{import.meta.env.VITE_PUBLIC_DOMAIN || 'http://localhost:8501'}/upload/{selectedQrMachine.machine_code}</span>
            </p>

            <button
              onClick={handlePrintQr}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-cyan-glow btn-touch"
            >
              <Printer className="w-4 h-4" />
              <span>Print QR Code Sticker</span>
            </button>
          </div>
        </div>
      )}

      {/* CREATE MACHINE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-white font-heading mb-6">Register New Kiosk Hardware</h3>

            <form onSubmit={handleCreateMachine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Machine Code</label>
                  <input
                    type="text"
                    required
                    value={formData.machine_code}
                    onChange={(e) => setFormData({ ...formData, machine_code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Select Client Owner</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.business_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Kiosk Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Location Address</label>
                <input
                  type="text"
                  required
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base mt-4"
              >
                Register & Generate QR
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default AdminMachines;
