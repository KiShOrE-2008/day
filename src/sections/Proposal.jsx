import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sendProposalNotificationEmail } from '../lib/emailService';
import ProposalCard from '../components/proposal/ProposalCard';
import Proposal3DScene from '../components/proposal/Proposal3DScene';
import ProposalOverlay from '../components/proposal/ProposalOverlay';

gsap.registerPlugin(ScrollTrigger);

export default function Proposal() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);

  // States: 'idle' | 'yes-intro' | 'yes-explosion' | 'yes-celebration' | 'yes-final' | 'no-drain' | 'no-heart' | 'no-rain' | 'no-final'
  const [proposalState, setProposalState] = useState('idle');
  const [screenFlash, setScreenFlash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Entrance animation for proposal card
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 50, scale: 0.92, rotateX: 15 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --------------------------------------------------------------------------
  // 💖 YES 3D Cinematic Sequence
  // --------------------------------------------------------------------------
  const handleYesClick = () => {
    if (proposalState !== 'idle') return;

    // Trigger email notification
    sendProposalNotificationEmail({ answer: 'YES' }).catch((err) => console.error(err));

    // Phase 1 — Button Press & Screen Flash (0–0.4s)
    setProposalState('yes-intro');
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 380);

    const tl = gsap.timeline();

    tl.to(yesBtnRef.current, {
      scale: 1.2,
      rotateY: 20,
      rotateX: -10,
      duration: 0.18,
      ease: 'back.out(2.5)',
    })
      .to(yesBtnRef.current, {
        scale: 0.92,
        rotateY: -10,
        duration: 0.1,
      })
      .to(yesBtnRef.current, {
        scale: 1.05,
        rotateY: 0,
        rotateX: 0,
        duration: 0.15,
      });

    // Phase 2 — Camera Fly-In & 3D Particle Explosion (0.4s → 2s)
    setTimeout(() => {
      setProposalState('yes-explosion');

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          rotateY: 360,
          rotateX: 15,
          scale: 1.12,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.inOut',
        });
      }
    }, 400);

    // Phase 3 — Celebration Orbit & Text Reveal (2s → 5.5s)
    setTimeout(() => {
      setProposalState('yes-celebration');
    }, 2000);

    // Phase 4 — Final Note & Infinity Reveal (5.5s+)
    setTimeout(() => {
      setProposalState('yes-final');
    }, 5500);
  };

  // --------------------------------------------------------------------------
  // 🖤 NO 3D Sad Monochrome Sequence
  // --------------------------------------------------------------------------
  const handleNoClick = () => {
    if (proposalState !== 'idle') return;

    // Trigger email notification
    sendProposalNotificationEmail({ answer: 'NEED_TIME' }).catch((err) => console.error(err));

    // Phase 1 — Color Drain & Shake (0–1.5s)
    setProposalState('no-drain');

    if (noBtnRef.current) {
      gsap.to(noBtnRef.current, {
        rotateZ: 8,
        x: '+=8',
        yoyo: true,
        repeat: 5,
        duration: 0.08,
      });
    }

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: -25,
        rotateY: 12,
        scale: 0.88,
        opacity: 0.15,
        duration: 1.4,
        ease: 'power2.inOut',
      });
    }

    gsap.to(containerRef.current, {
      filter: 'grayscale(1) brightness(0.6)',
      duration: 1.6,
      ease: 'power2.inOut',
    });

    // Phase 2 — 3D Splitting Heart (1.5s → 3.5s)
    setTimeout(() => {
      setProposalState('no-heart');
    }, 1500);

    // Phase 3 — Rain & Reflection Text (3.5s → 6.5s)
    setTimeout(() => {
      setProposalState('no-rain');
    }, 3500);

    // Phase 4 — Final Return State (6.5s+)
    setTimeout(() => {
      setProposalState('no-final');
    }, 6500);
  };

  // --------------------------------------------------------------------------
  // Restore Full Site Colors & State
  // --------------------------------------------------------------------------
  const handleRestoreColor = () => {
    gsap.to(containerRef.current, {
      filter: 'grayscale(0) brightness(1)',
      duration: 1.2,
      ease: 'power2.out',
      onComplete: () => {
        setProposalState('idle');
        if (cardRef.current) {
          gsap.set(cardRef.current, { opacity: 1, scale: 1, rotateX: 0, rotateY: 0 });
        }
      },
    });
  };

  const handleContinueStory = () => {
    const elem = document.getElementById('intro-section');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    setProposalState('idle');
    if (cardRef.current) {
      gsap.set(cardRef.current, { opacity: 1, scale: 1, rotateX: 0, rotateY: 0 });
    }
  };

  return (
    <section
      id="proposal-section"
      ref={containerRef}
      className={`relative w-full min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden selection:bg-[#B76E79]/30 transition-colors duration-1000 [perspective:1000px] ${
        proposalState.startsWith('no') ? 'bg-[#050505]' : 'bg-[#080808]'
      }`}
    >
      {/* Screen Flash */}
      {screenFlash && (
        <div className="fixed inset-0 z-50 bg-[#E89CA7]/40 pointer-events-none animate-ping" />
      )}

      {/* 3D WebGL Canvas Engine */}
      <Proposal3DScene proposalState={proposalState} isMobile={isMobile} />

      {/* Ambient Radial Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full filter blur-[150px] transition-all duration-1000 ${
            proposalState.startsWith('no')
              ? 'bg-white/5'
              : proposalState.startsWith('yes')
              ? 'bg-radial from-[#E89CA7]/30 via-[#B76E79]/15 to-transparent'
              : 'bg-radial from-[#B76E79]/20 via-[#E89CA7]/5 to-transparent'
          }`}
        />
      </div>

      {/* IDLE 2D Proposal Card */}
      {proposalState === 'idle' && (
        <ProposalCard
          ref={cardRef}
          yesBtnRef={yesBtnRef}
          noBtnRef={noBtnRef}
          onYesClick={handleYesClick}
          onNoClick={handleNoClick}
        />
      )}

      {/* 3D Cinematic Text & Icon Overlays */}
      <ProposalOverlay
        proposalState={proposalState}
        onContinueStory={handleContinueStory}
        onRestoreColor={handleRestoreColor}
      />
    </section>
  );
}
