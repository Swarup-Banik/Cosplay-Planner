import React, { useState } from 'react';
import { Sparkles, History, FolderHeart, ArrowRight, Flame, Compass } from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { CharacterCard } from './CharacterCard';
import { Character, DifficultyLevel } from '../types';

interface CharacterDiscoveryProps {
  onSelectCharacter: (characterId: string) => void;
  onOpenChecklist: (projectId: string) => void;
  onBrowseAll: () => void;
}

export const CharacterDiscovery: React.FC<CharacterDiscoveryProps> = ({
  onSelectCharacter,
  onOpenChecklist,
  onBrowseAll
}) => {
  const { trendingCharacters, characters, savedProjects, recentlyViewedIds, addCharacterToCosplay, getCharacterById } = useCosplay();
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');

  const baseList = trendingCharacters.length > 0 ? trendingCharacters : characters;

  // Filtered popular characters
  const popularList = baseList
    .filter(c => (selectedDifficulty === 'All' ? true : c.difficulty === selectedDifficulty))
    .slice(0, 6);

  // Recently viewed characters
  const recentCharacters = recentlyViewedIds
    .map(id => getCharacterById(id))
    .filter((c): c is Character => Boolean(c))
    .slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. MY ACTIVE COSPLAY SNIPPET (If user has saved projects) */}
      {savedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-lavender-100/90 via-white to-blush-50/80 border border-lavender-200 shadow-soft backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-dream-600 to-lavender-500 text-white flex items-center justify-center shadow-md">
                  <FolderHeart className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-dream-950 font-display">
                      My Active Cosplays
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-lavender-200 text-dream-800">
                      {savedProjects.length} {savedProjects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                  </div>
                  <p className="text-xs text-dream-600">
                    Pick up where you left off crafting and planning your anime costumes.
                  </p>
                </div>
              </div>

              {/* Quick Resume Carousel / Pills */}
              <div className="flex flex-wrap items-center gap-3">
                {savedProjects.slice(0, 2).map(project => {
                  const completedCount = project.items.filter(
                    i => i.status === 'Completed' || i.status === 'Acquired'
                  ).length;
                  const totalCount = project.items.length;
                  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                  return (
                    <button
                      key={project.id}
                      onClick={() => onOpenChecklist(project.id)}
                      className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-white border border-lavender-200/90 shadow-sm hover:shadow-md hover:border-lavender-400 transition-all text-left group"
                    >
                      <img
                        src={project.characterImage}
                        alt={project.characterName}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-dream-900 group-hover:text-dream-600 flex items-center gap-1.5">
                          <span>{project.characterName}</span>
                          <span className="text-[10px] font-mono text-dream-500">({pct}%)</span>
                        </div>
                        <div className="w-28 h-1.5 bg-lavender-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-dream-500 to-blush-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-dream-500 mt-1">
                          {completedCount} / {totalCount} items complete
                        </div>
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => onOpenChecklist(savedProjects[0].id)}
                  className="px-4 py-2.5 rounded-2xl bg-dream-900 hover:bg-dream-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span>Open Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. POPULAR CHARACTERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-dream-600 uppercase tracking-widest mb-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Trending in Cosplay</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dream-950 tracking-tight">
              Popular Characters
            </h2>
            <p className="text-sm text-dream-600/80 mt-1">
              Top curated anime characters with complete cosplay breakdowns and guides.
            </p>
          </div>

          {/* Difficulty Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/70 p-1.5 rounded-2xl border border-lavender-200/80 backdrop-blur-md">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-dream-700 text-white shadow-sm'
                    : 'text-dream-700 hover:bg-lavender-100/60'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Character Cards Grid with Staggered Fade-Up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {popularList.map((character, idx) => (
            <div
              key={character.id}
              className="animate-fadeUp h-full"
              style={{ animationDelay: `${Math.min(idx * 70, 420)}ms` }}
            >
              <CharacterCard
                character={character}
                onSelect={onSelectCharacter}
                onAddToCosplay={addCharacterToCosplay}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onBrowseAll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/90 hover:bg-white text-dream-900 font-bold text-sm border border-lavender-200 shadow-soft hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4 text-dream-600" />
            <span>Explore All {characters.length} Anime Characters</span>
            <ArrowRight className="w-4 h-4 text-dream-500" />
          </button>
        </div>
      </section>

      {/* 3. RECENTLY VIEWED (If user explored characters) */}
      {recentCharacters.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-dream-600" />
            <h3 className="font-display font-bold text-xl text-dream-950">
              Recently Viewed Characters
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentCharacters.map(char => (
              <button
                key={char.id}
                onClick={() => onSelectCharacter(char.id)}
                className="group relative flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-lavender-200 shadow-sm hover:shadow-md hover:border-lavender-400 transition-all text-left"
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-14 h-14 rounded-xl object-cover border border-lavender-100 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-dream-900 group-hover:text-dream-600 truncate">
                    {char.name}
                  </div>
                  <div className="text-[11px] text-dream-500 truncate">{char.series}</div>
                  <div className="text-[10px] text-lavender-700 font-semibold mt-0.5">
                    {char.difficulty}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
