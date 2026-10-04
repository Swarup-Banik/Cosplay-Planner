import React, { useState, useRef } from 'react';
import { Sparkles, Check, ArrowUpRight, Plus, Heart } from 'lucide-react';
import { Character, DIFFICULTY_COLORS } from '../types';
import { useCosplay } from '../context/CosplayContext';
import { isReducedMotionPreferred } from '../lib/motion';
import { getCharacterFull } from '../services/jikan';

interface CharacterCardProps {
  character: Character;
  onSelect: (characterId: string) => void;
  onAddToCosplay?: (characterId: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onSelect,
  onAddToCosplay
}) => {
  const { getProjectForCharacter, isFavorite, toggleFavorite } = useCosplay();
  const existingProject = getProjectForCharacter(character.id || character.mal_id);
  const isFav = isFavorite(character.id || character.mal_id);
  const [imgSrc, setImgSrc] = useState(character.image);
  const [isLoaded, setIsLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const prefetchTimerRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (character.mal_id) {
      prefetchTimerRef.current = setTimeout(() => {
        getCharacterFull(character.mal_id, 'low');
      }, 250);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isReducedMotionPreferred()) return;
    // Disable on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Max 10-12 degrees tilt
      const tiltX = (0.5 - y) * 12;
      const tiltY = (x - 0.5) * 12;

      cardRef.current.style.setProperty('--mx', `${x * 100}%`);
      cardRef.current.style.setProperty('--my', `${y * 100}%`);
      cardRef.current.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      cardRef.current.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      cardRef.current.style.setProperty('--card-scale', '1.025');
    });
  };

  const handleMouseLeave = () => {
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current);
    }
    if (!cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    cardRef.current.style.setProperty('--tilt-x', '0deg');
    cardRef.current.style.setProperty('--tilt-y', '0deg');
    cardRef.current.style.setProperty('--card-scale', '1');
    cardRef.current.style.setProperty('--mx', '50%');
    cardRef.current.style.setProperty('--my', '50%');
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCosplay) {
      setJustAdded(true);
      onAddToCosplay(String(character.id || character.mal_id));
      setTimeout(() => setJustAdded(false), 2200);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(String(character.id || character.mal_id))}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) scale3d(var(--card-scale, 1), var(--card-scale, 1), 1)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease'
      }}
      className="group relative flex flex-col h-full rounded-3xl bg-white/85 border border-lavender-200/80 shadow-soft hover:shadow-glass-hover cursor-pointer overflow-hidden backdrop-blur-md will-change-transform"
    >
      {/* Glossy Holographic Foil Gradient Shine on Hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 mix-blend-color-dodge"
        style={{
          background: `radial-gradient(circle 280px at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.4), rgba(172, 125, 232, 0.2), rgba(244, 114, 182, 0.15), transparent 75%)`
        }}
      />

      {/* Visual Artwork Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-lavender-100 via-dream-50 to-blush-50">
        {/* Shimmering Skeleton Loader while image loads */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-lavender-100 via-white/70 to-lavender-100 animate-pulse z-0" />
        )}

        <img
          src={imgSrc}
          alt={character.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setImgSrc('https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80');
          }}
          className={`h-full w-full object-cover object-[center_top] transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
          }`}
        />

        {/* Ambient Overlay Gradient for depth & legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F24]/95 via-[#151322]/45 via-45% to-transparent opacity-90 group-hover:opacity-95 transition-opacity pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          {/* Difficulty Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${
              DIFFICULTY_COLORS[character.difficulty]
            } bg-white/90 shadow-sm`}
          >
            {character.difficulty}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Saved Project Status Indicator */}
            {existingProject || justAdded ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm animate-scalePop">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>In Cosplays</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/50 text-white/90 backdrop-blur-md">
                {character.mal_id ? (
                  <span>MAL #{character.mal_id}</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-lavender-300" />
                    <span>{character.popularity}%</span>
                  </>
                )}
              </span>
            )}

            {/* Wishlist Heart Toggle */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(character);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
                isFav
                  ? 'bg-blush-500 text-white shadow-sm shadow-blush-500/40 scale-105 active:scale-95'
                  : 'bg-black/45 hover:bg-black/65 text-white/80 hover:text-blush-200 active:scale-95'
              }`}
              title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isFav ? 'fill-current text-white animate-scalePop' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Japanese Name Watermark - Vertical top-right to prevent collision with name */}
        {character.japaneseName && (
          <div
            style={{ writingMode: 'vertical-rl' }}
            className="absolute top-14 right-3 font-jp text-lg sm:text-xl font-extrabold tracking-widest text-white/20 select-none pointer-events-none group-hover:text-white/35 transition-colors z-10"
          >
            {character.japaneseName}
          </div>
        )}

        {/* Bottom Information Overlay with enhanced gradient contrast */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-lavender-300 mb-1 line-clamp-1">
            {character.series}
          </div>
          <h3 className="font-display font-extrabold text-2xl tracking-tight leading-snug group-hover:text-lavender-200 transition-colors drop-shadow-sm">
            {character.name}
          </h3>
          <p className="text-xs text-white/80 line-clamp-1 mt-1 font-light">
            {character.role || `${character.cosplayItems.length} Cosplay Items`}
          </p>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3.5 bg-white/90 border-t border-lavender-100 flex items-center justify-between gap-2 z-10">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onSelect(String(character.id || character.mal_id));
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-dream-800 hover:text-dream-950 hover:bg-lavender-50 transition-colors"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-dream-500" />
        </button>

        {onAddToCosplay && (
          <button
            type="button"
            onClick={handleAddClick}
            className={`p-2 rounded-xl transition-all duration-300 ${
              existingProject || justAdded
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-2 ring-emerald-400/40'
                : 'bg-lavender-100 text-dream-800 hover:bg-dream-600 hover:text-white hover:scale-105 active:scale-95'
            }`}
            title={existingProject ? 'Open in My Cosplays' : 'Add to My Cosplay'}
          >
            {existingProject || justAdded ? (
              <Check className="w-4 h-4 text-emerald-600 animate-scalePop" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
