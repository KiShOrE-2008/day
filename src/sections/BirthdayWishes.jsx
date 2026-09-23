import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Quote, ArrowRight, Maximize2, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchFeaturedWishes } from '../lib/wishesService';
import WishDetailModal from '../components/WishDetailModal';

gsap.registerPlugin(ScrollTrigger);

export default function BirthdayWishes() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    fetchFeaturedWishes(6)
      .then((data) => setWishes(data || []))
      .catch((err) => {
        console.error('Error fetching featured wishes:', err);
        setWishes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, wishes.length);
    const validCards = cardsRef.current.filter(Boolean);

    if (validCards.length > 0 && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          validCards,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }, sectionRef);

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      return () => {
        clearTimeout(timer);
        ctx.revert();
      };
    }
  }, [wishes]);

  const selectedWish = selectedIndex !== null ? wishes[selectedIndex] : null;
  const handlePrev = selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null;
  const handleNext =
    selectedIndex !== null && selectedIndex < wishes.length - 1
      ? () => setSelectedIndex(selectedIndex + 1)
      : null;

  return (
    <section
      id="birthday-wishes-section"
      ref={sectionRef}
      className="relative min-h-screen py-24 px-4 md:px-8 bg-[#080808] text-[#F5F1EA] flex flex-col justify-center overflow-hidden border-t border-white/5"
    >
      {/* Ambient Glass Wall Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#B76E79]/15 via-[#D4AF37]/10 to-transparent rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/35 text-[#E89CA7] text-xs font-mono uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(183,110,121,0.2)]">
            <Heart className="w-3.5 h-3.5 fill-current text-[#B76E79]" />
            <span>Community Love</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F5F1EA] leading-tight drop-shadow-md">
            A Lot Of People Wanted To Tell You Something...
          </h2>

          <p className="text-sm md:text-base text-[#F5F1EA]/70 mt-4 leading-relaxed font-light max-w-xl mx-auto">
            Before my final letter, here are birthday notes from friends, teammates, and people who adore you ❤️
          </p>
        </div>

        {/* 🏛️ COMMUNITY WISHES GLASS WALL CONTAINER */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-[#121016]/75 border border-white/20 backdrop-blur-2xl shadow-[0_0_90px_rgba(183,110,121,0.25)] overflow-hidden group">
          {/* Shimmering Glass Reflection Highlight Line */}
          <div className="absolute -top-[200%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/[0.07] to-transparent rotate-45 pointer-events-none transition-transform duration-1000 group-hover:translate-x-1/3" />

          {/* Top Glass Wall Header Bar */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-2 font-mono text-xs text-[#E89CA7] uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <span className="font-semibold text-white/90">Community Wishes Glass Wall</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#B76E79] animate-ping" />
              <span className="font-mono text-[10px] text-[#E89CA7] uppercase tracking-wider font-medium">LIVE GLASS WALL</span>
            </div>
          </div>

          {/* Featured Wishes Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 relative z-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#18161c]/60 border border-white/10 rounded-3xl p-6 h-64 animate-pulse flex flex-col justify-between backdrop-blur-md"
                >
                  <div className="space-y-3">
                    <div className="h-4 bg-white/10 rounded-full w-1/4" />
                    <div className="h-4 bg-white/10 rounded-full w-3/4" />
                    <div className="h-4 bg-white/10 rounded-full w-1/2" />
                  </div>
                  <div className="h-4 bg-white/10 rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : wishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 relative z-10">
              {wishes.map((wish, idx) => {
                return (
                  <div
                    key={wish.id}
                    ref={(el) => (cardsRef.current[idx] = el)}
                    onClick={() => setSelectedIndex(idx)}
                    className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-[#B76E79]/70 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-xl group/card cursor-pointer hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(183,110,121,0.25)] relative overflow-hidden"
                  >
                    {/* Glass Shine Arc on Card Hover */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    {/* Expand Hint Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/60 p-2 rounded-full border border-white/20 text-[#E89CA7] backdrop-blur-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    <div>
                      <Quote className="w-6 h-6 text-[#B76E79]/50 mb-3" />

                      <p className="text-sm text-[#F5F1EA]/90 font-light leading-relaxed mb-6 whitespace-pre-wrap line-clamp-4">
                        "{wish.message}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-serif text-sm text-[#F5F1EA] font-medium block">
                          — {wish.name}
                        </span>
                        {wish.relationship && (
                          <span className="text-[11px] font-mono text-[#E89CA7]/80">
                            {wish.relationship}
                          </span>
                        )}
                      </div>
                      {wish.featured && (
                        <div className="p-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40">
                          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.03] border border-white/10 rounded-3xl p-8 max-w-md mx-auto mb-10 relative z-10 backdrop-blur-xl">
              <Heart className="w-8 h-8 text-[#B76E79]/60 mx-auto mb-3" />
              <p className="text-base font-serif text-[#F5F1EA]">No community wishes posted yet.</p>
              <p className="text-xs text-[#F5F1EA]/50 mt-1">Be the first to write a heartfelt note for her!</p>
            </div>
          )}

          {/* Glass Wall Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-white/10 relative z-10">
            <Link
              to="/wishes"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#F5F1EA] font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-md hover:border-white/40"
            >
              <span>VIEW ALL COMMUNITY WISHES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/wish"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#B76E79] hover:brightness-110 text-white font-medium text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(183,110,121,0.4)] transition-all"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>LEAVE HER A WISH ❤️</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Wish Pop-up Modal */}
      <WishDetailModal
        wish={selectedWish}
        onClose={() => setSelectedIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        currentIndex={selectedIndex !== null ? selectedIndex + 1 : null}
        totalCount={wishes.length}
      />
    </section>
  );
}
