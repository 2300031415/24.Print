import React, { useEffect, useState } from 'react';
import { Users, Plus, Building, Phone, Mail, Percent, CheckCircle, AlertCircle, X, Edit, ShieldOff, ShieldCheck, Key, Trash2 } from 'lucide-react';

import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

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
    commission_rate: 100.00
  });

  const [editData, setEditData] = useState({
    business_name: '',
    email: '',
    phone: '',
    password: ''
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
          commission_rate: 100.00
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating client.');
    }
  };

  const isClientSuspended = (client) => {
    return client.status === 'suspended' || client.status === 'inactive' || client.status === 'disabled';
  };

  const handleToggleStatus = async (client) => {
    const currentlySuspended = isClientSuspended(client);
    const newStatus = currentlySuspended ? 'active' : 'suspended';
    try {
      setClients((prev) =>
        prev.map((c) => (c.id === client.id ? { ...c, status: newStatus, user_status: newStatus } : c))
      );
      await api.put(`/clients/${client.id}`, { status: newStatus });
      await fetchClients();
    } catch (err) {
      console.error('Error updating status:', err);
      fetchClients();
    }
  };

  const handleDeleteClient = async (client) => {
    if (!window.confirm(`Are you sure you want to delete client "${client.business_name}"? This will also remove their registered kiosk boards.`)) {
      return;
    }
    try {
      const res = await api.delete(`/clients/${client.id}`);
      if (res.data.success) {
        fetchClients();
      }
    } catch (err) {
      alert('Error deleting client partner.');
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setEditData({
      business_name: client.business_name || '',
      email: client.email || '',
      phone: client.contact_phone || client.phone || '',
      password: ''
    });
    setShowEditModal(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      const res = await api.put(`/clients/${selectedClient.id}`, editData);
      if (res.data.success) {
        setShowEditModal(false);
        fetchClients();
      }
    } catch (err) {
      alert('Error updating client details.');
    }
  };

  return (
    <PortalLayout title="Client Owner Management">
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 font-heading">Client Partner Network</h3>
            <p className="text-slate-600 font-bold text-xs mt-1">
              Manage Xerox Shop Partners, edit credentials, or toggle active/disabled status to control board operation.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-md flex items-center gap-2 btn-touch text-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Onboard New Client</span>
          </button>
        </div>

        {/* CLIENTS TABLE */}
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-900">
              <thead className="bg-blue-50/80 text-xs uppercase font-black text-blue-900 border-b border-blue-200">
                <tr>
                  <th className="py-3.5 px-4">Business Name</th>
                  <th className="py-3.5 px-4">Owner Name</th>
                  <th className="py-3.5 px-4">Contact Email</th>
                  <th className="py-3.5 px-4">Total Kiosks</th>
                  <th className="py-3.5 px-4">Total Revenue</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-center">Board Access Control</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 font-bold">
                {clients.map((client) => {
                  const isSuspended = isClientSuspended(client);
                  return (
                    <tr key={client.id} className="hover:bg-blue-50/50 transition-all">
                      <td className="py-4 px-4 font-black text-slate-950 flex items-center gap-2">
                        <Building className="w-4 h-4 text-blue-600" />
                        <span>{client.business_name}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-900">{client.full_name}</td>
                      <td className="py-4 px-4 text-blue-700">{client.email}</td>
                      <td className="py-4 px-4 font-black text-slate-950">{client.total_machines || 0}</td>
                      <td className="py-4 px-4 font-mono font-black text-emerald-600">
                        ₹{parseFloat(client.total_earnings || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                            isSuspended
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isSuspended ? 'Disabled' : 'Active'}
                        </span>
                      </td>

                      {/* TOGGLE SWITCH FOR BOARD OPERATIONAL STATUS */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(client)}
                          title={isSuspended ? 'Click to Enable Client & Kiosk Boards' : 'Click to Disable Client & Stop Boards'}
                          className={`relative mx-auto w-14 h-8 rounded-full transition-colors p-1 flex items-center shadow-inner ${
                            isSuspended ? 'bg-rose-600' : 'bg-emerald-500'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                              isSuspended ? 'translate-x-0' : 'translate-x-6'
                            }`}
                          >
                            {isSuspended ? (
                              <ShieldOff className="w-3.5 h-3.5 text-rose-600" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </div>
                        </button>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(client)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black rounded-xl text-xs border border-blue-200 transition-all flex items-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client)}
                            title="Delete Client Shop & Kiosks"
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs border border-rose-200 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE CLIENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative text-slate-950">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-black text-slate-950 font-heading mb-6">Onboard New Client Shop</h3>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                  placeholder="e.g. Metro Xerox Zone"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Owner Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                    placeholder="owner@shop.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                    placeholder="+919876543210"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md btn-touch text-base mt-4"
              >
                Create Partner Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLIENT MODAL */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative text-slate-950">
            <button onClick={() => setShowEditModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950">
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-black text-slate-950 font-heading mb-6">Edit Client Partner Account</h3>

            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={editData.business_name}
                  onChange={(e) => setEditData({ ...editData, business_name: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                    placeholder="owner@shop.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Reset Password (Leave blank to keep existing)</label>
                <input
                  type="text"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                  placeholder="New password (optional)"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md btn-touch text-base mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default AdminClients;
