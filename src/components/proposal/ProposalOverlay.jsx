import React from 'react';
import { Heart, RefreshCw, ArrowRight } from 'lucide-react';
import BreakingHeartAnimation from './BreakingHeartAnimation';

export default function ProposalOverlay({
  proposalState,
  onContinueStory,
  onRestoreColor,
}) {
  if (proposalState === 'idle') return null;

  return (
    <>
      {/* 💖 YES CELEBRATION OVERLAY */}
      {proposalState.startsWith('yes') && proposalState !== 'yes-intro' && (
        <div className="relative z-30 max-w-2xl w-full mx-auto text-center space-y-8 p-8 animate-fade-in [transform-style:preserve-3d]">
          {/* 3D Pulsing Heart Badge */}
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E89CA7] flex items-center justify-center shadow-[0_0_60px_rgba(232,156,167,0.8)] animate-bounce [transform:rotateX(10deg)_rotateY(10deg)]">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>

          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00ff66]">
              ✦ PROPOSAL ACCEPTED ✦
            </span>
            <h2 className="font-serif-cinematic text-4xl sm:text-6xl font-bold text-white tracking-tight">
              YOU SAID YES. <span className="text-[#E89CA7]">❤️</span>
            </h2>
            <p className="font-serif-cinematic italic text-xl sm:text-2xl text-[#E89CA7]">
              “And somehow... my favourite answer became my favourite moment.”
            </p>
          </div>

          {/* 3D Floating Infinity Symbol */}
          {(proposalState === 'yes-celebration' || proposalState === 'yes-final') && (
            <div className="py-4 space-y-4 animate-scale-up [transform-style:preserve-3d]">
              <div
                className="text-6xl sm:text-7xl font-bold text-[#E89CA7] drop-shadow-[0_0_40px_rgba(232,156,167,0.9)] animate-pulse inline-block"
                style={{
                  transform: 'perspective(1000px) rotateX(22deg) rotateY(-15deg) translateZ(40px)',
                }}
              >
                ∞
              </div>
              <p className="font-sans text-sm text-[#A09A93] tracking-widest uppercase font-mono">
                Here's to every chapter still waiting for us, Miyaaaaww.
              </p>
            </div>
          )}

          {/* Final Personal Message */}
          {proposalState === 'yes-final' && (
            <div className="pt-6 space-y-8 animate-fade-in border-t border-white/10 max-w-lg mx-auto">
              <div className="space-y-2 font-serif-cinematic text-lg sm:text-xl text-[#F5F1EA]/90 italic leading-relaxed">
                <p>“Thank you. ❤️”</p>
                <p>For choosing me. For staying. For every memory we've made.</p>
                <p className="text-[#E89CA7] not-italic font-semibold">
                  And for all the ones we haven't made yet.
                </p>
                <p className="font-mono text-xs text-white/50 not-italic pt-2">— Kishore</p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={onContinueStory}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-mono text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(183,110,121,0.5)] hover:scale-105 transition-all cursor-pointer"
                >
                  <span>Continue Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🖤 NO SAD MONOCHROME OVERLAY */}
      {proposalState.startsWith('no') && (
        <div className="relative z-30 max-w-xl w-full mx-auto text-center space-y-8 p-8 animate-fade-in font-serif-cinematic [transform-style:preserve-3d]">
          {/* 3D Animated Breaking Heart */}
          {(proposalState === 'no-heart' || proposalState === 'no-rain' || proposalState === 'no-final') && (
            <BreakingHeartAnimation />
          )}

          {/* Sad Reflection Text */}
          {(proposalState === 'no-rain' || proposalState === 'no-final') && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-normal text-white/90">
                It's okay.
              </h2>
              <div className="space-y-2 text-base sm:text-xl text-white/60 font-light leading-relaxed">
                <p>Maybe not today.</p>
                <p>Maybe not this chapter.</p>
                <p className="italic text-white/80">
                  But I'll still be grateful that our story happened.
                </p>
              </div>

              <div className="pt-4 font-mono text-xs text-white/40 uppercase tracking-widest">
                Take care, Miyaaaaww. <span className="opacity-40">❤️</span>
              </div>
            </div>
          )}

          {/* Return to Story Button */}
          {proposalState === 'no-final' && (
            <div className="pt-6 animate-fade-in flex justify-center">
              <button
                onClick={onRestoreColor}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white/70" />
                <span>Return to our story</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
