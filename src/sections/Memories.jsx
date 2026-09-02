import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Camera, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const photoList = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    title: 'Sowmiya R',
    caption: 'That unforgettable radiant smile.',
    rotate: '-6deg',
    pos: 'top-10 left-4 sm:left-12',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    title: 'Hyderabad Days',
    caption: 'Exploring together after the CTF.',
    rotate: '8deg',
    pos: 'top-20 right-4 sm:right-16',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    title: 'Miyaaaaww Moment',
    caption: 'Pure chaos and endless laughter.',
    rotate: '-4deg',
    pos: 'bottom-20 left-6 sm:left-24',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    title: 'SIH 2026 Memories',
    caption: 'Late night code & triumphs.',
    rotate: '5deg',
    pos: 'bottom-10 right-8 sm:right-20',
  },
];

export default function Memories() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const centerHeartRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.2,
          pin: true,
        },
      });

      // Scatter photos outwards then bring them into tight cinematic scrapbook focus
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const xOffset = idx % 2 === 0 ? -120 : 120;
        const yOffset = idx < 2 ? -80 : 80;

        tl.fromTo(
          card,
          {
            x: xOffset,
            y: yOffset,
            scale: 0.7,
            opacity: 0,
            filter: 'blur(12px)',
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
          },
          '<'
        );
      });

      // Center heart pulse effect
      tl.fromTo(
        centerHeartRef.current,
        { scale: 0, opacity: 0, rotate: -45 },
        { scale: 1.2, opacity: 1, rotate: 0, duration: 1.5, ease: 'back.out(1.7)' },
        '-=1'
      )
      // Fade out photos when scrolling past pinned section
      .to([...cardRefs.current, centerHeartRef.current], {
        opacity: 0,
        scale: 0.9,
        duration: 1,
      }, '+=0.8');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="memories-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Ambient Radial Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B76E79]/15 rounded-full filter blur-[160px] pointer-events-none" />

      {/* Header text */}
      <div className="absolute top-20 sm:top-24 text-center z-20 px-4">
        <span className="font-mono text-xs text-[#B76E79] uppercase tracking-[0.3em] block mb-1">
          Section 07 — Memory Scrapbook
        </span>
        <h2 className="font-serif-cinematic text-3xl sm:text-5xl font-bold text-white">
          Moments Frozen in Time
        </h2>
      </div>

      {/* Center Scrapbook Core Container */}
      <div className="relative z-10 w-full max-w-5xl h-[70vh] flex items-center justify-center">
        {/* Center Heart Anchor Node */}
        <div
          ref={centerHeartRef}
          className="z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full glass-panel border border-[#B76E79] flex flex-col items-center justify-center shadow-2xl glow-romantic bg-[#080808]/80"
        >
          <Heart className="w-8 h-8 text-[#B76E79] fill-[#B76E79] animate-pulse" />
          <span className="font-mono text-[9px] text-[#E89CA7] tracking-tighter uppercase mt-0.5">
            US ❤️
          </span>
        </div>

        {/* Floating Photo Cards */}
        {photoList.map((photo, index) => (
          <div
            key={photo.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`absolute ${photo.pos} z-20 w-52 sm:w-64 md:w-72 glass-panel p-3 rounded-2xl border border-white/15 shadow-2xl transition-all duration-300 hover:z-40 hover:scale-110 group cursor-pointer`}
            style={{ transform: `rotate(${photo.rotate})` }}
          >
            {/* Image Box styled as vintage Polaroid */}
            <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden mb-3 bg-black">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/80 border border-white/20">
                <Camera className="w-3 h-3 inline mr-1 text-[#B76E79]" />
                MEMORY #{photo.id}
              </div>
            </div>

            {/* Handwritten style caption */}
            <div className="px-1 text-left space-y-0.5">
              <h4 className="font-serif-cinematic text-lg font-bold text-white group-hover:text-[#B76E79] transition-colors">
                {photo.title}
              </h4>
              <p className="font-sans-clean text-xs text-white/70 italic font-light">
                “{photo.caption}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
