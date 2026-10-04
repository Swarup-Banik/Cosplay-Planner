import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Character, CosplayItem, CosplayProject, ItemStatus } from '../types';
import { INITIAL_CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';
import { searchCharacters, getCharacterFull, getCharacterPictures, getTopCharacters, JikanPagination } from '../services/jikan';
import { adaptJikanCharacterToApp } from '../utils/characterAdapter';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'purple';
}

export interface SearchApiResponse {
  characters: Character[];
  pagination?: JikanPagination;
  source: 'jikan' | 'cached' | 'fallback';
  error?: string;
}

interface CosplayContextType {
  characters: Character[];
  trendingCharacters: Character[];
  isTrendingLoading: boolean;
  savedProjects: CosplayProject[];
  activeProjectId: string | null;
  activeCharacterId: string | null;
  activeCharacterData: Character | null;
  companionCharacterId: string | null;
  recentlyViewedIds: string[];
  currency: 'INR' | 'USD';
  soundEnabled: boolean;
  toasts: ToastMessage[];

  // Favorites & Wishlist
  favorites: Character[];
  isFavoritesDrawerOpen: boolean;
  setIsFavoritesDrawerOpen: (open: boolean) => void;
  toggleFavorite: (characterOrId: string | Character) => void;
  isFavorite: (characterId: string | number) => boolean;
  clearFavorites: () => void;

  // Navigation & Modals
  setActiveProjectId: (id: string | null) => void;
  setActiveCharacterId: (id: string | null) => void;
  setCompanionCharacterId: (id: string | null) => void;
  setCurrency: (c: 'INR' | 'USD') => void;
  toggleSound: () => void;

  // Real Jikan Search & Fetch
  searchApiCharacters: (query: string, page?: number) => Promise<SearchApiResponse>;
  loadCharacterDetails: (id: string | number) => Promise<Character | null>;

  // Project Actions
  addCharacterToCosplay: (characterOrId: string | Character) => CosplayProject;
  removeCosplayProject: (projectId: string) => void;
  updateItemStatus: (projectId: string, itemId: string, status: ItemStatus) => void;
  addCustomItem: (projectId: string, item: Omit<CosplayItem, 'id'>) => void;
  updateItem: (projectId: string, itemId: string, item: Partial<CosplayItem>) => void;
  deleteItem: (projectId: string, itemId: string) => void;
  updateProjectMeta: (projectId: string, data: Partial<CosplayProject>) => void;

  // Helpers
  getProjectForCharacter: (characterId: string | number) => CosplayProject | undefined;
  getCharacterById: (characterId: string | number) => Character | undefined;
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'purple') => void;
  dismissToast: (id: string) => void;
  triggerCelebration: () => void;
}

const CosplayContext = createContext<CosplayContextType | undefined>(undefined);

const STORAGE_PROJECTS_KEY = 'cosplay_planner_saved_projects_v2';
const STORAGE_RECENT_KEY = 'cosplay_planner_recent_characters_v2';
const STORAGE_FAVORITES_KEY = 'cosplay_favorites_v1';

export const CosplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global registry for dynamically fetched and adapted Jikan characters
  const [characterRegistry, setCharacterRegistry] = useState<Map<string, Character>>(() => {
    const reg = new Map<string, Character>();
    for (const char of INITIAL_CHARACTERS) {
      reg.set(String(char.id), char);
      if (char.mal_id) {
        reg.set(String(char.mal_id), char);
      }
    }
    return reg;
  });

  const [trendingCharacters, setTrendingCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  // Saved Projects from localStorage
  const [savedProjects, setSavedProjects] = useState<CosplayProject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading from localStorage', e);
    }

    // Default starter project (Gojo Satoru sample with official MAL image & details)
    const gojo = INITIAL_CHARACTERS.find(c => c.name.toLowerCase().includes('gojo')) || INITIAL_CHARACTERS[0];
    return [
      {
        id: 'project-gojo-sample',
        characterId: String(gojo.id),
        mal_id: gojo.mal_id || 164472,
        characterName: gojo.name,
        characterSeries: gojo.series,
        characterImage: gojo.image,
        characterDifficulty: gojo.difficulty,
        createdAt: new Date().toISOString(),
        targetEvent: 'Anime Con 2026',
        targetDate: '2026-11-20',
        budgetTotal: 8900,
        notes: 'Tailor mandarin collar jacket first, then got2b freeze spray for gravity-defying white spikes!',
        items: gojo.cosplayItems.map((item, idx) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          status: idx < 3 ? ('Completed' as ItemStatus) : idx === 3 ? ('In Progress' as ItemStatus) : ('Missing' as ItemStatus),
          estimatedPrice: item.estimatedPrice,
          actualPrice: idx < 3 ? item.estimatedPrice : undefined,
          notes: item.notes,
          shoppingUrl: 'https://amazon.com'
        }))
      }
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [activeCharacterData, setActiveCharacterData] = useState<Character | null>(null);
  const [companionCharacterId, setCompanionCharacterId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Wishlist & Favorites
  const [favorites, setFavorites] = useState<Character[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_FAVORITES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed reading favorites from localStorage', e);
    }
    return [];
  });
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed saving favorites to localStorage', e);
    }
  }, [favorites]);

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENT_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return ['164472', '170942', '184000', '138102'];
  });

  // Sync saved projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(savedProjects));
    } catch (e) {
      console.error('Failed saving projects to localStorage', e);
    }
  }, [savedProjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(recentlyViewedIds));
    } catch (e) {
      console.error('Failed saving recent to localStorage', e);
    }
  }, [recentlyViewedIds]);

  // Load trending characters from Jikan / Anime DB on startup
  useEffect(() => {
    let isMounted = true;
    async function loadTrending() {
      setIsTrendingLoading(true);
      try {
        const res = await getTopCharacters(1, 12);
        if (isMounted && res.data && res.data.length > 0) {
          const adapted = res.data.map(adaptJikanCharacterToApp);
          setTrendingCharacters(adapted);
          // Register in cache
          setCharacterRegistry(prev => {
            const next = new Map(prev);
            for (const char of adapted) {
              next.set(String(char.id), char);
              if (char.mal_id) next.set(String(char.mal_id), char);
            }
            return next;
          });
        }
      } catch (err) {
        console.warn('Could not load online trending characters, using initial roster', err);
      } finally {
        if (isMounted) setIsTrendingLoading(false);
      }
    }
    loadTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  // When activeCharacterId changes, fetch full details if needed
  useEffect(() => {
    if (!activeCharacterId) {
      setActiveCharacterData(null);
      return;
    }

    // Check registry first
    const existing = characterRegistry.get(String(activeCharacterId));
    if (existing && (existing.about || existing.description) && existing.animeAppearances && existing.animeAppearances.length > 0) {
      setActiveCharacterData(existing);
      return;
    }

    // Load full details from API
    loadCharacterDetails(activeCharacterId).then(loaded => {
      if (loaded) {
        setActiveCharacterData(loaded);
      } else if (existing) {
        setActiveCharacterData(existing);
      }
    });
  }, [activeCharacterId]);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'purple' = 'purple') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerCelebration = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.7 },
        colors: ['#AC7DE8', '#F472B6', '#56B0DC', '#FAF5EF', '#FFD166']
      });
    } catch {}
  };

  const getCharacterById = useCallback(
    (id: string | number): Character | undefined => {
      const strId = String(id);
      return (
        characterRegistry.get(strId) ||
        INITIAL_CHARACTERS.find(c => String(c.id) === strId || String(c.mal_id) === strId)
      );
    },
    [characterRegistry]
  );

  const getProjectForCharacter = useCallback(
    (characterId: string | number): CosplayProject | undefined => {
      const strId = String(characterId);
      const numId = Number(characterId);
      return savedProjects.find(
        p => p.characterId === strId || (numId && p.mal_id === numId)
      );
    },
    [savedProjects]
  );

  const isFavorite = useCallback(
    (charId: string | number): boolean => {
      const sId = String(charId);
      return favorites.some(f => String(f.id) === sId || String(f.mal_id) === sId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (characterOrId: string | Character) => {
      let targetChar: Character | undefined;
      let targetId: string;

      if (typeof characterOrId === 'object' && characterOrId !== null) {
        targetChar = characterOrId;
        targetId = String(characterOrId.id || characterOrId.mal_id);
      } else {
        targetId = String(characterOrId);
        targetChar = getCharacterById(targetId);
      }

      const alreadyFav = favorites.some(f => String(f.id) === targetId || String(f.mal_id) === targetId);

      if (alreadyFav) {
        setFavorites(prev => prev.filter(f => String(f.id) !== targetId && String(f.mal_id) !== targetId));
        sound.playClick();
        addToast(
          'Removed from Wishlist',
          targetChar ? `${targetChar.name} removed from your favorites.` : 'Character removed.',
          'info'
        );
      } else {
        if (!targetChar) return;
        setFavorites(prev => [targetChar!, ...prev]);
        sound.playClick();
        addToast('Added to Wishlist ♡', `${targetChar.name} saved to your favorites!`, 'purple');
      }
    },
    [favorites, getCharacterById, addToast]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    sound.playClick();
    addToast('Wishlist Cleared', 'All favorites have been removed.', 'info');
  }, [addToast]);

  /**
   * Performs real Jikan character search, maps to Character models,
   * caches them in registry, and returns structured result.
   */
  const searchApiCharacters = useCallback(
    async (query: string, page: number = 1): Promise<SearchApiResponse> => {
      try {
        const res = await searchCharacters(query, page, 15);
        const adaptedList = res.data.map(adaptJikanCharacterToApp);

        // Update registry
        setCharacterRegistry(prev => {
          const next = new Map(prev);
          for (const c of adaptedList) {
            next.set(String(c.id), c);
            if (c.mal_id) next.set(String(c.mal_id), c);
          }
          return next;
        });

        return {
          characters: adaptedList,
          pagination: res.pagination,
          source: res.source,
          error: res.error
        };
      } catch (err: any) {
        console.error('searchApiCharacters error', err);
        return {
          characters: [],
          source: 'fallback',
          error: 'Character search is temporarily unavailable. Please try again.'
        };
      }
    },
    []
  );

  /**
   * Fetches full Jikan character information (biography, animeography, voice actors, pictures)
   */
  const loadCharacterDetails = useCallback(
    async (id: string | number): Promise<Character | null> => {
      const numId = Number(id);
      if (!numId) return null;

      try {
        const [fullRes, pics] = await Promise.all([
          getCharacterFull(numId),
          getCharacterPictures(numId)
        ]);

        if (fullRes.data) {
          const adapted = adaptJikanCharacterToApp(fullRes.data);
          if (pics && pics.length > 0) {
            adapted.pictures = pics;
          }

          // Register in cache
          setCharacterRegistry(prev => {
            const next = new Map(prev);
            next.set(String(adapted.id), adapted);
            if (adapted.mal_id) next.set(String(adapted.mal_id), adapted);
            return next;
          });

          return adapted;
        }
      } catch (err) {
        console.warn('loadCharacterDetails error', err);
      }

      return getCharacterById(id) || null;
    },
    [getCharacterById]
  );

  // Add character to cosplay project
  const addCharacterToCosplay = useCallback(
    (characterOrId: string | Character): CosplayProject => {
      let character: Character | undefined;

      if (typeof characterOrId === 'string') {
        character = getCharacterById(characterOrId);
      } else {
        character = characterOrId;
      }

      if (!character) {
        throw new Error('Character not found');
      }

      // Check if project already exists
      const existing = getProjectForCharacter(character.id || character.mal_id);
      if (existing) {
        setActiveProjectId(existing.id);
        addToast('Opened existing plan', `${character.name} is already in your cosplays!`, 'info');
        sound.playClick();
        return existing;
      }

      // Ensure character is stored in registry
      setCharacterRegistry(prev => {
        const next = new Map(prev);
        next.set(String(character!.id), character!);
        if (character!.mal_id) next.set(String(character!.mal_id), character!);
        return next;
      });

      const newProject: CosplayProject = {
        id: `project-${character.mal_id || character.id}-${Date.now()}`,
        characterId: String(character.id || character.mal_id),
        mal_id: character.mal_id,
        characterName: character.name,
        characterSeries: character.series,
        characterImage: character.image,
        characterDifficulty: character.difficulty,
        createdAt: new Date().toISOString(),
        targetEvent: 'Upcoming Convention',
        notes: `Cosplay planning for ${character.name} from ${character.series}.`,
        budgetTotal: character.cosplayItems.reduce((acc, it) => acc + it.estimatedPrice, 0),
        items: character.cosplayItems.map((item, idx) => ({
          id: `item-${character!.mal_id || character!.id}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          name: item.name,
          category: item.category,
          status: 'Missing',
          estimatedPrice: item.estimatedPrice,
          notes: item.notes,
          isCustom: false
        }))
      };

      setSavedProjects(prev => [newProject, ...prev]);
      setActiveProjectId(newProject.id);
      sound.playSuccess();
      addToast(
        'Added to My Cosplay!',
        `Created project for ${character.name} with ${newProject.items.length} checklist items.`,
        'success'
      );
      return newProject;
    },
    [getCharacterById, getProjectForCharacter]
  );

  const removeCosplayProject = (projectId: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
    sound.playClick();
    addToast('Project removed', 'Cosplay plan was removed from your collection.', 'info');
  };

  const updateItemStatus = (projectId: string, itemId: string, status: ItemStatus) => {
    setSavedProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        const updatedItems = proj.items.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            status,
            actualPrice:
              status === 'Completed' || status === 'Acquired'
                ? item.actualPrice || item.estimatedPrice
                : item.actualPrice
          };
        });

        const allCompleted = updatedItems.every(i => i.status === 'Completed');
        if (allCompleted && status === 'Completed') {
          triggerCelebration();
          addToast('★ Cosplay 100% Complete!', `All items ready for ${proj.characterName}!`, 'success');
        } else if (status === 'Completed') {
          sound.playSuccess();
        } else {
          sound.playClick();
        }

        return { ...proj, items: updatedItems };
      })
    );
  };

  const addCustomItem = (projectId: string, itemData: Omit<CosplayItem, 'id'>) => {
    const newItem: CosplayItem = {
      ...itemData,
      id: `custom-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true
    };

    setSavedProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          items: [...proj.items, newItem]
        };
      })
    );

    sound.playClick();
    addToast('New item added', `${newItem.name} added to checklist!`, 'purple');
  };

  const updateItem = (projectId: string, itemId: string, itemData: Partial<CosplayItem>) => {
    setSavedProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          items: proj.items.map(it => (it.id === itemId ? { ...it, ...itemData } : it))
        };
      })
    );
    sound.playClick();
    addToast('Item updated', 'Changes saved successfully', 'info');
  };

  const deleteItem = (projectId: string, itemId: string) => {
    setSavedProjects(prev =>
      prev.map(proj => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          items: proj.items.filter(it => it.id !== itemId)
        };
      })
    );
    sound.playClick();
    addToast('Item removed', 'Checklist item removed.', 'info');
  };

  const updateProjectMeta = (projectId: string, data: Partial<CosplayProject>) => {
    setSavedProjects(prev =>
      prev.map(proj => (proj.id === projectId ? { ...proj, ...data } : proj))
    );
  };

  return (
    <CosplayContext.Provider
      value={{
        characters: Array.from(characterRegistry.values()),
        trendingCharacters,
        isTrendingLoading,
        savedProjects,
        activeProjectId,
        activeCharacterId,
        activeCharacterData,
        companionCharacterId,
        recentlyViewedIds,
        currency,
        soundEnabled,
        toasts,
        favorites,
        isFavoritesDrawerOpen,
        setIsFavoritesDrawerOpen,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        setActiveProjectId,
        setActiveCharacterId,
        setCompanionCharacterId,
        setCurrency,
        toggleSound,
        searchApiCharacters,
        loadCharacterDetails,
        addCharacterToCosplay,
        removeCosplayProject,
        updateItemStatus,
        addCustomItem,
        updateItem,
        deleteItem,
        updateProjectMeta,
        getProjectForCharacter,
        getCharacterById,
        addToast,
        dismissToast,
        triggerCelebration
      }}
    >
      {children}
    </CosplayContext.Provider>
  );
};

export const useCosplay = () => {
  const context = useContext(CosplayContext);
  if (!context) {
    throw new Error('useCosplay must be used within a CosplayProvider');
  }
  return context;
};
