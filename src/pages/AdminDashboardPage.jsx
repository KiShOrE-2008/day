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
  Clock,
  Mail,
  Send,
  MessageSquare,
  MailOpen
} from 'lucide-react';
import {
  fetchAllWishes,
  approveWish,
  rejectWish,
  editWish,
  toggleFeaturedWish,
  sendThankYouEmail,
  markWishAsRead,
  getAdminSession,
  signOutAdmin,
  getPhotoUrl
} from '../lib/wishesService';
import ReplyComposerModal from '../components/ReplyComposerModal';

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [wishes, setWishes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'new' | 'replied' | 'featured'
  const [replyingWish, setReplyingWish] = useState(null); // wish object being replied to
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
      setWishes(data || []);
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

  const handleSendReply = async (id, replyMessage) => {
    try {
      await sendThankYouEmail(id, replyMessage);
      loadWishes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenReply = async (wish) => {
    setReplyingWish(wish);
    if (!wish.is_read) {
      await markWishAsRead(wish.id);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingWish) return;

    try {
      await editWish(editingWish.id, {
        name: editingWish.name,
        email: editingWish.email,
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
          <p className="text-xs font-mono text-[#F5F1EA]/60">Opening Miyaaaaww's Birthday Inbox...</p>
        </div>
      </div>
    );
  }

  // Filter Counts
  const totalCount = wishes.length;
  const newCount = wishes.filter((w) => !w.is_read || !w.approved).length;
  const repliedCount = wishes.filter((w) => w.thank_you_sent).length;
  const featuredCount = wishes.filter((w) => w.featured).length;

  const filteredWishes = wishes.filter((w) => {
    if (filterTab === 'new') return !w.is_read || !w.approved;
    if (filterTab === 'replied') return w.thank_you_sent;
    if (filterTab === 'featured') return w.featured;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white px-4 md:px-8 py-8">
      {/* Top Admin Header */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 text-[#E89CA7] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Sowmiyaa Private Inbox</span>
            </span>
            <span className="text-xs text-[#F5F1EA]/40 font-mono hidden sm:inline">
              {session?.user?.email}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif mt-2 text-[#F5F1EA]">
            Miyaaaaww's Birthday Inbox ❤️
          </h1>
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
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono flex items-center gap-2 transition-colors text-[#D4AF37]"
          >
            <Eye className="w-3.5 h-3.5" />
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
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="text-xs font-mono text-[#F5F1EA]/50 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Total Wishes</span>
            </div>
            <div className="text-3xl font-serif text-[#F5F1EA] mt-2">{totalCount}</div>
          </div>

          <div className="bg-[#121212] border border-amber-500/30 rounded-2xl p-5 shadow-xl">
            <div className="text-xs font-mono text-amber-400/80 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>New / Unread</span>
            </div>
            <div className="text-3xl font-serif text-amber-300 mt-2">{newCount}</div>
          </div>

          <div className="bg-[#121212] border border-[#B76E79]/40 rounded-2xl p-5 shadow-xl">
            <div className="text-xs font-mono text-[#E89CA7] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-current" />
              <span>Replied</span>
            </div>
            <div className="text-3xl font-serif text-[#E89CA7] mt-2">{repliedCount}</div>
          </div>

          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-2xl p-5 shadow-xl">
            <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
              <span>Featured Cards</span>
            </div>
            <div className="text-3xl font-serif text-[#D4AF37] mt-2">{featuredCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/5">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all shrink-0 ${
              filterTab === 'all'
                ? 'bg-[#B76E79]/20 border border-[#B76E79]/50 text-[#E89CA7] font-bold'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            All Wishes ({totalCount})
          </button>

          <button
            onClick={() => setFilterTab('new')}
            className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shrink-0 ${
              filterTab === 'new'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>New / Unread ({newCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('replied')}
            className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shrink-0 ${
              filterTab === 'replied'
                ? 'bg-[#B76E79]/30 border border-[#B76E79]/60 text-[#E89CA7] font-bold'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#B76E79]" />
            <span>Replied ({repliedCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('featured')}
            className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all shrink-0 ${
              filterTab === 'featured'
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-bold'
                : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Featured ({featuredCount})</span>
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
            Loading Miyaaaaww's birthday messages...
          </div>
        ) : filteredWishes.length === 0 ? (
          <div className="py-20 text-center bg-[#121212]/50 border border-white/5 rounded-3xl p-8 max-w-md mx-auto">
            <Heart className="w-10 h-10 text-[#B76E79]/40 mx-auto mb-3" />
            <p className="text-base font-serif text-[#F5F1EA]/70">No wishes in this view</p>
            <p className="text-xs text-[#F5F1EA]/40 mt-1">Birthday notes from loved ones will appear here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWishes.map((wish) => {
              const photoUrl = getPhotoUrl(wish.photo_path);

              return (
                <div
                  key={wish.id}
                  className={`bg-[#121212] border rounded-3xl p-6 transition-all flex flex-col justify-between shadow-xl ${
                    wish.thank_you_sent
                      ? 'border-[#B76E79]/40 bg-[#B76E79]/[0.03]'
                      : !wish.is_read
                      ? 'border-amber-500/40 bg-amber-500/[0.03]'
                      : wish.featured
                      ? 'border-[#D4AF37]/40 bg-[#D4AF37]/[0.03]'
                      : 'border-white/10'
                  }`}
                >
                  <div>
                    {/* Header: Name, Relationship, Email & Status Pills */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-serif font-medium text-[#F5F1EA]">
                            {wish.name}
                          </h3>
                          {!wish.is_read && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono uppercase font-bold animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {wish.relationship && (
                            <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-[#F5F1EA]/60">
                              {wish.relationship}
                            </span>
                          )}
                          {wish.email ? (
                            <span className="px-2 py-0.5 rounded bg-[#B76E79]/15 border border-[#B76E79]/30 text-[11px] font-mono text-[#E89CA7] flex items-center gap-1">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{wish.email}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#F5F1EA]/30">No email</span>
                          )}
                        </div>
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
                    <p className="text-sm text-[#F5F1EA]/85 leading-relaxed font-light mb-4 whitespace-pre-wrap">
                      "{wish.message}"
                    </p>

                    {/* Sent Reply Note Box if Replied */}
                    {wish.thank_you_sent && wish.thank_you_message && (
                      <div className="mb-4 p-3 rounded-2xl bg-[#B76E79]/10 border border-[#B76E79]/30 text-xs space-y-1">
                        <div className="font-mono text-[#E89CA7] text-[10px] flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-current" />
                          <span>Sowmiyaa's Reply Sent:</span>
                        </div>
                        <p className="text-[#F5F1EA]/80 italic">"{wish.thank_you_message}"</p>
                      </div>
                    )}

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
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 mt-4 text-xs font-mono">
                    <span className="text-[#F5F1EA]/30 text-[11px]">
                      {new Date(wish.created_at).toLocaleDateString()}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* REPLY BUTTON */}
                      {wish.thank_you_sent ? (
                        <button
                          onClick={() => handleOpenReply(wish)}
                          className="px-3 py-1.5 rounded-xl bg-[#B76E79]/20 border border-[#B76E79]/40 text-[#E89CA7] text-[11px] font-mono flex items-center gap-1 hover:bg-[#B76E79]/30 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B76E79]" />
                          <span>Replied ✓</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenReply(wish)}
                          disabled={!wish.email}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:opacity-95 text-white font-medium text-[11px] font-mono flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-30 disabled:pointer-events-none"
                          title={wish.email ? `Reply to ${wish.email}` : 'No email address provided'}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>Reply ❤️</span>
                        </button>
                      )}

                      {/* APPROVE / FEATURE MODERATION */}
                      {!wish.approved ? (
                        <button
                          onClick={() => handleApprove(wish.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleFeatured(wish.id, wish.featured)}
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1 transition-colors ${
                            wish.featured
                              ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]'
                              : 'bg-white/5 border-white/10 text-[#F5F1EA]/60 hover:text-white'
                          }`}
                          title="Toggle featured status"
                        >
                          <Star className={`w-3.5 h-3.5 ${wish.featured ? 'fill-current' : ''}`} />
                          <span>{wish.featured ? 'Featured' : 'Feature'}</span>
                        </button>
                      )}

                      {/* EDIT */}
                      <button
                        onClick={() => setEditingWish(wish)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#F5F1EA]/70 transition-colors"
                        title="Edit Wish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleReject(wish.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                        title="Delete Wish"
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

      {/* SOWMIYA CUSTOM REPLY COMPOSER MODAL */}
      <ReplyComposerModal
        wish={replyingWish}
        onClose={() => setReplyingWish(null)}
        onSendReply={handleSendReply}
      />

      {/* EDIT MODAL */}
      {editingWish && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/20 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-xl font-serif text-[#F5F1EA]">Edit Wish Details</h2>
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
                <label className="block text-xs font-mono text-[#F5F1EA]/70 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={editingWish.email || ''}
                  onChange={(e) => setEditingWish({ ...editingWish, email: e.target.value })}
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
