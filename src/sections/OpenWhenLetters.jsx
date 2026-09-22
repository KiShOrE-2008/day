import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Heart, X, Sparkles, Coffee, Moon, Flame, Smile, CloudRain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LETTERS = [
  {
    id: 'sad',
    title: "When you're sad",
    icon: CloudRain,
    color: '#89CFF0',
    envelopeBg: 'from-[#1e293b] to-[#0f172a]',
    teaser: 'For rainy days when everything feels heavy...',
    message: [
      "Hey Miyaaaaww,",
      "If you're reading this, take a deep breath. Whatever is making you sad right now won't last forever, but my love for you always will.",
      "Remember all the times we laughed until our stomachs hurt during late-night code runs? You are so much stronger and more loved than you know. I'm right here with you."
    ]
  },
  {
    id: 'miss_me',
    title: 'When you miss me',
    icon: Heart,
    color: '#E89CA7',
    envelopeBg: 'from-[#3b1219] to-[#1c080c]',
    teaser: 'For moments when distance feels a little too far...',
    message: [
      "Miyaaaaww,",
      "Close your eyes for 5 seconds. I'm thinking about you right at this exact moment too.",
      "No matter where we are or how busy life gets, you are always the first thought on my mind every morning and the last every night. Distance is just temporary."
    ]
  },
  {
    id: 'cant_sleep',
    title: "When you can't sleep",
    icon: Moon,
    color: '#93C5FD',
    envelopeBg: 'from-[#172554] to-[#0b132b]',
    teaser: 'For quiet midnight hours when your mind is racing...',
    message: [
      "Late Night Miyaaaaww,",
      "Put your phone aside after reading this, tuck yourself warm under the blanket, and relax.",
      "You don't have to figure out everything tonight. Rest your eyes and your heart — tomorrow is a fresh start, and I'll be right here cheering for you."
    ]
  },
  {
    id: 'motivation',
    title: 'When you need motivation',
    icon: Flame,
    color: '#FBBF24',
    envelopeBg: 'from-[#451a03] to-[#1f0900]',
    teaser: 'For moments of doubt or big challenges ahead...',
    message: [
      "Hey Champion,",
      "Remember SIH hackathon? Remember how brilliant, capable, and unstoppable you are when you set your mind to something?",
      "You have achieved so much already and this is just the beginning. Go out there and shine — I'm your biggest fan forever!"
    ]
  },
  {
    id: 'smile',
    title: 'When you need a smile',
    icon: Smile,
    color: '#F472B6',
    envelopeBg: 'from-[#4c0519] to-[#28020d]',
    teaser: 'For an instant dose of joy and affection...',
    message: [
      "Cutieee,",
      "Did you know that your smile is literally my favourite thing in the entire world?",
      "Here is your official reminder that you are adorably cute, ridiculously smart, and the best thing that ever happened to me. Now give me that big smile!"
    ]
  }
];

export default function OpenWhenLetters() {
  const containerRef = useRef(null);
  const [activeLetter, setActiveLetter] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.letter-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="open-when-section"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#060608] py-24 px-4 sm:px-8 flex flex-col items-center justify-center overflow-hidden selection:bg-[#B76E79]/30"
    >
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-radial from-[#B76E79]/15 via-transparent to-transparent rounded-full filter blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center space-y-12">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/35 text-[#E89CA7] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>06. Personal Comfort Letters</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="font-serif-cinematic text-3xl sm:text-5xl font-bold text-[#F5F1EA] tracking-tight">
            Open When... <span className="italic text-[#E89CA7] font-normal">❤️</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#A09A93] leading-relaxed">
            Little sealed notes crafted just for you. Whenever you need comfort, encouragement, or a reminder of how special you are — open the one you need.
          </p>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {LETTERS.map((letter) => {
            const IconComponent = letter.icon;
            return (
              <div
                key={letter.id}
                onClick={() => setActiveLetter(letter)}
                className="letter-card group relative cursor-pointer rounded-2xl p-6 bg-[#121216] border border-white/10 hover:border-[#B76E79]/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_12px_40px_rgba(183,110,121,0.25)] overflow-hidden flex flex-col justify-between h-56"
              >
                {/* Envelope Top Flap Simulation */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${letter.envelopeBg}`} />

                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border bg-white/5"
                      style={{ borderColor: `${letter.color}40`, color: letter.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 group-hover:text-[#E89CA7] transition-colors">
                      SEALED 💌
                    </span>
                  </div>

                  <h3 className="font-serif-cinematic text-xl font-bold text-white group-hover:text-[#E89CA7] transition-colors">
                    {letter.title}
                  </h3>

                  <p className="font-sans text-xs text-[#A09A93] line-clamp-2 leading-relaxed">
                    {letter.teaser}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                  <span>Click to Unfold Letter</span>
                  <Mail className="w-4 h-4 text-[#B76E79] group-hover:scale-110 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unfolded Letter Modal Dialog */}
      {activeLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative max-w-lg w-full rounded-3xl p-8 bg-[#181617] border border-[#B76E79]/40 shadow-[0_0_60px_rgba(183,110,121,0.3)] space-y-6 animate-scale-up"
            style={{
              backgroundImage: 'radial-gradient(circle at top right, rgba(183,110,121,0.1), transparent)'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border bg-white/5"
                  style={{ borderColor: `${activeLetter.color}50`, color: activeLetter.color }}
                >
                  <activeLetter.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#E89CA7] block">
                    OPEN WHEN...
                  </span>
                  <h4 className="font-serif-cinematic text-xl font-bold text-white">
                    {activeLetter.title}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => setActiveLetter(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letter Paper Body */}
            <div className="p-6 rounded-2xl bg-[#0f0e0f] border border-white/10 space-y-4 font-sans text-sm sm:text-base text-[#F5F1EA]/90 leading-relaxed italic shadow-inner">
              {activeLetter.message.map((paragraph, index) => (
                <p key={index} className={index === 0 ? 'font-serif-cinematic not-italic text-lg text-[#E89CA7] font-semibold' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[11px] text-white/40">
                Always here for you, Sowmiya ❤️
              </span>
              <button
                onClick={() => setActiveLetter(null)}
                className="px-5 py-2 rounded-full bg-[#B76E79] hover:bg-[#E89CA7] text-white text-xs font-mono transition-colors"
              >
                Keep In Envelope
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
