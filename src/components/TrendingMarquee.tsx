import React from 'react';
import { Character } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TrendingMarqueeProps {
  characters: Character[];
  onSelectCharacter: (characterId: string) => void;
}

export const TrendingMarquee: React.FC<TrendingMarqueeProps> = ({ characters, onSelectCharacter }) => {
  if (!characters || characters.length === 0) return null;

  // Duplicate for seamless infinite loop
  const displayItems = [...characters.slice(0, 8), ...characters.slice(0, 8)];

  return (
    <div className="w-full overflow-hidden py-6 relative group">
      {/* Soft gradient edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAF8FD] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAF8FD] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex gap-4 animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
        {displayItems.map((char, index) => (
          <button
            key={`${char.id || char.mal_id}-${index}`}
            onClick={() => onSelectCharacter(String(char.id || char.mal_id))}
            className="flex items-center gap-3.5 p-2 pr-4 rounded-2xl bg-white/80 hover:bg-white border border-lavender-200/80 shadow-soft hover:shadow-glass-hover hover:border-lavender-400 transition-all duration-300 shrink-0 text-left cursor-pointer group/item hover:scale-[1.02]"
          >
            <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-lavender-100 shrink-0 border border-lavender-200">
              <img
                src={char.image}
                alt={char.name}
                loading="lazy"
                className="w-full h-full object-cover object-[center_top] group-hover/item:scale-110 transition-transform duration-500"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-dream-950 group-hover/item:text-dream-700 transition-colors">
                {char.name}
              </div>
              <div className="text-[11px] text-dream-600/80 line-clamp-1 max-w-[140px]">
                {char.series}
              </div>
              <div className="text-[10px] text-lavender-500 font-semibold font-mono mt-0.5">
                {char.cosplayItems?.length || 4} pieces
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-dream-400 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
