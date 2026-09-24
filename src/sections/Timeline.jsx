import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Heart,
  Sparkles,
  Camera,
  Sun,
  Bus,
  Train,
  Code2,
  GraduationCap,
  Calendar,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  RefreshCw,
  Flower2,
  MapPin,
  ArrowRight,
  Star,
  Quote
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Complete Chronological 13 Relationship Timeline Milestones (2025 -> Aug 2026)
const milestones = [
  {
    id: 'diwali-2025',
    step: '01',
    date: '2025',
    dateFormatted: '2025',
    title: 'Diwali Celebration',
    emoji: '🎆',
    tagline: 'Diwali 2025',
    desc: 'Our Diwali celebration — one of the beautiful memories from 2025.',
    details: 'The glow of diyas, festive warmth, and spending our very first Diwali celebration together. A moment bathed in golden light that signaled the beginning of so many shared celebrations to come.',
    quote: 'Our Diwali celebration — one of the beautiful memories from 2025.',
    icon: Flame,
    color: '#FFD76A',
    secondaryColor: '#FF9E00',
    specialType: 'diwali',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'quoteify-college-day',
    step: '02',
    date: 'NOV 5, 2025',
    dateFormatted: 'Nov 5, 2025',
    title: 'Our First Full College Day',
    emoji: '🎓',
    tagline: 'First OD (On Duty)',
    desc: 'Quoteify — her first OD (on duty) and first full day of college with me.',
    details: 'Quoteify — her very first OD (on duty) day with me. Walking through college corridors together, sharing stories, and turning her first OD into an unforgettable milestone side-by-side.',
    quote: 'Quoteify — her first OD (on duty) with me.',
    icon: GraduationCap,
    color: '#E89CA7',
    secondaryColor: '#B76E79',
    specialType: 'college',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'photo-shoot',
    step: '03',
    date: 'NOV 14, 2025',
    dateFormatted: 'Nov 14, 2025',
    title: 'Photo Shoot',
    emoji: '📸',
    tagline: 'Through My Camera',
    desc: 'One of those days where I got to capture her through my camera.',
    details: 'Looking through the viewfinder, adjusting the focus, and capturing her genuine smiles. Photography has always been special to me, but framing her in my camera made every shot magical.',
    quote: 'One of those days where I got to capture her through my camera.',
    icon: Camera,
    color: '#00E5FF',
    secondaryColor: '#00B0FF',
    specialType: 'photoshoot',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'pongal-2026',
    step: '04',
    date: 'JAN 9, 2026',
    dateFormatted: 'Jan 9, 2026',
    title: 'Pongal Celebration',
    emoji: '🌾',
    tagline: 'Celebrating Together',
    desc: 'Celebrating Pongal together and creating another little chapter of our story.',
    details: 'Fresh harvests, sweet Pongal, traditional attire, and laughter. Celebrating Pongal together added another vibrant, joyful page to our growing storybook.',
    quote: 'Celebrating Pongal together and creating another little chapter of our story.',
    icon: Sparkles,
    color: '#FFB703',
    secondaryColor: '#FB8500',
    specialType: 'pongal',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'my-birthday-2026',
    step: '05',
    date: 'FEB 6, 2026',
    dateFormatted: 'Feb 6, 2026',
    title: 'My Birthday',
    emoji: '🎂',
    tagline: 'A Special Day',
    desc: 'My birthday — made more special because she was part of it.',
    details: 'Birthdays come every year, but having her by my side turned a simple date into one of the happiest days of my life. Her presence was the best gift I could ever ask for.',
    quote: 'My birthday — made more special because she was part of it.',
    icon: Heart,
    color: '#FF2A6D',
    secondaryColor: '#B76E79',
    specialType: 'birthday_me',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'tk-26',
    step: '06',
    date: 'FEB 26–28, 2026',
    dateFormatted: 'Feb 26–28, 2026',
    title: "TK'26",
    emoji: '🎭',
    tagline: 'College Memories Together',
    desc: "Four days of TK'26, filled with college memories, moments and memories together.",
    details: 'From event rushes and stage lights to quiet walks during festival breaks. Three non-stop days of campus energy where every hour was spent creating shared memories.',
    quote: "Four days of TK'26, filled with college memories, moments and memories together.",
    icon: Star,
    color: '#A855F7',
    secondaryColor: '#7C3AED',
    specialType: 'tk26',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'priya-birthday-2026',
    step: '07',
    date: 'APR 17, 2026',
    dateFormatted: 'Apr 17, 2026',
    title: "Priya's Birthday",
    emoji: '🎂',
    tagline: 'Memorable Day Together',
    desc: "Celebrating Priya's birthday and another memorable day together.",
    details: 'Cake cuts, birthday wishes, laughter, and celebrating her special milestone with happiness and love. Another unforgettable spring day added to our timeline.',
    quote: "Celebrating Priya's birthday and another memorable day together.",
    icon: Heart,
    color: '#F472B6',
    secondaryColor: '#EC4899',
    specialType: 'priya_birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'sun-and-shadows',
    step: '08',
    date: 'APR 26, 2026',
    dateFormatted: 'Apr 26, 2026',
    title: 'Sun & Shadows',
    emoji: '☀️',
    tagline: 'First Shadow Photo',
    desc: 'The sun photo — and our first shadow photo. A simple moment that became a special memory.',
    details: 'Golden afternoon sunlight casting our long shadows side-by-side on the ground. A quiet, intimate moment captured in silence — two shadows standing together against the world.',
    quote: 'The sun photo — and our first shadow photo. A simple moment that became a special memory.',
    icon: Sun,
    color: '#FBBF24',
    secondaryColor: '#F59E0B',
    specialType: 'sun_shadow',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'hyderabad-ctf',
    step: '09',
    date: 'JUL 10, 2026',
    dateFormatted: 'Jul 10, 2026',
    title: 'Hyderabad CTF',
    emoji: '🚌🚆',
    tagline: 'Her First 24-Hour Competition',
    desc: 'Her first 24-hour competition. But for me, the competition was not even the best part — the journey with her was. The bus journey going there and the train journey coming back became one of my favourite memories.',
    details: 'Her very first 24-hour cybersecurity competition! While the hackathon was thrilling, the bus journey heading to Hyderabad and the overnight train journey coming back became one of my absolute favourite memories of all time. Sitting by the train window, watching night lights pass by, talking for hours.',
    quote: 'The competition was memorable. But the journey with you was my favourite part.',
    journeyText: '🚌 Chennai → Hyderabad → 🚆 Chennai',
    journeySubtext: 'Some memories aren\'t about where we went. They\'re about who we went with.',
    icon: Bus,
    color: '#38BDF8',
    secondaryColor: '#0284C7',
    specialType: 'hyderabad_ctf',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    align: 'center',
    tilt: 'rotate-0',
  },
  {
    id: 'refresh-aug-14',
    step: '10',
    date: 'AUG 14, 2026',
    dateFormatted: 'Aug 14, 2026',
    title: 'Refresh',
    emoji: '✨',
    tagline: 'A Fresh Chapter',
    desc: 'A fresh chapter, another day and another memory together.',
    details: 'A clean slate, fresh energy, and turning the page into late summer. Re-energized, connected, and stepping into new goals with renewed joy.',
    quote: 'A fresh chapter, another day and another memory together.',
    icon: RefreshCw,
    color: '#34D399',
    secondaryColor: '#059669',
    specialType: 'refresh',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'onam-2026',
    step: '11',
    date: 'AUG 24, 2026',
    dateFormatted: 'Aug 24, 2026',
    title: 'Onam Celebration',
    emoji: '🌸',
    tagline: 'Celebrating Onam',
    desc: 'Celebrating Onam together and adding another beautiful memory to our story.',
    details: 'Vibrant flower petals, traditional attire, and festive happiness. Celebrating Onam together brought warmth, beauty, and color into our shared story.',
    quote: 'Celebrating Onam together and adding another beautiful memory to our story.',
    icon: Flower2,
    color: '#FACC15',
    secondaryColor: '#EAB308',
    specialType: 'onam',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
  {
    id: 'sih-2026',
    step: '12',
    date: 'AUG 27–28, 2026',
    dateFormatted: 'Aug 27–28, 2026',
    title: "SIH'26",
    emoji: '💻',
    tagline: 'SIH Memories',
    desc: 'SIH memories — two days of ideas, teamwork, pressure and moments together.',
    details: '36 hours of relentless coding, intense hackathon pressure, whiteboard brainstorms, and late-night coffee runs. Facing high-stakes deadlines together and coming out stronger as a team.',
    quote: 'SIH memories — two days of ideas, teamwork, pressure and moments together.',
    icon: Code2,
    color: '#00E5FF',
    secondaryColor: '#0088FF',
    specialType: 'sih26',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    align: 'left',
    tilt: '-rotate-2',
  },
  {
    id: 'sister-graduation',
    step: '13',
    date: 'AUG 29, 2026',
    dateFormatted: 'Aug 29, 2026',
    title: "Sister's Graduation",
    emoji: '🎓📸',
    tagline: 'Photographer for Both',
    desc: 'A special day for sister — and I got to be the photographer for both of them, capturing the moments through my camera.',
    details: 'Graduation gowns, black caps tossed in the air, and family pride. I had the privilege of being their official photographer for the day, capturing every proud smile and sisterly hug through my camera lens.',
    quote: 'A special day for sister — and I got to be the photographer for both of them, capturing the moments through my camera.',
    icon: Camera,
    color: '#A7F3D0',
    secondaryColor: '#10B981',
    specialType: 'graduation',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    align: 'right',
    tilt: 'rotate-2',
  },
];

export default function Timeline() {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const pathRef = useRef(null);

  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(null);
  const [flashActive, setFlashActive] = useState(false);

  // Trigger camera flash animation when photographer milestone is opened
  const triggerCameraFlash = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 500);
  };

  const handleOpenMilestone = (index) => {
    const item = milestones[index];
    if (item.specialType === 'photoshoot' || item.specialType === 'graduation') {
      triggerCameraFlash();
    }
    setSelectedMilestoneIndex(index);
  };

  // Keyboard Navigation for Modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMilestoneIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedMilestoneIndex(null);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const nextIdx = (selectedMilestoneIndex + 1) % milestones.length;
        if (milestones[nextIdx].specialType === 'photoshoot' || milestones[nextIdx].specialType === 'graduation') {
          triggerCameraFlash();
        }
        setSelectedMilestoneIndex(nextIdx);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prevIdx = (selectedMilestoneIndex - 1 + milestones.length) % milestones.length;
        if (milestones[prevIdx].specialType === 'photoshoot' || milestones[prevIdx].specialType === 'graduation') {
          triggerCameraFlash();
        }
        setSelectedMilestoneIndex(prevIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMilestoneIndex]);

  // GSAP ScrollTrigger for HTML Story Cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const isLeft = milestones[index].align === 'left';
        const isCenter = milestones[index].align === 'center';

        const xStart = isCenter ? 0 : isLeft ? -70 : 70;
        const rotateStart = isCenter ? 0 : isLeft ? -5 : 5;

        gsap.fromTo(
          card,
          { opacity: 0, x: xStart, y: 40, rotate: rotateStart, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Animate Central Timeline Line (Div scaleY or SVG stroke)
      if (pathRef.current) {
        if (typeof pathRef.current.getTotalLength === 'function') {
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
        } else {
          gsap.fromTo(
            pathRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'top center',
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
                end: 'bottom 85%',
                scrub: 1,
              },
            }
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeMilestone =
    selectedMilestoneIndex !== null ? milestones[selectedMilestoneIndex] : null;

  // Curved SVG path string for 2D desktop backup trace
  const curvedPathD =
    'M 250 120 C 650 120, 350 450, 750 450 C 350 450, 650 800, 250 800 C 650 800, 350 1150, 750 1150 C 650 1150, 350 1500, 250 1500 C 650 1500, 350 1850, 750 1850 C 650 1850, 350 2200, 250 2200 C 650 2200, 350 2550, 750 2550 C 650 2550, 350 2900, 250 2900 C 650 2900, 350 3250, 750 3250 C 650 3250, 500 3500, 500 3500';

  return (
    <section
      id="timeline-section"
      ref={containerRef}
      className="relative w-full bg-[#080808] pt-24 pb-44 px-4 sm:px-8 overflow-hidden z-10 select-none"
    >
      {/* Flash animation trigger overlay */}
      {flashActive && (
        <div className="fixed inset-0 z-[100000] bg-white pointer-events-none animate-ping opacity-90 transition-opacity duration-300" />
      )}

      {/* Subtle Soft Ambient Glowing Halos */}
      <div className="absolute top-1/6 left-5 w-[450px] h-[450px] bg-[#B76E79]/8 rounded-full filter blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-5 w-[450px] h-[450px] bg-[#38BDF8]/8 rounded-full filter blur-[180px] pointer-events-none" />

      {/* Timeline Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-20 sm:mb-28 relative z-10 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-[#B76E79]/40 text-xs font-mono text-[#E89CA7] uppercase tracking-[0.3em] mb-4 shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-spin" />
          Section 05 — Story Roadmap
        </div>
        <h2 className="font-serif-cinematic text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
          OUR STORY
        </h2>
        <p className="font-mono text-sm sm:text-base text-[#E89CA7] font-semibold tracking-widest uppercase mb-3">
          2025 → 2026
        </p>
        <p className="font-sans-clean text-white/70 max-w-xl mx-auto font-light text-sm sm:text-base leading-relaxed">
          A collection of moments that became memories. Scroll through our story or click any milestone to open story details.
        </p>
      </div>

      {/* Main Timeline Grid Container */}
      <div className="relative max-w-5xl mx-auto z-10">
        {/* Central Vertical Axis Line (Desktop: center, Mobile: left-6) */}
        <div className="absolute top-4 bottom-12 left-6 md:left-1/2 -translate-x-1/2 w-[3px] bg-white/10 rounded-full">
          {/* Animated Scroll Fill Line */}
          <div
            ref={pathRef}
            className="w-full bg-gradient-to-b from-[#FFD76A] via-[#FF2A6D] via-[#38BDF8] to-[#A7F3D0] rounded-full shadow-[0_0_15px_rgba(232,156,167,0.6)]"
            style={{ height: '100%' }}
          />
        </div>

        {/* Story Milestone Cards */}
        <div className="space-y-16 sm:space-y-24 relative z-10">
          {milestones.map((item, index) => {
            const Icon = item.icon;
            const isLeft = item.align === 'left';
            const isCenter = item.align === 'center';
            const isHyderabad = item.specialType === 'hyderabad_ctf';
            const isSunShadow = item.specialType === 'sun_shadow';
            const isGraduation = item.specialType === 'graduation';
            const isBirthday = item.specialType === 'birthday_me';

            return (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`relative flex items-center w-full ${
                  isCenter
                    ? 'justify-center'
                    : isLeft
                    ? 'md:justify-start'
                    : 'md:justify-end'
                }`}
              >
                {/* Central Timeline Node Dot (Desktop: center line, Mobile: left-6) */}
                <div
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 w-8 h-8 rounded-full glass-panel border-2 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-125"
                  style={{
                    borderColor: item.color,
                    boxShadow: `0 0 16px ${item.color}60`,
                    backgroundColor: '#080808',
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: item.color }}
                  />
                </div>

                {/* Card Container Box */}
                <div
                  className={`w-full ${
                    isCenter
                      ? 'md:w-[85%] md:mx-auto'
                      : isLeft
                      ? 'md:w-[45%] md:mr-auto'
                      : 'md:w-[45%] md:ml-auto'
                  } pl-14 md:pl-0 transition-all duration-500`}
                >
                  <div
                    onClick={() => handleOpenMilestone(index)}
                    className={`glass-panel p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-2xl group hover:-translate-y-2 relative overflow-hidden bg-[#101014]/95 backdrop-blur-xl cursor-pointer ${
                      isHyderabad
                        ? 'border-[#38BDF8]/60 hover:border-[#38BDF8] shadow-[0_0_30px_rgba(56,189,248,0.25)]'
                        : isSunShadow
                        ? 'border-[#FBBF24]/60 hover:border-[#FBBF24] shadow-[0_0_30px_rgba(251,191,36,0.25)]'
                        : isGraduation
                        ? 'border-[#A7F3D0]/60 hover:border-[#A7F3D0]'
                        : 'border-white/15 hover:border-white/40'
                    }`}
                  >
                    {/* Background Watermark Step Number */}
                    <div className="absolute -top-4 -right-2 font-display-bold text-6xl sm:text-7xl font-extrabold text-white/5 select-none pointer-events-none group-hover:text-white/15 transition-colors">
                      {item.step}
                    </div>

                    {/* Special Hyderabad CTF Journey Header */}
                    {isHyderabad && (
                      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-xs font-mono text-[#38BDF8]">
                        <Bus className="w-3.5 h-3.5 animate-bounce" />
                        <span>SPECIAL JOURNEY NODE</span>
                        <Train className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Special Sun & Shadow Badge */}
                    {isSunShadow && (
                      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-xs font-mono text-[#FBBF24]">
                        <Sun className="w-3.5 h-3.5 animate-spin" />
                        <span>INTIMATE MEMORY NODE</span>
                      </div>
                    )}

                    {/* Card Top Header: Icon, Date Pill & Trigger Button */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-full glass-panel border flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                          style={{
                            borderColor: item.color,
                            boxShadow: `0 0 14px ${item.color}50`,
                          }}
                        >
                          <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                        </div>
                        <div className="px-3 py-1 rounded-full glass-panel text-[11px] font-mono tracking-widest text-white/90 border border-white/20">
                          {item.emoji} {item.date}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover:border-[#E89CA7]/60 group-hover:bg-[#E89CA7]/15 transition-all text-xs font-mono text-white/70 group-hover:text-white">
                        <Maximize2 className="w-3.5 h-3.5 text-[#E89CA7]" />
                        <span>Open Story</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="relative z-10 space-y-2">
                      <span
                        className="font-mono text-[11px] uppercase tracking-wider block font-bold"
                        style={{ color: item.color }}
                      >
                        {item.tagline}
                      </span>
                      <h3 className="font-serif-cinematic text-2xl sm:text-3xl font-bold text-white group-hover:text-[#E89CA7] transition-colors flex items-center gap-2">
                        {item.title}
                        {isBirthday && <Heart className="w-5 h-5 text-[#FF2A6D] fill-[#FF2A6D] animate-pulse" />}
                      </h3>
                      <p className="font-sans-clean text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Special Hyderabad Journey Graphic Box */}
                    {isHyderabad && (
                      <div className="mt-5 p-4 rounded-2xl bg-black/60 border border-[#38BDF8]/40 space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between text-xs font-mono text-[#38BDF8] font-semibold">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {item.journeyText}
                          </span>
                          <span className="text-white/40">24 Hours</span>
                        </div>
                        {/* Glowing animated route path */}
                        <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="absolute inset-y-0 bg-gradient-to-r from-[#38BDF8] via-[#00E5FF] to-[#38BDF8] w-full animate-pulse" />
                        </div>
                        <p className="font-sans-clean text-xs text-white/90 italic font-light">
                          "{item.quote}"
                        </p>
                      </div>
                    )}

                    {/* Special Sun & Shadow Visual Box */}
                    {isSunShadow && (
                      <div className="mt-4 p-3.5 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                          <Sun className="w-4 h-4 text-[#FBBF24]" />
                        </div>
                        <p className="font-sans-clean text-xs text-white/90 italic">
                          "The sun photo — and our first shadow photo."
                        </p>
                      </div>
                    )}

                    {/* Card Footer Click Prompt */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50 group-hover:text-white/90 transition-colors relative z-10">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#E89CA7]" /> Click to view story details
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#E89CA7] group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finale Node: Timeline Continues into a 3D Glowing Heart */}
        <div className="mt-28 text-center relative z-10 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full glass-panel border border-[#FF2A6D]/60 flex items-center justify-center shadow-[0_0_30px_rgba(255,42,109,0.5)] animate-bounce">
            <Heart className="w-8 h-8 text-[#FF2A6D] fill-[#FF2A6D]" />
          </div>
          <h3 className="font-serif-cinematic text-2xl sm:text-4xl font-bold text-white tracking-widest uppercase">
            AND THE STORY CONTINUES... ❤️
          </h3>
          <p className="font-mono text-xs sm:text-sm text-[#E89CA7]">
            Every single day with you is a new memory waiting to happen.
          </p>
        </div>
      </div>

      {/* FROSTED GLASS POPUP MODAL (PORTAL TO DOCUMENT BODY FOR PERFECT VIEWPORT CENTERING) */}
      {activeMilestone &&
        createPortal(
          <>
            {/* Backdrop Click to Close */}
            <div
              className="fixed top-0 left-0 w-screen h-screen z-[99990] bg-black/85 backdrop-blur-md animate-fade-in"
              onClick={() => setSelectedMilestoneIndex(null)}
            />

            {/* Frosted Glass Modal Container */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-[92vw] max-w-2xl bg-[#0c0c10]/95 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] max-h-[88vh] flex flex-col transition-all duration-300">
              {/* Ambient Glowing Background Halos */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full filter blur-[100px] pointer-events-none opacity-35"
                style={{ backgroundColor: activeMilestone.color }}
              />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#38BDF8]/20 rounded-full filter blur-[100px] pointer-events-none opacity-25" />

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
                      <Calendar className="w-3.5 h-3.5 text-[#E89CA7]" /> {activeMilestone.dateFormatted}
                    </span>
                  </div>
                </div>

                {/* Navigation & Close Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const prevIdx =
                        (selectedMilestoneIndex - 1 + milestones.length) % milestones.length;
                      if (
                        milestones[prevIdx].specialType === 'photoshoot' ||
                        milestones[prevIdx].specialType === 'graduation'
                      ) {
                        triggerCameraFlash();
                      }
                      setSelectedMilestoneIndex(prevIdx);
                    }}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
                    title="Previous Memory (← Left Arrow)"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      const nextIdx = (selectedMilestoneIndex + 1) % milestones.length;
                      if (
                        milestones[nextIdx].specialType === 'photoshoot' ||
                        milestones[nextIdx].specialType === 'graduation'
                      ) {
                        triggerCameraFlash();
                      }
                      setSelectedMilestoneIndex(nextIdx);
                    }}
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
              <div className="relative z-10 overflow-y-auto p-6 space-y-6">
                {/* Milestone Header Banner (No photo) */}
                <div className="relative p-6 sm:p-7 rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl space-y-2 overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full filter blur-[60px] pointer-events-none opacity-20"
                    style={{ backgroundColor: activeMilestone.color }}
                  />
                  <span
                    className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 inline-block"
                    style={{ color: activeMilestone.color }}
                  >
                    {activeMilestone.emoji} {activeMilestone.tagline}
                  </span>
                  <h3 className="font-serif-cinematic text-2xl sm:text-4xl font-bold text-white tracking-tight">
                    {activeMilestone.title}
                  </h3>
                </div>

                {/* Special Hyderabad Journey Highlight Box inside Modal */}
                {activeMilestone.specialType === 'hyderabad_ctf' && (
                  <div className="p-5 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/40 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#38BDF8] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Bus className="w-4 h-4" /> {activeMilestone.journeyText}
                      </span>
                      <span className="flex items-center gap-1">
                        <Train className="w-4 h-4" /> Overnight Journey
                      </span>
                    </div>
                    <p className="font-serif-cinematic text-lg text-white font-semibold italic">
                      "{activeMilestone.quote}"
                    </p>
                    <p className="font-sans-clean text-xs text-white/70 italic">
                      {activeMilestone.journeySubtext}
                    </p>
                  </div>
                )}

                {/* Story Details Box */}
                <div className="space-y-4 bg-white/[0.04] backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-inner">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-xs text-[#E89CA7] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E89CA7]" /> Memory Story
                    </h4>
                    <span className="font-mono text-[10px] text-white/40">
                      {selectedMilestoneIndex + 1} of {milestones.length}
                    </span>
                  </div>

                  <p className="font-sans-clean text-sm sm:text-base text-white/90 leading-relaxed font-light">
                    {activeMilestone.desc}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-start gap-3">
                    <div
                      className="w-1.5 rounded-full shrink-0 self-stretch"
                      style={{
                        background: `linear-gradient(to bottom, ${activeMilestone.color}, ${activeMilestone.secondaryColor})`,
                      }}
                    />
                    <p className="font-sans-clean text-xs sm:text-sm text-white/80 leading-relaxed italic font-light">
                      "{activeMilestone.details}"
                    </p>
                  </div>
                </div>

                {/* Footer navigation hint */}
                <div className="flex items-center justify-between text-xs font-mono text-white/40 px-1 pt-1">
                  <span>Press Esc to return to 3D timeline</span>
                  <span className="hidden sm:inline">Use ← → arrow keys to browse milestones</span>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </section>
  );
}


