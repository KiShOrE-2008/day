import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollIndicator from '../components/ScrollIndicator';
import CountdownTimer from '../components/CountdownTimer';

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const dateRef = useRef(null);
  const subRef = useRef(null);
  const bgImageRef = useRef(null);
  const countdownRef = useRef(null);

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

      // Step 1: Fade in initial date 04.09.2025 & countdown timer
      tl.fromTo(
        [dateRef.current, countdownRef.current],
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1 }
      )
      .to([dateRef.current, countdownRef.current], { opacity: 0.2, duration: 0.8 }, '+=0.5')

      // Step 2: Fade in quote part 1
      .fromTo(
        text1Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 }
      )
      .to(text1Ref.current, { opacity: 0, y: -20, duration: 0.8 }, '+=0.8')

      // Step 3: Fade in quote part 2
      .fromTo(
        text2Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 }
      )
      .to(text2Ref.current, { opacity: 0, y: -20, duration: 0.8 }, '+=0.8')

      // Step 4: Big camera zoom on final date and reveal background photograph
      .fromTo(
        subRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5 }
      )
      .to(bgImageRef.current, { opacity: 0.3, scale: 1.1, duration: 2 }, '<');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="intro-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Background Subtle Photograph Layer */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1000 filter grayscale contrast-125"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.95) 100%), url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      {/* Ambient Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B76E79]/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Content Canvas */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center min-h-[60vh]">
        {/* Date Stamp */}
        <div ref={dateRef} className="mb-2">
          <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#B76E79] uppercase">
            04 . 09 . 2025
          </span>
        </div>

        {/* Live Countdown Timer on First Page */}
        <div ref={countdownRef} className="w-full flex justify-center mb-4">
          <CountdownTimer />
        </div>

        {/* Phase 1 Text */}
        <h1
          ref={text1Ref}
          className="absolute font-serif-cinematic text-3xl sm:text-5xl md:text-6xl font-light text-[#F5F1EA] leading-relaxed tracking-wide opacity-0"
        >
          “Some dates look ordinary...”
        </h1>

        {/* Phase 2 Text */}
        <h1
          ref={text2Ref}
          className="absolute font-serif-cinematic text-3xl sm:text-5xl md:text-6xl font-light text-[#F5F1EA] leading-relaxed tracking-wide opacity-0"
        >
          “...until you realize they changed everything.”
        </h1>

        {/* Phase 3 Reveal */}
        <div ref={subRef} className="opacity-0 space-y-4">
          <h2 className="font-serif-cinematic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            04 / 09 / 2025
          </h2>
          <p className="font-serif-cinematic italic text-xl sm:text-3xl text-[#B76E79] font-light">
            The day I met you.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator label="Scroll to start story" />
      </div>
    </section>
  );
}
