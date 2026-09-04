import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Code, Sparkles, Menu, X, Terminal, ChevronRight, Compass } from 'lucide-react';
import gsap from 'gsap';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('intro-section');
  const [isCyberTheme, setIsCyberTheme] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const headerRef = useRef(null);
  const brandHeartRef = useRef(null);

  const navItems = [
    { id: 'intro-section', label: '01. Intro', short: 'Intro' },
    { id: 'first-meeting-section', label: '02. First Meeting', short: 'Meeting' },
    { id: 'timeline-section', label: '03. Journey', short: 'Journey' },
    { id: 'hyderabad-ctf-section', label: '04. CTF Memory', short: 'CTF', icon: Code, isCyber: true },
    { id: 'memories-section', label: '05. Memories', short: 'Memories' },
    { id: 'birthday-wishes-section', label: '06. Wishes', short: 'Wishes' },
    { id: 'love-letter-section', label: '07. Letter', short: 'Letter' },
    { id: 'finale-section', label: '08. Finale', short: 'Finale' },
  ];

  // GSAP Entrance animation on mount
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -60, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  // IntersectionObserver to auto-detect active section & scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentProgress);
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // IntersectionObserver for section detection
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          setIsCyberTheme(sectionId === 'hyderabad-ctf-section');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      if (window.lenis) {
        window.lenis.scrollTo(elem, { duration: 1.2 });
      } else {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  const handleBrandHover = () => {
    if (brandHeartRef.current) {
      gsap.to(brandHeartRef.current, {
        rotate: 360,
        scale: 1.25,
        duration: 0.6,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to(brandHeartRef.current, { rotate: 0, scale: 1, duration: 0.3 });
        },
      });
    }
  };

  // Find active label for collapsed hint badge
  const currentActiveItem = navItems.find((item) => item.id === activeSection) || navItems[0];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
        isScrolled ? 'py-2.5 px-3 sm:px-6' : 'py-4 px-4 sm:px-8'
      }`}
    >
      {/* Animated Top Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-150 relative ${
            isCyberTheme
              ? 'bg-gradient-to-r from-[#00ff66] via-[#00e5ff] to-[#00ff66] shadow-[0_0_12px_#00ff66]'
              : 'bg-gradient-to-r from-[#B76E79] via-[#E89CA7] to-[#00ff66] shadow-[0_0_12px_#B76E79]'
          }`}
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Glowing head particle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
        </div>
      </div>

      {/* Main Auto-Hiding Capsule Navbar */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-between px-3 sm:px-5 py-2 rounded-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl backdrop-blur-xl border ${
          isHovered ? 'max-w-6xl w-full' : 'max-w-[240px] sm:max-w-[270px] w-auto'
        } ${
          isCyberTheme
            ? 'glass-cyber border-[#00ff66]/40 shadow-[0_0_30px_rgba(0,255,106,0.2)] bg-[#050b14]/90'
            : isScrolled
            ? 'glass-panel border-[#B76E79]/40 bg-[#0c0a0b]/85 shadow-[0_10px_35px_rgba(0,0,0,0.9)]'
            : 'glass-panel border-white/20 bg-[#141414]/75'
        }`}
      >
        {/* Brand Logo & Heart (Always Visible) */}
        <button
          onClick={() => {
            scrollToSection('intro-section');
            setIsHovered(!isHovered);
          }}
          onMouseEnter={handleBrandHover}
          className="flex items-center gap-2.5 group text-left focus:outline-none shrink-0"
        >
          <div
            ref={brandHeartRef}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
              isCyberTheme
                ? 'bg-[#00ff66]/20 border-[#00ff66]/60 text-[#00ff66]'
                : 'bg-[#B76E79]/20 border-[#B76E79]/50 text-[#B76E79] group-hover:bg-[#B76E79]/30'
            }`}
          >
            {isCyberTheme ? (
              <Terminal className="w-4 h-4 text-[#00ff66] animate-pulse" />
            ) : (
              <Heart className="w-4.5 h-4.5 text-[#B76E79] fill-[#B76E79]/40 group-hover:fill-[#B76E79] transition-all duration-300" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-serif-cinematic text-base sm:text-lg tracking-wide font-bold transition-colors duration-300 ${
                  isCyberTheme ? 'text-[#00ff66] font-mono' : 'text-white group-hover:text-[#E89CA7]'
                }`}
              >
                Miyaaaaww
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  isCyberTheme ? 'bg-[#00ff66]' : 'bg-[#B76E79]'
                }`}
              />
            </div>
            {!isHovered && (
              <span className="text-[10px] font-mono text-white/50 tracking-wider flex items-center gap-1">
                <Compass className="w-2.5 h-2.5 text-[#B76E79] animate-spin" />
                {currentActiveItem.short}
              </span>
            )}
          </div>
        </button>

        {/* Collapsed Hint Sparkle (Visible when NOT hovered) */}
        {!isHovered && (
          <div className="flex items-center gap-1.5 ml-2 text-xs font-mono text-[#E89CA7] opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79] animate-pulse" />
            <span className="text-[10px] text-white/40 uppercase hidden sm:inline">Hover</span>
          </div>
        )}

        {/* Desktop Animated Navigation Items (Revealed ONLY on hover) */}
        <div
          className={`transition-all duration-500 ease-out flex items-center justify-between w-full overflow-hidden ${
            isHovered
              ? 'opacity-100 max-w-full ml-4 pointer-events-auto scale-100'
              : 'opacity-0 max-w-0 ml-0 pointer-events-none scale-95'
          }`}
        >
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-white/10 relative">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const ItemIcon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 flex items-center gap-1.5 focus:outline-none whitespace-nowrap ${
                    isActive
                      ? item.isCyber
                        ? 'text-[#00ff66] font-bold shadow-[0_0_15px_rgba(0,255,106,0.3)]'
                        : 'text-white font-bold shadow-[0_0_15px_rgba(183,110,121,0.3)]'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {/* Active Sliding Background Pill */}
                  {isActive && (
                    <span
                      className={`absolute inset-0 rounded-full border transition-all duration-500 animate-fade-in ${
                        item.isCyber
                          ? 'bg-[#00ff66]/15 border-[#00ff66]/50'
                          : 'bg-gradient-to-r from-[#B76E79]/25 to-[#E89CA7]/20 border-[#B76E79]/50'
                      }`}
                    />
                  )}

                  {/* Optional Icon */}
                  {ItemIcon && (
                    <ItemIcon
                      className={`w-3.5 h-3.5 relative z-10 ${
                        isActive ? (item.isCyber ? 'text-[#00ff66] animate-pulse' : 'text-[#E89CA7]') : ''
                      }`}
                    />
                  )}

                  <span className="relative z-10">{item.label}</span>

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <span
                      className={`relative z-10 w-1.5 h-1.5 rounded-full animate-pulse ${
                        item.isCyber ? 'bg-[#00ff66]' : 'bg-[#E89CA7]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Compact Links */}
          <nav className="hidden md:flex lg:hidden items-center gap-2 text-xs font-mono text-white/70">
            {navItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-white bg-white/10 font-bold border border-white/20'
                    : 'hover:text-white'
                }`}
              >
                {item.short}
              </button>
            ))}
          </nav>

          {/* Right Badge & Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <Link
              to="/wish"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B76E79]/20 hover:bg-[#B76E79]/30 border border-[#B76E79]/40 text-[#E89CA7] text-xs font-mono transition-all duration-300 whitespace-nowrap"
            >
              <Heart className="w-3 h-3 fill-current" />
              <span>Send Wish</span>
            </Link>

            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono transition-all duration-300 whitespace-nowrap ${
                isCyberTheme
                  ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66]'
                  : 'bg-white/5 border-white/15 text-white/90 hover:border-[#B76E79]/50 hover:text-[#E89CA7]'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${isCyberTheme ? 'text-[#00ff66] animate-spin' : 'text-[#B76E79]'}`} />
              <span>Sowmiya R</span>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full glass-panel border border-white/15 text-white hover:border-white/30 transition-all focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#E89CA7] transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-5 h-5 text-white/90 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-6xl mx-auto px-4 animate-fade-in w-full">
          <div
            className={`glass-panel p-4 rounded-2xl border shadow-2xl flex flex-col gap-2 ${
              isCyberTheme
                ? 'bg-[#050b14]/95 border-[#00ff66]/40 text-[#00ff66]'
                : 'bg-[#0e0c0d]/95 border-[#B76E79]/30 text-white'
            }`}
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-3 py-1 border-b border-white/10">
              Story Navigation
            </div>

            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-mono text-xs text-left transition-all ${
                    isActive
                      ? isCyberTheme
                        ? 'bg-[#00ff66]/20 text-[#00ff66] font-bold border border-[#00ff66]/50'
                        : 'bg-[#B76E79]/20 text-[#E89CA7] font-bold border border-[#B76E79]/40'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'translate-x-1' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
