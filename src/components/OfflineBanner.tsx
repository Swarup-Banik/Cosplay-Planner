import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Sparkles, Download } from 'lucide-react';
import { sound } from '../utils/audio';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [showReconnected, setShowReconnected] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    sound.playClick();
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      sound.playSuccess();
      setInstallPrompt(null);
    }
  };

  return (
    <>
      {/* Offline Alert Pill */}
      {!isOnline && (
        <div className="fixed top-20 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-slideDown">
          <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-[#1F1B35]/95 text-white border border-lavender-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Offline Mode — Your saved cosplays, checklists & notes remain fully accessible!</span>
          </div>
        </div>
      )}

      {/* Reconnected Banner */}
      {showReconnected && isOnline && (
        <div className="fixed top-20 inset-x-0 z-50 flex justify-center pointer-events-none px-4 animate-slideDown">
          <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-emerald-900/95 text-white border border-emerald-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-semibold">
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Back online! Jikan Anime API connection restored.</span>
          </div>
        </div>
      )}

      {/* Floating PWA Install Prompt Banner (if available on Chrome/Android/Desktop) */}
      {installPrompt && (
        <div className="fixed bottom-20 left-4 z-40 animate-scalePop">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-dream-700 to-lavender-600 text-white font-bold text-xs shadow-xl border border-lavender-300/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>
      )}
    </>
  );
};
