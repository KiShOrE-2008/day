import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/Navbar';
import AudioController from './components/AudioController';
import FilmGrain from './components/FilmGrain';
import CustomCursor from './components/CustomCursor';

// Story Sections
import Intro from './sections/Intro';
import BirthdayReveal from './sections/BirthdayReveal';
import FirstMeeting from './sections/FirstMeeting';
import Timeline from './sections/Timeline';
import HyderabadCTF from './sections/HyderabadCTF';
import Memories from './sections/Memories';
import LoveAboutYou from './sections/LoveAboutYou';
import BirthdayWishes from './sections/BirthdayWishes';
import LoveLetter from './sections/LoveLetter';
import Finale from './sections/Finale';

// Pages
import WishSubmissionPage from './pages/WishSubmissionPage';
import WishesWallPage from './pages/WishesWallPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function HomeStory() {
  // Initialize Lenis smooth scroll for homepage story
  useLenis();

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white">
      {/* Visual Enhancers */}
      <FilmGrain />
      <CustomCursor />

      {/* Navigation & Controls */}
      <Navbar />
      <AudioController />

      {/* Main 10 Story Sections */}
      <main className="relative z-10 w-full overflow-hidden">
        {/* Section 01 — Movie Opening Intro */}
        <Intro />

        {/* Section 02 & 03 — Sowmiya Identity & 29 Sept Birthday Reveal */}
        <BirthdayReveal />

        {/* Section 04 — First Meeting 04.09.2025 Focus */}
        <FirstMeeting />

        {/* Section 05 — The Journey Vertical Timeline */}
        <Timeline />

        {/* Section 06 — Hyderabad CTF Cyber World & Glitch Unlock */}
        <HyderabadCTF />

        {/* Section 07 — Memory Scrapbook 3D Collage */}
        <Memories />

        {/* Section 08 — Things I Love About You */}
        <LoveAboutYou />

        {/* Section 09 — Community Birthday Wishes */}
        <BirthdayWishes />

        {/* Section 10 — Progressive Love Letter */}
        <LoveLetter />

        {/* Section 11 — Grand Finale Celebration */}
        <Finale />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeStory />} />
        <Route path="/wish" element={<WishSubmissionPage />} />
        <Route path="/wishes" element={<WishesWallPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
