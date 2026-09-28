import React, { useState, useEffect, useRef, useCallback } from 'react';

const CORRECT_PASSWORD = import.meta.env.VITE_SITE_PASSWORD || '290907';
const SESSION_KEY = 'sow_auth';
const PIN_LENGTH = CORRECT_PASSWORD.length || 6;

/* ─── Floating background particle ─── */
function Particle({ style }) {
  return <div className="pg-particle" style={style} />;
}

/* ─── Explosive Confetti / Heart Burst Particle ─── */
function BurstParticle({ angle, distance, size, symbol, color, delay }) {
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;

  return (
    <span
      className="pg-burst-particle"
      style={{
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        fontSize: `${size}px`,
        color: color,
        animationDelay: `${delay}ms`,
      }}
    >
      {symbol}
    </span>
  );
}

/* ─── Single digit slot ─── */
function PinDot({ filled, isActive, isUnlocked }) {
  return (
    <div
      className={`pg-pin-dot ${filled ? 'pg-pin-dot--filled' : ''} ${
        isActive ? 'pg-pin-dot--active' : ''
      } ${isUnlocked ? 'pg-pin-dot--unlocked' : ''}`}
    >
      {filled && <div className="pg-pin-dot-inner" />}
    </div>
  );
}

/* ─── Numpad key ─── */
function Key({ value, onClick, isPressed }) {
  return (
    <button
      className={`pg-key ${isPressed ? 'pg-key--pressed' : ''}`}
      onClick={(e) => {
        e.currentTarget.blur();
        onClick(value);
      }}
      aria-label={value === '⌫' ? 'Backspace' : `Digit ${value}`}
      type="button"
      tabIndex={-1}
    >
      <span className="pg-key-label">{value}</span>
      <div className={`pg-key-ripple ${isPressed ? 'pg-key-ripple--active' : ''}`} />
    </button>
  );
}

/* ─── Typewriter Text Component ─── */
function TypewriterText({ text, speed = 50, delay = 150, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const startTimeout = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(intervalId);
          setIsDone(true);
          if (onComplete) onComplete();
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className="pg-typewriter">
      {displayedText}
      {!isDone && <span className="pg-cursor">|</span>}
    </span>
  );
}

export default function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('lock')) {
        sessionStorage.removeItem(SESSION_KEY);
        window.history.replaceState({}, '', window.location.pathname);
        return false;
      }
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('idle'); // idle | wrong | unlocking
  const [titleDone, setTitleDone] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [showBurst, setShowBurst] = useState(false);

  // Generate confetti burst items
  const [burstParticles] = useState(() => {
    const symbols = ['♥', '✦', '🌸', '✨', '•', '💖'];
    const colors = ['#E89CA7', '#B76E79', '#00ff66', '#ffd700', '#00e5ff'];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      angle: (i / 32) * 360 + Math.random() * 15,
      distance: Math.random() * 180 + 120,
      size: Math.random() * 14 + 10,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 150,
    }));
  });

  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      width: Math.random() * 4 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 6,
    }))
  );

  const lockRef = useRef(null);
  const dotsRef = useRef(null);

  /* ─── Global Relock Listener ─── */
  useEffect(() => {
    const handleRelock = () => {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
      setPin('');
      setStatus('idle');
      setTitleDone(false);
      setShowBurst(false);
      setUnlocked(false);
    };
    window.addEventListener('sow_relock', handleRelock);
    return () => window.removeEventListener('sow_relock', handleRelock);
  }, []);

  /* ─── Entrance animation ─── */
  useEffect(() => {
    if (unlocked) return;
    const el = lockRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.97)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    });
  }, [unlocked]);

  /* ─── Multi-Stage Unlocking Handler ─── */
  const handleKey = useCallback((val) => {
    if (status === 'wrong' || status === 'unlocking') return;

    setActiveKey(val);
    setTimeout(() => setActiveKey(null), 220);

    if (val === '⌫') {
      setPin(p => p.slice(0, -1));
      return;
    }

    if (pin.length >= PIN_LENGTH) return;

    const next = pin + val;
    setPin(next);

    if (next.length === PIN_LENGTH) {
      if (next === CORRECT_PASSWORD) {
        // Stage 1: Trigger unlock sequence
        setStatus('unlocking');
        try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch {}

        // Stage 2: Trigger confetti particle burst after lock opens
        setTimeout(() => {
          setShowBurst(true);
        }, 200);

        // Stage 3: Fade out screen with zoom & blur reveal
        setTimeout(() => {
          const el = lockRef.current;
          if (el) {
            el.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1), filter 1s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(1.12)';
            el.style.filter = 'blur(12px)';
          }
          setTimeout(() => {
            setUnlocked(true);
            setTimeout(() => {
              if (typeof window !== 'undefined' && window.ScrollTrigger) {
                window.ScrollTrigger.refresh();
              }
            }, 150);
          }, 1050);
        }, 1250);
      } else {
        setStatus('wrong');
        const dots = dotsRef.current;
        if (dots) {
          dots.classList.add('pg-shake');
          setTimeout(() => {
            dots?.classList.remove('pg-shake');
            setPin('');
            setStatus('idle');
          }, 650);
        }
      }
    }
  }, [pin, status]);

  /* ─── Physical keyboard support ─── */
  useEffect(() => {
    if (unlocked) return;
    const handler = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKey(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleKey('⌫');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [unlocked, handleKey]);

  if (unlocked) return children;

  const numpadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫'],
  ];

  return (
    <>
      <style>{`
        .pg-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #080808;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .pg-aurora {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(183,110,121,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(183,110,121,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(0,229,255,0.04) 0%, transparent 60%);
          transition: opacity 0.8s;
        }

        .pg-unlocking .pg-aurora {
          background:
            radial-gradient(ellipse 90% 70% at 50% 30%, rgba(0,255,106,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 70% 50% at 50% -10%, rgba(232,156,167,0.3) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 50% 80%, rgba(255,215,0,0.12) 0%, transparent 60%);
        }

        .pg-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(183,110,121,0.6);
          pointer-events: none;
          animation: pg-float linear infinite;
        }
        @keyframes pg-float {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }

        .pg-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%);
        }

        .pg-card {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          padding: 3rem 2.5rem 2.5rem;
        }

        /* Lock Icon & Shockwave Container */
        .pg-icon-wrap {
          position: relative;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(183,110,121,0.2), rgba(183,110,121,0.05));
          border: 1px solid rgba(183,110,121,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pg-pulse 3s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pg-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(183,110,121,0.25), 0 0 20px rgba(183,110,121,0.12); }
          50%      { box-shadow: 0 0 0 14px rgba(183,110,121,0), 0 0 30px rgba(183,110,121,0.2); }
        }

        .pg-lock-svg {
          width: 34px;
          height: 34px;
          fill: none;
          stroke: #B76E79;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.4s, transform 0.4s;
        }

        /* SVG Shackle Animation */
        .pg-shackle {
          transform-origin: 16px 11px;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s;
        }
        .pg-unlocking .pg-shackle {
          transform: translateY(-4px) rotate(-15deg);
          stroke: #00ff66;
        }

        /* Shockwave Ripple ring on Unlock */
        .pg-shockwave {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #00ff66;
          opacity: 0;
          pointer-events: none;
        }
        .pg-unlocking .pg-shockwave {
          animation: pg-shockwave-expand 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes pg-shockwave-expand {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(4.5); border-color: #E89CA7; }
        }

        /* Confetti Burst Particles */
        .pg-burst-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 30;
        }
        .pg-burst-particle {
          position: absolute;
          transform: translate(-50%, -50%);
          opacity: 0;
          animation: pg-burst-fly 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          user-select: none;
        }
        @keyframes pg-burst-fly {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.3);
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.2) rotate(180deg);
          }
        }

        .pg-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-height: 110px;
        }
        .pg-eyebrow {
          font-family: 'Fira Code', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #B76E79;
          opacity: 0.85;
          transition: color 0.4s;
        }
        .pg-unlocking .pg-eyebrow {
          color: #00ff66;
        }
        .pg-title {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 600;
          color: #F5F1EA;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
        .pg-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          color: rgba(160,154,147,0.85);
          letter-spacing: 0.04em;
          margin-top: 0.25rem;
        }

        .pg-cursor {
          display: inline-block;
          margin-left: 2px;
          color: #B76E79;
          font-weight: 300;
          animation: pg-blink 0.8s infinite;
        }
        @keyframes pg-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* PIN dots */
        .pg-dots {
          display: flex;
          gap: 0.9rem;
          align-items: center;
        }
        @keyframes pg-shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
        .pg-shake { animation: pg-shake 0.62s cubic-bezier(0.36,0.07,0.19,0.97) both; }

        .pg-pin-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid rgba(183,110,121,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s, transform 0.2s, background 0.3s, box-shadow 0.3s;
        }
        .pg-pin-dot--filled { border-color: #B76E79; transform: scale(1.1); }
        .pg-pin-dot--active { border-color: #E89CA7; }
        .pg-pin-dot--unlocked {
          border-color: #00ff66 !important;
          transform: scale(1.25) !important;
          box-shadow: 0 0 12px rgba(0, 255, 106, 0.8) !important;
        }
        .pg-pin-dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #E89CA7, #B76E79);
          box-shadow: 0 0 8px rgba(183,110,121,0.6);
          animation: pg-dot-pop 0.18s ease;
        }
        .pg-pin-dot--unlocked .pg-pin-dot-inner {
          background: linear-gradient(135deg, #00ff66, #00e5ff) !important;
          box-shadow: 0 0 10px rgba(0, 255, 106, 0.9) !important;
        }

        @keyframes pg-dot-pop {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.25); }
          100% { transform: scale(1); }
        }

        .pg-hint {
          font-family: 'Fira Code', monospace;
          font-size: 0.76rem;
          letter-spacing: 0.14em;
          min-height: 1.2rem;
          transition: opacity 0.3s, color 0.3s;
        }
        .pg-hint--wrong { color: #ff6b6b; opacity: 1; }
        .pg-hint--idle  { opacity: 0; }
        .pg-hint--unlock {
          color: #00ff66;
          opacity: 1;
          text-shadow: 0 0 12px rgba(0, 255, 106, 0.7);
          animation: pg-unlock-text 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pg-unlock-text {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .pg-numpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.7rem;
          width: min(300px, 88vw);
          transition: opacity 0.4s;
        }
        .pg-unlocking .pg-numpad {
          opacity: 0.25;
          pointer-events: none;
        }

        .pg-key {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s;
          -webkit-tap-highlight-color: transparent !important;
          outline: none !important;
          user-select: none;
        }
        .pg-key:focus,
        .pg-key:focus-visible,
        .pg-key:active {
          outline: none !important;
          box-shadow: none;
        }
        .pg-key:hover {
          background: rgba(183,110,121,0.12);
          border-color: rgba(183,110,121,0.3);
          transform: scale(1.04);
        }
        .pg-key:active,
        .pg-key--pressed {
          background: rgba(183, 110, 121, 0.35) !important;
          border-color: #E89CA7 !important;
          transform: scale(0.92) !important;
          box-shadow: 0 0 25px rgba(183, 110, 121, 0.6), inset 0 0 15px rgba(232, 156, 167, 0.4) !important;
          outline: none !important;
        }
        .pg-key--pressed .pg-key-label {
          color: #ffffff !important;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
        }
        .pg-key-empty {
          pointer-events: none;
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }
        .pg-key-label {
          font-family: 'Inter', sans-serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: #F5F1EA;
          letter-spacing: 0.02em;
          user-select: none;
          line-height: 1;
          transition: color 0.15s, text-shadow 0.15s;
        }
        .pg-key-ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(232,156,167,0.5) 0%, transparent 70%);
          opacity: 0;
          transform: scale(0);
          transition: opacity 0.3s, transform 0.3s;
        }
        .pg-key:active .pg-key-ripple,
        .pg-key-ripple--active {
          opacity: 1 !important;
          transform: scale(1.6) !important;
          transition: none !important;
        }

        .pg-divider {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(183,110,121,0.4), transparent);
          margin: -0.5rem 0;
        }

        /* Unlocking transformation */
        .pg-unlocking .pg-icon-wrap {
          animation: none;
          background: linear-gradient(135deg, rgba(0,255,106,0.25), rgba(0,229,255,0.1));
          border-color: #00ff66;
          box-shadow: 0 0 35px rgba(0,255,106,0.5), 0 0 70px rgba(0,255,106,0.25);
          transform: scale(1.15);
        }
        .pg-unlocking .pg-lock-svg {
          stroke: #00ff66;
        }
      `}</style>

      <div ref={lockRef} className={`pg-root ${status === 'unlocking' ? 'pg-unlocking' : ''}`}>
        <div className="pg-aurora" />
        <div className="pg-vignette" />

        {/* Ambient floating particles */}
        {particles.map(p => (
          <Particle
            key={p.id}
            style={{
              width: `${p.width}px`,
              height: `${p.width}px`,
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div className="pg-card">
          {/* Lock Icon & Shockwave Ring */}
          <div className="pg-icon-wrap">
            <div className="pg-shockwave" />
            <svg className="pg-lock-svg" viewBox="0 0 24 24">
              <path className="pg-shackle" d="M7 11V7a5 5 0 0 1 10 0v4" />
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <circle
                cx="12"
                cy="16"
                r="1.5"
                fill={status === 'unlocking' ? '#00ff66' : 'rgba(183,110,121,0.5)'}
                stroke="none"
              />
            </svg>

            {/* Explosive Confetti / Heart Burst */}
            {showBurst && (
              <div className="pg-burst-container">
                {burstParticles.map(p => (
                  <BurstParticle
                    key={p.id}
                    angle={p.angle}
                    distance={p.distance}
                    size={p.size}
                    symbol={p.symbol}
                    color={p.color}
                    delay={p.delay}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pg-header">
            <p className="pg-eyebrow">
              <TypewriterText text="Private Access" speed={40} delay={200} />
            </p>
            <h1 className="pg-title">
              <TypewriterText
                text="For Her Eyes Only"
                speed={70}
                delay={800}
                onComplete={() => setTitleDone(true)}
              />
            </h1>
            <p className="pg-subtitle">
              {titleDone && (
                <TypewriterText text="Enter the secret code to continue" speed={35} delay={100} />
              )}
            </p>
          </div>

          {/* PIN dots */}
          <div ref={dotsRef} className="pg-dots" aria-label="PIN entry">
            {Array.from({ length: PIN_LENGTH }, (_, i) => (
              <PinDot
                key={i}
                filled={i < pin.length}
                isActive={i === pin.length}
                isUnlocked={status === 'unlocking'}
              />
            ))}
          </div>

          {/* Status hint */}
          <p
            className={`pg-hint ${
              status === 'wrong'
                ? 'pg-hint--wrong'
                : status === 'unlocking'
                ? 'pg-hint--unlock'
                : 'pg-hint--idle'
            }`}
          >
            {status === 'wrong'
              ? 'Incorrect code — try again'
              : status === 'unlocking'
              ? '✦ ACCESS GRANTED — WELCOME SOWMIYA ✦'
              : '\u00A0'}
          </p>

          <div className="pg-divider" />

          {/* Numpad */}
          <div className="pg-numpad" role="group" aria-label="Number pad">
            {numpadRows.map((row, ri) =>
              row.map((val, ci) =>
                val === '' ? (
                  <button key={`${ri}-${ci}`} className="pg-key pg-key-empty" disabled aria-hidden="true" />
                ) : (
                  <Key
                    key={`${ri}-${ci}`}
                    value={val}
                    onClick={handleKey}
                    isPressed={activeKey === val}
                  />
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
