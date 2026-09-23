import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/Navbar';
import AudioController from './components/AudioController';
import FilmGrain from './components/FilmGrain';
import CustomCursor from './components/CustomCursor';
import PasswordGate from './components/PasswordGate';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ErrorBoundary from './components/ErrorBoundary';

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') {
  window.ScrollTrigger = ScrollTrigger;
}

// 3D Persistent Universe Engine
import World from './components/3d/World';

// Visual & Interactive Utilities
import SecretEasterEgg from './components/SecretEasterEgg';

// Story Sections
import Intro from './sections/Intro';
import BirthdayReveal from './sections/BirthdayReveal';
import FirstMeeting from './sections/FirstMeeting';
import Timeline from './sections/Timeline';
import Memories from './sections/Memories';
import LoveAboutYou from './sections/LoveAboutYou';
import BirthdayWishes from './sections/BirthdayWishes';
import OpenWhenLetters from './sections/OpenWhenLetters';
import LoveLetter from './sections/LoveLetter';
import TimeCapsule from './sections/TimeCapsule';
import Finale from './sections/Finale';
import Proposal from './sections/Proposal';

// Pages
import WishSubmissionPage from './pages/WishSubmissionPage';
import WishesWallPage from './pages/WishesWallPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function HomeStory() {
  // Initialize Lenis smooth scroll for homepage story
  useLenis();
  const location = useLocation();

  // Auto-refresh GSAP ScrollTrigger after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Reset scroll to top (first page) on reload unless a specific #hash URL is present
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const hash = location.hash || window.location.hash;
    if (hash) {
      const targetId = hash.replace('#', '');

      const scrollToTarget = () => {
        const elem = document.getElementById(targetId);
        if (elem) {
          if (window.lenis) {
            window.lenis.scrollTo(elem, { duration: 1.2, immediate: false });
          } else {
            elem.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };

      const timer1 = setTimeout(scrollToTarget, 250);
      const timer2 = setTimeout(scrollToTarget, 700);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // Force scroll to top (01. Intro section) on initial page load / refresh
      window.scrollTo(0, 0);
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      const resetTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
      }, 100);
      return () => clearTimeout(resetTimer);
    }
  }, [location]);

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white">
      {/* Persistent 3D WebGL Canvas Layer */}
      <World />

      {/* Visual Enhancers */}
      <FilmGrain />
      <CustomCursor />
      <SecretEasterEgg />

      {/* Navigation & Controls */}
      <Navbar />
      <AudioController />

      {/* Main Narrative Story Sections */}
      <main className="relative z-10 w-full overflow-hidden">
        {/* 01. Movie Opening Intro */}
        <Intro />

        {/* 02. Sowmiya Identity & 29 Sept Birthday Reveal */}
        <BirthdayReveal />

        {/* 03. First Meeting (04.09.2025 Focus) */}
        <FirstMeeting />

        {/* 04. Our Journey Vertical Timeline */}
        <Timeline />

        {/* 05. Memory Scrapbook Collage */}
        <Memories />

        {/* 06. Things I Love About You */}
        <LoveAboutYou />

        {/* 07. Community Birthday Wishes */}
        <BirthdayWishes />

        {/* 08. Open When... Letters */}
        <OpenWhenLetters />

        {/* 09. Progressive Love Letter */}
        <LoveLetter />

        {/* 10. Time Capsule (29.09.2027) */}
        <TimeCapsule />

        {/* 11. Grand Finale Celebration */}
        <Finale />

        {/* 12. Climax Proposal / Forever */}
        <Proposal />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PasswordGate><HomeStory /></PasswordGate>} />
          <Route path="/wish" element={<WishSubmissionPage />} />
          <Route path="/wishes" element={<WishesWallPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
