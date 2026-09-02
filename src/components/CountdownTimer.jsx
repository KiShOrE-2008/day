import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target: 29 September 2026 00:00:00
    const targetDate = new Date('2026-09-29T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3 my-6 animate-fade-in">
      {/* Title Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[#B76E79]/40 text-[#E89CA7] font-mono text-[11px] uppercase tracking-[0.25em] shadow-lg">
        <Sparkles className="w-3 h-3 text-[#B76E79] animate-spin" />
        <span>Countdown To 29 Sept 2026</span>
        <Heart className="w-3 h-3 text-[#B76E79] fill-[#B76E79] animate-pulse" />
      </div>

      {/* Countdown Grid */}
      <div className="flex items-center gap-2 sm:gap-4 font-mono">
        {/* Days */}
        <div className="flex flex-col items-center glass-panel px-3 sm:px-5 py-2.5 rounded-2xl border border-white/15 min-w-[65px] sm:min-w-[85px] shadow-xl hover:border-[#B76E79]/50 transition-colors group">
          <span className="font-display-bold text-2xl sm:text-4xl font-extrabold text-white group-hover:text-[#E89CA7] transition-colors">
            {timeLeft.days}
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#B76E79] font-mono uppercase tracking-widest mt-0.5">
            Days
          </span>
        </div>

        <span className="text-xl sm:text-2xl font-bold text-[#B76E79] animate-pulse">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center glass-panel px-3 sm:px-5 py-2.5 rounded-2xl border border-white/15 min-w-[65px] sm:min-w-[85px] shadow-xl hover:border-[#B76E79]/50 transition-colors group">
          <span className="font-display-bold text-2xl sm:text-4xl font-extrabold text-white group-hover:text-[#E89CA7] transition-colors">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#B76E79] font-mono uppercase tracking-widest mt-0.5">
            Hours
          </span>
        </div>

        <span className="text-xl sm:text-2xl font-bold text-[#B76E79] animate-pulse">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center glass-panel px-3 sm:px-5 py-2.5 rounded-2xl border border-white/15 min-w-[65px] sm:min-w-[85px] shadow-xl hover:border-[#B76E79]/50 transition-colors group">
          <span className="font-display-bold text-2xl sm:text-4xl font-extrabold text-white group-hover:text-[#E89CA7] transition-colors">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#B76E79] font-mono uppercase tracking-widest mt-0.5">
            Mins
          </span>
        </div>

        <span className="text-xl sm:text-2xl font-bold text-[#B76E79] animate-pulse">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center glass-panel px-3 sm:px-5 py-2.5 rounded-2xl border border-white/15 min-w-[65px] sm:min-w-[85px] shadow-xl hover:border-[#B76E79]/50 transition-colors group bg-[#B76E79]/10">
          <span className="font-display-bold text-2xl sm:text-4xl font-extrabold text-[#E89CA7] group-hover:text-white transition-colors">
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#E89CA7] font-mono uppercase tracking-widest mt-0.5">
            Secs
          </span>
        </div>
      </div>
    </div>
  );
}
