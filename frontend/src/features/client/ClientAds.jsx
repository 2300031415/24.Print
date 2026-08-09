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
    if (url.startsWith('http')) return url;
    if (window.location.hostname === 'localhost') return `http://localhost:5000${url}`;
    return `https://lowcostfreedom.com${url}`;
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* UPLOAD & BOARD SELECTION FORM */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-white font-heading mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <span>Publish Promotional Ad</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Upload promotional media and select target kiosk boards to broadcast instantly.</p>

          <form onSubmit={handleUploadAd} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Ad Title / Campaign Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 transition-all outline-none"
                placeholder="e.g. 20% Discount for Students"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Media File (JPG, PNG, GIF, MP4)</label>
              <input
                type="file"
                required
                accept="image/*,video/mp4"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300"
              />
            </div>

            {/* TARGET KIOSK BOARDS SELECTION */}
            {machines.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Target Kiosk Board(s)</label>
                <div className="space-y-2 bg-slate-950 border border-slate-800 rounded-2xl p-3">
                  {machines.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 text-xs text-white cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedMachineIds.includes(m.id)}
                        onChange={() => handleMachineToggle(m.id)}
                        className="rounded accent-cyan-500 w-4 h-4"
                      />
                      <MonitorCheck className="w-4 h-4 text-cyan-400" />
                      <span>{m.name} ({m.machine_code})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-sm"
            >
              {uploading ? 'Publishing...' : 'Publish to Selected Board(s)'}
            </button>
          </form>
        </div>

        {/* ADS LIST */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xl font-bold text-white font-heading">Active Advertisements ({ads.length})</h3>

          {ads.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-300">No active advertisements.</h4>
              <p className="text-xs text-slate-500 mt-1">Upload your first ad on the left to broadcast to your kiosk boards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                      {ad.media_type === 'video' ? (
                        <video src={getMediaUrl(ad.media_url)} className="w-full h-full object-cover" />
                      ) : (
                        <img src={getMediaUrl(ad.media_url)} alt={ad.title} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm truncate">{ad.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Rotation Duration: {ad.duration_seconds || 10}s</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Live Broadcasting
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAd(ad.id)}
                    title="Delete Advertisement"
                    className="p-3 bg-rose-950/60 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-800 rounded-xl transition-all shrink-0 btn-touch flex items-center gap-1.5 text-xs font-bold"
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
