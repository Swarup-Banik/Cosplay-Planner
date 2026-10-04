import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Database, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { CharacterCard } from './CharacterCard';
import { Character, DifficultyLevel } from '../types';
import { JikanPagination } from '../services/jikan';

interface CharacterSearchPageProps {
  initialQuery?: string;
  onSelectCharacter: (characterId: string) => void;
}

export const CharacterSearchPage: React.FC<CharacterSearchPageProps> = ({
  initialQuery = '',
  onSelectCharacter
}) => {
  const { 
    trendingCharacters, 
    searchApiCharacters, 
    addCharacterToCosplay 
  } = useCosplay();

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Character[]>([]);
  const [pagination, setPagination] = useState<JikanPagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchSource, setSearchSource] = useState<string | null>(null);

  // Client-side Filters & Sorting
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Main' | 'Supporting'>('All');
  const [selectedSeries, setSelectedSeries] = useState<string | 'All'>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'az'>('relevance');

  // Request Tracking & Watchdog Refs
  const activeSearchIdRef = useRef(0);

  // Watchdog timer: Guarantee skeletons never remain stuck longer than 9 seconds
  useEffect(() => {
    if (!isLoading) return;
    const watchdog = setTimeout(() => {
      setIsLoading(false);
      if (debouncedQuery && searchResults.length === 0 && !errorMessage) {
        setErrorMessage('Search took longer than expected. Please tap retry.');
      }
    }, 9000);
    return () => clearTimeout(watchdog);
  }, [isLoading, debouncedQuery, searchResults.length, errorMessage]);

  const handleLoadMore = async () => {
    if (!pagination?.has_next_page || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const res = await searchApiCharacters(debouncedQuery, nextPage);
      setSearchResults(prev => [...prev, ...(res.characters || [])]);
      setCurrentPage(nextPage);
      setPagination(res.pagination || null);
    } catch (err) {
      console.error('Failed to load more characters', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Debounce search input (400ms pause)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchTerm.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Execute API Search on debounced query change or pagination change
  useEffect(() => {
    const currentSearchId = ++activeSearchIdRef.current;

    async function performSearch() {
      if (!debouncedQuery) {
        setIsLoading(false);
        setSearchResults([]);
        setPagination(null);
        setErrorMessage(null);
        setSearchSource(null);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await searchApiCharacters(debouncedQuery, currentPage);
        // Only update if this request is still the most current search
        if (currentSearchId === activeSearchIdRef.current) {
          setSearchResults(res.characters || []);
          setPagination(res.pagination || null);
          setSearchSource(res.source);
          if (res.error && (!res.characters || res.characters.length === 0)) {
            setErrorMessage(res.error);
          }
        }
      } catch (err: any) {
        if (currentSearchId === activeSearchIdRef.current) {
          setErrorMessage('Character data is temporarily unavailable. Please try again.');
        }
      } finally {
        if (currentSearchId === activeSearchIdRef.current) {
          setIsLoading(false);
        }
      }
    }

    performSearch();
  }, [debouncedQuery, currentPage, searchApiCharacters]);

  // Characters to display: search results if queried, or trending characters when query is empty
  const isQueryActive = debouncedQuery.length > 0;
  const rawList = isQueryActive ? searchResults : trendingCharacters;

  // Derive list of unique series present in currently loaded results
  const availableSeries = useMemo(() => {
    const seriesSet = new Set<string>();
    (rawList || []).forEach(c => {
      if (c?.series && typeof c.series === 'string' && c.series.trim()) {
        seriesSet.add(c.series.trim());
      }
    });
    return Array.from(seriesSet).sort();
  }, [rawList]);

  // Client-side filtering & sorting
  const displayedCharacters = useMemo(() => {
    let list = Array.isArray(rawList) ? [...rawList] : [];

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      list = list.filter(c => c?.difficulty === selectedDifficulty);
    }

    // Role filter
    if (selectedRole !== 'All') {
      list = list.filter(c => {
        const roleStr = (c?.role || '').toLowerCase();
        if (selectedRole === 'Main') return roleStr.includes('main');
        if (selectedRole === 'Supporting') {
          return roleStr.includes('supp') || (!roleStr.includes('main') && roleStr.length > 0);
        }
        return true;
      });
    }

    // Series filter
    if (selectedSeries !== 'All') {
      list = list.filter(c => c?.series === selectedSeries);
    }

    // Defensive Sort
    if (sortBy === 'popularity') {
      list.sort((a, b) => (Number(b?.popularity) || 0) - (Number(a?.popularity) || 0));
    } else if (sortBy === 'az') {
      list.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
    }

    return list;
  }, [rawList, selectedDifficulty, selectedRole, selectedSeries, sortBy]);

  const hasActiveFilters =
    selectedDifficulty !== 'All' ||
    selectedRole !== 'All' ||
    selectedSeries !== 'All' ||
    sortBy !== 'relevance';

  const resetFilters = () => {
    setSelectedDifficulty('All');
    setSelectedRole('All');
    setSelectedSeries('All');
    setSortBy('relevance');
  };

  const sampleSearchChips = [
    'Yor Forger',
    'Gojo Satoru',
    'Anya Forger',
    'Nezuko Kamado',
    'Tanjiro Kamado',
    'Marin Kitagawa',
    'Luffy',
    'Naruto',
    'Frieren',
    'Mikasa'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100 text-dream-800 text-xs font-semibold mb-3 border border-lavender-200">
          <Database className="w-3.5 h-3.5 text-dream-600" />
          <span>MyAnimeList Database via Jikan API</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-dream-950 tracking-tight mb-3">
          Anime Character Database
        </h1>
        <p className="text-base text-dream-700/80">
          Search millions of official MyAnimeList characters. Real artwork, authentic Japanese profiles, and instant cosplay checklists.
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="p-6 rounded-3xl bg-white/85 border border-lavender-200/90 shadow-soft backdrop-blur-xl mb-10 space-y-5">
        
        {/* Search Input Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-dream-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-dream-600" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search anime character: Yor Forger, Gojo Satoru, Luffy, Frieren, Naruto..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl glass-input text-dream-900 placeholder-dream-400 font-medium text-sm sm:text-base focus:ring-4 focus:ring-lavender-200/60"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDebouncedQuery('');
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-dream-400 hover:text-dream-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-dream-500 font-medium mr-1">Popular searches:</span>
          {sampleSearchChips.map(chip => (
            <button
              key={chip}
              onClick={() => setSearchTerm(chip)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                searchTerm === chip
                  ? 'bg-dream-700 text-white shadow-sm'
                  : 'bg-lavender-50 hover:bg-lavender-100 text-dream-800 border border-lavender-200/80'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Source attribution indicator */}
        {isQueryActive && searchSource && (
          <div className="pt-3 border-t border-lavender-100 dark:border-lavender-800/40 flex items-center justify-between text-xs text-dream-500 dark:text-lavender-400">
            <span className="font-medium">Search results refined in real-time</span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-lavender-200 dark:border-lavender-700 text-[11px] font-mono">
              Source: {searchSource === 'jikan' ? 'MyAnimeList API' : 'Anime Database Cache'}
            </span>
          </div>
        )}

      </div>

      {/* Sticky Filter & Sort Bar */}
      <div className="sticky top-16 sm:top-20 z-30 mb-8 p-3.5 sm:p-4 rounded-3xl bg-white/90 dark:bg-[#151226]/90 border border-lavender-200/90 dark:border-lavender-800/60 shadow-glass backdrop-blur-xl transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          
          {/* Left: Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-dream-800 dark:text-lavender-200 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-dream-500" />
              <span className="hidden sm:inline">Filters:</span>
            </div>

            {/* Difficulty Chips */}
            <div className="flex items-center gap-1 bg-lavender-50/80 dark:bg-gray-800/80 p-1 rounded-2xl border border-lavender-200/60 dark:border-lavender-800/40 overflow-x-auto max-w-full">
              {(['All', 'Beginner', 'Intermediate', 'Advanced', 'Master'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-gradient-to-r from-dream-700 to-lavender-600 text-white shadow-xs'
                      : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Role Filter Chips */}
            <div className="flex items-center gap-1 bg-lavender-50/80 dark:bg-gray-800/80 p-1 rounded-2xl border border-lavender-200/60 dark:border-lavender-800/40">
              {(['All', 'Main', 'Supporting'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === role
                      ? 'bg-gradient-to-r from-dream-700 to-lavender-600 text-white shadow-xs'
                      : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60'
                  }`}
                >
                  {role === 'All' ? 'All Roles' : role}
                </button>
              ))}
            </div>

            {/* Series Filter Dropdown */}
            {availableSeries.length > 0 && (
              <div className="relative">
                <select
                  value={selectedSeries}
                  onChange={e => setSelectedSeries(e.target.value)}
                  className="px-3 py-1.5 rounded-2xl text-xs font-semibold bg-lavender-50/80 dark:bg-gray-800/80 text-dream-800 dark:text-lavender-200 border border-lavender-200/60 dark:border-lavender-800/40 focus:ring-2 focus:ring-lavender-400 cursor-pointer max-w-[160px] truncate"
                >
                  <option value="All">All Series ({availableSeries.length})</option>
                  {availableSeries.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-blush-600 dark:text-blush-400 hover:bg-blush-50 dark:hover:bg-blush-950/40 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Sorting */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-lavender-100 dark:border-lavender-800/40 text-xs">
            <div className="flex items-center gap-1.5 text-dream-600 dark:text-lavender-300 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-dream-500" />
              <span>Sort:</span>
            </div>

            <div className="flex items-center gap-1 bg-lavender-50/80 dark:bg-gray-800/80 p-1 rounded-2xl border border-lavender-200/60 dark:border-lavender-800/40">
              {[
                { id: 'relevance', label: 'Relevance' },
                { id: 'popularity', label: 'Popularity' },
                { id: 'az', label: 'A-Z' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    sortBy === s.id
                      ? 'bg-dream-800 dark:bg-lavender-700 text-white shadow-xs'
                      : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900 dark:hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="text-sm font-semibold text-dream-800">
          {isLoading ? (
            <span className="flex items-center gap-2 text-dream-600">
              <Loader2 className="w-4 h-4 animate-spin text-dream-500" />
              <span>Finding characters in MyAnimeList database...</span>
            </span>
          ) : isQueryActive ? (
            <span>
              Found <strong className="text-dream-950 font-black">{displayedCharacters.length}</strong> matching character{displayedCharacters.length === 1 ? '' : 's'} for "{debouncedQuery}"
            </span>
          ) : (
            <span>
              Featured & Trending Anime Characters ({displayedCharacters.length})
            </span>
          )}
        </div>

        {pagination && pagination.last_visible_page > 1 && (
          <div className="text-xs text-dream-500 font-mono">
            Page {pagination.current_page} of {pagination.last_visible_page}
          </div>
        )}
      </div>

      {/* SKELETON LOADING STATE WITH SHIMMER */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map(idx => (
            <div
              key={idx}
              className="rounded-3xl bg-white/85 border border-lavender-200/80 shadow-soft overflow-hidden flex flex-col h-full"
            >
              {/* Artwork Container Skeleton */}
              <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-lavender-100 via-dream-50 to-blush-50 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Top Badge Skeletons */}
                <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                  <div className="h-6 w-16 rounded-full bg-lavender-200/60 animate-pulse" />
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-14 rounded-full bg-lavender-200/50 animate-pulse" />
                    <div className="h-6 w-6 rounded-full bg-lavender-200/50 animate-pulse" />
                  </div>
                </div>

                {/* Bottom Overlay Info Skeleton */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#120F24]/90 via-[#151322]/40 to-transparent space-y-2">
                  <div className="h-3 w-24 bg-white/20 rounded-md animate-pulse" />
                  <div className="h-5 w-44 bg-white/30 rounded-md animate-pulse" />
                  <div className="h-3 w-28 bg-white/15 rounded-md animate-pulse" />
                </div>
              </div>

              {/* Action Buttons Footer Skeleton */}
              <div className="p-3.5 bg-white/90 border-t border-lavender-100 flex items-center justify-between gap-2">
                <div className="flex-1 h-8 rounded-xl bg-lavender-100/70 animate-pulse" />
                <div className="h-8 w-24 rounded-xl bg-lavender-200/70 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CUTE ILLUSTRATED RATE-LIMIT / ERROR STATE WITH COUNTDOWN */}
      {!isLoading && errorMessage && (
        <div className="p-8 text-center rounded-3xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 max-w-lg mx-auto mb-8 space-y-4 shadow-soft animate-scalePop">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 mx-auto flex items-center justify-center text-3xl shadow-inner animate-pulse">
            🐱💤
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-amber-950 dark:text-amber-200">
              The Anime Database is Catching Its Breath!
            </h3>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 max-w-sm mx-auto leading-relaxed mt-1">
              External MyAnimeList API is temporarily busy. Resting for a quick moment so you don't lose your spot...
            </p>
          </div>
          <button
            onClick={() => {
              setErrorMessage(null);
              setDebouncedQuery(searchTerm.trim() || 'Yor Forger');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Now</span>
          </button>
        </div>
      )}

      {/* CHARACTERS RESULTS GRID WITH STAGGERED FADE-UP */}
      {!isLoading && displayedCharacters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedCharacters.map((char, idx) => (
            <div
              key={`${char.mal_id || char.id}`}
              className="animate-fadeUp h-full"
              style={{ animationDelay: `${Math.min(idx * 65, 450)}ms` }}
            >
              <CharacterCard
                character={char}
                onSelect={() => onSelectCharacter(String(char.id || char.mal_id))}
                onAddToCosplay={() => addCharacterToCosplay(char)}
              />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY RESULTS STATE */}
      {!isLoading && isQueryActive && displayedCharacters.length === 0 && !errorMessage && (
        <div className="p-12 text-center rounded-3xl bg-white/70 border border-lavender-200 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-dream-400 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-dream-900 mb-1">
            No characters found for "{debouncedQuery}"
          </h3>
          <p className="text-xs text-dream-600 mb-4 leading-relaxed">
            Try checking the spelling, searching the character's first name, or searching by their anime series title (e.g. "Spy x Family", "Demon Slayer", "Jujutsu Kaisen").
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSearchTerm('Yor Forger')}
              className="px-3 py-1.5 rounded-xl bg-lavender-100 text-dream-800 text-xs font-bold hover:bg-lavender-200"
            >
              Try "Yor Forger"
            </button>
            <button
              onClick={() => setSearchTerm('Gojo Satoru')}
              className="px-3 py-1.5 rounded-xl bg-lavender-100 text-dream-800 text-xs font-bold hover:bg-lavender-200"
            >
              Try "Gojo Satoru"
            </button>
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-1.5 rounded-xl bg-white border border-lavender-200 text-dream-800 text-xs font-medium"
            >
              Reset Search
            </button>
          </div>
        </div>
      )}

      {/* LOAD MORE BUTTON */}
      {!isLoading && isQueryActive && pagination?.has_next_page && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white border border-lavender-200 text-dream-800 text-xs font-bold shadow-soft hover:shadow-glass-hover hover:bg-lavender-50 disabled:opacity-60 transition-all hover:scale-[1.02]"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-dream-600" />
                <span>Loading more characters...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-dream-500" />
                <span>Load More Characters</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!isLoading && pagination && pagination.last_visible_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-lavender-200 text-xs font-semibold text-dream-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lavender-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-mono font-bold text-dream-700 px-3">
            {currentPage} / {pagination.last_visible_page}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.last_visible_page, prev + 1))}
            disabled={!pagination.has_next_page}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-lavender-200 text-xs font-semibold text-dream-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lavender-50 transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
