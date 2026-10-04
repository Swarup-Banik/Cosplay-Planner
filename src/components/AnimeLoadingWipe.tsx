import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { isReducedMotionPreferred } from '../lib/motion';

export const AnimeLoadingWipe: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isWipingOut, setIsWipingOut] = useState(false);

  useEffect(() => {
    // Skip if user prefers reduced motion or already seen in this session
    if (isReducedMotionPreferred()) return;

    try {
      const seen = sessionStorage.getItem('cosplay_splash_seen');
      if (seen) return;
    } catch {
      return;
    }

    // Show splash
    setIsVisible(true);

    const wipeTimer = setTimeout(() => {
      setIsWipingOut(true);
    }, 900);

    const endTimer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem('cosplay_splash_seen', 'true');
      } catch {}
    }, 1250);

    return () => {
      clearTimeout(wipeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0E0C18] text-white transition-all duration-350 ease-out pointer-events-none select-none ${
        isWipingOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Anime Speed-Lines Canvas & Backdrop */}
      <div className="absolute inset-0 manga-speed-lines opacity-80" />

      {/* Atmospheric Radial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-lavender-500/25 via-blush-500/20 to-softblue-500/25 blur-[90px] animate-pulse" />

      {/* Center Anime Logo & Badge */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-3 px-6 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-lavender-500 to-dream-600 p-0.5 shadow-glow-lavender flex items-center justify-center animate-bounce">
          <Sparkles className="w-7 h-7 text-white" />
        </div>

        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
            COSPLAY PLANNER
          </h1>
          <div className="text-[11px] font-mono tracking-widest text-lavender-300 uppercase mt-0.5">
            コスプレ・プランナー // SYSTEM READY
          </div>
        </div>

        {/* Rapid loading track */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-dream-400 via-blush-400 to-lavender-300 rounded-full animate-loadingBar" />
        </div>
      </div>
    </div>
  );
};
