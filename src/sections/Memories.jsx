import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Camera, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Single Featured Photo Memory
const singlePhoto = {
  id: 1,
  url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  title: 'Sowmiya R',
  caption: 'That unforgettable radiant smile — pure joy and endless laughter.',
  date: '04.09.2025',
};

export default function Memories() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const centerHeartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1.2,
          pin: true,
        },
      });

      // Bring single photo into tight cinematic scrapbook focus
      tl.fromTo(
        cardRef.current,
        {
          y: 80,
          scale: 0.8,
          opacity: 0,
          filter: 'blur(12px)',
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out',
        }
      );

      // Heart pulse effect
      tl.fromTo(
        centerHeartRef.current,
        { scale: 0, opacity: 0, rotate: -45 },
        { scale: 1.2, opacity: 1, rotate: 0, duration: 1.5, ease: 'back.out(1.7)' },
        '-=1'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="memories-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#B76E79]/15 rounded-full filter blur-[160px] pointer-events-none" />

      {/* Header text */}
      <div className="absolute top-16 sm:top-24 text-center z-20 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/35 text-[#E89CA7] text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
          <span>Section 04 — Single Featured Memory</span>
        </div>
        <h2 className="font-serif-cinematic text-3xl sm:text-5xl font-bold text-white">
          Moments Frozen in Time
        </h2>
      </div>

      {/* Center Single Photo Display Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-center px-4 mt-12">
        {/* Single Polaroid Glass Card */}
        <div
          ref={cardRef}
          className="relative z-20 w-full max-w-md bg-[#141216]/90 border border-[#B76E79]/40 p-4 sm:p-5 rounded-3xl backdrop-blur-2xl shadow-[0_0_80px_rgba(183,110,121,0.25)] transition-all duration-500 hover:scale-105 group cursor-pointer"
        >
          {/* Polaroid Image Container */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-4 bg-black">
            <img
              src={singlePhoto.url}
              alt={singlePhoto.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
            />
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-white/90 border border-white/20 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>{singlePhoto.date}</span>
            </div>
          </div>

          {/* Caption & Title */}
          <div className="px-2 text-center space-y-1.5">
            <h4 className="font-serif-cinematic text-2xl font-bold text-white group-hover:text-[#E89CA7] transition-colors">
              {singlePhoto.title}
            </h4>
            <p className="font-sans-clean text-xs sm:text-sm text-[#A09A93] italic font-light">
              “{singlePhoto.caption}”
            </p>
          </div>
        </div>

        {/* Floating Heart Anchor */}
        <div
          ref={centerHeartRef}
          className="mt-6 z-30 w-14 h-14 rounded-full glass-panel border border-[#B76E79]/50 flex flex-col items-center justify-center shadow-xl bg-[#080808]/80"
        >
          <Heart className="w-6 h-6 text-[#B76E79] fill-[#B76E79] animate-pulse" />
          <span className="font-mono text-[9px] text-[#E89CA7] tracking-tighter uppercase">
            US ❤️
          </span>
        </div>
      </div>
    </section>
  );
}
