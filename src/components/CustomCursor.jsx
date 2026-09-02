import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isCyber, setIsCyber] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if mouse is inside cyber section
      const cyberElem = document.getElementById('hyderabad-ctf-section');
      if (cyberElem) {
        const rect = cyberElem.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          setIsCyber(true);
          return;
        }
      }
      setIsCyber(false);
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
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Outer Glow Orb */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full transition-transform duration-150 ease-out transform -translate-x-1/2 -translate-y-1/2 ${
          isCyber
            ? 'w-10 h-10 border border-[#00ff66]/60 bg-[#00ff66]/10 shadow-[0_0_15px_rgba(0,255,106,0.4)]'
            : isHovered
            ? 'w-12 h-12 border border-[#B76E79] bg-[#B76E79]/20 shadow-[0_0_20px_rgba(183,110,121,0.3)] scale-125'
            : 'w-8 h-8 border border-white/20 bg-white/5'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
      {/* Center Dot */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 w-2 h-2 rounded-full transition-colors duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
          isCyber ? 'bg-[#00ff66]' : 'bg-[#B76E79]'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </>
  );
}
