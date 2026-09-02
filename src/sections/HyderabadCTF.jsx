import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ShieldCheck, Cpu, Key, Lock, Unlock, Heart, Award, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HyderabadCTF() {
  const containerRef = useRef(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const terminalLines = [
    { text: '> INITIALIZING MEMORY DECRYPTION SYSTEM...', delay: 600 },
    { text: '> TARGET: SOWMIYA R [Miyaaaaww]', delay: 1200 },
    { text: '> LOCATION: HYDERABAD, INDIA', delay: 1800 },
    { text: '> EVENT: CTF COMPETITION 2026', delay: 2400 },
    { text: '> SEARCHING SHARED LOGS...', delay: 3000 },
    { text: '> STATUS: CORE MEMORY FOUND! 🔓', delay: 3600 },
    { text: '> ACCESS GRANTED ❤️', delay: 4200 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 60%',
        onEnter: () => {
          // Trigger terminal typing sequence
          let current = 0;
          const interval = setInterval(() => {
            current++;
            setTerminalStep(current);
            if (current >= terminalLines.length) {
              clearInterval(interval);
              setTimeout(() => {
                triggerGlitchUnlock();
              }, 800);
            }
          }, 650);
        },
        once: true,
      });
      // Fade out container when leaving section to prevent section overlap
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -30,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 60%',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Recalculate ScrollTrigger offsets when memory grid unlocks
  useEffect(() => {
    if (isUnlocked) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }
  }, [isUnlocked]);

  const triggerGlitchUnlock = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setIsUnlocked(true);
    }, 900);
  };

  return (
    <section
      id="hyderabad-ctf-section"
      ref={containerRef}
      className={`relative w-full min-h-screen transition-colors duration-1000 overflow-hidden py-20 px-4 sm:px-8 ${
        isUnlocked ? 'bg-[#080808]' : 'bg-[#050b14]'
      }`}
    >
      {/* Background Cyber Scanlines & Matrix Glow */}
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ff66]/10 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Tag */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-cyber text-xs font-mono text-[#00ff66] uppercase tracking-widest mb-3">
            <Terminal className="w-4 h-4 text-[#00ff66]" /> Section 06 — Cyber World
          </div>
          <h2 className="font-mono-cyber text-3xl sm:text-5xl font-bold text-white tracking-tight">
            [ HYDERABAD CTF MEMORY ]
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#00ff66]/80 mt-2">
            Where cybersecurity challenges met unforgettable moments.
          </p>
        </div>

        {/* Phase 1: Terminal Screen */}
        {!isUnlocked && (
          <div className={`max-w-3xl mx-auto glass-cyber rounded-xl p-6 sm:p-8 font-mono border border-[#00ff66]/40 shadow-2xl relative ${isGlitching ? 'glitch-effect' : ''}`}>
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between border-b border-[#00ff66]/20 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-[#00ff66]/70">root@miyaaaaww-ctf:~#</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#00ff66]">
                <Cpu className="w-4 h-4 animate-spin" /> ACTIVE SESSION
              </div>
            </div>

            {/* Terminal Output Stream */}
            <div className="space-y-3 min-h-[220px] text-sm sm:text-base">
              {terminalLines.slice(0, terminalStep).map((line, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 ${
                    index === terminalLines.length - 1
                      ? 'text-white font-bold text-base sm:text-lg animate-pulse'
                      : 'text-[#00ff66]'
                  }`}
                >
                  <span>{line.text}</span>
                </div>
              ))}
              {terminalStep < terminalLines.length && (
                <div className="inline-block w-2.5 h-5 bg-[#00ff66] animate-ping ml-1" />
              )}
            </div>

            {/* Terminal Unlock Button (for manual click if needed) */}
            <div className="mt-8 pt-4 border-t border-[#00ff66]/20 flex justify-end">
              <button
                onClick={triggerGlitchUnlock}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs uppercase tracking-wider font-bold hover:bg-[#00ff66] hover:text-black transition-all duration-300 shadow-lg shadow-[#00ff66]/20"
              >
                <Unlock className="w-4 h-4" /> Decrypt Memory Now
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Memory Revealed after Glitch */}
        {isUnlocked && (
          <div className="space-y-10 animate-fade-in">
            {/* Access Granted Banner */}
            <div className="glass-panel p-4 rounded-xl border border-[#00ff66]/40 flex items-center justify-between text-xs sm:text-sm font-mono">
              <div className="flex items-center gap-2 text-[#00ff66]">
                <ShieldCheck className="w-5 h-5" />
                <span>MEMORY UNLOCKED: HYDERABAD CTF COMPETITION</span>
              </div>
              <span className="text-[#B76E79] font-bold">ACCESS GRANTED ❤️</span>
            </div>

            {/* Photo Cards Grid for Hyderabad Memory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo 1: Team & CTF Arena */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 group hover:border-[#00ff66]/50 transition-all duration-500 shadow-2xl">
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
                    alt="Hyderabad CTF Memory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-cyber text-[10px] font-mono text-[#00ff66]">
                    FLAG_CAPTURED: SOWMIYA_HEART
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#00ff66] font-mono">
                    <MapPin className="w-3.5 h-3.5" /> Hyderabad CTF Arena
                  </div>
                  <h3 className="font-serif-cinematic text-2xl font-bold text-white">
                    The Hyderabad CTF Challenge
                  </h3>
                  <p className="font-sans-clean text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    Debugging code, exploiting binaries, and solving CTF flags together. Between terminal windows and keypresses, Hyderabad became a core milestone in our story.
                  </p>
                </div>
              </div>

              {/* Photo 2: Celebration & City Memories */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 group hover:border-[#B76E79]/50 transition-all duration-500 shadow-2xl">
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                    alt="Hyderabad City Memory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-panel text-[10px] font-mono text-[#E89CA7]">
                    LOCATION: HYDERABAD
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#E89CA7] font-mono">
                    <Award className="w-3.5 h-3.5" /> Beyond The Competition
                  </div>
                  <h3 className="font-serif-cinematic text-2xl font-bold text-white">
                    Late Night Talks & Celebration
                  </h3>
                  <p className="font-sans-clean text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    It wasn't just about winning points—it was the laughter after submission deadlines, exploring Hyderabad together, and realizing how perfectly we clicked.
                  </p>
                </div>
              </div>
            </div>

            {/* Replay Terminal Trigger */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setTerminalStep(0);
                }}
                className="font-mono text-xs text-white/50 hover:text-[#00ff66] transition-colors underline uppercase tracking-wider"
              >
                [ Re-run Cyber Decryption Sequence ]
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
