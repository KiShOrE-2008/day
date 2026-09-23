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
if (typeof window !== 'undefined') window.ScrollTrigger = ScrollTrigger;

import World from './components/3d/World';
import SecretEasterEgg from './components/SecretEasterEgg';

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

import WishSubmissionPage from './pages/WishSubmissionPage';
import WishesWallPage from './pages/WishesWallPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function HomeStory() {
  useLenis();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => window.ScrollTrigger?.refresh(), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const hash = location.hash || window.location.hash;

    if (hash) {
      const targetId = hash.replace('#', '');
      const scrollToTarget = () => {
        const elem = document.getElementById(targetId);
        if (elem) {
          if (window.lenis) window.lenis.scrollTo(elem, { duration: 1.2, immediate: false });
          else elem.scrollIntoView({ behavior: 'smooth' });
        }
      };
      const t1 = setTimeout(scrollToTarget, 250);
      const t2 = setTimeout(scrollToTarget, 700);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    window.scrollTo(0, 0);
    window.lenis?.scrollTo(0, { immediate: true });
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      window.lenis?.scrollTo(0, { immediate: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="story-3d-mode relative min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white">
      <World />
      <FilmGrain />
      <CustomCursor />
      <SecretEasterEgg />
      <Navbar />
      <AudioController />

      <main className="relative z-10 w-full overflow-hidden">
        <Intro />
        <BirthdayReveal />
        <FirstMeeting />
        <Timeline />
        <Memories />
        <LoveAboutYou />
        <BirthdayWishes />
        <OpenWhenLetters />
        <LoveLetter />
        <TimeCapsule />
        <Finale />
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
