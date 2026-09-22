import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default React.forwardRef(function ProposalCard(
  { onYesClick, onNoClick, yesBtnRef, noBtnRef },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative z-10 max-w-3xl w-full mx-auto text-center p-8 sm:p-14 rounded-3xl bg-[#141414]/80 border border-[#B76E79]/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(183,110,121,0.25)] flex flex-col items-center gap-8 [transform-style:preserve-3d]"
    >
      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 text-[#E89CA7] text-xs font-mono tracking-widest uppercase animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>One Last Question For You</span>
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      {/* Heading & Intro */}
      <div className="space-y-4 max-w-2xl">
        <h2 className="font-serif-cinematic text-3xl sm:text-5xl md:text-6xl font-normal text-[#F5F1EA] leading-tight tracking-tight">
          Will You Walk This Journey With Me{' '}
          <span className="italic text-[#E89CA7] font-semibold">Forever?</span>
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#A09A93] leading-relaxed max-w-xl mx-auto">
          From our first handshake on{' '}
          <span className="text-[#E89CA7] font-mono">04.09.2025</span> to every late night code
          commit, memory, and laugh... I want every future chapter of my life with you, Sowmiya.
        </p>
      </div>

      {/* Heart Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />
        <div className="mx-4 w-10 h-10 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 flex items-center justify-center animate-bounce">
          <Heart className="w-5 h-5 text-[#E89CA7] fill-[#E89CA7]" />
        </div>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />
      </div>

      {/* Interactive Decision Buttons */}
      <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 w-full [transform-style:preserve-3d]">
        <button
          ref={yesBtnRef}
          onClick={onYesClick}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-medium text-base sm:text-lg shadow-[0_0_35px_rgba(183,110,121,0.6)] hover:shadow-[0_0_55px_rgba(232,156,167,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 z-20 cursor-pointer [transform-style:preserve-3d]"
        >
          <Heart className="w-5 h-5 fill-current animate-pulse" />
          <span>YES! I'D LOVE TO! 💖</span>
        </button>

        <button
          ref={noBtnRef}
          onClick={onNoClick}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/15 hover:border-red-400/40 text-white/70 hover:text-red-300 text-sm font-mono transition-all duration-300 cursor-pointer"
        >
          <span>No... 💔</span>
        </button>
      </div>
    </div>
  );
});
