import React, { useEffect, useState } from 'react';
import { Users, Plus, Building, Phone, Mail, Percent, CheckCircle, AlertCircle, X } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    password: 'Client@123',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    commission_rate: 80.00
  });

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      if (res.data.success) {
        setClients(res.data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/clients', formData);
      if (res.data.success) {
        setShowModal(false);
        fetchClients();
        setFormData({
          business_name: '',
          email: '',
          password: 'Client@123',
          full_name: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          commission_rate: 80.00
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating client.');
    }
  };

  return (
    <PortalLayout title="Client Owner Management" role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Manage Xerox Shop Partners and setup revenue share percentage.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow flex items-center gap-2 btn-touch text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Onboard New Client</span>
          </button>
        </div>

        {/* CLIENTS TABLE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Business Name</th>
                  <th className="py-3.5 px-4">Owner Name</th>
                  <th className="py-3.5 px-4">Contact Email</th>
                  <th className="py-3.5 px-4">Commission Share</th>
                  <th className="py-3.5 px-4">Total Kiosks</th>
                  <th className="py-3.5 px-4">Total Earnings</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-all">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                      <Building className="w-4 h-4 text-cyan-400" />
                      <span>{client.business_name}</span>
                    </td>
                    <td className="py-4 px-4">{client.full_name}</td>
                    <td className="py-4 px-4 text-slate-400">{client.email}</td>
                    <td className="py-4 px-4 font-bold text-cyan-400">{client.commission_rate}% Client / {100 - parseFloat(client.commission_rate)}% Admin</td>
                    <td className="py-4 px-4 font-bold text-white">{client.total_machines || 0}</td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400">₹{parseFloat(client.total_earnings || 0).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold">
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE CLIENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-white font-heading mb-6">Onboard New Client Shop</h3>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  placeholder="e.g. Metro Xerox Zone"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                    placeholder="owner@shop.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Client Commission (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base mt-4"
              >
                Create Partner Account
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default AdminClients;
