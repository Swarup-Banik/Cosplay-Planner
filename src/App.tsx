import React, { useState, useEffect } from 'react';
import { CosplayProvider, useCosplay } from './context/CosplayContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CharacterDiscovery } from './components/CharacterDiscovery';
import { CharacterSearchPage } from './components/CharacterSearchPage';
import { CosplayChecklistPage } from './components/CosplayChecklistPage';
import { MyCosplaysPage } from './components/MyCosplaysPage';
import { CommunityPage } from './components/CommunityPage';
import { ResourcesPage } from './components/ResourcesPage';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { PageTransition } from './lib/motion';
import { FloatingCompanionPill } from './components/FloatingCompanionPill';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { OfflineBanner } from './components/OfflineBanner';
import { AnimeLoadingWipe } from './components/AnimeLoadingWipe';
import { useKonamiCode } from './hooks/useKonamiCode';

const ImmersiveCharacterProfile = React.lazy(() =>
  import('./components/ImmersiveCharacterProfile').then(m => ({ default: m.ImmersiveCharacterProfile }))
);
const CharacterCompanionModal = React.lazy(() =>
  import('./components/CharacterCompanionModal').then(m => ({ default: m.CharacterCompanionModal }))
);
const CosplayMatchQuiz = React.lazy(() =>
  import('./components/CosplayMatchQuiz').then(m => ({ default: m.CosplayMatchQuiz }))
);
const DataBackupModal = React.lazy(() =>
  import('./components/DataBackupModal').then(m => ({ default: m.DataBackupModal }))
);
const OnboardingTour = React.lazy(() =>
  import('./components/OnboardingTour').then(m => ({ default: m.OnboardingTour }))
);

type NavTab = 'home' | 'characters' | 'my-cosplays' | 'community' | 'resources';

const MainAppContent: React.FC = () => {
  const {
    activeCharacterId,
    setActiveCharacterId,
    activeCharacterData,
    activeProjectId,
    setActiveProjectId,
    companionCharacterId,
    setCompanionCharacterId,
    getCharacterById,
    addCharacterToCosplay,
    isFavoritesDrawerOpen,
    setIsFavoritesDrawerOpen,
    savedProjects,
    addToast
  } = useCosplay();

  // Konami Code Easter Egg (Up Up Down Down Left Right Left Right B A)
  useKonamiCode(() => {
    addToast(
      '🌸 Secret Otaku Crafter Unlocked!',
      'You entered the legendary Konami Code! May your stitches hold and your props defy gravity!',
      'purple'
    );
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Dynamic Document Title Sync
  useEffect(() => {
    if (activeCharacterData) {
      document.title = `${activeCharacterData.name} | Cosplay Planner`;
    } else if (activeProjectId) {
      const proj = savedProjects.find(p => p.id === activeProjectId);
      document.title = proj ? `${proj.characterName} Plan | Cosplay Planner` : 'Cosplay Checklist | Cosplay Planner';
    } else {
      const titles: Record<NavTab, string> = {
        home: 'Cosplay Planner | Anime Discovery & Organizer',
        characters: 'Anime Characters | Cosplay Planner',
        'my-cosplays': 'My Cosplay Projects | Cosplay Planner',
        community: 'Community Showcases | Cosplay Planner',
        resources: 'Cosplay Crafting Guides | Cosplay Planner'
      };
      document.title = titles[currentTab] || 'Cosplay Planner';
    }
  }, [currentTab, activeProjectId, activeCharacterData, savedProjects]);

  // Auto-launch tour on first visit
  useEffect(() => {
    try {
      const completed = localStorage.getItem('cosplay_onboarding_completed_v2');
      if (!completed) {
        const timer = setTimeout(() => setIsOnboardingOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // Handle global keyboard shortcuts (Command+K or Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentTab('characters');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHeroSearchSubmit = (query: string) => {
    setSearchInitialQuery(query);
    setCurrentTab('characters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCharacter = (characterId: string) => {
    setActiveCharacterId(characterId);
  };

  const handleOpenChecklist = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentTab('my-cosplays');
  };

  // Prioritize full details if loaded, or fallback to registry/initial character
  const activeCharacter = activeCharacterId
    ? activeCharacterData || getCharacterById(activeCharacterId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-lavender-200 selection:text-dream-950">
      
      {/* Anime-style Speed-Lines Loading Screen (first visit only) */}
      <AnimeLoadingWipe />

      {/* Skip to Main Content Link for A11y / Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-dream-900 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-lavender-400 font-bold text-xs"
      >
        Skip to main content
      </a>

      {/* Offline Status & PWA Install Banner */}
      <OfflineBanner />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab !== 'my-cosplays') {
            setActiveProjectId(null);
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => {
          setCurrentTab('characters');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenTour={() => setIsOnboardingOpen(true)}
      />

      {/* Main Tab Content with smooth animated route transitions */}
      <main id="main-content" className="flex-1">
        <PageTransition pageKey={currentTab}>
          {currentTab === 'home' && (
            <div className="space-y-4">
              <HeroSection
                onSearchSubmit={handleHeroSearchSubmit}
                onSelectCharacter={handleSelectCharacter}
                onOpenQuiz={() => setIsQuizOpen(true)}
              />
              <CharacterDiscovery
                onSelectCharacter={handleSelectCharacter}
                onOpenChecklist={handleOpenChecklist}
                onBrowseAll={() => {
                  setCurrentTab('characters');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {currentTab === 'characters' && (
            <CharacterSearchPage
              key={searchInitialQuery}
              initialQuery={searchInitialQuery}
              onSelectCharacter={handleSelectCharacter}
            />
          )}

          {currentTab === 'my-cosplays' && (
            <div>
              {activeProjectId ? (
                <CosplayChecklistPage
                  projectId={activeProjectId}
                  onBack={() => setActiveProjectId(null)}
                  onOpenCompanion={charId => setCompanionCharacterId(charId)}
                  onViewCharacterProfile={charId => setActiveCharacterId(charId)}
                />
              ) : (
                <MyCosplaysPage
                  onOpenChecklist={projId => setActiveProjectId(projId)}
                  onOpenCompanion={charId => setCompanionCharacterId(charId)}
                  onBrowseCharacters={() => setCurrentTab('characters')}
                />
              )}
            </div>
          )}

          {currentTab === 'community' && <CommunityPage />}

          {currentTab === 'resources' && <ResourcesPage />}
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={tab => {
          if (tab !== 'my-cosplays') {
            setActiveProjectId(null);
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenTour={() => setIsOnboardingOpen(true)}
      />

      {/* Full-Screen Immersive Character Profile Modal */}
      <React.Suspense fallback={null}>
        {activeCharacter && (
          <ImmersiveCharacterProfile
            character={activeCharacter}
            onClose={() => setActiveCharacterId(null)}
            onOpenChecklist={projId => {
              setActiveCharacterId(null);
              setActiveProjectId(projId);
              setCurrentTab('my-cosplays');
            }}
            onOpenCompanion={charId => setCompanionCharacterId(charId)}
            onSearchAnime={animeTitle => {
              setActiveCharacterId(null);
              setSearchInitialQuery(animeTitle);
              setCurrentTab('characters');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </React.Suspense>

      {/* Interactive AI Character Mode / Voice Companion Modal */}
      <React.Suspense fallback={null}>
        {companionCharacterId && (
          <CharacterCompanionModal
            characterId={companionCharacterId}
            onClose={() => setCompanionCharacterId(null)}
            onOpenChecklist={projId => {
              setActiveProjectId(projId);
              setCurrentTab('my-cosplays');
            }}
          />
        )}
      </React.Suspense>

      {/* Cosplay Matchmaker Quiz Modal */}
      <React.Suspense fallback={null}>
        {isQuizOpen && (
          <CosplayMatchQuiz
            isOpen={isQuizOpen}
            onClose={() => setIsQuizOpen(false)}
            onSelectCharacter={charId => {
              setIsQuizOpen(false);
              setActiveCharacterId(charId);
            }}
            onAddToCosplay={charId => {
              const char = getCharacterById(charId);
              if (char) addCharacterToCosplay(char);
              else addCharacterToCosplay(charId);
            }}
          />
        )}
      </React.Suspense>

      {/* Floating Draggable AI Companion Pill */}
      <FloatingCompanionPill onOpenCompanion={charId => setCompanionCharacterId(charId)} />

      {/* Wishlist / Favorites Slide-Over Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesDrawerOpen}
        onClose={() => setIsFavoritesDrawerOpen(false)}
        onSelectCharacter={handleSelectCharacter}
        onBrowseCharacters={() => {
          setCurrentTab('characters');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Backup & Data Restore Modal */}
      <React.Suspense fallback={null}>
        {isBackupModalOpen && (
          <DataBackupModal
            isOpen={isBackupModalOpen}
            onClose={() => setIsBackupModalOpen(false)}
          />
        )}
      </React.Suspense>

      {/* 4-Step Interactive Onboarding Feature Tour */}
      <React.Suspense fallback={null}>
        {isOnboardingOpen && (
          <OnboardingTour
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
            onNavigateTab={tab => {
              setCurrentTab(tab as NavTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </React.Suspense>

      {/* Global Toast Notifications */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <CosplayProvider>
      <MainAppContent />
    </CosplayProvider>
  );
}
