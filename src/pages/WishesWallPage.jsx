import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowLeft, Star, PlusCircle, Quote, Maximize2, MessageSquare, PartyPopper } from 'lucide-react';
import gsap from 'gsap';
import { fetchApprovedWishes, getPhotoUrl } from '../lib/wishesService';
import WishDetailModal from '../components/WishDetailModal';

export default function WishesWallPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const cardsRef = useRef([]);
  const heroRef = useRef(null);

  useEffect(() => {
    fetchApprovedWishes()
      .then((data) => setWishes(data || []))
      .catch((err) => {
        console.error(err);
        setFetchError('Could not load birthday wishes. Please refresh the page.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Reset selectedIndex if activeFilter changes
  useEffect(() => {
    setSelectedIndex(null);
  }, [activeFilter]);

  // GSAP entrance animation for hero and wish cards
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }
  }, [wishes, activeFilter]);

  // Extract unique relationships for filters
  const categories = ['ALL', ...new Set(wishes.map((w) => w.relationship).filter(Boolean))];

  const filteredWishes = wishes.filter((w) => {
    if (activeFilter === 'ALL') return true;
    return w.relationship === activeFilter;
  });

  const selectedWish = selectedIndex !== null ? filteredWishes[selectedIndex] : null;
  const handlePrev = selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null;
  const handleNext =
    selectedIndex !== null && selectedIndex < filteredWishes.length - 1
      ? () => setSelectedIndex(selectedIndex + 1)
      : null;

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white px-4 py-8 sm:py-12 md:py-16 overflow-x-hidden">
      {/* Background Ambient Glowing Halos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B76E79]/15 rounded-full filter blur-[180px]" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-[#E89CA7]/10 rounded-full filter blur-[160px]" />
        <div className="absolute top-3/4 left-10 w-[450px] h-[450px] bg-[#D4AF37]/5 rounded-full filter blur-[150px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-20 max-w-6xl mx-auto flex items-center justify-end mb-10 sm:mb-14">
        <Link
          to="/wish"
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-medium text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(183,110,121,0.5)] hover:shadow-[0_0_40px_rgba(232,156,167,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <PlusCircle className="w-4 h-4 animate-pulse" />
          <span>Leave Her A Wish ❤️</span>
        </Link>
      </header>

      {/* Hero Header & Title */}
      <section ref={heroRef} className="relative z-10 max-w-4xl mx-auto text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#B76E79]/40 text-[#E89CA7] text-xs font-mono uppercase tracking-[0.25em] shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-spin" />
          <span>Community Birthday Wall</span>
          <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-[#B76E79]" />
        </div>

        <h1 className="font-serif-cinematic text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-tight drop-shadow-2xl max-w-3xl mx-auto break-words">
          A Little Something From The People{' '}
          <span className="italic text-[#E89CA7] font-semibold">Who Love You</span> ❤️
        </h1>

        <p className="font-sans-clean text-sm sm:text-base md:text-lg text-[#F5F1EA]/75 max-w-2xl mx-auto leading-relaxed italic font-light">
          Messages, memories, and birthday wishes sent by friends, family, and loved ones to celebrate Sowmiyaa on her special day.
        </p>

        {/* Wishes Count & Category Filter Pills */}
        <div className="pt-4 flex flex-col items-center gap-6">
          {wishes.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">
              <MessageSquare className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>{wishes.length} {wishes.length === 1 ? 'Wish' : 'Wishes'} Received</span>
            </div>
          )}

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white shadow-[0_0_20px_rgba(183,110,121,0.5)] scale-105'
                      : 'glass-panel border border-white/10 text-[#F5F1EA]/60 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat === 'ALL' ? '✦ All Wishes' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="relative z-10 max-w-6xl mx-auto">
        {fetchError ? (
          <div className="py-20 text-center glass-panel border border-red-500/40 rounded-3xl p-8 max-w-md mx-auto shadow-2xl">
            <p className="text-red-300 text-sm font-mono">⚠️ {fetchError}</p>
          </div>
        ) : loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 font-mono text-xs uppercase tracking-widest">
              Gathering Birthday Wishes...
            </p>
          </div>
        ) : filteredWishes.length === 0 ? (
          /* Redesigned Premium Empty State Card */
          <div className="py-20 px-8 text-center glass-panel border border-[#B76E79]/30 rounded-3xl max-w-lg mx-auto shadow-[0_0_60px_rgba(183,110,121,0.15)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B76E79]/20 rounded-full filter blur-[50px] pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B76E79]/20 to-[#E89CA7]/30 border border-[#B76E79]/40 flex items-center justify-center mx-auto shadow-xl">
              <PartyPopper className="w-9 h-9 text-[#E89CA7] animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-cinematic text-2xl sm:text-3xl font-semibold text-white">
                No Wishes Written Yet
              </h3>
              <p className="font-sans-clean text-xs sm:text-sm text-[#F5F1EA]/70 italic leading-relaxed max-w-sm mx-auto">
                Be the very first person to leave a sweet birthday note and wish for Miyaaaaww!
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/wish"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white text-xs font-mono uppercase tracking-wider shadow-[0_0_30px_rgba(183,110,121,0.6)] hover:scale-105 transition-all"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Leave The First Wish</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Masonry Wish Cards Grid */
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredWishes.map((wish, index) => {
              const photoUrl = getPhotoUrl(wish.photo_path);

              return (
                <div
                  key={wish.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={() => setSelectedIndex(index)}
                  className={`break-inside-avoid glass-panel border rounded-3xl p-6 sm:p-7 transition-all duration-500 hover:border-[#B76E79]/60 shadow-2xl cursor-pointer hover:-translate-y-1.5 group relative overflow-hidden ${
                    wish.featured
                      ? 'border-[#D4AF37]/50 bg-gradient-to-b from-[#D4AF37]/[0.08] via-black/40 to-black/60 shadow-[0_0_40px_rgba(212,175,55,0.2)]'
                      : 'border-white/15 bg-white/[0.03]'
                  }`}
                >
                  {/* Subtle Background Glow on Hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B76E79]/10 rounded-full filter blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Expand Hint Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2 rounded-full border border-white/20 text-[#E89CA7] backdrop-blur-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Photo attachment if available */}
                  {photoUrl && (
                    <div className="mb-5 rounded-2xl overflow-hidden border border-white/15 max-h-72 bg-black/60 relative group-hover:border-[#B76E79]/40 transition-colors">
                      <img
                        src={photoUrl}
                        alt={`Photo with wish from ${wish.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {wish.featured && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest mb-4 shadow-md">
                      <Star className="w-3 h-3 fill-current animate-spin" />
                      <span>Featured Wish</span>
                    </div>
                  )}

                  {/* Quote Icon */}
                  <Quote className="w-6 h-6 text-[#B76E79]/40 mb-3" />

                  {/* Message Content */}
                  <p className="font-sans-clean text-sm sm:text-base text-[#F5F1EA]/90 font-light leading-relaxed mb-6 whitespace-pre-wrap line-clamp-5 italic">
                    “{wish.message}”
                  </p>

                  {/* Submitter Info Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-serif-cinematic text-[#F5F1EA] font-semibold text-base block group-hover:text-[#E89CA7] transition-colors">
                        — {wish.name}
                      </span>
                      {wish.relationship && (
                        <span className="text-[#E89CA7]/80 font-mono text-[11px] uppercase tracking-wider block">
                          {wish.relationship}
                        </span>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#B76E79]/30 transition-all">
                      <Heart className="w-4 h-4 text-[#B76E79] fill-[#B76E79]" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="relative z-10 max-w-2xl mx-auto text-center mt-24 pt-12 border-t border-white/10">
        <div className="glass-panel border border-white/15 p-8 sm:p-10 rounded-3xl space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#B76E79]/15 rounded-full filter blur-[60px] pointer-events-none" />

          <h4 className="font-serif-cinematic text-2xl font-bold text-white">
            Want Your Wish To Appear On Her Wall?
          </h4>
          <p className="font-sans-clean text-xs sm:text-sm text-[#F5F1EA]/70 max-w-md mx-auto italic">
            Send your heartfelt message, birthday note, or memory photo to make her day unforgettable.
          </p>

          <div className="pt-2">
            <Link
              to="/wish"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white text-xs font-mono uppercase tracking-wider shadow-[0_0_30px_rgba(183,110,121,0.6)] hover:scale-105 transition-all"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Submit Your Birthday Wish</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Detailed Wish Pop-up Modal */}
      <WishDetailModal
        wish={selectedWish}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={selectedIndex !== null ? selectedIndex + 1 : null}
        totalCount={filteredWishes.length}
      />
    </div>
  );
}

