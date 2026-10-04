import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ArrowRight, Wand2, CheckCircle2, Bot, Loader2, Flame } from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { Character } from '../types';
import { SakuraCanvas } from './SakuraCanvas';
import { TrendingMarquee } from './TrendingMarquee';
import { isReducedMotionPreferred } from '../lib/motion';

interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onSelectCharacter: (characterId: string) => void;
  onOpenQuiz?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onSearchSubmit, 
  onSelectCharacter,
  onOpenQuiz 
}) => {
  const { characters, trendingCharacters, searchApiCharacters } = useCosplay();
  const [searchVal, setSearchVal] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState<Character[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  // Rotating placeholder cycle
  const rotatingExamples = [
    'Yor Forger',
    'Gojo Satoru',
    'Anya Forger',
    'Mikasa Ackerman',
    'Monkey D. Luffy',
    'Naruto Uzumaki',
    'Frieren',
    'Marin Kitagawa'
  ];
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setExampleIndex(prev => (prev + 1) % rotatingExamples.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [rotatingExamples.length]);

  // Interactive cursor glow tracking
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isReducedMotionPreferred() || window.matchMedia('(pointer: coarse)').matches) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const sampleSuggestions = [
    { name: 'Yor Forger', query: 'Yor Forger' },
    { name: 'Gojo Satoru', query: 'Gojo Satoru' },
    { name: 'Anya Forger', query: 'Anya Forger' },
    { name: 'Nezuko', query: 'Nezuko Kamado' },
    { name: 'Frieren', query: 'Frieren' },
    { name: 'Marin', query: 'Marin Kitagawa' },
    { name: 'Luffy', query: 'Luffy' },
    { name: 'Naruto', query: 'Naruto' },
    { name: 'Mikasa', query: 'Mikasa' }
  ];

  // Debounced API search for dropdown
  useEffect(() => {
    if (!searchVal.trim() || searchVal.length < 2) {
      setLiveSuggestions([]);
      setIsSearchingLive(false);
      return;
    }

    setIsSearchingLive(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchApiCharacters(searchVal.trim());
        setLiveSuggestions(res.characters.slice(0, 5));
      } catch {
        // Fallback to local characters
        const fallback = characters.filter(c =>
          c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          c.series.toLowerCase().includes(searchVal.toLowerCase())
        ).slice(0, 5);
        setLiveSuggestions(fallback);
      } finally {
        setIsSearchingLive(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchVal, searchApiCharacters, characters]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchSubmit(searchVal.trim());
    }
  };

  const marqueeList = trendingCharacters.length > 0 ? trendingCharacters : characters;

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden"
    >
      {/* Floating Sakura Petals / Sparkles Canvas */}
      <SakuraCanvas />

      {/* Manga Speed-Lines Atmospheric Effect */}
      <div className="absolute inset-0 manga-speed-lines opacity-65 -z-10 pointer-events-none" />

      {/* Animated Mesh Gradient Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-gradient-to-tr from-lavender-300/40 via-blush-200/40 to-softblue-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-mesh" />
      <div
        className="absolute top-36 -left-20 w-80 h-80 bg-dream-300/35 rounded-full blur-3xl -z-10 pointer-events-none animate-mesh"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute top-28 -right-20 w-96 h-96 bg-blush-300/35 rounded-full blur-3xl -z-10 pointer-events-none animate-mesh"
        style={{ animationDelay: '-12s' }}
      />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(circle 380px at ${cursorPos.x}px ${cursorPos.y}px, rgba(172, 125, 232, 0.14), transparent 70%)`
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Soft Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-lavender-200 shadow-soft text-dream-800 text-xs font-semibold mb-6 backdrop-blur-md animate-float">
          <Sparkles className="w-3.5 h-3.5 text-dream-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>MyAnimeList Connected • Jikan API</span>
          <span className="w-1.5 h-1.5 rounded-full bg-dream-500" />
          <span className="text-dream-600 font-normal">Checklist & Companion</span>
        </div>

        {/* Hero Title with Word-by-Word Reveal */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-dream-950 tracking-tight leading-[1.1] mb-6">
          <span className="block font-bold">Cosplay Planner</span>
          <span className="block text-2xl sm:text-3xl md:text-4xl font-normal text-dream-700/90 mt-3 font-sans flex flex-wrap justify-center gap-x-2">
            {'Turn your favorite characters into your next cosplay.'.split(' ').map((word, i) => (
              <span
                key={i}
                className="inline-block animate-fadeUp"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {word}
              </span>
            ))}
          </span>
        </h1>

        {/* Narrative Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-dream-800/80 mb-10 leading-relaxed font-normal">
          Discover immersive MyAnimeList character profiles, auto-generate complete crafting & garment checklists,
          track every prop and wig, and interact with your personal character companion.
        </p>

        {/* Prominent Search Container */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <form onSubmit={handleFormSubmit} className="relative z-20">
            <div
              className={`relative flex items-center bg-white/95 backdrop-blur-xl rounded-2xl border transition-all duration-300 shadow-glass-hover ${
                isFocused
                  ? 'border-dream-500 shadow-glow-lavender ring-4 ring-lavender-200/50'
                  : 'border-lavender-200/90 hover:border-lavender-300'
              }`}
            >
              <div className="pl-5 text-dream-500">
                {isSearchingLive ? (
                  <Loader2 className="w-5 h-5 animate-spin text-dream-600" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                placeholder={`Search for a character... Try ${rotatingExamples[exampleIndex]}`}
                className="w-full py-4 pl-3 pr-28 text-base text-dream-950 placeholder-dream-400/80 bg-transparent focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 hover:to-lavender-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] active:shadow-inner"
              >
                Search
              </button>
            </div>
          </form>

          {/* Instant Search Dropdown Results */}
          {isFocused && searchVal.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border border-lavender-200 shadow-2xl p-2 z-30 text-left animate-fadeUp">
              {liveSuggestions.length > 0 ? (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-dream-400 uppercase tracking-wider flex items-center justify-between">
                    <span>MyAnimeList Character Matches</span>
                    <span className="text-[10px] lowercase font-normal text-dream-500">Press Enter for all</span>
                  </div>
                  {liveSuggestions.map(char => (
                    <button
                      key={char.id || char.mal_id}
                      onClick={() => onSelectCharacter(String(char.id || char.mal_id))}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-lavender-50 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-10 h-10 rounded-lg object-cover border border-lavender-200 object-[center_top]"
                        />
                        <div>
                          <div className="text-sm font-bold text-dream-900 group-hover:text-dream-600">
                            {char.name}
                          </div>
                          <div className="text-xs text-dream-500 line-clamp-1">
                            {char.series}
                            {char.japaneseName && <span className="ml-1 text-[11px] font-jp text-dream-400">({char.japaneseName})</span>}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-dream-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              ) : isSearchingLive ? (
                <div className="p-4 text-center text-xs text-dream-600 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-dream-500" />
                  <span>Searching MyAnimeList characters...</span>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-dream-500">
                  Press Enter to search all results for "{searchVal}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-6">
          <span className="text-xs text-dream-500 font-medium mr-1">Quick pick:</span>
          {sampleSuggestions.map(chip => (
            <button
              key={chip.name}
              onClick={() => onSearchSubmit(chip.query)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 hover:bg-white text-dream-800 border border-lavender-200/90 shadow-soft hover:border-lavender-400 hover:shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <span>{chip.name}</span>
            </button>
          ))}
        </div>

        {/* Find My Cosplay Match Quiz CTA */}
        {onOpenQuiz && (
          <div className="flex justify-center mb-7">
            <button
              onClick={onOpenQuiz}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-dream-600 via-lavender-600 to-blush-500 hover:from-dream-500 hover:to-blush-400 text-white text-xs sm:text-sm font-bold shadow-glow-lavender hover:shadow-lg transition-all hover:scale-105 active:scale-95 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Not sure who to cosplay? Take the "Find My Cosplay" Match Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Auto-scrolling Trending Marquee Section */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 px-2 mb-1 text-xs font-bold text-dream-700 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Trending Characters Marquee</span>
          </div>
          <TrendingMarquee
            characters={marqueeList}
            onSelectCharacter={onSelectCharacter}
          />
        </div>

        {/* Value Proposition Highlights with Hover Lift & Icon Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 border-t border-lavender-200/60">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-lavender-100 hover:border-lavender-300 shadow-soft hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-lavender-100 text-dream-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-dream-900 group-hover:text-dream-700 transition-colors">MyAnimeList Lore</div>
              <div className="text-[11px] text-dream-500">Authentic character bios & CVs</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-lavender-100 hover:border-lavender-300 shadow-soft hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-blush-100 text-blush-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-dream-900 group-hover:text-dream-700 transition-colors">Live Checklists</div>
              <div className="text-[11px] text-dream-500">Wigs, props, and garments</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-lavender-100 hover:border-lavender-300 shadow-soft hover:shadow-glass-hover hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="w-10 h-10 rounded-xl bg-softblue-100 text-softblue-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-dream-900 group-hover:text-dream-700 transition-colors">Voice Companion</div>
              <div className="text-[11px] text-dream-500">Talk directly to characters</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
