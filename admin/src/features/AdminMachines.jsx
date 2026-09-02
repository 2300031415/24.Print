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
    name: 'FFPVT_EasyXerox-002',
    client_id: '',
    location_address: 'Metro Station Entrance #2',
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
    const publicDomain = import.meta.env.VITE_PUBLIC_DOMAIN || 'https://easyxerox.com';
    const qrUrl = `${publicDomain}/upload/${selectedQrMachine.machine_code}`;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Kiosk QR Code - ${selectedQrMachine.machine_code}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .card { border: 3px solid #000; border-radius: 20px; padding: 30px; display: inline-block; }
            h1 { margin: 0 0 10px 0; font-size: 28px; }
            h2 { color: #0066FF; margin: 0 0 20px 0; font-size: 20px; }
            p { font-size: 14px; margin-top: 15px; color: #555; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="card">
            <h1>SCAN TO PRINT</h1>
            <h2>${selectedQrMachine.machine_code}</h2>
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
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 font-heading">Registered Hardware Fleet</h3>
            <p className="text-slate-600 font-bold text-xs mt-1">Register new Windows 11 Touch Kiosks and generate unique machine QR codes.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-md flex items-center gap-2 btn-touch text-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Register New Kiosk</span>
          </button>
        </div>

        {/* MACHINES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div key={machine.id} className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex flex-col justify-between space-y-5 shadow-xl hover:border-blue-500 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-mono font-black shadow-sm">
                    {machine.machine_code}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black capitalize shadow-sm ${
                    machine.status === 'online' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {machine.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-950 font-heading mt-4">{machine.machine_code}</h3>
                <p className="text-xs text-slate-700 font-bold flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{machine.location_address || 'Registered Location'}, {machine.city || 'Delhi'}</span>
                </p>

                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 text-xs space-y-2 font-bold">
                  <div className="flex justify-between text-slate-600">
                    <span>Partner Owner</span>
                    <span className="text-slate-950 font-black">{machine.client_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Default Printer</span>
                    <span className="text-blue-700 font-mono font-bold">{machine.default_printer_name || 'Brother DCP-T820DW Printer'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Printed Jobs</span>
                    <span className="text-emerald-600 font-black">{machine.total_jobs_printed || 0}</span>
                  </div>
                </div>
              </div>

              {/* View QR Code Button */}
              <button
                onClick={() => setSelectedQrMachine(machine)}
                className="w-full py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black rounded-2xl text-xs border border-blue-200 flex items-center justify-center gap-2 btn-touch shadow-sm"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>View & Print QR Code</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW QR MODAL */}
      {selectedQrMachine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative text-center text-slate-950">
            <button onClick={() => setSelectedQrMachine(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-black text-slate-950 font-heading">{selectedQrMachine.machine_code}</h3>
            <p className="text-xs text-blue-700 font-mono font-bold mt-1 mb-4">{selectedQrMachine.machine_code}</p>

            <div className="p-4 bg-white border-2 border-blue-100 rounded-2xl inline-block shadow-xl mb-4">
              <QRCodeSVG
                value={`${import.meta.env.VITE_PUBLIC_DOMAIN || 'https://easyxerox.com'}/upload/${selectedQrMachine.machine_code}`}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-xs text-slate-600 font-bold mb-4">
              Scan Mobile Upload URL: <br />
              <span className="text-blue-700 font-mono text-[11px] font-black">https://easyxerox.com/upload/{selectedQrMachine.machine_code}</span>
            </p>

            <button
              onClick={handlePrintQr}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md btn-touch"
            >
              <Printer className="w-4 h-4" />
              <span>Print QR Code Sticker</span>
            </button>
          </div>
        </div>
      )}

      {/* CREATE MACHINE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative text-slate-950">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-slate-950 font-heading mb-6">Register New Kiosk Hardware</h3>

            <form onSubmit={handleCreateMachine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Machine Code</label>
                  <input
                    type="text"
                    required
                    value={formData.machine_code}
                    onChange={(e) => setFormData({ ...formData, machine_code: e.target.value.toUpperCase(), name: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-mono font-bold focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Select Client Owner</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.business_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Location Address</label>
                <input
                  type="text"
                  required
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md btn-touch text-base mt-4"
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
