import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Heart, Sparkles, Handshake, Zap } from 'lucide-react';
import HandshakeAnim from '../components/HandshakeAnim';

gsap.registerPlugin(ScrollTrigger);

export default function FirstMeeting() {
  const containerRef = useRef(null);
  const blueBgRef = useRef(null);
  const darkOverlayRef = useRef(null);

  const handshakeStageRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=420%',
          scrub: 1.2,
          pin: true,
        },
      });

      // --- STEP 0: Handshake Vector Animation Entrance ---
      tl.fromTo(
        handshakeStageRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' }
      )
      .to(handshakeStageRef.current, { opacity: 0, y: -30, duration: 0.8 }, '+=1')

      // --- SCROLL 1: Title & "I still remember that day." ---
      .fromTo(
        step1Ref.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2 }
      )
      .to(step1Ref.current, { opacity: 0, y: -30, duration: 0.8 }, '+=1.2')

      // --- SCROLL 2: Blue-toned visual reveal & "The blue chudithar." ---
      .to(
        blueBgRef.current,
        { opacity: 0.85, scale: 1.05, duration: 1.5 },
        '<'
      )
      .fromTo(
        step2Ref.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5 }
      )
      .to(step2Ref.current, { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.8 }, '+=1')

      // --- SCROLL 3: "That little wound on your right hand pinky finger." ---
      .fromTo(
        step3Ref.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5 }
      )
      .to(step3Ref.current, { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.8 }, '+=1')

      // --- SCROLL 4: "And that very first handshake." -> Fade to Black ---
      .fromTo(
        step4Ref.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.5 }
      )
      .to(step4Ref.current, { opacity: 0, scale: 1.1, duration: 1 }, '+=1')
      .to(darkOverlayRef.current, { opacity: 1, duration: 1 }, '<')

      // --- SCROLL 5: "We couldn't join... But somehow... I GOT YOU ❤️" ---
      .to(darkOverlayRef.current, { opacity: 0.3, duration: 1 })
      .fromTo(
        step5Ref.current,
        { opacity: 0, scale: 0.9, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'back.out(1.4)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="first-meeting-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden text-center"
    >
      {/* Background Blue-Toned Aesthetic Photography Visual */}
      <div
        ref={blueBgRef}
        className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1000 filter contrast-125 saturate-150"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(12,24,45,0.75) 0%, rgba(8,8,8,0.98) 100%), url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      {/* Ambient Blue Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1e3a8a]/20 rounded-full filter blur-[160px] pointer-events-none" />

      {/* Full Dark Overlay for Fade to Black */}
      <div ref={darkOverlayRef} className="absolute inset-0 bg-black opacity-0 z-30 pointer-events-none" />

      {/* Section Header Tag (Positioned below fixed navbar) */}
      <div className="absolute top-20 sm:top-24 z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#B76E79]/40 text-xs font-mono text-[#E89CA7] uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5 text-[#B76E79]" /> Section 04 — First Meeting
        </div>
      </div>

      {/* Main Story Stage */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh] w-full">
        
        {/* --- STEP 0: Handshake Vector Illustration Animation Stage --- */}
        <div ref={handshakeStageRef} className="absolute w-full opacity-0 z-20">
          <HandshakeAnim />
        </div>

        {/* --- SCROLL 1: Intro --- */}
        <div ref={step1Ref} className="absolute space-y-6 opacity-0 z-20">
          <div className="inline-block font-mono text-xs sm:text-sm text-[#B76E79] tracking-[0.4em] uppercase">
            04 . 09 . 2025
          </div>
          <h2 className="font-serif-cinematic text-3xl sm:text-6xl font-bold text-white leading-tight">
            The Handshake That Started Everything
          </h2>
          <p className="font-sans-clean text-xs sm:text-base text-white/70 max-w-lg mx-auto font-light leading-relaxed">
            You were there because you wanted to join my team for the SIH 2025 inter-college round.
          </p>
          <div className="font-serif-cinematic text-xl sm:text-3xl text-[#E89CA7] italic font-light pt-2">
            “I still remember that day.”
          </div>
        </div>

        {/* --- SCROLL 2: The Blue Chudithar --- */}
        <div ref={step2Ref} className="absolute space-y-4 opacity-0 z-20">
          <span className="font-mono text-xs text-[#00e5ff] uppercase tracking-widest block">
            [ Memory Detail #01 ]
          </span>
          <h1 className="font-serif-cinematic text-4xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-300 drop-shadow-2xl">
            “The blue chudithar.”
          </h1>
        </div>

        {/* --- SCROLL 3: That little wound on your right hand pinky finger --- */}
        <div ref={step3Ref} className="absolute space-y-4 opacity-0 z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[#E89CA7]/40 text-xs font-mono text-[#E89CA7] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#B76E79]" />
            A detail that stayed forever
          </div>
          <h2 className="font-serif-cinematic text-3xl sm:text-6xl font-semibold text-[#F5F1EA] italic drop-shadow-2xl">
            “That little wound on your right hand pinky finger.”
          </h2>
        </div>

        {/* --- SCROLL 4: And that very first handshake --- */}
        <div ref={step4Ref} className="absolute space-y-6 opacity-0 z-20">
          <div className="w-20 h-20 rounded-full glass-panel border border-[#B76E79] flex items-center justify-center mx-auto text-[#E89CA7] shadow-2xl animate-bounce bg-[#B76E79]/20">
            <Handshake className="w-10 h-10 text-[#E89CA7]" />
          </div>
          <h1 className="font-serif-cinematic text-3xl sm:text-7xl font-bold text-white tracking-wide drop-shadow-2xl">
            “And that very first handshake.”
          </h1>
        </div>

        {/* --- SCROLL 5: The Emotional Climax --- */}
        <div ref={step5Ref} className="absolute space-y-8 opacity-0 z-40 max-w-2xl px-4">
          <div className="space-y-3">
            <p className="font-serif-cinematic text-xl sm:text-3xl text-white/80 italic font-light">
              “We couldn't join the competition together...”
            </p>
            <p className="font-mono text-sm sm:text-lg text-[#E89CA7] font-semibold tracking-wider">
              “but somehow...”
            </p>
          </div>

          <div className="pt-2 space-y-4">
            <h1 className="font-serif-cinematic text-5xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E89CA7] to-[#B76E79] tracking-tight drop-shadow-2xl">
              I GOT YOU. ❤️
            </h1>
            <p className="font-sans-clean text-xs sm:text-sm text-white/50 font-mono tracking-widest uppercase">
              The best outcome of SIH 2025
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
