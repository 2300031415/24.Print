import React, { useEffect, useState } from 'react';
import { Tv, Upload, Plus, CheckCircle, Clock, MonitorCheck, Trash2 } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientAds = () => {
  const [ads, setAds] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedMachineIds, setSelectedMachineIds] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDeleteAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement? It will be removed from your kiosk board.')) return;
    
    // Optimistic UI update: Remove ad card from screen immediately
    setAds(prevAds => prevAds.filter(a => String(a.id) !== String(id)));

    try {
      const res = await api.delete(`/ads/${id}`);
      if (res.data.success) {
        alert('🗑️ Advertisement deleted successfully.');
      }
    } catch (err) {
      console.error('Error deleting ad:', err);
      fetchAds();
      alert('Failed to delete advertisement.');
    }
  };

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    const backendBase = (hostname === 'localhost' || hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : (port === '5173' || port === '8501' ? `http://${hostname}:5000` : `${protocol}//${hostname}`);

    return `${backendBase}${url}`;
  };


  const fetchAds = async () => {
    try {
      const res = await api.get('/ads');
      if (res.data.success) setAds(res.data.ads);
    } catch (err) {
      console.error('Error loading ads:', err);
    }
  };

  const fetchMachines = async () => {
    try {
      const res = await api.get('/machines');
      if (res.data.success) {
        setMachines(res.data.machines);
        // Default select all client machines
        setSelectedMachineIds(res.data.machines.map(m => m.id));
      }
    } catch (err) {
      console.error('Error loading machines:', err);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchMachines();
  }, []);

  const handleMachineToggle = (id) => {
    if (selectedMachineIds.includes(id)) {
      setSelectedMachineIds(selectedMachineIds.filter(mId => mId !== id));
    } else {
      setSelectedMachineIds([...selectedMachineIds, id]);
    }
  };

  const handleUploadAd = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('media', file);
    formData.append('title', title);
    formData.append('duration_seconds', 10);
    formData.append('machine_ids', JSON.stringify(selectedMachineIds));

    try {
      const res = await api.post('/ads/upload', formData);
      if (res.data.success) {
        setTitle('');
        setFile(null);
        fetchAds();
        alert('🎉 Advertisement published & active live on selected Kiosk board(s)!');
      }
    } catch (err) {
      console.error('Error publishing ad:', err);
      alert(err.response?.data?.message || err.message || 'Failed to publish ad media.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PortalLayout title="Promotional Advertisement Management" role="client">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 select-none font-sans">
        {/* UPLOAD & BOARD SELECTION FORM */}
        <div className="lg:col-span-5 bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl h-fit">
          <h3 className="text-xl font-black text-slate-950 font-heading mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Publish Promotional Ad</span>
          </h3>
          <p className="text-xs font-bold text-slate-600 mb-6">Upload promotional media and select target kiosk boards to broadcast instantly.</p>

          <form onSubmit={handleUploadAd} className="space-y-5">
            <div>
              <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Ad Title / Campaign Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white transition-all outline-none"
                placeholder="e.g. 20% Discount for Students"
              />
            </div>

            <div>
              <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Media File (JPG, PNG, GIF, MP4)</label>
              <input
                type="file"
                required
                accept="image/*,video/mp4"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-950 font-bold"
              />
            </div>

            {/* TARGET KIOSK BOARDS SELECTION */}
            {machines.length > 0 && (
              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Target Kiosk Board(s)</label>
                <div className="space-y-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                  {machines.map((m) => (
                    <label key={m.id} className="flex items-center gap-2.5 text-xs text-slate-950 font-extrabold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedMachineIds.includes(m.id)}
                        onChange={() => handleMachineToggle(m.id)}
                        className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <MonitorCheck className="w-4 h-4 text-blue-600" />
                      <span>{m.name} ({m.machine_code})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-blue-glow btn-touch text-sm"
            >
              {uploading ? 'Publishing...' : 'Publish to Selected Board(s)'}
            </button>
          </form>
        </div>

        {/* ADS LIST */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-2xl font-black text-slate-950 font-heading">Active Advertisements ({ads.length})</h3>

          {ads.length === 0 ? (
            <div className="text-center py-16 bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-md">
              <Tv className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-950">No active advertisements.</h4>
              <p className="text-xs font-bold text-slate-600 mt-1">Upload your first ad on the left to broadcast to your kiosk boards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white p-5 rounded-3xl border-2 border-blue-100 flex items-center justify-between gap-4 shadow-xl hover:border-blue-500 transition-all">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border-2 border-slate-200">
                      {ad.media_type === 'video' ? (
                        <video src={getMediaUrl(ad.media_url)} className="w-full h-full object-cover" />
                      ) : (
                        <img src={getMediaUrl(ad.media_url)} alt={ad.title} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="font-black text-slate-950 text-base truncate">{ad.title}</h4>
                      <p className="text-xs text-slate-600 font-bold mt-1">Rotation Duration: {ad.duration_seconds || 10}s</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                        Live Broadcasting
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    title="Delete Advertisement"
                    className="p-3 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl transition-all shrink-0 btn-touch flex items-center gap-1.5 text-xs font-black"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default ClientAds;
