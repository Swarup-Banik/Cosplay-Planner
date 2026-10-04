import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  FolderHeart, 
  Compass, 
  BookOpen, 
  Users, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Heart,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentTab: 'home' | 'characters' | 'my-cosplays' | 'community' | 'resources';
  onSelectTab: (tab: 'home' | 'characters' | 'my-cosplays' | 'community' | 'resources') => void;
  onOpenSearch: () => void;
  onOpenQuiz?: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenSearch, onOpenQuiz, onOpenTour }) => {
  const { 
    savedProjects, 
    soundEnabled, 
    toggleSound, 
    currency, 
    setCurrency, 
    favorites, 
    setIsFavoritesDrawerOpen 
  } = useCosplay();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dark Mode Theme State (persisted in localStorage)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cosplay_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cosplay_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cosplay_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    sound.playClick();
    setIsDark(prev => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  interface NavItem {
    id: 'home' | 'characters' | 'my-cosplays' | 'community' | 'resources';
    label: string;
    icon: any;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'characters', label: 'Characters', icon: Search },
    { 
      id: 'my-cosplays', 
      label: 'My Cosplays', 
      icon: FolderHeart, 
      badge: savedProjects.length > 0 ? savedProjects.length : undefined 
    },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-[#120F20]/80 border-b border-lavender-200/60 dark:border-lavender-800/40 transition-all duration-300 ${
        isScrolled ? 'shadow-glass-hover bg-white/85 dark:bg-[#120F20]/90 py-0' : 'shadow-glass'
      }`}>
        {/* Top Scroll Progress Bar */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-transparent z-50 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-dream-500 via-lavender-500 to-blush-400 transition-all duration-150 ease-out shadow-xs"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            
            {/* Logo */}
            <button
              onClick={() => {
                onSelectTab('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01] shrink-0 whitespace-nowrap"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-lavender-400 via-dream-500 to-blush-400 p-[2px] shadow-glow-lavender flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white/95 dark:bg-gray-900 rounded-[14px] flex items-center justify-center group-hover:bg-white transition-colors">
                  <Sparkles className="w-5 h-5 text-dream-700 dark:text-lavender-300 transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-dream-900 via-dream-700 to-blush-500 dark:from-white dark:via-lavender-200 dark:to-blush-300 bg-clip-text text-transparent whitespace-nowrap">
                    Cosplay Planner
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-lavender-100 dark:bg-lavender-900/60 text-dream-700 dark:text-lavender-300 border border-lavender-300 dark:border-lavender-700 hidden sm:inline-block">
                    PROTOTYPE
                  </span>
                </div>
                <p className="hidden xl:block text-[11px] font-jp tracking-wider text-dream-600/80 dark:text-lavender-400/80 font-medium whitespace-nowrap">
                  コスプレ・プランナー • Anime Companion
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-white/60 dark:bg-gray-900/60 p-1.5 rounded-2xl border border-lavender-200/50 dark:border-lavender-800/40 shadow-sm backdrop-blur-md shrink-0 relative">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playHover();
                      onSelectTab(item.id);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-dream-900 dark:text-lavender-200 hover:text-dream-700 hover:bg-lavender-50/60 dark:hover:bg-lavender-900/30'
                    }`}
                  >
                    {/* Sliding active pill indicator */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-500 shadow-md shadow-dream-500/25 -z-10 animate-scalePop"
                      />
                    )}
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-dream-500 dark:text-lavender-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-lavender-200 dark:bg-lavender-800 text-dream-900 dark:text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Utility Tools */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Quick Search Shortcut */}
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 text-dream-800 dark:text-lavender-200 border border-lavender-200/80 dark:border-lavender-800/50 shadow-soft transition-all hover:border-lavender-400 group"
                title="Search characters"
              >
                <Search className="w-3.5 h-3.5 text-dream-500 group-hover:scale-110 transition-transform" />
                <span>Search</span>
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-lavender-100 dark:bg-gray-700 text-[10px] text-dream-700 dark:text-lavender-300 font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Match Quiz Shortcut */}
              {onOpenQuiz && (
                <button
                  onClick={onOpenQuiz}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-dream-500/15 to-blush-500/15 hover:from-dream-500/25 hover:to-blush-500/25 text-dream-800 dark:text-lavender-200 border border-lavender-300/60 dark:border-lavender-700/50 shadow-soft transition-all hover:scale-105"
                  title="Find your cosplay match"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                  <span>Match Quiz</span>
                </button>
              )}

              {/* Currency Switcher */}
              <button
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 text-dream-700 dark:text-lavender-200 border border-lavender-200/80 dark:border-lavender-800/50 shadow-soft transition-all"
                title="Toggle currency display"
              >
                {currency === 'INR' ? '₹ INR' : '$ USD'}
              </button>

              {/* Sound FX Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border transition-all ${
                  soundEnabled
                    ? 'bg-lavender-100/80 dark:bg-lavender-900/60 text-dream-700 dark:text-lavender-200 border-lavender-300 dark:border-lavender-700 hover:bg-lavender-200'
                    : 'bg-white/70 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                }`}
                title={soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-dream-600 dark:text-lavender-300" />
                ) : (
                  <VolumeX className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Dark Mode Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-lavender-200/80 dark:border-lavender-800/60 bg-white/70 dark:bg-gray-800 hover:bg-white text-dream-700 dark:text-lavender-300 shadow-soft transition-all"
                title={isDark ? 'Switch to Light Pastel' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dream-600" />}
              </button>

              {/* Wishlist Favorites Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsFavoritesDrawerOpen(true);
                }}
                className="relative p-2 rounded-xl border border-lavender-200/80 dark:border-lavender-800/60 bg-white/70 dark:bg-gray-800 hover:bg-white text-blush-500 hover:text-blush-600 shadow-soft transition-all hover:scale-105 active:scale-95 group"
                title="Open Wishlist & Favorites"
                aria-label="Open Wishlist & Favorites"
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-blush-400 text-blush-500 animate-scalePop' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blush-500 text-[10px] font-bold text-white shadow-xs font-mono">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Interactive App Tour Button */}
              {onOpenTour && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenTour();
                  }}
                  className="p-2 rounded-xl border border-lavender-200/80 dark:border-lavender-800/60 bg-white/70 dark:bg-gray-800 hover:bg-white text-dream-700 dark:text-lavender-300 shadow-soft transition-all hover:scale-105 active:scale-95"
                  title="App Features Tour"
                  aria-label="App Features Tour"
                >
                  <HelpCircle className="w-4 h-4 text-dream-600 dark:text-lavender-300" />
                </button>
              )}
            </div>

            {/* Mobile Top Action Buttons */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsFavoritesDrawerOpen(true);
                }}
                className="relative p-2.5 rounded-xl bg-white/80 dark:bg-gray-800 text-blush-500 border border-lavender-200 dark:border-lavender-700 shadow-soft"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-blush-400 text-blush-500' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-blush-500 text-[9px] font-bold text-white font-mono">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800 text-dream-700 dark:text-amber-400 border border-lavender-200 dark:border-lavender-700 shadow-soft"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800 text-dream-700 dark:text-lavender-200 border border-lavender-200 dark:border-lavender-700 shadow-soft"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800 text-dream-800 dark:text-lavender-200 border border-lavender-200 dark:border-lavender-700 shadow-soft"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer (Menu) */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-lavender-300 dark:border-lavender-700 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-dream-600 to-lavender-500 text-white shadow-sm'
                      : 'text-dream-900 dark:text-lavender-200 hover:bg-lavender-50 dark:hover:bg-lavender-900/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/30 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {onOpenQuiz && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuiz();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-dream-600 via-lavender-600 to-blush-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Take the "Find My Cosplay" Match Quiz</span>
              </button>
            )}

            {onOpenTour && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTour();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-lavender-100 dark:bg-lavender-900/50 hover:bg-lavender-200 text-dream-800 dark:text-lavender-200 font-bold text-xs transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5 text-dream-500" />
                <span>Quick Feature Tour</span>
              </button>
            )}

            <div className="pt-3 border-t border-lavender-200 dark:border-lavender-700/60 flex items-center justify-between px-2 text-xs">
              <span className="text-dream-600 dark:text-lavender-400 font-medium">Currency & Audio:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-lavender-200 dark:border-lavender-700 text-dream-700 dark:text-lavender-200 font-semibold"
                >
                  {currency === 'INR' ? '₹ INR' : '$ USD'}
                </button>
                <button
                  onClick={toggleSound}
                  className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-lavender-200 dark:border-lavender-700 text-dream-600 dark:text-lavender-200"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (<768px) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-[#120F20]/95 backdrop-blur-2xl border-t border-lavender-200/80 dark:border-lavender-800/40 py-1.5 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-dream-700 dark:text-lavender-300 font-bold scale-105'
                  : 'text-dream-500 dark:text-gray-400 hover:text-dream-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 text-[10px] w-4 h-4 rounded-full bg-gradient-to-r from-dream-600 to-blush-500 text-white flex items-center justify-center font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-dream-600 dark:bg-lavender-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
