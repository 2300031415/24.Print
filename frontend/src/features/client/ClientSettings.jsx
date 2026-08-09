import React, { useEffect, useState } from 'react';
import { Key, ShieldCheck, Save, Eye, EyeOff, Building, Phone, MapPin, Loader2, CheckCircle2, AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
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

  const fetchSettings = async () => {
    try {
      const res = await api.get('/clients/my-settings');
      if (res.data.success && res.data.client) {
        const c = res.data.client;
        setFormData({
          business_name: c.business_name || '',
          contact_phone: c.contact_phone || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          pincode: c.pincode || '',
          razorpay_key_id: c.razorpay_key_id || '',
          razorpay_key_secret: c.razorpay_key_secret || '',
          commission_rate: c.commission_rate || 80.0
        });
      }
    } catch (err) {
      console.error('Error loading client settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/clients/my-settings', formData);
      if (res.data.success) {
        setSuccessMsg('Payment API keys & business profile saved successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const isCustomKeyConfigured = Boolean(formData.razorpay_key_id && formData.razorpay_key_id.trim());

  return (
    <PortalLayout title="Payment API Keys & Franchise Profile" role="client">
      <div className="p-8 max-w-5xl mx-auto space-y-8 select-none">
        {/* Banner */}
        <div className="bg-gradient-to-r from-cyan-900/40 via-indigo-900/30 to-slate-900 p-6 rounded-2xl border border-cyan-500/30 flex items-center justify-between shadow-cyan-glow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/40">
              <Key className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">
                Client Razorpay Payment Gateway API Integration
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Configure your independent Razorpay API Keys so customer payments across your kiosk boards deposit directly to your merchant account.
              </p>
            </div>
          </div>
        </div>

        {/* Success / Error Toasts */}
        {successMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-xl flex items-center gap-3 animate-fade-in font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-950/80 border border-rose-500 text-rose-300 rounded-xl flex items-center gap-3 animate-fade-in font-medium text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
            <p className="text-slate-400 text-sm">Loading Client Profile Settings...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            {/* CARD 1: RAZORPAY PAYMENT GATEWAY SETTINGS */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white font-heading">
                    Razorpay Merchant API Credentials
                  </h3>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                    isCustomKeyConfigured
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                      : 'bg-amber-950/80 text-amber-400 border-amber-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isCustomKeyConfigured ? 'Custom Razorpay API Active' : 'System Default Fallback Key'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Razorpay Key ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Razorpay Key ID (e.g. rzp_live_... or rzp_test_...)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.razorpay_key_id}
                      onChange={(e) => setFormData({ ...formData, razorpay_key_id: e.target.value })}
                      placeholder="rzp_live_1234567890ABC"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Found in your Razorpay Dashboard under Settings → API Keys.
                  </p>
                </div>

                {/* Razorpay Key Secret */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Razorpay Key Secret
                  </label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={formData.razorpay_key_secret}
                      onChange={(e) => setFormData({ ...formData, razorpay_key_secret: e.target.value })}
                      placeholder="Enter Secret Key"
                      className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Secret key used for secure HMAC SHA256 payment signature verification.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: FRANCHISE BUSINESS PROFILE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-heading">
                  Franchise Business Profile Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* SAVE ACTION BUTTON */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-98 text-white font-extrabold rounded-xl transition-all shadow-cyan-glow flex items-center gap-2 text-base btn-touch disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving API Keys...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Payment API Settings</span>
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
