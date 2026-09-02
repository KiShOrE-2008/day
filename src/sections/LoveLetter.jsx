import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Feather, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LoveLetter() {
  const containerRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);
  const p4Ref = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          scrub: 1,
        },
      });

      tl.fromTo(
        photoRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2 }
      )
      .fromTo(
        p1Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.5'
      )
      .fromTo(
        p2Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '+=0.2'
      )
      .fromTo(
        p3Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        '+=0.2'
      )
      .fromTo(
        p4Ref.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2 },
        '+=0.2'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="love-letter-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#080808] text-[#F5F1EA] py-24 px-6 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Soft Ambient Candle Light Halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#B76E79]/10 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#B76E79]/30 text-xs font-mono text-[#E89CA7] uppercase tracking-widest mb-3">
          <Feather className="w-3.5 h-3.5" /> Section 09 — Love Letter
        </div>
        <h2 className="font-serif-cinematic text-4xl sm:text-5xl font-bold text-white">
          A Letter For Sowmiya
        </h2>
      </div>

      {/* Main Letter Card */}
      <div className="max-w-3xl mx-auto glass-panel p-8 sm:p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl space-y-8 relative">
        {/* Photo Header */}
        <div ref={photoRef} className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#B76E79] shadow-2xl p-1 bg-black">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Sowmiya R"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="font-mono text-xs text-[#E89CA7] uppercase tracking-widest">
            For My Dearest Miyaaaaww
          </div>
        </div>

        {/* Letter Text - Written / Progressive Reveal */}
        <div className="space-y-6 font-serif-cinematic text-lg sm:text-xl leading-relaxed text-[#F5F1EA]/90 font-light">
          <p ref={p1Ref} className="text-2xl sm:text-3xl text-white font-normal italic">
            Dear Miyaaaaww,
          </p>

          <p ref={p2Ref}>
            Looking back from 04 September 2025 to today, meeting you was one of those unexpected turning points that transformed everything. From working through code bugs to late-night CTF sessions in Hyderabad, every moment shared with you holds a special place in my heart.
          </p>

          <p ref={p3Ref}>
            Your intellect, your chaotic energy, your warmth, and the way you care inspire me every single day. You make ordinary moments feel cinematic and unforgettable.
          </p>

          <div ref={p4Ref} className="pt-6 text-center space-y-3">
            <p className="font-serif-cinematic text-2xl text-[#E89CA7] italic font-semibold">
              Thank you for being you, Sowmiya.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-[1px] bg-[#B76E79]/50" />
              <Heart className="w-6 h-6 text-[#B76E79] fill-[#B76E79] animate-pulse" />
              <div className="w-12 h-[1px] bg-[#B76E79]/50" />
            </div>
            <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
              Always & Forever
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
