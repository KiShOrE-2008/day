import React from 'react';
import { useLenis } from './hooks/useLenis';
import Navbar from './components/Navbar';
import AudioController from './components/AudioController';
import FilmGrain from './components/FilmGrain';
import CustomCursor from './components/CustomCursor';

import Intro from './sections/Intro';
import BirthdayReveal from './sections/BirthdayReveal';
import FirstMeeting from './sections/FirstMeeting';
import Timeline from './sections/Timeline';
import HyderabadCTF from './sections/HyderabadCTF';
import Memories from './sections/Memories';
import LoveAboutYou from './sections/LoveAboutYou';
import LoveLetter from './sections/LoveLetter';
import Finale from './sections/Finale';

export default function App() {
  // Initialize Lenis smooth scroll
  useLenis();

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F1EA] selection:bg-[#B76E79]/30 selection:text-white">
      {/* Visual Enhancers */}
      <FilmGrain />
      <CustomCursor />

      {/* Navigation & Controls */}
      <Navbar />
      <AudioController />

      {/* 10 Story Sections */}
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

        {/* Section 09 — Progressive Love Letter */}
        <LoveLetter />

        {/* Section 10 — Grand Finale Celebration */}
        <Finale />
      </main>
    </div>
  );
}
