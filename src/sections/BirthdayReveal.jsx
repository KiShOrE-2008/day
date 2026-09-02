import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BirthdayReveal() {
  const containerRef = useRef(null);
  const letterArrayRef = useRef([]);
  const nicknameRef = useRef(null);
  const bdayContainerRef = useRef(null);
  const bigNumberRef = useRef(null);

  const letters = ['S', 'O', 'W', 'M', 'I', 'Y', 'A'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
        },
      });

      // 1. Reveal letters of S-O-W-M-I-Y-A one by one
      tl.fromTo(
        letterArrayRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out',
        }
      )

      // 2. Reveal Nickname identity "Miyaaaaww"
      .fromTo(
        nicknameRef.current,
        { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'back.out(1.4)',
        },
        '+=0.3'
      )
      .to([letterArrayRef.current, nicknameRef.current], {
        opacity: 0,
        y: -40,
        duration: 1,
      }, '+=1')

      // 3. Transition to warm birthday lighting & big number 29
      .fromTo(
        bdayContainerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.5 }
      )
      .fromTo(
        bigNumberRef.current,
        { scale: 0.6, opacity: 0, rotate: -5 },
        { scale: 1, opacity: 0.15, rotate: 0, duration: 2 },
        '<'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="birthday-reveal-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#080808] text-[#F5F1EA] flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B76E79]/15 via-[#080808]/90 to-[#080808] pointer-events-none" />

      {/* Part 1: Sowmiya R & Miyaaaaww Name Reveal Canvas */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mb-8">
          {letters.map((char, index) => (
            <span
              key={index}
              ref={(el) => (letterArrayRef.current[index] = el)}
              className="font-display-bold text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F5F1EA] to-[#B76E79] tracking-wider drop-shadow-2xl"
            >
              {char}
            </span>
          ))}
        </div>

        {/* Nickname Brand Identity */}
        <div ref={nicknameRef} className="opacity-0 space-y-3">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border border-[#B76E79]/40 text-[#E89CA7]">
            <Heart className="w-4 h-4 fill-[#B76E79] animate-pulse" />
            <span className="font-mono text-sm uppercase tracking-widest">Sowmiya R</span>
          </div>

          <h2 className="font-serif-cinematic text-4xl sm:text-6xl md:text-7xl italic font-bold text-[#E89CA7] drop-shadow-lg">
            Miyaaaaww ❤️
          </h2>
        </div>
      </div>

      {/* Part 2: Birthday 29 September 2026 Canvas */}
      <div
        ref={bdayContainerRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0 pointer-events-none"
      >
        {/* Massive Background Number 19 */}
        <div
          ref={bigNumberRef}
          className="absolute font-display-bold text-[28vw] font-extrabold text-[#B76E79] select-none pointer-events-none opacity-0"
        >
          19
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-2 text-[#E89CA7] font-mono text-xs sm:text-sm uppercase tracking-[0.4em]">
            <Sparkles className="w-4 h-4 animate-spin text-[#B76E79]" />
            <span>29 SEPTEMBER 2026</span>
            <Sparkles className="w-4 h-4 animate-spin text-[#B76E79]" />
          </div>

          <h1 className="font-serif-cinematic text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
            HAPPY BIRTHDAY
          </h1>

          <div className="font-serif-cinematic text-3xl sm:text-5xl md:text-6xl text-[#E89CA7] italic font-medium">
            MIYAAAW ✨
          </div>

          <p className="max-w-xl mx-auto font-sans-clean text-sm sm:text-base text-white/70 leading-relaxed font-light">
            Today is dedicated to celebrating you—your smile, your brilliant mind, and every chapter of our journey.
          </p>
        </div>
      </div>
    </section>
  );
}
