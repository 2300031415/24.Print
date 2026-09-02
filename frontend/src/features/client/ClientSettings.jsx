import React, { useEffect, useState } from 'react';
import { Key, ShieldCheck, Save, Eye, EyeOff, Building, Phone, MapPin, Loader2, CheckCircle2, AlertCircle, Sparkles, CreditCard, Monitor, ChevronDown } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [machines, setMachines] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState('all'); // 'all' or machine.id

  const [clientDefaults, setClientDefaults] = useState({
    business_name: '',
    contact_phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    commission_rate: 80.0
  });

  const [formData, setFormData] = useState({
    razorpay_key_id: '',
    razorpay_key_secret: '',
    business_name: '',
    contact_phone: '',
    address: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsRes, machinesRes] = await Promise.all([
        api.get('/clients/my-settings'),
        api.get('/machines')
      ]);

      if (settingsRes.data.success && settingsRes.data.client) {
        const c = settingsRes.data.client;
        const defaults = {
          business_name: c.business_name || '',
          contact_phone: c.contact_phone || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          pincode: c.pincode || '',
          razorpay_key_id: c.razorpay_key_id || '',
          razorpay_key_secret: c.razorpay_key_secret || '',
          commission_rate: c.commission_rate || 80.0
        };
        setClientDefaults(defaults);
        setFormData({
          razorpay_key_id: defaults.razorpay_key_id,
          razorpay_key_secret: defaults.razorpay_key_secret,
          business_name: defaults.business_name,
          contact_phone: defaults.contact_phone,
          address: defaults.address
        });
      }

      if (machinesRes.data.success) {
        setMachines(machinesRes.data.machines || []);
      }
    } catch (err) {
      console.error('Error loading client settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Switch form data when user changes target board selection dropdown
  const handleBoardChange = (boardId) => {
    setSelectedBoardId(boardId);
    setSuccessMsg('');
    setErrorMsg('');

    if (boardId === 'all') {
      setFormData({
        razorpay_key_id: clientDefaults.razorpay_key_id,
        razorpay_key_secret: clientDefaults.razorpay_key_secret,
        business_name: clientDefaults.business_name,
        contact_phone: clientDefaults.contact_phone,
        address: clientDefaults.address
      });
    } else {
      const targetMachine = machines.find((m) => String(m.id) === String(boardId) || m.machine_code === boardId);
      if (targetMachine) {
        setFormData({
          razorpay_key_id: targetMachine.razorpay_key_id || '',
          razorpay_key_secret: targetMachine.razorpay_key_secret || '',
          business_name: clientDefaults.business_name,
          contact_phone: clientDefaults.contact_phone,
          address: clientDefaults.address
        });
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (selectedBoardId === 'all') {
        const res = await api.put('/clients/my-settings', {
          razorpay_key_id: formData.razorpay_key_id,
          razorpay_key_secret: formData.razorpay_key_secret,
          business_name: formData.business_name,
          contact_phone: formData.contact_phone,
          address: formData.address
        });
        if (res.data.success) {
          setSuccessMsg('Default Client Razorpay Gateway credentials saved successfully!');
          fetchData();
        }
      } else {
        const targetMachine = machines.find((m) => String(m.id) === String(selectedBoardId) || m.machine_code === selectedBoardId);
        if (targetMachine) {
          const res = await api.put(`/machines/${targetMachine.id}/payment-keys`, {
            razorpay_key_id: formData.razorpay_key_id,
            razorpay_key_secret: formData.razorpay_key_secret
          });
          if (res.data.success) {
            setSuccessMsg(`Razorpay API Keys saved specifically for Kiosk ${targetMachine.machine_code}!`);
            fetchData();
          }
        }
      }
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const selectedMachineObj = machines.find((m) => String(m.id) === String(selectedBoardId) || m.machine_code === selectedBoardId);
  const isCustomKeyConfigured = Boolean(formData.razorpay_key_id && formData.razorpay_key_id.trim());

  return (
    <PortalLayout title="Payment API Keys & Board Assignment" role="client">
      <div className="w-full max-w-7xl mx-auto space-y-8 select-none font-sans">
        {/* Banner */}
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex flex-wrap items-center justify-between shadow-xl gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
              <Key className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950 font-heading">
                Client Razorpay Payment Gateway API Integration
              </h2>
              <p className="text-sm text-slate-700 font-bold mt-1">
                Configure your independent Razorpay API Keys for all kiosk boards or set separate API credentials for individual boards.
              </p>
            </div>
          </div>
        </div>

        {/* Success / Error Toasts */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-extrabold text-sm shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 font-extrabold text-sm shadow-md">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-slate-600 font-bold text-sm">Loading Client Profile & Kiosk Boards...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            {/* BOARD SELECTION DROPDOWN HEADER CARD */}
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-black text-slate-950 font-heading">
                      Select Target Kiosk Board
                    </h3>
                    <p className="text-xs text-slate-700 font-bold">
                      Choose whether to apply Razorpay API keys to ALL boards or a specific kiosk board.
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border shadow-sm ${
                    isCustomKeyConfigured
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isCustomKeyConfigured ? 'Custom Key Active' : 'System Default Fallback'}
                </span>
              </div>

              {/* Dropdown Selector */}
              <div className="relative">
                <select
                  value={selectedBoardId}
                  onChange={(e) => handleBoardChange(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-blue-200 rounded-2xl text-slate-950 font-black text-base focus:outline-none focus:border-blue-600 focus:bg-white appearance-none cursor-pointer shadow-sm transition-all"
                >
                  <option value="all">🌐 All Kiosk Boards (Default Client Razorpay Gateway)</option>
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      🖥️ {m.machine_code} - {m.name} ({m.city || 'Location'})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-6 h-6 text-blue-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* CARD 2: RAZORPAY MERCHANT CREDENTIALS */}
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-black text-slate-950 font-heading">
                    {selectedBoardId === 'all'
                      ? 'Default Client Razorpay Merchant Credentials'
                      : `Independent Credentials for ${selectedMachineObj ? selectedMachineObj.machine_code : 'Selected Kiosk Board'}`}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Razorpay Key ID */}
                <div>
                  <label className="block text-xs font-black text-blue-700 uppercase tracking-wider mb-2">
                    Razorpay Key ID (e.g. rzp_live_... or rzp_test_...)
                  </label>
                  <input
                    type="text"
                    value={formData.razorpay_key_id}
                    onChange={(e) => setFormData({ ...formData, razorpay_key_id: e.target.value })}
                    placeholder="rzp_live_1234567890ABC"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-950 font-mono font-bold text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-slate-600 font-bold mt-1.5">
                    Found in your Razorpay Dashboard under Settings → API Keys.
                  </p>
                </div>

                {/* Razorpay Key Secret */}
                <div>
                  <label className="block text-xs font-black text-blue-700 uppercase tracking-wider mb-2">
                    Razorpay Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={formData.razorpay_key_secret}
                      onChange={(e) => setFormData({ ...formData, razorpay_key_secret: e.target.value })}
                      placeholder="Enter Secret Key"
                      className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-950 font-mono font-bold text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                    >
                      {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold mt-1.5">
                    Secret key used for secure HMAC SHA256 payment signature verification.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 3: BUSINESS PROFILE */}
            <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="border-b border-blue-100 pb-4">
                <h3 className="text-xl font-black text-slate-950 font-heading">
                  Franchise Business Profile
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-blue-700 uppercase tracking-wider mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-950 font-bold text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-blue-700 uppercase tracking-wider mb-2">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-950 font-bold text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* SAVE ACTION BUTTON */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-blue-glow flex items-center gap-2 text-base btn-touch disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving API Keys...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>
                      {selectedBoardId === 'all'
                        ? 'Save Default Client Gateway Keys'
                        : `Save Keys for ${selectedMachineObj ? selectedMachineObj.machine_code : 'Board'}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </PortalLayout>
  );
};

export default ClientSettings;
