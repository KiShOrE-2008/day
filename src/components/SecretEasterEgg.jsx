import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Heart, ArrowRight } from 'lucide-react';

export default function SecretEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [targetEl, setTargetEl] = useState(null);
  const [pos, setPos] = useState({ top: '50%', left: '88%' });
  const [visible, setVisible] = useState(false);
  const [textStep, setTextStep] = useState(0);

  // Random section target & scroll visibility pulse
  useEffect(() => {
    const candidateSections = [
      'first-meeting-section',
      'timeline-section',
      'memories-section',
      'open-when-section',
      'love-letter-section',
      'time-capsule-section',
    ];

    const chosenId = candidateSections[Math.floor(Math.random() * candidateSections.length)];
    const randomTop = `${Math.floor(Math.random() * 50 + 25)}%`;
    const randomSide = Math.random() > 0.5 ? '8%' : '88%';

    setPos({ top: randomTop, left: randomSide });

    const timer = setTimeout(() => {
      const el = document.getElementById(chosenId);
      if (el) {
        if (getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        setTargetEl(el);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  // Trigger brief 2.5s visibility pulse on scroll transitions
  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      setVisible(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setVisible(false);
      }, 2500); // Fades in during scroll, fades out after 2.5s
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Staggered text progression when blackout opens
  useEffect(() => {
    if (isOpen) {
      setTextStep(0);
      const interval = setInterval(() => {
        setTextStep((prev) => (prev < 6 ? prev + 1 : prev));
      }, 900);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const heartButton = (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
      }}
      className={`z-30 p-2 rounded-full bg-[#B76E79]/20 hover:bg-[#B76E79]/50 border border-[#B76E79]/40 shadow-[0_0_20px_rgba(183,110,121,0.5)] transition-all duration-700 hover:scale-130 group cursor-pointer ${
        visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      title="Secret Hidden Heart ❤️"
    >
      <Heart className="w-3.5 h-3.5 text-[#E89CA7] fill-[#E89CA7] animate-pulse" />
    </button>
  );

  return (
    <>
      {/* Portal small heart into random section */}
      {targetEl && ReactDOM.createPortal(heartButton, targetEl)}

      {/* Cinematic Fullscreen Blackout Message Reveal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 sm:p-12 text-center animate-fade-in transition-opacity duration-1000 selection:bg-white/20">
          <div className="max-w-md w-full space-y-8 font-serif-cinematic">
            {/* Progression Line 1: You found it */}
            {textStep >= 1 && (
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-wide animate-fade-in">
                You found it. <span className="text-[#E89CA7]">❤️</span>
              </h2>
            )}

            {/* Progression Lines 2 & 3: I could have told you */}
            <div className="space-y-3 text-lg sm:text-xl text-[#F5F1EA]/80 font-light leading-relaxed">
              {textStep >= 2 && (
                <p className="animate-fade-in">
                  I could have told you this was here...
                </p>
              )}
              {textStep >= 3 && (
                <p className="animate-fade-in italic text-white/60">
                  But then it wouldn't have been a secret.
                </p>
              )}
            </div>

            {/* Progression Lines 4 & 5: Favorite things */}
            <div className="space-y-3 text-lg sm:text-xl text-[#F5F1EA]/90 font-light leading-relaxed pt-2">
              {textStep >= 4 && (
                <p className="animate-fade-in">
                  Some of my favourite things are the ones I never have to explain.
                </p>
              )}
              {textStep >= 5 && (
                <p className="animate-fade-in font-semibold text-[#E89CA7]">
                  You're one of them.
                </p>
              )}
            </div>

            {/* Progression Line 6: Signature */}
            {textStep >= 6 && (
              <div className="pt-6 space-y-8 animate-fade-in">
                <p className="font-sans text-sm text-white/50 tracking-widest uppercase">
                  — Kishore
                </p>

                {/* Return / Continue Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105"
                  >
                    <span>[ Continue ]</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E89CA7]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
