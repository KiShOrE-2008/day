import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Terminal, Trophy, Code2, Sparkles, Star, ArrowDownRight, ArrowDownLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    id: 'm1',
    step: '01',
    date: '04 / 09 / 2025',
    title: 'FIRST MEETING',
    tagline: 'The First Spark',
    desc: 'The beginning of everything. An unforgettable day where paths crossed and a quiet connection began to grow.',
    icon: Heart,
    color: '#B76E79',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'm2',
    step: '02',
    date: 'LATE 2025',
    title: 'FIRST CONVERSATIONS',
    tagline: 'Endless Messages & Inside Jokes',
    desc: 'Late-night texts, shared playlists, tech banter, and realizing how effortlessly we understand each other.',
    icon: Sparkles,
    color: '#E89CA7',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'm3',
    step: '03',
    date: 'EARLY 2026',
    title: 'SIH 2026',
    tagline: 'Hackathon Hustle & Code Synergy',
    desc: 'Building together under pressure. Late-night commits, coffee runs, and discovering we make an unstoppable team.',
    icon: Code2,
    color: '#00e5ff',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'm4',
    step: '04',
    date: 'MID 2026',
    title: 'HYDERABAD CTF',
    tagline: 'The Unforgettable Memory',
    desc: 'Competing in Hyderabad. Solving security challenges, exploring the city, and building a memory that defined us.',
    icon: Terminal,
    color: '#00ff66',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'm5',
    step: '05',
    date: '29 / 09 / 2026',
    title: 'TODAY & BEYOND',
    tagline: 'Happy Birthday Miyaaaaww',
    desc: 'Looking back on how far we have come, celebrating you today, and looking forward to every adventure ahead.',
    icon: Star,
    color: '#F5F1EA',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    align: 'center',
    tilt: 'rotate-0',
  },
];

export default function Timeline() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. GSAP ScrollTrigger for cards entering along zig-zag sides
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const isLeft = milestones[index].align === 'left';
        const isCenter = milestones[index].align === 'center';

        const xStart = isCenter ? 0 : isLeft ? -100 : 100;
        const rotateStart = isCenter ? 0 : isLeft ? -8 : 8;

        gsap.fromTo(
          card,
          { opacity: 0, x: xStart, y: 60, rotate: rotateStart, scale: 0.92 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 2. Animate SVG Zig-Zag Path stroke
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 85%',
            scrub: 1,
          },
        });
      }

      // 3. Fade out timeline container when leaving section to prevent section overlap
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -30,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom 60%',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="timeline-section"
      ref={containerRef}
      className="relative w-full bg-[#080808] pt-24 pb-40 px-4 sm:px-8 overflow-hidden z-10"
    >
      {/* Ambient glowing halos */}
      <div className="absolute top-1/4 left-5 w-[400px] h-[400px] bg-[#B76E79]/10 rounded-full filter blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-5 w-[400px] h-[400px] bg-[#00ff66]/10 rounded-full filter blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[#B76E79]/40 text-xs font-mono text-[#E89CA7] uppercase tracking-[0.3em] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-spin" />
          Section 05 — Zig-Zag Journey
        </div>
        <h2 className="font-serif-cinematic text-4xl sm:text-6xl font-bold text-white mb-4">
          Our Story Roadmap
        </h2>
        <p className="font-sans-clean text-white/70 max-w-xl mx-auto font-light text-sm sm:text-base">
          A winding journey across core memories, hackathon hustle, and shared milestones.
        </p>
      </div>

      {/* Extreme Zig-Zag Container */}
      <div className="relative max-w-5xl mx-auto z-10">
        {/* SVG Glowing Zig-Zag Path (Visible on md+ screens) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox="0 0 1000 1500"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d="M 250 120 L 750 420 L 250 750 L 750 1080 L 500 1380"
            stroke="url(#zigzag-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="zigzag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B76E79" />
              <stop offset="30%" stopColor="#E89CA7" />
              <stop offset="60%" stopColor="#00e5ff" />
              <stop offset="85%" stopColor="#00ff66" />
              <stop offset="100%" stopColor="#F5F1EA" />
            </linearGradient>
          </defs>
        </svg>

        {/* Straight Fallback Guide for Mobile */}
        <div className="absolute top-0 bottom-0 left-6 md:hidden w-[2px] bg-gradient-to-b from-[#B76E79] via-[#00ff66] to-[#E89CA7]" />

        {/* Zig-Zag Story Cards */}
        <div className="space-y-16 sm:space-y-24 relative z-10">
          {milestones.map((item, index) => {
            const Icon = item.icon;
            const isLeft = item.align === 'left';
            const isCenter = item.align === 'center';

            return (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative flex flex-col md:flex-row items-center w-full ${
                  isCenter
                    ? 'justify-center'
                    : isLeft
                    ? 'md:justify-start'
                    : 'md:justify-end'
                }`}
              >
                {/* Milestone Node Badge */}
                <div
                  className={`z-20 w-10 h-10 rounded-full glass-panel border flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-125 absolute ${
                    isCenter
                      ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-6'
                      : isLeft
                      ? 'left-6 md:left-[25%] -translate-x-1/2'
                      : 'left-6 md:left-[75%] -translate-x-1/2'
                  }`}
                  style={{ borderColor: item.color, boxShadow: `0 0 15px ${item.color}40` }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>

                {/* Main Card */}
                <div
                  className={`w-full md:w-[420px] pl-14 md:pl-0 ${item.tilt} hover:rotate-0 transition-transform duration-500`}
                >
                  <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/15 hover:border-white/30 transition-all duration-300 shadow-2xl group hover:-translate-y-1.5 relative overflow-hidden bg-[#121212]/90">
                    {/* Background Subtle Step Watermark */}
                    <div className="absolute -top-4 -right-2 font-display-bold text-6xl font-extrabold text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                      {item.step}
                    </div>

                    {/* Image Box */}
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full glass-panel text-[10px] font-mono tracking-widest text-white border border-white/20">
                        {item.date}
                      </div>

                      {/* Directional Zig-Zag Indicator Arrow */}
                      <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full glass-panel border border-white/20 flex items-center justify-center text-white/80">
                        {isLeft ? (
                          <ArrowDownRight className="w-3.5 h-3.5 text-[#B76E79]" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-[#00ff66]" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <span
                      className="font-mono text-[11px] uppercase tracking-wider block mb-1 font-bold"
                      style={{ color: item.color }}
                    >
                      {item.tagline}
                    </span>
                    <h3 className="font-serif-cinematic text-xl sm:text-2xl font-bold text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="font-sans-clean text-xs text-white/70 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
