import React from 'react';

export default function BreakingHeartAnimation() {
  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center animate-fade-in my-4 [perspective:800px] [transform-style:preserve-3d]">
      <style>{`
        @keyframes draw3DCrack {
          0% { stroke-dasharray: 140; stroke-dashoffset: 140; opacity: 0; }
          40% { stroke-dashoffset: 0; opacity: 1; filter: drop-shadow(0 0 10px #ffffff); }
          100% { stroke-dashoffset: 0; opacity: 0.95; }
        }
        @keyframes breakLeft3D {
          0% { transform: perspective(800px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          30% { transform: perspective(800px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: perspective(800px) translate3d(-24px, 16px, 45px) rotateX(15deg) rotateY(-40deg) rotateZ(-22deg); opacity: 0.7; }
        }
        @keyframes breakRight3D {
          0% { transform: perspective(800px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          30% { transform: perspective(800px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: perspective(800px) translate3d(24px, 16px, -45px) rotateX(-15deg) rotateY(40deg) rotateZ(22deg); opacity: 0.7; }
        }
        @keyframes shardFloat3D {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translate3d(var(--tx), var(--ty), var(--tz)) rotateX(180deg) rotateY(360deg); opacity: 0; }
        }
        .animate-3d-crack {
          animation: draw3DCrack 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-3d-break-left {
          animation: breakLeft3D 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          transform-origin: 50% 88%;
        }
        .animate-3d-break-right {
          animation: breakRight3D 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          transform-origin: 50% 88%;
        }
      `}</style>

      {/* Floating 3D Shards */}
      <div className="absolute inset-0 pointer-events-none [transform-style:preserve-3d]">
        <div
          className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/70 rounded-full blur-[0.5px]"
          style={{
            '--tx': '-40px',
            '--ty': '-50px',
            '--tz': '80px',
            animation: 'shardFloat3D 2.2s 0.8s ease-out forwards',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-1.5 h-3 bg-white/60 rounded"
          style={{
            '--tx': '50px',
            '--ty': '-30px',
            '--tz': '-60px',
            animation: 'shardFloat3D 2.4s 0.9s ease-out forwards',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 w-2 h-2 bg-white/80 rounded-full"
          style={{
            '--tx': '-20px',
            '--ty': '60px',
            '--tz': '100px',
            animation: 'shardFloat3D 2.1s 1s ease-out forwards',
          }}
        />
      </div>

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_0_30px_rgba(255,255,255,0.45)] [transform-style:preserve-3d]"
      >
        <defs>
          <clipPath id="left-heart-half-3d">
            <rect x="0" y="0" width="50" height="100" />
          </clipPath>
          <clipPath id="right-heart-half-3d">
            <rect x="50" y="0" width="50" height="100" />
          </clipPath>
        </defs>

        {/* Left 3D Heart Piece */}
        <g className="animate-3d-break-left">
          <path
            d="M 50,88 C 20,65 5,45 5,28 C 5,14 16,5 29,5 C 38,5 46,10 50,18 C 54,10 62,5 71,5 C 84,5 95,14 95,28 C 95,45 80,65 50,88 Z"
            fill="rgba(255, 255, 255, 0.28)"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2.8"
            clipPath="url(#left-heart-half-3d)"
          />
        </g>

        {/* Right 3D Heart Piece */}
        <g className="animate-3d-break-right">
          <path
            d="M 50,88 C 20,65 5,45 5,28 C 5,14 16,5 29,5 C 38,5 46,10 50,18 C 54,10 62,5 71,5 C 84,5 95,14 95,28 C 95,45 80,65 50,88 Z"
            fill="rgba(255, 255, 255, 0.28)"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2.8"
            clipPath="url(#right-heart-half-3d)"
          />
        </g>

        {/* Center Dynamic 3D Crack Drawing */}
        <path
          d="M 50,14 L 46,28 L 54,42 L 45,58 L 52,72 L 50,88"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-3d-crack"
        />
      </svg>
    </div>
  );
}
