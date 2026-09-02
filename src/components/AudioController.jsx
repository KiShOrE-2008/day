import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Sliders, ChevronUp, Radio } from 'lucide-react';

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [preset, setPreset] = useState('romantic'); // 'romantic', 'celestial', 'cyber'
  const [showControls, setShowControls] = useState(false);

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const timerRef = useRef(null);
  const audioFileRef = useRef(null);

  // Initialize or resume Web Audio API context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      audioContextRef.current = ctx;
      masterGainRef.current = masterGain;
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  };

  // Update volume
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
    if (audioFileRef.current) {
      audioFileRef.current.volume = volume;
    }
  }, [volume]);

  // Ambient sound synthesizer engine
  const startAmbientEngine = (selectedPreset = preset) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Clear previous timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Warm Chord progressions for presets
    const presetsData = {
      romantic: [
        [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9
        [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9
        [220.00, 261.63, 329.63, 392.00, 523.25], // Am9
        [164.81, 246.94, 293.66, 392.00, 493.88], // Em7
      ],
      celestial: [
        [261.63, 392.00, 523.25, 659.25], // Cmaj7 high
        [174.61, 261.63, 349.23, 440.00], // Fmaj7 high
        [196.00, 293.66, 392.00, 493.88], // Gsus4
        [220.00, 329.63, 440.00, 523.25], // Am7
      ],
      cyber: [
        [110.00, 164.81, 220.00, 261.63], // A low bass synth
        [130.81, 196.00, 261.63, 311.13], // C minor bass
        [87.31, 130.81, 174.61, 220.00],  // F low bass
        [98.00, 146.83, 196.00, 246.94],  // G bass
      ],
    };

    const currentChords = presetsData[selectedPreset] || presetsData.romantic;
    let chordIdx = 0;

    const playPadStep = () => {
      if (!ctx || ctx.state === 'closed') return;
      const now = ctx.currentTime;
      const notes = currentChords[chordIdx % currentChords.length];

      // Master Lowpass Filter for analog warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(selectedPreset === 'cyber' ? 450 : 700, now);
      filter.Q.setValueAtTime(2, now);
      filter.connect(masterGainRef.current);

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = selectedPreset === 'cyber' ? 'sawtooth' : idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Soft attack envelope (2s attack, 4s decay)
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.exponentialRampToValueAtTime(0.035, now + 2.0);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start(now);
        osc.stop(now + 5.8);
      });

      // High crystalline sparkle note
      if (selectedPreset !== 'cyber' && Math.random() > 0.25) {
        const sparkleOsc = ctx.createOscillator();
        const sparkleGain = ctx.createGain();
        const sparkleNotes = [659.25, 783.99, 880.00, 987.77, 1046.50, 1318.51];
        const randomSparkle = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];

        sparkleOsc.type = 'sine';
        sparkleOsc.frequency.setValueAtTime(randomSparkle, now + 0.8);

        sparkleGain.gain.setValueAtTime(0.0001, now + 0.8);
        sparkleGain.gain.exponentialRampToValueAtTime(0.015, now + 1.2);
        sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        sparkleOsc.connect(sparkleGain);
        sparkleGain.connect(masterGainRef.current);

        sparkleOsc.start(now + 0.8);
        sparkleOsc.stop(now + 3.7);
      }

      chordIdx++;
    };

    playPadStep();
    timerRef.current = setInterval(playPadStep, 4500);
  };

  const stopAmbientEngine = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend();
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      if (audioFileRef.current) audioFileRef.current.pause();
      stopAmbientEngine();
      setIsPlaying(false);
    } else {
      if (audioFileRef.current && audioFileRef.current.src) {
        audioFileRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          startAmbientEngine();
          setIsPlaying(true);
        });
      } else {
        startAmbientEngine();
        setIsPlaying(true);
      }
    }
  };

  const changePreset = (newPreset) => {
    setPreset(newPreset);
    if (isPlaying) {
      startAmbientEngine(newPreset);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientEngine();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Controls Popover Panel */}
      {showControls && (
        <div className="glass-panel p-4 rounded-2xl border border-white/20 shadow-2xl space-y-3 w-64 animate-fade-in text-xs font-mono">
          <div className="flex items-center justify-between text-white/80 font-bold border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5 text-[#E89CA7]">
              <Sliders className="w-3.5 h-3.5" /> Ambient Sound Controls
            </span>
            <button onClick={() => setShowControls(false)} className="text-white/40 hover:text-white">✕</button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-white/60">
              <span>Master Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-[#B76E79] bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Sound Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-white/60 block">Ambient Sound Mode:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { id: 'romantic', name: '🌸 Dreamy Romance Pad' },
                { id: 'celestial', name: '✨ Celestial Sparkle' },
                { id: 'cyber', name: '💻 Midnight Cyber Synth' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => changePreset(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-left transition-all ${
                    preset === p.id
                      ? 'bg-[#B76E79]/30 text-[#E89CA7] border border-[#B76E79]/50 font-bold'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Bar Button Row */}
      <div className="flex items-center gap-3">
        {/* Sound Status Pill */}
        {isPlaying && (
          <div
            onClick={() => setShowControls(!showControls)}
            className="hidden sm:flex items-center gap-2 glass-panel px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-[#B76E79] cursor-pointer hover:border-[#B76E79]/50 transition-all shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#B76E79]" />
            <span className="font-mono text-[11px] tracking-wider uppercase font-semibold text-white/90">
              {preset === 'romantic' ? 'Dreamy Romance' : preset === 'celestial' ? 'Celestial Sparkle' : 'Cyber Synth'}
            </span>
            <div className="flex items-end gap-[2px] h-3 ml-1">
              <span className="w-[2px] bg-[#B76E79] h-full animate-pulse"></span>
              <span className="w-[2px] bg-[#B76E79] h-2/3 animate-pulse delay-75"></span>
              <span className="w-[2px] bg-[#B76E79] h-4/5 animate-pulse delay-150"></span>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-white/50 transition-transform ${showControls ? 'rotate-180' : ''}`} />
          </div>
        )}

        {/* Controls Toggle Pill */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="p-3 rounded-full glass-panel border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all"
          aria-label="Sound Settings"
          title="Sound Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Main Play/Pause Button */}
        <button
          onClick={toggleSound}
          className={`group relative flex items-center justify-center w-12 h-12 rounded-full glass-panel border transition-all duration-300 ${
            isPlaying
              ? 'border-[#B76E79] text-[#B76E79] shadow-lg shadow-[#B76E79]/30 scale-105 bg-[#B76E79]/10'
              : 'border-white/20 text-white/70 hover:text-white hover:border-white/40'
          }`}
          aria-label="Toggle Soundtrack"
          title={isPlaying ? 'Mute Soundtrack' : 'Play Ambient Soundtrack'}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 animate-pulse text-[#E89CA7]" />
          ) : (
            <VolumeX className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          )}

          {/* Pulse Ring when active */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-[#B76E79]/50 animate-ping pointer-events-none" />
          )}
        </button>
      </div>

      <audio ref={audioFileRef} src="/audio/birthday.mp3" loop preload="none" />
    </div>
  );
}
