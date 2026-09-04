import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const canvasRef = useRef(null);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isCyber, setIsCyber] = useState(false);

  const particlesRef = useRef([]);
  const lastPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle colors palette
    const colors = [
      '#B76E79', // Rose gold
      '#E89CA7', // Soft pink
      '#FFD700', // Sparkling gold
      '#F5F1EA', // Cream white
      '#FFB7C5', // Sakura pink
      '#FFFFFF', // Diamond white
    ];

    const cyberColors = ['#00ff66', '#00e5ff', '#39ff14', '#ffffff'];

    // Helper to draw a sparkling 4-pointed star
    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha, rotation) => {
      ctx.save();
      ctx.beginPath();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(0, -outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    };

    // Helper to create a single sparkle particle
    const createParticle = (x, y, isBurst = false, isCyber = false) => {
      const palette = isCyber ? cyberColors : colors;
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? Math.random() * 3.5 + 1.5 : Math.random() * 1.2 + 0.3;
      const size = Math.random() * 4 + 3;

      return {
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.2, // slight upward float
        size,
        maxSize: size,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        life: 0,
        maxLife: isBurst ? Math.random() * 35 + 25 : Math.random() * 25 + 20,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        isStar: Math.random() > 0.3, // 70% stars, 30% glow dots
      };
    };

    // Main animation render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gentle gravity
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        p.alpha = Math.max(0, 1 - progress);
        const currentSize = p.maxSize * (1 - progress * 0.6);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        if (p.isStar) {
          drawStar(
            ctx,
            p.x,
            p.y,
            4,
            currentSize * 1.2,
            currentSize * 0.3,
            p.color,
            p.alpha,
            p.rotation
          );
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse Move Listener
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });

      // Check if inside cyber section
      const cyberElem = document.getElementById('hyderabad-ctf-section');
      let cyberActive = false;
      if (cyberElem) {
        const rect = cyberElem.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          cyberActive = true;
        }
      }
      setIsCyber(cyberActive);

      // Spawn trail sparkles when moved > 6px
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        const numToSpawn = Math.min(3, Math.floor(dist / 8));
        for (let i = 0; i < numToSpawn; i++) {
          particlesRef.current.push(createParticle(x, y, false, cyberActive));
        }
        lastPosRef.current = { x, y };
      }
    };

    // Click Sparkle Burst Listener
    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const cyberActive = isCyber;

      // Burst 16 sparkling star particles on click
      for (let i = 0; i < 16; i++) {
        particlesRef.current.push(createParticle(x, y, true, cyberActive));
      }
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.getAttribute('role') === 'button' ||
        e.target.closest('button') ||
        e.target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isCyber]);

  return (
    <>
      {/* 60fps Canvas for Sparkling Trail & Click Bursts */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Main Cursor Glow Ring */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full transition-transform duration-150 ease-out transform -translate-x-1/2 -translate-y-1/2 ${
          isCyber
            ? 'w-10 h-10 border border-[#00ff66]/70 bg-[#00ff66]/10 shadow-[0_0_15px_rgba(0,255,106,0.5)]'
            : isHovered
            ? 'w-12 h-12 border border-[#B76E79] bg-[#B76E79]/20 shadow-[0_0_25px_rgba(183,110,121,0.4)] scale-125'
            : 'w-8 h-8 border border-white/30 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />

      {/* Center Dot */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 w-2 h-2 rounded-full transition-colors duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
          isCyber ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]' : 'bg-[#B76E79] shadow-[0_0_8px_#B76E79]'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </>
  );
}
