import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Heart,
  Terminal,
  Code2,
  Sparkles,
  Star,
  ArrowDownRight,
  ArrowDownLeft,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Calendar
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    id: 'm1',
    step: '01',
    date: '04 / 09 / 2025',
    title: 'FIRST MEETING',
    tagline: 'The First Spark',
    desc: 'The beginning of everything. An unforgettable day where paths crossed and a quiet connection began to grow.',
    details: 'SIH 2025 team recruitment day. You came in wearing that iconic blue chudithar. A little wound on your right hand pinky finger, and that very first handshake that started our entire journey.',
    icon: Heart,
    color: '#B76E79',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
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
    details: 'From formal project discussions to talking until 3 AM about everything and nothing. Sharing memes, code snippets, songs, and realizing we speak the exact same language.',
    icon: Sparkles,
    color: '#E89CA7',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
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
    details: 'Late nights, intense debugging sessions, endless cups of coffee, and that instant synergy where we knew what the other needed without saying a word.',
    icon: Code2,
    color: '#00e5ff',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
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
    details: 'Traveling to Hyderabad together, solving security challenges side-by-side, exploring street foods, and creating an unforgettable core memory.',
    icon: Terminal,
    color: '#00ff66',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
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
    details: 'Celebrating your special day, looking back at every beautiful milestone, and stepping into a future full of endless love, growth, and adventures together.',
    icon: Star,
    color: '#F5F1EA',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
    align: 'center',
    tilt: 'rotate-0',
  },
];

export default function Timeline() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const pathRef = useRef(null);

  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(null);

  // Smooth keyboard navigation & Esc key handler for popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMilestoneIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedMilestoneIndex(null);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedMilestoneIndex((prev) => (prev + 1) % milestones.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedMilestoneIndex((prev) => (prev - 1 + milestones.length) % milestones.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMilestoneIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. GSAP ScrollTrigger for cards entering along zig-zag sides
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const isLeft = milestones[index].align === 'left';
        const isCenter = milestones[index].align === 'center';

        const xStart = isCenter ? 0 : isLeft ? -80 : 80;
        const rotateStart = isCenter ? 0 : isLeft ? -6 : 6;

        gsap.fromTo(
          card,
          { opacity: 0, x: xStart, y: 50, rotate: rotateStart, scale: 0.94 },
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

      // 2. Animate Curved SVG Path stroke
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

      // 3. Fade out timeline container when leaving section to prevent overlap
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

  const activeMilestone =
    selectedMilestoneIndex !== null ? milestones[selectedMilestoneIndex] : null;

  // Curved SVG path string for smooth organic serpentine S-curves between cards
  const curvedPathD =
    'M 250 120 C 650 120, 350 420, 750 420 C 350 420, 650 750, 250 750 C 650 750, 350 1080, 750 1080 C 650 1200, 600 1380, 500 1380';

  return (
    <section
      id="timeline-section"
      ref={containerRef}
      className="relative w-full bg-[#080808] pt-24 pb-40 px-4 sm:px-8 overflow-hidden z-10"
    >
      {/* Ambient glowing halos */}
      <div className="absolute top-1/4 left-5 w-[450px] h-[450px] bg-[#B76E79]/10 rounded-full filter blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-5 w-[450px] h-[450px] bg-[#00ff66]/10 rounded-full filter blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[#B76E79]/40 text-xs font-mono text-[#E89CA7] uppercase tracking-[0.3em] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-spin" />
          Section 05 — Interactive Story Roadmap
        </div>
        <h2 className="font-serif-cinematic text-4xl sm:text-6xl font-bold text-white mb-4">
          Our Story Roadmap
        </h2>
        <p className="font-sans-clean text-white/70 max-w-xl mx-auto font-light text-sm sm:text-base">
          A winding journey across core memories, hackathon hustle, and shared milestones. Click any box to view details & photos.
        </p>
      </div>

      {/* Extreme Zig-Zag Container */}
      <div className="relative max-w-5xl mx-auto z-10">
        {/* SVG Dynamic Curved Path with Floating Energy Beam (Visible on md+ screens) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox="0 0 1000 1500"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="curved-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B76E79" />
              <stop offset="30%" stopColor="#E89CA7" />
              <stop offset="60%" stopColor="#00e5ff" />
              <stop offset="85%" stopColor="#00ff66" />
              <stop offset="100%" stopColor="#F5F1EA" />
            </linearGradient>

            <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background glowing glow trace line */}
          <path
            d={curvedPathD}
            stroke="url(#curved-gradient)"
            strokeWidth="8"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#path-glow)"
          />

          {/* Main animated scroll path */}
          <path
            ref={pathRef}
            d={curvedPathD}
            stroke="url(#curved-gradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Traveling energy orb particles along the curve */}
          <circle r="6" fill="#00e5ff" filter="url(#path-glow)">
            <animateMotion path={curvedPathD} dur="6s" repeatCount="indefinite" />
          </circle>

          <circle r="4.5" fill="#E89CA7" filter="url(#path-glow)">
            <animateMotion path={curvedPathD} dur="6s" begin="3s" repeatCount="indefinite" />
          </circle>

          {/* Glowing node waypoints directly on the curve path */}
          <circle cx="250" cy="120" r="7" fill="#B76E79" filter="url(#path-glow)" />
          <circle cx="750" cy="420" r="7" fill="#E89CA7" filter="url(#path-glow)" />
          <circle cx="250" cy="750" r="7" fill="#00e5ff" filter="url(#path-glow)" />
          <circle cx="750" cy="1080" r="7" fill="#00ff66" filter="url(#path-glow)" />
          <circle cx="500" cy="1380" r="7" fill="#F5F1EA" filter="url(#path-glow)" />
        </svg>

        {/* Dynamic Curved Guide for Mobile */}
        <div className="absolute top-0 bottom-0 left-6 md:hidden w-[2px] bg-gradient-to-b from-[#B76E79] via-[#00e5ff] to-[#00ff66] opacity-70" />

        {/* Story Cards */}
        <div className="space-y-14 sm:space-y-20 relative z-10">
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
                {/* Main Card (No photo directly on card view) */}
                <div
                  className={`w-full md:w-[420px] pl-14 md:pl-0 ${item.tilt} hover:rotate-0 transition-transform duration-500`}
                >
                  <div
                    onClick={() => setSelectedMilestoneIndex(index)}
                    className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/15 hover:border-white/40 transition-all duration-300 shadow-2xl group hover:-translate-y-2 relative overflow-hidden bg-[#121212]/95 cursor-pointer"
                  >
                    {/* Background Step Watermark */}
                    <div className="absolute -top-4 -right-2 font-display-bold text-6xl font-extrabold text-white/5 select-none pointer-events-none group-hover:text-white/15 transition-colors">
                      {item.step}
                    </div>

                    {/* Card Top Header: Icon & Date Pill & Action Indicator */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full glass-panel border flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                          style={{ borderColor: item.color, boxShadow: `0 0 12px ${item.color}40` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <div className="px-3 py-1 rounded-full glass-panel text-[11px] font-mono tracking-widest text-white/90 border border-white/20">
                          {item.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-[#B76E79]/50 group-hover:bg-[#B76E79]/15 transition-all text-xs font-mono text-white/70 group-hover:text-[#E89CA7]">
                        <Maximize2 className="w-3.5 h-3.5 text-[#B76E79]" />
                        <span>View Photo</span>
                      </div>
                    </div>

                    {/* Title & Content */}
                    <div className="relative z-10 space-y-2">
                      <span
                        className="font-mono text-[11px] uppercase tracking-wider block font-bold"
                        style={{ color: item.color }}
                      >
                        {item.tagline}
                      </span>
                      <h3 className="font-serif-cinematic text-xl sm:text-2xl font-bold text-white group-hover:text-[#E89CA7] transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-sans-clean text-xs text-white/70 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Card Footer Click Prompt */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50 group-hover:text-white/80 transition-colors relative z-10">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#B76E79]" /> Click to open memory
                      </span>
                      {isLeft ? (
                        <ArrowDownRight className="w-4 h-4 text-[#B76E79] group-hover:translate-x-1 transition-transform" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-[#00ff66] group-hover:-translate-x-1 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FROSTED GLASS POPUP MODAL (PORTAL TO DOCUMENT BODY FOR PERFECT VIEWPORT CENTERING) */}
      {activeMilestone &&
        createPortal(
          <>
            {/* Backdrop Click to Close */}
            <div
              className="fixed top-0 left-0 w-screen h-screen z-[99990] bg-black/80 backdrop-blur-md animate-fade-in"
              onClick={() => setSelectedMilestoneIndex(null)}
            />

            {/* Frosted Glass Modal Container centered in screen viewport */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-[92vw] max-w-2xl bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] max-h-[85vh] flex flex-col transition-all duration-300">
              {/* Ambient Glowing Background Halos */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full filter blur-[100px] pointer-events-none opacity-30"
                style={{ backgroundColor: activeMilestone.color }}
              />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00e5ff]/20 rounded-full filter blur-[100px] pointer-events-none opacity-25" />

              {/* Glass Header Bar */}
              <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/15 bg-white/[0.04] backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-lg border shadow-lg"
                    style={{
                      borderColor: activeMilestone.color,
                      boxShadow: `0 0 18px ${activeMilestone.color}50`,
                    }}
                  >
                    <activeMilestone.icon className="w-5 h-5" style={{ color: activeMilestone.color }} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest block">
                      MILESTONE #{activeMilestone.step}
                    </span>
                    <span className="font-mono text-xs text-[#E89CA7] font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B76E79]" /> {activeMilestone.date}
                    </span>
                  </div>
                </div>

                {/* Navigation & Close Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedMilestoneIndex(
                        (selectedMilestoneIndex - 1 + milestones.length) % milestones.length
                      )
                    }
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                    title="Previous Memory (← Left Arrow)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() =>
                      setSelectedMilestoneIndex(
                        (selectedMilestoneIndex + 1) % milestones.length
                      )
                    }
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                    title="Next Memory (→ Right Arrow)"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setSelectedMilestoneIndex(null)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105 active:scale-95 ml-2"
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="relative z-10 overflow-y-auto p-6 space-y-5">
                {/* Glass Photo Frame */}
                <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl group bg-black/40">
                  <img
                    src={activeMilestone.image}
                    alt={activeMilestone.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/30 to-transparent opacity-90" />

                  <div className="absolute bottom-4 left-5 right-5 space-y-1">
                    <span
                      className="font-mono text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 inline-block"
                      style={{ color: activeMilestone.color }}
                    >
                      {activeMilestone.tagline}
                    </span>
                    <h3 className="font-serif-cinematic text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                      {activeMilestone.title}
                    </h3>
                  </div>
                </div>

                {/* Memory Story Details Box */}
                <div className="space-y-3 bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-inner">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-xs text-[#E89CA7] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" /> Memory Details
                    </h4>
                    <span className="font-mono text-[10px] text-white/40">
                      {selectedMilestoneIndex + 1} / {milestones.length}
                    </span>
                  </div>

                  <p className="font-sans-clean text-sm sm:text-base text-white/90 leading-relaxed font-light">
                    {activeMilestone.desc}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-start gap-2.5">
                    <div className="w-1.5 h-full rounded-full bg-gradient-to-b from-[#B76E79] to-[#00e5ff] shrink-0 self-stretch" />
                    <p className="font-sans-clean text-xs sm:text-sm text-white/75 leading-relaxed italic font-light">
                      "{activeMilestone.details}"
                    </p>
                  </div>
                </div>

                {/* Footer navigation hint */}
                <div className="flex items-center justify-between text-xs font-mono text-white/40 px-1 pt-1">
                  <span>Click outside or press Esc to exit</span>
                  <span className="hidden sm:inline">Use ← → arrow keys to flip memories</span>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </section>
  );
}


