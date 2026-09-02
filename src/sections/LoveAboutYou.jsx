import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const statements = [
  'YOUR SMILE.',
  'YOUR LAUGH.',
  'THE WAY YOU CARE.',
  'THE CHAOS YOU BRING.',
  'THE PERSON YOU ARE.',
];

export default function LoveAboutYou() {
  const containerRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
        },
      });

      // Reveal statement by statement in crisp serif focus
      statements.forEach((_, idx) => {
        const el = textRefs.current[idx];
        if (!el) return;

        tl.fromTo(
          el,
          { opacity: 0, scale: 0.85, filter: 'blur(10px)', y: 30 },
          {
            opacity: 1,
            scale: 1.05,
            filter: 'blur(0px)',
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
          }
        ).to(
          el,
          {
            opacity: 0,
            scale: 1.15,
            filter: 'blur(10px)',
            y: -30,
            duration: 0.8,
            ease: 'power3.in',
          },
          '+=0.8'
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="love-about-you-section"
      ref={containerRef}
      className="relative w-full h-screen bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#B76E79]/10 rounded-full filter blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Header */}
      <div className="absolute top-12 text-center z-20">
        <span className="font-mono text-xs text-[#B76E79] uppercase tracking-[0.4em] block">
          Section 08 — Things I Love About You
        </span>
      </div>

      {/* Center Statement Revealer Canvas */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center h-[50vh] flex items-center justify-center">
        {statements.map((text, index) => (
          <h2
            key={index}
            ref={(el) => (textRefs.current[index] = el)}
            className="absolute font-serif-cinematic text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#F5F1EA] drop-shadow-2xl opacity-0 select-none"
          >
            {text}
          </h2>
        ))}
      </div>
    </section>
  );
}
