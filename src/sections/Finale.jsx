import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCcw, PartyPopper, Infinity as InfinityIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Finale() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const infinityRef = useRef(null);
  const [wishCount, setWishCount] = useState(29);
  const [hasSentWish, setHasSentWish] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          onEnter: () => triggerFireworks(),
        },
      });

      tl.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.9, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'power3.out' }
      )
      .fromTo(
        infinityRef.current,
        { opacity: 0, scale: 0.5, rotate: -90 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'back.out(1.7)' },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const triggerFireworks = () => {
    // Canvas confetti fireworks burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#B76E79', '#E89CA7', '#FFFFFF', '#00ff66', '#00e5ff'],
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleSendWish = () => {
    setWishCount((prev) => prev + 1);
    setHasSentWish(true);
    triggerFireworks();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="finale-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#080808] text-[#F5F1EA] flex flex-col items-center justify-center py-24 px-6 overflow-hidden text-center"
    >
      {/* Background Ambient Crimson & Rose Halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B76E79]/20 rounded-full filter blur-[180px] pointer-events-none" />

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Date */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border border-[#B76E79]/40 text-xs font-mono text-[#E89CA7] tracking-[0.4em] uppercase">
          <Sparkles className="w-4 h-4 text-[#B76E79] animate-spin" />
          29 . 09 . 2026
        </div>

        {/* Happy Birthday Sowmiya */}
        <div className="space-y-4">
          <h1 className="font-serif-cinematic text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
            HAPPY BIRTHDAY
          </h1>
          <h2 className="font-serif-cinematic text-4xl sm:text-6xl md:text-7xl text-[#E89CA7] italic font-semibold">
            SOWMIYA ❤️
          </h2>
        </div>

        <p className="font-serif-cinematic text-2xl sm:text-3xl text-white/90 font-light italic">
          “Miyaaaaww...”
        </p>

        {/* Infinity Sign */}
        <div ref={infinityRef} className="pt-4 pb-2 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full glass-panel border border-white/20 flex items-center justify-center text-[#E89CA7] shadow-2xl">
            <InfinityIcon className="w-10 h-10 animate-pulse" />
          </div>
          <span className="font-mono text-sm sm:text-base tracking-[0.3em] uppercase text-white/80 font-semibold">
            THIS IS ONLY THE BEGINNING.
          </span>
        </div>

        {/* Interactive Action Buttons */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-4">
          {/* Wish Button */}
          <button
            onClick={handleSendWish}
            className={`flex items-center gap-2 px-6 py-3 rounded-full glass-panel border transition-all duration-300 ${
              hasSentWish
                ? 'border-[#B76E79] text-[#E89CA7] bg-[#B76E79]/20'
                : 'border-white/20 text-white hover:border-[#B76E79] hover:text-[#E89CA7]'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasSentWish ? 'fill-[#B76E79]' : ''}`} />
            <span className="font-mono text-xs uppercase tracking-wider">
              {hasSentWish ? 'Wish Sent! ❤️' : 'Send Birthday Love'} ({wishCount})
            </span>
          </button>

          {/* Fireworks Button */}
          <button
            onClick={triggerFireworks}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel border border-white/20 text-white hover:border-[#00ff66] hover:text-[#00ff66] transition-all duration-300"
          >
            <PartyPopper className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">
              Fireworks ✨
            </span>
          </button>

          {/* Replay Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-wider">
              Replay Story
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-12 text-xs font-mono text-white/30 tracking-widest uppercase">
          Crafted with love for Sowmiya R • 2026
        </div>
      </div>
    </section>
  );
}
