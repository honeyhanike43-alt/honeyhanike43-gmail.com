import React, { useState, useCallback, useRef, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import LotteryContainer from './components/LotteryContainer';
import ResultCard from './components/ResultCard';
import { CONSTELLATIONS } from './constants';
import { Constellation } from './types';

// Audio Assets
const AUDIO_SOURCES = {
  // Deep, ambient, mysterious
  bgm: "https://assets.mixkit.co/music/preview/mixkit-deep-meditation-108.mp3",
  // Ethereal, magical sparkle
  draw: "https://assets.mixkit.co/sfx/preview/mixkit-magic-wind-sparkle-2656.mp3",
  // Deep revelation/impact
  reveal: "https://assets.mixkit.co/sfx/preview/mixkit-cinematic-deep-impact-hit-2457.mp3"
};

type AppState = 'intro' | 'drawing' | 'result';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('intro');
  const [result, setResult] = useState<Constellation | null>(null);
  
  // Audio State & Refs
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement>(null);
  const drawSfxRef = useRef<HTMLAudioElement>(null);
  const revealSfxRef = useRef<HTMLAudioElement>(null);

  // Initialize Audio Settings
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = 0.3; // Lower volume for BGM so it's not overwhelming
    }
    if (drawSfxRef.current) drawSfxRef.current.volume = 0.6;
    if (revealSfxRef.current) revealSfxRef.current.volume = 0.8;
  }, []);

  // Handle BGM Playback
  useEffect(() => {
    const playBgm = async () => {
      if (bgmRef.current && !isMuted) {
        try {
          await bgmRef.current.play();
        } catch (err) {
          // Autoplay was prevented by the browser
          console.log("Autoplay prevented. Waiting for interaction.");
        }
      } else if (bgmRef.current && isMuted) {
        bgmRef.current.pause();
      }
    };
    playBgm();
  }, [isMuted, hasInteracted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setHasInteracted(true);
  };

  const playSfx = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (!isMuted && ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  // Random drawing logic
  const handleDraw = useCallback(() => {
    if (appState === 'drawing') return; // Prevent double clicks
    
    // User interaction confirmed
    setHasInteracted(true);
    
    setAppState('drawing');
    playSfx(drawSfxRef);

    // Simulate the "ritual" duration
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * CONSTELLATIONS.length);
      const selectedConstellation = CONSTELLATIONS[randomIndex];
      setResult(selectedConstellation);
      setAppState('result');
      playSfx(revealSfxRef);
    }, 2000); // 2 seconds of animation
  }, [appState, isMuted]);

  const handleReset = useCallback(() => {
    setResult(null);
    setAppState('intro');
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-celestial-dark font-serif overflow-x-hidden selection:bg-mystic-gold selection:text-celestial-dark">
      
      {/* Audio Elements */}
      <audio ref={bgmRef} src={AUDIO_SOURCES.bgm} loop preload="auto" />
      <audio ref={drawSfxRef} src={AUDIO_SOURCES.draw} preload="auto" />
      <audio ref={revealSfxRef} src={AUDIO_SOURCES.reveal} preload="auto" />

      {/* Background Layer */}
      <StarBackground />

      {/* Header / Nav (Static) */}
      <header className="absolute top-0 w-full p-6 z-20 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex flex-col">
            <div className="text-mystic-gold font-display text-sm md:text-base tracking-[0.2em] uppercase border border-mystic-gold/30 px-4 py-2 inline-block">
                The Celestial 28
            </div>
            <div className="hidden md:block text-slate-500 text-xs tracking-widest mt-1 ml-1">
                天界二十八星宿
            </div>
        </div>

        {/* Audio Toggle Button */}
        <button 
          onClick={toggleMute}
          className="group flex items-center justify-center w-10 h-10 border border-mystic-gold/50 rounded-full hover:bg-mystic-gold/10 hover:border-mystic-gold transition-all duration-300"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-mystic-gold">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-mystic-gold animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 z-10">
        
        {appState === 'intro' && (
          <div className="animate-fade-in w-full">
            <LotteryContainer onDraw={handleDraw} isShaking={false} />
          </div>
        )}

        {appState === 'drawing' && (
          <div className="w-full">
            <LotteryContainer onDraw={() => {}} isShaking={true} />
          </div>
        )}

        {appState === 'result' && result && (
          <ResultCard data={result} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full p-6 text-center z-20">
        <p className="text-slate-600 text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Ancient Star Divination
        </p>
      </footer>

    </div>
  );
};

export default App;