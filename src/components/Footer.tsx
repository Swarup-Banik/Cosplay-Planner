import React, { useState } from 'react';
import { Sparkles, Heart, Compass, Search, FolderHeart, BookOpen, Users } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'characters' | 'my-cosplays' | 'community' | 'resources') => void;
  onOpenBackup?: () => void;
  onOpenTour?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenBackup, onOpenTour }) => {
  const [showSecretModal, setShowSecretModal] = useState(false);

  const handleHeartClick = () => {
    sound.playSuccess();
    setShowSecretModal(true);
  };

  return (
    <footer className="relative border-t border-lavender-200/80 dark:border-lavender-800/40 bg-white/70 dark:bg-[#120F20]/80 backdrop-blur-md pt-12 pb-14 text-dream-900 dark:text-lavender-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lavender-400 to-dream-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl text-dream-950 dark:text-white">
                  Cosplay Planner
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-lavender-100 dark:bg-lavender-900/60 text-dream-800 dark:text-lavender-200 border border-lavender-300 dark:border-lavender-700">
                  BETA
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-dream-700/80 dark:text-lavender-300/80 max-w-sm leading-relaxed font-light">
              An elegant anime character discovery platform combined with a personal cosplay organizer and interactive character companion.
            </p>
            <div className="text-[11px] font-jp text-dream-500 dark:text-lavender-400">
              お気に入りのキャラクターを、次のコスプレへ。
            </div>
            <p className="text-[11px] text-dream-600/90 dark:text-lavender-400/90 pt-1 leading-relaxed max-w-sm">
              Character data from <a href="https://myanimelist.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-dream-800 dark:text-lavender-200 underline decoration-lavender-300">MyAnimeList</a> via the <a href="https://jikan.moe" target="_blank" rel="noopener noreferrer" className="font-semibold text-dream-800 dark:text-lavender-200 underline decoration-lavender-300">Jikan API</a>, with <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-dream-800 dark:text-lavender-200 underline decoration-lavender-300">AniList</a> as a fallback. This is an unofficial fan project, not affiliated with MyAnimeList or any anime studio. All characters and artwork belong to their respective owners.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-dream-950 dark:text-white uppercase tracking-wider mb-2 font-display">
              Navigation
            </div>
            <div>
              <button
                onClick={() => onSelectTab('home')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                Home / Discovery
              </button>
            </div>
            <div>
              <button
                onClick={() => onSelectTab('characters')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                Explore Characters
              </button>
            </div>
            <div>
              <button
                onClick={() => onSelectTab('my-cosplays')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                My Cosplay Checklist
              </button>
            </div>
            <div>
              <button
                onClick={() => onSelectTab('community')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                Community Showcases
              </button>
            </div>
            {onOpenTour && (
              <div>
                <button
                  onClick={onOpenTour}
                  className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
                >
                  Interactive Feature Tour
                </button>
              </div>
            )}
            {onOpenBackup && (
              <div className="pt-1">
                <button
                  onClick={onOpenBackup}
                  className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Data & Backup (JSON)</span>
                </button>
              </div>
            )}
          </div>

          {/* Resources & Crafting */}
          <div className="space-y-2 text-xs">
            <div className="font-bold text-dream-950 dark:text-white uppercase tracking-wider mb-2 font-display">
              Crafting Resources
            </div>
            <div>
              <button
                onClick={() => onSelectTab('resources')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                EVA Foam Prop Guide
              </button>
            </div>
            <div>
              <button
                onClick={() => onSelectTab('resources')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                Anime Wig Gravity Spiking
              </button>
            </div>
            <div>
              <button
                onClick={() => onSelectTab('resources')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                Circle Lens Safety Protocol
              </button>
            </div>
            <div>
              <button
                onClick={() => onSelectTab('resources')}
                className="text-dream-700 dark:text-lavender-300 hover:text-dream-950 dark:hover:text-white transition-colors"
              >
                Con Emergency SOS Kit
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Subtle Personal Touch & Attribution */}
        <div className="pt-8 border-t border-lavender-200/60 dark:border-lavender-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dream-600 dark:text-lavender-400">
          <div>
            © {new Date().getFullYear()} Cosplay Planner. Crafted for anime & cosplay fans worldwide.
          </div>

          {/* Hidden/Subtle Personal Touch */}
          <div className="flex items-center gap-1.5 font-medium group">
            <span className="text-dream-700 dark:text-lavender-300">Made with love for a fellow cosplay lover</span>
            <button
              onClick={handleHeartClick}
              className="text-rose-400 hover:text-rose-600 hover:scale-125 transition-all inline-flex p-0.5"
              title="A small warm note ♡"
            >
              <Heart className="w-4 h-4 fill-rose-300 hover:fill-rose-500" />
            </button>
          </div>
        </div>

        {/* Mandatory Voice TTS Attribution */}
        <div className="pt-3 text-[10px] text-center text-dream-500/80 dark:text-lavender-400/60 leading-relaxed">
          Some voices generated with ElevenLabs. All voices are AI-generated, original character-style voices, not the actual voice actors. Fan project, not for commercial use.
        </div>

      </div>

      {/* Secret Warm Easter Egg Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#1A162B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-lavender-200 dark:border-lavender-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-6 h-6 fill-rose-400" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-dream-950 dark:text-white">
              For someone who breathes life into art ♡
            </h3>
            <p className="text-xs sm:text-sm text-dream-700 dark:text-lavender-300 leading-relaxed font-light">
              "Every stitch you sew, every wig fiber you tease, and every prop you sand with care is a celebration of stories that touched your heart. Never stop expressing your utmost love for cosplay!"
            </p>
            <div className="text-xs font-semibold text-dream-500 dark:text-lavender-400 font-jp">
              自分を信じて、輝いて。✨
            </div>
            <button
              onClick={() => setShowSecretModal(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
            >
              Keep Crafting ✨
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
