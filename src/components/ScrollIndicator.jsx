import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, MousePointerClick } from 'lucide-react';

export default function ScrollIndicator({ label = "Scroll down to start story" }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (window.lenis) {
      window.lenis.scrollTo(window.innerHeight * 0.8, { duration: 1.2 });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleScrollClick}
      className={`cursor-pointer transition-all duration-700 transform flex flex-col items-center justify-center gap-2 group ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      }`}
    >
      {/* Floating Glowing Notification Badge */}
      <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#141414]/90 border border-[#B76E79]/50 shadow-[0_0_25px_rgba(183,110,121,0.35)] backdrop-blur-md group-hover:border-[#E89CA7] group-hover:shadow-[0_0_35px_rgba(232,156,167,0.5)] transition-all duration-300 animate-pulse-slow">
        {/* Sparkle icon */}
        <Sparkles className="w-3.5 h-3.5 text-[#E89CA7] animate-spin-slow" />
        
        {/* Notification Text */}
        <span className="text-xs sm:text-sm font-mono tracking-widest text-[#F5F1EA] group-hover:text-white font-medium">
          {label}
        </span>

        {/* Animated Bouncing Down Arrow */}
        <div className="w-5 h-5 rounded-full bg-[#B76E79]/30 flex items-center justify-center border border-[#B76E79]/50 group-hover:bg-[#B76E79]/50 transition-colors">
          <ChevronDown className="w-3.5 h-3.5 text-[#E89CA7] animate-bounce" />
        </div>
      </div>

      {/* Mouse Icon Hint */}
      <div className="w-5 h-8 border border-[#B76E79]/40 rounded-full flex justify-center p-1 group-hover:border-[#E89CA7] transition-colors">
        <div className="w-1 h-2.5 bg-gradient-to-b from-[#E89CA7] to-[#B76E79] rounded-full animate-bounce" />
      </div>
    </div>
  );
}
