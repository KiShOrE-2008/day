import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Quote, ArrowRight, Maximize2 } from 'lucide-react';
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
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B76E79]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/30 text-[#B76E79] text-xs font-mono uppercase tracking-widest mb-4">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Community Love</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F5F1EA] leading-tight">
            A Lot Of People Wanted To Tell You Something...
          </h2>

          <p className="text-sm md:text-base text-[#F5F1EA]/60 mt-4 leading-relaxed font-light">
            Before my final letter, here are birthday notes from friends, teammates, and people who adore you ❤️
          </p>
        </div>

        {/* Featured Wishes Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#121212]/50 border border-white/5 rounded-3xl p-6 h-64 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
                <div className="h-4 bg-white/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : wishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {wishes.map((wish, idx) => {
              return (
                <div
                  key={wish.id}
                  ref={(el) => (cardsRef.current[idx] = el)}
                  onClick={() => setSelectedIndex(idx)}
                  className="bg-[#121212]/80 border border-white/10 hover:border-[#B76E79]/60 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-xl group cursor-pointer hover:scale-[1.02] hover:shadow-2xl relative"
                >
                  {/* Expand Hint Icon */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1.5 rounded-full border border-white/20 text-[#B76E79]">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  <div>
                    <Quote className="w-6 h-6 text-[#B76E79]/40 mb-3" />

                    <p className="text-sm text-[#F5F1EA]/85 font-light leading-relaxed mb-6 whitespace-pre-wrap line-clamp-4">
                      "{wish.message}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-serif text-sm text-[#F5F1EA] font-medium block">
                        — {wish.name}
                      </span>
                      {wish.relationship && (
                        <span className="text-[11px] font-mono text-[#F5F1EA]/40">
                          {wish.relationship}
                        </span>
                      )}
                    </div>
                    {wish.featured && (
                      <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#121212]/40 border border-white/5 rounded-3xl p-8 max-w-md mx-auto mb-12">
            <p className="text-sm font-serif text-[#F5F1EA]/70">No community wishes posted yet.</p>
            <p className="text-xs text-[#F5F1EA]/40 mt-1">Be the first to write one for her!</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/wishes"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[#F5F1EA] font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all"
          >
            <span>VIEW ALL COMMUNITY WISHES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/wish"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:opacity-95 text-white font-medium text-xs font-mono flex items-center justify-center gap-2 shadow-lg hover:shadow-[#B76E79]/20 transition-all"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>LEAVE HER A WISH ❤️</span>
          </Link>
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

