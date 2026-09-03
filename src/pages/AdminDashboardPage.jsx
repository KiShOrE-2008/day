import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  Edit3,
  Trash2,
  LogOut,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Eye,
  Heart,
  Filter,
  Image as ImageIcon,
  Check,
  X,
  Clock
} from 'lucide-react';
import {
  fetchAllWishes,
  approveWish,
  rejectWish,
  editWish,
  toggleFeaturedWish,
  getAdminSession,
  signOutAdmin,
  getPhotoUrl
} from '../lib/wishesService';

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [wishes, setWishes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const [filterTab, setFilterTab] = useState('pending'); // 'pending' | 'approved' | 'featured' | 'all'
  const [editingWish, setEditingWish] = useState(null); // wish object being edited

  const navigate = useNavigate();

  // 1. Verify Auth Session
  useEffect(() => {
    getAdminSession()
      .then((sess) => {
        if (!sess) {
          navigate('/admin/login', { replace: true });
        } else {
          setSession(sess);
          loadWishes();
        }
      })
      .finally(() => setLoadingSession(false));
  }, [navigate]);

  // 2. Fetch Wishes
  const loadWishes = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const data = await fetchAllWishes();
      setWishes(data);
    } catch (err) {
      console.error('Failed to load wishes:', err);
      setError(err.message || 'Failed to load wishes.');
    } finally {
      setLoadingData(false);
    }
  };

  // 3. Actions
  const handleApprove = async (id) => {
    try {
      await approveWish(id);
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject & delete this wish?')) return;
    try {
      await rejectWish(id);
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleFeatured = async (id, currentState) => {
    try {
      await toggleFeaturedWish(id, !currentState);
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingWish) return;

    try {
      await editWish(editingWish.id, {
        name: editingWish.name,
        relationship: editingWish.relationship,
        message: editingWish.message,
        featured: editingWish.featured,
        approved: editingWish.approved,
      });
      setEditingWish(null);
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    navigate('/admin/login', { replace: true });
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-[#F5F1EA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-[#F5F1EA]/60">Authenticating session...</p>
        </div>
      </div>
    );
  }

  // Filtered List
  const pendingCount = wishes.filter((w) => !w.approved).length;
  const approvedCount = wishes.filter((w) => w.approved).length;
  const featuredCount = wishes.filter((w) => w.featured).length;

  const filteredWishes = wishes.filter((w) => {
    if (filterTab === 'pending') return !w.approved;
    if (filterTab === 'approved') return w.approved;
    if (filterTab === 'featured') return w.featured;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white px-4 md:px-8 py-8">
      {/* Top Admin Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#B76E79]/20 text-[#B76E79] text-xs font-mono uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-[#F5F1EA]/40 font-mono">
              {session?.user?.email}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif mt-1">Sowmiyaa Wishes Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadWishes}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-2 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/wishes"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Public Wall</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-5">
            <div className="text-xs font-mono text-[#F5F1EA]/50 uppercase tracking-wider">Total Received</div>
            <div className="text-3xl font-serif text-[#F5F1EA] mt-1">{wishes.length}</div>
          </div>
          <div className="bg-[#121212] border border-amber-500/30 rounded-2xl p-5">
            <div className="text-xs font-mono text-amber-400/80 uppercase tracking-wider">Pending Moderation</div>
            <div className="text-3xl font-serif text-amber-300 mt-1">{pendingCount}</div>
          </div>
          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-5">
            <div className="text-xs font-mono text-emerald-400/80 uppercase tracking-wider">Approved & Live</div>
            <div className="text-3xl font-serif text-emerald-300 mt-1">{approvedCount}</div>
          </div>
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-2xl p-5">
            <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">Featured Cards</div>
            <div className="text-3xl font-serif text-[#D4AF37] mt-1">{featuredCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/5">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shrink-0 ${
              filterTab === 'pending'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shrink-0 ${
              filterTab === 'approved'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('featured')}
            className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shrink-0 ${
              filterTab === 'featured'
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Featured ({featuredCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all shrink-0 ${
              filterTab === 'all'
                ? 'bg-[#B76E79]/20 border border-[#B76E79]/50 text-[#B76E79]'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            All Wishes ({wishes.length})
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Wish Card List Grid */}
        {loadingData ? (
          <div className="py-20 text-center text-[#F5F1EA]/50 font-mono text-sm">
            Loading wishes data...
          </div>
        ) : filteredWishes.length === 0 ? (
          <div className="py-20 text-center bg-[#121212]/50 border border-white/5 rounded-3xl p-8">
            <Heart className="w-10 h-10 text-[#F5F1EA]/20 mx-auto mb-3" />
            <p className="text-base font-serif text-[#F5F1EA]/70">No wishes found in this category.</p>
            <p className="text-xs text-[#F5F1EA]/40 mt-1">Submissions from friends will appear here for your review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWishes.map((wish) => {
              const photoUrl = getPhotoUrl(wish.photo_path);

              return (
                <div
                  key={wish.id}
                  className={`bg-[#121212] border rounded-3xl p-6 transition-all flex flex-col justify-between ${
                    !wish.approved
                      ? 'border-amber-500/30 bg-amber-500/[0.02]'
                      : wish.featured
                      ? 'border-[#D4AF37]/40 bg-[#D4AF37]/[0.02]'
                      : 'border-white/10'
                  }`}
                >
                  <div>
                    {/* Header: Name, Relationship & Status Pills */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">
                          {wish.name}
                        </h3>
                        {wish.relationship && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-[#F5F1EA]/60">
                            {wish.relationship}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 justify-end">
                        {wish.approved ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono uppercase">
                            Pending
                          </span>
                        )}
                        {wish.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono uppercase flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message Body */}
                    <p className="text-sm text-[#F5F1EA]/80 leading-relaxed font-light mb-4 whitespace-pre-wrap">
                      "{wish.message}"
                    </p>

                    {/* Photo Thumbnail if present */}
                    {photoUrl && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black/40">
                        <img
                          src={photoUrl}
                          alt={`Upload by ${wish.name}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer Action Toolbar */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2 mt-4 text-xs font-mono">
                    <span className="text-[#F5F1EA]/30 text-[11px]">
                      {new Date(wish.created_at).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {!wish.approved ? (
                        <button
                          onClick={() => handleApprove(wish.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleFeatured(wish.id, wish.featured)}
                          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                            wish.featured
                              ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]'
                              : 'bg-white/5 border-white/10 text-[#F5F1EA]/60 hover:text-white'
                          }`}
                          title="Toggle featured status for story section"
                        >
                          <Star className={`w-3.5 h-3.5 ${wish.featured ? 'fill-current' : ''}`} />
                          <span>{wish.featured ? 'Featured' : 'Feature'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setEditingWish(wish)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F1EA]/70 transition-colors"
                        title="Edit Wish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleReject(wish.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                        title="Reject / Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      {editingWish && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/20 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-serif text-[#F5F1EA]">Edit Wish Before Publishing</h2>
              <button
                onClick={() => setEditingWish(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#F5F1EA]/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#F5F1EA]/70 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editingWish.name}
                  onChange={(e) => setEditingWish({ ...editingWish, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F1EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#F5F1EA]/70 mb-1">Relationship</label>
                <input
                  type="text"
                  value={editingWish.relationship || ''}
                  onChange={(e) => setEditingWish({ ...editingWish, relationship: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F1EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#F5F1EA]/70 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={editingWish.message}
                  onChange={(e) => setEditingWish({ ...editingWish, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F1EA] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={editingWish.approved}
                    onChange={(e) => setEditingWish({ ...editingWish, approved: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-[#B76E79]"
                  />
                  <span>Approved for Public Wall</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={editingWish.featured}
                    onChange={(e) => setEditingWish({ ...editingWish, featured: e.target.checked })}
                    className="rounded border-white/20 bg-white/5 text-[#D4AF37]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingWish(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono border border-white/10 text-[#F5F1EA]/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-mono bg-[#B76E79] hover:bg-[#A35D68] text-white font-medium shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
