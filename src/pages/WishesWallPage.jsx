import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowLeft, Star, PlusCircle, Quote, Filter } from 'lucide-react';
import gsap from 'gsap';
import { fetchApprovedWishes, getPhotoUrl } from '../lib/wishesService';

export default function WishesWallPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchApprovedWishes()
      .then((data) => setWishes(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // GSAP animation for floating wish cards
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
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

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white px-4 py-8 md:py-16">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-[#B76E79]/10 via-[#D4AF37]/5 to-transparent rounded-full blur-[160px]" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-6xl mx-auto flex items-center justify-between mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#F5F1EA]/60 hover:text-[#B76E79] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Story</span>
        </Link>

        <Link
          to="/wish"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:opacity-95 text-white font-medium text-xs shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Leave Her A Wish ❤️</span>
        </Link>
      </header>

      {/* Title & Introduction */}
      <section className="relative z-10 max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/30 text-[#B76E79] text-xs font-mono uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Birthday Wall</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif text-[#F5F1EA] leading-tight mb-4">
          A Little Something From The People Who Love You ❤️
        </h1>

        <p className="text-sm md:text-base text-[#F5F1EA]/70 max-w-xl mx-auto leading-relaxed">
          Messages, notes, and photos sent by friends, family, and loved ones to celebrate Sowmiyaa on her special day.
        </p>

        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeFilter === cat
                    ? 'bg-[#B76E79] text-white shadow-md'
                    : 'bg-white/5 border border-white/10 text-[#F5F1EA]/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Wishes Wall Grid */}
      <main className="relative z-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="py-20 text-center text-[#F5F1EA]/50 font-mono text-sm">
            Loading birthday wishes...
          </div>
        ) : filteredWishes.length === 0 ? (
          <div className="py-20 text-center bg-[#121212]/60 border border-white/10 rounded-3xl p-8 max-w-md mx-auto">
            <Heart className="w-10 h-10 text-[#B76E79]/40 mx-auto mb-3" />
            <h3 className="text-xl font-serif text-[#F5F1EA]">No wishes yet</h3>
            <p className="text-xs text-[#F5F1EA]/60 mt-2 mb-6">
              Be the first to leave a birthday message for Miyaaaaww!
            </p>
            <Link
              to="/wish"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B76E79] text-white text-xs font-medium"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Leave A Wish</span>
            </Link>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredWishes.map((wish, index) => {
              const photoUrl = getPhotoUrl(wish.photo_path);

              return (
                <div
                  key={wish.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`break-inside-avoid bg-[#121212]/80 border rounded-3xl p-6 backdrop-blur-xl transition-all hover:border-[#B76E79]/40 shadow-xl ${
                    wish.featured
                      ? 'border-[#D4AF37]/40 bg-gradient-to-b from-[#D4AF37]/[0.05] to-[#121212]/90'
                      : 'border-white/10'
                  }`}
                >
                  {/* Photo if present */}
                  {photoUrl && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 max-h-64 bg-black/40">
                      <img
                        src={photoUrl}
                        alt={`Photo with wish from ${wish.name}`}
                        className="w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {wish.featured && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider mb-3">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured Wish</span>
                    </div>
                  )}

                  {/* Quote Icon */}
                  <Quote className="w-6 h-6 text-[#B76E79]/30 mb-2" />

                  {/* Message */}
                  <p className="text-sm md:text-base text-[#F5F1EA]/90 font-light leading-relaxed mb-4 whitespace-pre-wrap">
                    {wish.message}
                  </p>

                  {/* Submitter Info */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-serif text-[#F5F1EA] font-medium">
                        — {wish.name}
                      </span>
                      {wish.relationship && (
                        <span className="text-[#F5F1EA]/50 font-mono text-[11px] block">
                          {wish.relationship}
                        </span>
                      )}
                    </div>
                    <Heart className="w-3.5 h-3.5 text-[#B76E79]/40" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="relative z-10 max-w-xl mx-auto text-center mt-20 pt-8 border-t border-white/10">
        <p className="text-xs text-[#F5F1EA]/50 font-mono mb-4">
          Want your wish to appear here?
        </p>
        <Link
          to="/wish"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#B76E79] hover:bg-[#A35D68] text-white text-xs font-medium shadow-lg transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Submit Your Birthday Wish</span>
        </Link>
      </footer>
    </div>
  );
}
