import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { sendProposalNotificationEmail } from '../lib/emailService';

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------------
// 3D Animated Breaking Heart Component
// ----------------------------------------------------------------------------
function BreakingHeartAnimation() {
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
          <clipPath id="left-heart-half">
            <rect x="0" y="0" width="50" height="100" />
          </clipPath>
          <clipPath id="right-heart-half">
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
            clipPath="url(#left-heart-half)"
          />
        </g>

        {/* Right 3D Heart Piece */}
        <g className="animate-3d-break-right">
          <path
            d="M 50,88 C 20,65 5,45 5,28 C 5,14 16,5 29,5 C 38,5 46,10 50,18 C 54,10 62,5 71,5 C 84,5 95,14 95,28 C 95,45 80,65 50,88 Z"
            fill="rgba(255, 255, 255, 0.28)"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2.8"
            clipPath="url(#right-heart-half)"
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

export default function Proposal() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const canvasRef = useRef(null);

  // States: 'idle' | 'yes_phase1' | 'yes_phase2' | 'yes_phase3' | 'yes_phase4' | 'yes_phase5' | 'no_phase1' | 'no_phase2' | 'no_phase3' | 'no_phase4' | 'no_phase5'
  const [proposalState, setProposalState] = useState('idle');
  const [screenFlash, setScreenFlash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Entrance animation for proposal card
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.92, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
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

  // 3D Canvas Particle / Rain Engine with Z-Depth Parallax Projection
  useEffect(() => {
    if (proposalState === 'idle') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const maxParticles = proposalState.startsWith('yes') ? (isMobile ? 65 : 180) : (isMobile ? 35 : 90);
    const perspective = 600;

    // YES 3D Floating Heart & Sparkle Particles
    if (proposalState.startsWith('yes')) {
      const symbols = ['❤️', '💕', '💖', '✨', '🌸', '💗'];
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: (Math.random() - 0.5) * canvas.width,
          y: (Math.random() - 0.5) * canvas.height,
          z: Math.random() * 800 - 200, // Z depth range
          vx: (Math.random() - 0.5) * 14,
          vy: Math.random() * -12 - 4,
          vz: (Math.random() - 0.5) * 10,
          baseSize: Math.random() * 24 + 14,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          alpha: 1,
          gravity: 0.2,
          rotZ: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
        });
      }
    }

    // NO 3D Raindrops Engine
    if (proposalState.startsWith('no')) {
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 500,
          length: Math.random() * 25 + 12,
          speed: Math.random() * 10 + 6,
          alpha: Math.random() * 0.45 + 0.1,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (proposalState.startsWith('yes')) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.vy += p.gravity;
          p.rotZ += p.rotSpeed;
          p.alpha -= 0.006;

          if (p.alpha <= 0 || p.z <= -perspective) {
            particles.splice(i, 1);
            continue;
          }

          // 3D Perspective Projection
          const scale = perspective / (perspective + p.z);
          const projX = cx + p.x * scale;
          const projY = cy + p.y * scale;
          const projSize = p.baseSize * scale;

          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * scale));
          ctx.font = `${Math.max(6, projSize)}px serif`;
          ctx.translate(projX, projY);
          ctx.rotate(p.rotZ);
          ctx.fillText(p.symbol, 0, 0);
          ctx.restore();
        }
      } else if (proposalState.startsWith('no')) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const scale = perspective / (perspective + p.z);

          ctx.lineWidth = scale;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length * scale);
          ctx.stroke();

          p.y += p.speed * scale;
          if (p.y > canvas.height) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [proposalState, isMobile]);

  // --------------------------------------------------------------------------
  // 💖 YES 3D Celebration Click Sequence
  // --------------------------------------------------------------------------
  const handleYesClick = () => {
    if (proposalState !== 'idle') return;

    sendProposalNotificationEmail({ answer: 'YES' }).catch((err) => console.error(err));

    setProposalState('yes_phase1');
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 350);

    const tl = gsap.timeline();

    // 3D Button Bounce & Rotate
    tl.to(yesBtnRef.current, {
      scale: 1.22,
      rotateY: 20,
      rotateX: -10,
      duration: 0.18,
      ease: 'back.out(2.5)',
    })
      .to(yesBtnRef.current, {
        scale: 0.92,
        rotateY: -10,
        duration: 0.1,
      })
      .to(yesBtnRef.current, {
        scale: 1.05,
        rotateY: 0,
        rotateX: 0,
        duration: 0.15,
      });

    // 3D Card Spin Flip & Dissolve (0.4s → 2s)
    setTimeout(() => {
      setProposalState('yes_phase2');

      gsap.to(cardRef.current, {
        rotateY: 360,
        rotateX: 15,
        scale: 1.12,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.inOut',
      });
    }, 400);

    setTimeout(() => {
      setProposalState('yes_phase3');
    }, 2000);

    setTimeout(() => {
      setProposalState('yes_phase4');
    }, 3000);

    setTimeout(() => {
      setProposalState('yes_phase5');
    }, 5500);
  };

  // --------------------------------------------------------------------------
  // 🖤 NO 3D Sad Monochrome Sequence
  // --------------------------------------------------------------------------
  const handleNoClick = () => {
    if (proposalState !== 'idle') return;

    sendProposalNotificationEmail({ answer: 'NEED_TIME' }).catch((err) => console.error(err));

    setProposalState('no_phase1');

    // 3D Shake & Backwards Tilt Rejection
    gsap.to(noBtnRef.current, {
      rotateZ: 8,
      x: '+=8',
      yoyo: true,
      repeat: 5,
      duration: 0.08,
    });

    gsap.to(cardRef.current, {
      rotateX: -25,
      rotateY: 12,
      scale: 0.88,
      opacity: 0.15,
      duration: 1.4,
      ease: 'power2.inOut',
    });

    // Grayscale Color Drain
    gsap.to(containerRef.current, {
      filter: 'grayscale(1) brightness(0.6)',
      duration: 1.6,
      ease: 'power2.inOut',
    });

    setTimeout(() => {
      setProposalState('no_phase2');
    }, 1500);

    setTimeout(() => {
      setProposalState('no_phase3');
    }, 3000);

    setTimeout(() => {
      setProposalState('no_phase4');
    }, 4500);

    setTimeout(() => {
      setProposalState('no_phase5');
    }, 7000);
  };

  // Restore 3D Site Color & Alignment
  const handleRestoreColor = () => {
    gsap.to(containerRef.current, {
      filter: 'grayscale(0) brightness(1)',
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => {
        setProposalState('idle');
        if (cardRef.current) {
          gsap.set(cardRef.current, { opacity: 1, scale: 1, rotateX: 0, rotateY: 0 });
        }
      },
    });
  };

  return (
    <section
      id="proposal-section"
      ref={containerRef}
      className={`relative w-full min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden selection:bg-[#B76E79]/30 transition-colors duration-1000 [perspective:1000px] ${
        proposalState.startsWith('no') ? 'bg-[#050505]' : 'bg-[#080808]'
      }`}
    >
      {/* Screen Flash */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-[#E89CA7]/40 pointer-events-none animate-ping" />
      )}

      {/* 3D Particle / Rain Canvas */}
      {proposalState !== 'idle' && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-20 w-full h-full"
        />
      )}

      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full filter blur-[150px] transition-all duration-1000 ${
            proposalState.startsWith('no')
              ? 'bg-white/5'
              : proposalState.startsWith('yes')
              ? 'bg-radial from-[#E89CA7]/30 via-[#B76E79]/15 to-transparent'
              : 'bg-radial from-[#B76E79]/20 via-[#E89CA7]/5 to-transparent'
          }`}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. INITIAL PROPOSAL CARD (IDLE STATE) */}
      {/* ------------------------------------------------------------------ */}
      {proposalState === 'idle' && (
        <div
          ref={cardRef}
          className="relative z-10 max-w-3xl w-full mx-auto text-center p-8 sm:p-14 rounded-3xl bg-[#141414]/80 border border-[#B76E79]/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(183,110,121,0.25)] flex flex-col items-center gap-8 [transform-style:preserve-3d]"
        >
          {/* Top Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 text-[#E89CA7] text-xs font-mono tracking-widest uppercase animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>One Last Question For You</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

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

          <div className="relative flex items-center justify-center my-2">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />
            <div className="mx-4 w-10 h-10 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/40 flex items-center justify-center animate-bounce">
              <Heart className="w-5 h-5 text-[#E89CA7] fill-[#E89CA7]" />
            </div>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79]/50 to-transparent" />
          </div>

          <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 w-full [transform-style:preserve-3d]">
            <button
              ref={yesBtnRef}
              onClick={handleYesClick}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-medium text-base sm:text-lg shadow-[0_0_35px_rgba(183,110,121,0.6)] hover:shadow-[0_0_55px_rgba(232,156,167,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 z-20 cursor-pointer [transform-style:preserve-3d]"
            >
              <Heart className="w-5 h-5 fill-current animate-pulse" />
              <span>YES! I'D LOVE TO! 💖</span>
            </button>

            <button
              ref={noBtnRef}
              onClick={handleNoClick}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/5 hover:bg-red-500/10 border border-white/15 hover:border-red-400/40 text-white/70 hover:text-red-300 text-sm font-mono transition-all duration-300 cursor-pointer"
            >
              <span>No... 💔</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. 💖 YES 3D CELEBRATION SCENE */}
      {/* ------------------------------------------------------------------ */}
      {proposalState.startsWith('yes') && proposalState !== 'yes_phase1' && (
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
          {(proposalState === 'yes_phase4' || proposalState === 'yes_phase5') && (
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
          {proposalState === 'yes_phase5' && (
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
                  onClick={() => {
                    const elem = document.getElementById('intro-section');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    setProposalState('idle');
                    if (cardRef.current) gsap.set(cardRef.current, { opacity: 1, scale: 1, rotateX: 0, rotateY: 0 });
                  }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#B76E79] to-[#E89CA7] text-white font-mono text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(183,110,121,0.5)] hover:scale-105 transition-all"
                >
                  <span>Continue Our Story</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. 🖤 NO 3D SAD MONOCHROME SCENE */}
      {/* ------------------------------------------------------------------ */}
      {proposalState.startsWith('no') && (
        <div className="relative z-30 max-w-xl w-full mx-auto text-center space-y-8 p-8 animate-fade-in font-serif-cinematic [transform-style:preserve-3d]">
          {/* 3D Animated Breaking Heart */}
          {(proposalState === 'no_phase3' || proposalState === 'no_phase4' || proposalState === 'no_phase5') && (
            <BreakingHeartAnimation />
          )}

          {/* Sad Reflection Text */}
          {(proposalState === 'no_phase4' || proposalState === 'no_phase5') && (
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
          {proposalState === 'no_phase5' && (
            <div className="pt-6 animate-fade-in flex justify-center">
              <button
                onClick={handleRestoreColor}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-3.5 h-3.5 text-white/70" />
                <span>Return to our story</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
