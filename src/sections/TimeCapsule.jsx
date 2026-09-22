import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lock, Unlock, Sparkles, Clock, Calendar, Heart, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

export default function TimeCapsule() {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.capsule-box',
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleOpenCapsule = () => {
    setIsOpen(true);

    // Golden sparkling confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#B76E79', '#E89CA7', '#FFFFFF'],
    });
  };

  return (
    <section
      id="time-capsule-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#07070a] py-24 px-4 sm:px-8 flex flex-col items-center justify-center overflow-hidden selection:bg-[#FFD700]/30"
    >
      {/* Golden Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#FFD700]/10 via-[#B76E79]/5 to-transparent rounded-full filter blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto text-center space-y-10">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/35 text-[#FFD700] text-xs font-mono tracking-widest uppercase">
            <Clock className="w-3.5 h-3.5" />
            <span>08. Time Capsule</span>
            <Clock className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-serif-cinematic text-3xl sm:text-5xl font-bold text-[#F5F1EA] tracking-tight">
            For Miyaaaaww — <span className="italic text-[#FFD700]">29.09.2027</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#A09A93] leading-relaxed">
            A message sealed in time. Written today, dedicated to our future.
          </p>
        </div>

        {/* Sealed Capsule Box / Letter Display */}
        {!isOpen ? (
          <div className="capsule-box max-w-lg mx-auto p-10 sm:p-14 rounded-3xl bg-[#121118]/90 border border-[#FFD700]/30 shadow-[0_0_80px_rgba(255,215,0,0.15)] backdrop-blur-2xl flex flex-col items-center gap-6 group hover:border-[#FFD700]/60 transition-all duration-500">
            {/* Glowing Golden Lock Seal */}
            <div
              onClick={handleOpenCapsule}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD700]/20 to-[#B76E79]/20 border-2 border-[#FFD700]/60 flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(255,215,0,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all duration-500"
            >
              <Lock className="w-10 h-10 text-[#FFD700] group-hover:hidden transition-all" />
              <Unlock className="w-10 h-10 text-[#FFD700] hidden group-hover:block transition-all" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FFD700]">
                ✦ SEALED MESSAGE ✦
              </span>
              <h3 className="font-serif-cinematic text-2xl font-bold text-white">
                "A message from us, one year ago."
              </h3>
              <p className="font-sans text-xs text-[#A09A93]">
                Click the golden seal to break the wax and unfold the future letter.
              </p>
            </div>

            <button
              onClick={handleOpenCapsule}
              className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#B76E79]/30 hover:from-[#FFD700]/30 hover:to-[#B76E79]/50 border border-[#FFD700]/50 text-white font-mono text-xs tracking-wider transition-all duration-300 shadow-lg hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <span>UNSEAL TIME CAPSULE</span>
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#141216]/95 border border-[#FFD700]/40 shadow-[0_0_100px_rgba(255,215,0,0.2)] text-left space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#FFD700]/20 pb-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#FFD700]">
                <Calendar className="w-4 h-4" />
                <span>UNSEALED: 29.09.2027 TIME CAPSULE</span>
              </div>
              <Sparkles className="w-5 h-5 text-[#FFD700]" />
            </div>

            <div className="space-y-4 font-sans text-sm sm:text-base text-[#F5F1EA]/90 leading-relaxed italic border-l-2 border-[#FFD700]/50 pl-5 py-2 bg-white/[0.02] rounded-r-xl">
              <p className="font-serif-cinematic not-italic text-2xl text-[#FFD700] font-bold">
                “If you're reading this, one year has passed.”
              </p>
              <p>
                Think back to where we started on 04.09.2025 during SIH hackathon. Look how far we have come, how many memories we've built, and how many challenges we solved together.
              </p>
              <p>
                No matter where life has taken us since then, know that the love, respect, and promise made on this birthday site remains unchanged and forever strong.
              </p>
              <p className="font-serif-cinematic not-italic text-lg text-[#E89CA7] font-semibold pt-2">
                Always yours, forever and always. ❤️
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono transition-colors"
              >
                Reseal Time Capsule
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
