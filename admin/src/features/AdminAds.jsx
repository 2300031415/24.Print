import React, { useEffect, useState } from 'react';
import { Tv, CheckCircle, XCircle, Plus, Upload } from 'lucide-react';

import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  
  // Quick Upload Form for Super Admin
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const res = await api.put(`/ads/${id}/status`, { status, rejection_reason: reason });
      if (res.data.success) fetchAds();
    } catch (err) {
      alert('Failed to update ad status.');
    }
  };

  const handleAdminUploadAd = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('media', file);
    formData.append('title', title);
    formData.append('duration_seconds', 10);

    try {
      const res = await api.post('/ads/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setTitle('');
        setFile(null);
        setShowUploadModal(false);
        fetchAds();
        alert('Advertisement created & approved successfully!');
      }
    } catch (err) {
      alert('Failed to upload advertisement.');
    } finally {
      setUploading(false);
    }
  };

  const filteredAds = ads.filter(ad => {
    if (activeTab === 'pending') return ad.status === 'pending';
    if (activeTab === 'approved') return ad.status === 'approved';
    if (activeTab === 'rejected') return ad.status === 'rejected';
    return true;
  });

  const pendingCount = ads.filter(a => a.status === 'pending').length;

  return (
    <PortalLayout title="Advertisements Review & Approval">
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        {/* TOP CONTROLS & FILTER TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl text-slate-950">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              All Ads ({ads.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black rounded-full border border-amber-300">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Approved ({ads.filter(a => a.status === 'approved').length})
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'rejected'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Rejected ({ads.filter(a => a.status === 'rejected').length})
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(!showUploadModal)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-md btn-touch shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Ad</span>
          </button>
        </div>

        {/* UPLOAD FORM MODAL / PANEL */}
        {showUploadModal && (
          <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl text-slate-950">
            <h3 className="text-xl font-black text-slate-950 font-heading mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              <span>Create System Advertisement</span>
            </h3>

            <form onSubmit={handleAdminUploadAd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Ad Title / Campaign Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-xs text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                  placeholder="e.g. Festival Printing Offer 30% Off"
                />
              </div>

              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Media File (JPG, PNG, GIF, MP4)</label>
                <input
                  type="file"
                  required
                  accept="image/*,video/mp4"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-950 font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs transition-all shadow-md btn-touch"
                >
                  {uploading ? 'Uploading...' : 'Upload & Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADS LIST GRID */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-16 bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl">
            <Tv className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-black text-slate-950 font-heading">No advertisements found in this status.</h4>
            <p className="text-xs text-slate-600 font-bold mt-1">Client submitted ads will appear here for review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div key={ad.id} className="bg-white p-6 rounded-3xl border-2 border-blue-100 flex flex-col justify-between space-y-4 shadow-xl hover:border-blue-500 transition-all text-slate-950">
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900 mb-4 border border-slate-200">
                    {ad.media_type === 'video' ? (
                      <video src={getMediaUrl(ad.media_url)} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={getMediaUrl(ad.media_url)} alt={ad.title} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-blue-900 text-xs font-black rounded-lg uppercase shadow-sm">
                      {ad.media_type}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-950 font-heading">{ad.title}</h4>
                  <p className="text-xs text-slate-600 font-bold mt-1">
                    Submitted by: <span className="text-slate-950 font-black">{ad.client_name || 'System Admin'}</span>
                  </p>
                  <p className="text-xs text-slate-600 font-bold">
                    Duration: <span className="text-blue-700 font-mono font-black">{ad.duration_seconds || 10} seconds</span>
                  </p>
                </div>

                {/* Status & Action Buttons */}
                <div className="pt-3 border-t border-blue-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-slate-500 uppercase">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      ad.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      ad.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {ad.status}
                    </span>
                  </div>

                  {ad.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStatusUpdate(ad.id, 'approved')}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 btn-touch shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(ad.id, 'rejected', 'Violates policy')}
                        className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1 btn-touch shadow-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {ad.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(ad.id, 'rejected', 'Revoked by admin')}
                      className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-xl text-xs border border-rose-200 transition-all"
                    >
                      Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default AdminAds;
