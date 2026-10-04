import React, { useEffect } from 'react';
import { 
  Heart, 
  X, 
  Trash2, 
  ArrowUpRight, 
  Plus, 
  Check, 
  Sparkles, 
  FolderHeart,
  Search
} from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { DIFFICULTY_COLORS } from '../types';
import { sound } from '../utils/audio';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (characterId: string) => void;
  onBrowseCharacters: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
  onBrowseCharacters
}) => {
  const { 
    favorites, 
    toggleFavorite, 
    clearFavorites, 
    getProjectForCharacter, 
    addCharacterToCosplay 
  } = useCosplay();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 dark:bg-[#151226]/95 backdrop-blur-2xl shadow-2xl border-l border-lavender-200/80 dark:border-lavender-800/40 flex flex-col animate-slideInRight">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-lavender-100 dark:border-lavender-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blush-50 dark:bg-blush-950/40 border border-blush-200 dark:border-blush-800/40 flex items-center justify-center text-blush-500 shadow-sm">
                <Heart className="w-5 h-5 fill-blush-400 text-blush-500 animate-scalePop" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl text-dream-950 dark:text-white flex items-center gap-2">
                  <span>Cosplay Wishlist</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blush-100 dark:bg-blush-900/60 text-blush-700 dark:text-blush-300 font-semibold font-mono">
                    {favorites.length}
                  </span>
                </h2>
                <p className="text-xs text-dream-600/80 dark:text-lavender-300/70">
                  Bookmarked characters for upcoming plans
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-dream-400 hover:text-dream-700 dark:hover:text-white hover:bg-lavender-100/60 dark:hover:bg-lavender-900/40 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Toolbar */}
          {favorites.length > 0 && (
            <div className="px-6 py-2.5 bg-lavender-50/60 dark:bg-lavender-950/30 border-b border-lavender-100 dark:border-lavender-900/40 flex items-center justify-between text-xs">
              <span className="text-dream-600 dark:text-lavender-400 font-medium">
                Saved in your local storage
              </span>
              <button
                onClick={clearFavorites}
                className="flex items-center gap-1 text-red-500 dark:text-red-400 hover:text-red-700 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                <div className="w-20 h-20 rounded-3xl bg-blush-50 dark:bg-blush-950/40 border-2 border-dashed border-blush-200 dark:border-blush-800/40 flex items-center justify-center text-blush-300 dark:text-blush-400 animate-pulse">
                  <Heart className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-dream-900 dark:text-white mb-1">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-xs text-dream-600 dark:text-lavender-400 max-w-xs leading-relaxed">
                    Bookmark your dream cosplays by clicking the heart icon on any character card across the discovery or search pages.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onBrowseCharacters();
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 hover:to-lavender-700 text-white font-semibold text-xs shadow-md shadow-dream-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Characters</span>
                </button>
              </div>
            ) : (
              favorites.map(character => {
                const existingProject = getProjectForCharacter(character.id || character.mal_id);
                return (
                  <div
                    key={character.id || character.mal_id}
                    className="p-3 rounded-2xl bg-white dark:bg-gray-800/70 border border-lavender-200/80 dark:border-lavender-800/50 shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 group"
                  >
                    {/* Thumbnail Image */}
                    <div 
                      onClick={() => {
                        sound.playClick();
                        onClose();
                        onSelectCharacter(String(character.id || character.mal_id));
                      }}
                      className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-lavender-100 dark:bg-gray-700"
                    >
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-1">
                        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                    {/* Character Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${DIFFICULTY_COLORS[character.difficulty]}`}>
                          {character.difficulty}
                        </span>
                        <span className="text-[11px] font-medium text-dream-500 dark:text-lavender-400 truncate">
                          {character.series}
                        </span>
                      </div>
                      
                      <h4 
                        onClick={() => {
                          sound.playClick();
                          onClose();
                          onSelectCharacter(String(character.id || character.mal_id));
                        }}
                        className="font-display font-bold text-sm text-dream-900 dark:text-white truncate cursor-pointer hover:text-dream-600 dark:hover:text-lavender-300 transition-colors"
                      >
                        {character.name}
                      </h4>

                      <div className="flex items-center gap-2 mt-2">
                        {existingProject ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>In Cosplays</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              sound.playClick();
                              addCharacterToCosplay(character);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-lavender-100 hover:bg-lavender-200 dark:bg-lavender-900/60 dark:hover:bg-lavender-800 text-dream-900 dark:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add to Plan</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            sound.playClick();
                            onClose();
                            onSelectCharacter(String(character.id || character.mal_id));
                          }}
                          className="text-[11px] font-medium text-dream-500 dark:text-lavender-400 hover:text-dream-800 dark:hover:text-white"
                        >
                          View
                        </button>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => toggleFavorite(character)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
                      title="Remove from favorites"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-lavender-100 dark:border-lavender-900/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between">
              <span className="text-xs text-dream-600 dark:text-lavender-400">
                {favorites.length} {favorites.length === 1 ? 'character' : 'characters'} saved
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onBrowseCharacters();
                }}
                className="text-xs font-semibold text-dream-700 dark:text-lavender-300 hover:underline flex items-center gap-1"
              >
                <span>Find more characters</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
