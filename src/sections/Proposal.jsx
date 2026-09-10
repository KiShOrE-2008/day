import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ShieldCheck, Gift, Star, ArrowRight, Frown, RefreshCw, XCircle } from 'lucide-react';

import { sendProposalNotificationEmail } from '../lib/resendService';

gsap.registerPlugin(ScrollTrigger);

export default function Proposal() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [decision, setDecision] = useState('pending'); // pending | accepted | no_modal | no_accepted_time
  const [noHoverCount, setNoHoverCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Trigger heart-shaped romantic confetti celebration
  const triggerCelebration = () => {
    setDecision('accepted');
    sendProposalNotificationEmail({ answer: 'YES' }).catch(err => console.error(err));

    const count = 300;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#B76E79', '#E89CA7', '#FFFFFF', '#FFD700', '#FF69B4'],
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 35, startVelocity: 60 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleNoClick = () => {
    setDecision('no_modal');
  };

  return (
    <section
      id="proposal-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#080808] flex items-center justify-center py-24 px-4 overflow-hidden selection:bg-[#B76E79]/30"
    >
      {/* Background Aurora Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#B76E79]/20 via-[#E89CA7]/5 to-transparent rounded-full filter blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E89CA7]/10 rounded-full filter blur-[100px]" />
      </div>

      {/* Main Glass Card */}
      <div
        ref={cardRef}
        className="relative z-10 max-w-3xl w-full mx-auto text-center p-8 sm:p-14 rounded-3xl bg-[#141414]/80 border border-[#B76E79]/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(183,110,121,0.25)] flex flex-col items-center gap-8"
      >
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 text-[#E89CA7] text-xs font-mono tracking-widest uppercase animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>One Last Question For You</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {decision === 'pending' && (
          <>
            {/* Romantic Heading */}
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-serif-cinematic text-3xl sm:text-5xl md:text-6xl font-normal text-[#F5F1EA] leading-tight tracking-tight">
                Will You Walk This Journey With Me <span className="italic text-[#E89CA7] font-semibold">Forever?</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#A09A93] leading-relaxed max-w-xl mx-auto">
                From our first handshake on <span className="text-[#E89CA7] font-mono">04.09.2025</span> to every late night code commit, memory, and laugh... I want every future chapter of my life with you, Sowmiya.
              </p>
            </div>

            {/* Heart Divider Icon */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />
              <div className="mx-4 w-10 h-10 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 flex items-center justify-center animate-bounce">
                <Heart className="w-5 h-5 text-[#E89CA7] fill-[#E89CA7]" />
              </div>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />
            </div>

            {/* Interactive Decision Buttons */}
            <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 w-full">
              {/* Primary YES Button */}
              <button
                onClick={triggerCelebration}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-medium text-base sm:text-lg shadow-[0_0_30px_rgba(183,110,121,0.5)] hover:shadow-[0_0_50px_rgba(232,156,167,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 z-20 cursor-pointer"
              >
                <Heart className="w-5 h-5 fill-current animate-pulse" />
                <span>YES! I'D LOVE TO! 💖</span>
              </button>

              {/* Real NO Button */}
              <button
                onClick={handleNoClick}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/15 hover:border-red-400/40 text-white/70 hover:text-red-300 text-sm font-mono transition-all duration-300 cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-red-400/80" />
                <span>No... 💔</span>
              </button>
            </div>
          </>
        )}

        {/* NO Decision Confirmation Modal / Dialog */}
        {decision === 'no_modal' && (
          <div className="space-y-6 animate-fade-in py-2 max-w-lg">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-400">
              <Frown className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-3">
              <h3 className="font-serif-cinematic text-2xl sm:text-4xl font-bold text-white">
                Are you really sure, Sowmiya? 🥺
              </h3>
              <p className="font-sans text-sm text-[#A09A93] leading-relaxed">
                Think about 04.09.2025, our SIH hackathon nights, all the memes, laughter, and memories... Are you sure you want to say no?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={triggerCelebration}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-medium text-sm shadow-[0_0_25px_rgba(183,110,121,0.5)] hover:scale-105 transition-all"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Wait, change to YES! 💖</span>
              </button>

              <button
                onClick={() => {
                  setDecision('no_accepted_time');
                  sendProposalNotificationEmail({ answer: 'NEED_TIME' }).catch(err => console.error(err));
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 text-sm font-mono transition-all"
              >
                <span>I need a little more time 💭</span>
              </button>
            </div>
          </div>
        )}

        {/* NO: Need Time Response */}
        {decision === 'no_accepted_time' && (
          <div className="space-y-6 animate-fade-in py-4 max-w-lg">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 flex items-center justify-center text-[#E89CA7]">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs tracking-widest text-[#E89CA7] uppercase">
                ✦ Take All The Time You Need ✦
              </span>
              <h3 className="font-serif-cinematic text-2xl sm:text-4xl font-bold text-white">
                I'll Always Be Here For You ❤️
              </h3>
              <p className="font-sans text-sm text-[#A09A93] leading-relaxed">
                No matter what, your happiness means everything to me. Take all the time you need — I'll always be by your side as your biggest supporter.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDecision('pending')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono tracking-wider transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E89CA7]" />
                <span>Rethink Question</span>
              </button>
            </div>
          </div>
        )}

        {/* Proposal Accepted Celebration State */}
        {decision === 'accepted' && (
          <div className="space-y-6 animate-fade-in py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E89CA7] flex items-center justify-center shadow-[0_0_40px_rgba(232,156,167,0.7)] animate-bounce">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs tracking-widest text-[#00ff66] uppercase">
                ✦ Proposal Accepted ✦
              </span>
              <h3 className="font-serif-cinematic text-3xl sm:text-5xl font-bold text-white">
                You Just Made Me The Happiest Person Ever! ❤️
              </h3>
              <p className="font-serif-cinematic italic text-xl text-[#E89CA7]">
                “Forever and always, Miyaaaaww...”
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  const elem = document.getElementById('intro-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono tracking-wider transition-all"
              >
                <span>Relive Our Story From The Beginning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
