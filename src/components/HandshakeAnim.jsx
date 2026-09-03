import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function HandshakeAnim() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg mx-auto py-4 select-none pointer-events-none">
      {/* Background Energy Aura */}
      <div className="absolute w-48 h-48 bg-gradient-to-r from-[#B76E79]/30 via-[#E89CA7]/20 to-[#00ff66]/20 rounded-full filter blur-3xl animate-pulse" />

      {/* Main Vector Handshake Illustration */}
      <div className="relative z-10 animate-float">
        <svg
          className="w-72 sm:w-96 h-48 filter drop-shadow-[0_10px_25px_rgba(183,110,121,0.4)]"
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Arm & Cuff (My Hand) */}
          <path
            d="M 10 110 L 80 105 C 95 105 110 95 120 85 L 140 100 C 130 115 110 125 90 125 L 10 125 Z"
            fill="url(#left-arm-grad)"
            stroke="#B76E79"
            strokeWidth="2.5"
          />
          {/* Left Hand Fingers Interlocked */}
          <path
            d="M 120 85 C 130 75 145 75 155 85 C 160 90 160 100 150 105 C 142 110 135 115 125 115 Z"
            fill="#B76E79"
            fillOpacity="0.8"
            stroke="#E89CA7"
            strokeWidth="2"
          />

          {/* Right Arm & Cuff (Sowmiya's Hand) */}
          <path
            d="M 310 110 L 240 105 C 225 105 210 95 200 85 L 180 100 C 190 115 210 125 230 125 L 310 125 Z"
            fill="url(#right-arm-grad)"
            stroke="#E89CA7"
            strokeWidth="2.5"
          />
          {/* Right Hand Fingers Interlocked */}
          <path
            d="M 200 85 C 190 75 175 75 165 85 C 160 90 160 100 170 105 C 178 110 185 115 195 115 Z"
            fill="#E89CA7"
            fillOpacity="0.8"
            stroke="#F5F1EA"
            strokeWidth="2"
          />

          {/* Center Handshake Clasp Highlight */}
          <g transform="translate(160, 95)">
            <circle cx="0" cy="0" r="22" fill="#080808" stroke="#E89CA7" strokeWidth="2" />
            <Heart className="w-6 h-6 -translate-x-3 -translate-y-3 text-[#B76E79] fill-[#B76E79] animate-pulse" />
          </g>

          {/* Radiating Light Particles */}
          <circle cx="160" cy="95" r="35" stroke="#B76E79" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" />

          {/* Gradients */}
          <defs>
            <linearGradient id="left-arm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141414" />
              <stop offset="100%" stopColor="#B76E79" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="right-arm-grad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#141414" />
              <stop offset="100%" stopColor="#E89CA7" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Sparkles & Label */}
      <div className="relative z-10 flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full glass-panel border border-[#B76E79]/40 text-xs font-mono text-[#E89CA7] shadow-xl">
        <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-spin" />
        <span>04.09.2025 — The First Handshake</span>
        <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-[#B76E79] animate-pulse" />
      </div>
    </div>
  );
}
