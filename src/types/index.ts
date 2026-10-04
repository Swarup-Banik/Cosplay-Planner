export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
export type ItemCategory = 'Garment' | 'Wig' | 'Prop' | 'Makeup' | 'Footwear' | 'Accessories';
export type ItemStatus = 'Missing' | 'In Progress' | 'Acquired' | 'Completed';

export interface CharacterStat {
  strength: number; // 1-100
  speed: number;
  technique: number;
  defense: number;
  intelligence: number;
  energy: number;
  note?: string;
}

export interface CharacterAbility {
  id: string;
  name: string;
  japaneseName?: string;
  type: 'Offensive' | 'Defensive' | 'Utility' | 'Passive' | 'Special';
  description: string;
  details?: string;
  energyCost?: string;
}

export interface CharacterSpecialMove {
  id: string;
  name: string;
  type?: string;
  description: string;
  impact?: string;
}

export interface CosplayDefaultItem {
  id: string;
  name: string;
  category: ItemCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedPrice: number;
  notes: string;
  diyTips?: string;
}

export interface CharacterPersonality {
  traits: string[];
  speakingStyle: string;
  greeting: string;
  adviceTone: string;
  voicePitch?: number; // for Web Speech API
  voiceRate?: number;
}

export interface AnimeAppearance {
  mal_id?: number;
  title: string;
  role?: string;
  image?: string;
}

export interface MangaAppearance {
  mal_id?: number;
  title: string;
  role?: string;
}

export interface CharacterVoiceActor {
  name: string;
  language: string;
  image?: string;
  japaneseName?: string;
}

export interface Character {
  id: string; // Stable identifier (MAL ID as string)
  mal_id: number; // The official MyAnimeList character ID
  name: string;
  romanjiName?: string;
  japaneseName?: string;
  nicknames?: string[];
  series: string;
  seriesJapanese?: string;
  role?: string;
  difficulty: DifficultyLevel;
  gender?: 'Male' | 'Female' | 'Other';
  popularity?: number; // ranking / score / favorites
  tags: string[];
  description: string; // Biography or about section from Jikan
  about?: string; // Jikan/MAL about field alias
  quote?: string;
  image: string; // Official character image URL from API
  backgroundImage?: string;
  pictures?: string[]; // Gallery pictures from Jikan
  url?: string; // Official MyAnimeList URL
  accentColor?: string; // pastel hex
  animeAppearances?: AnimeAppearance[];
  mangaAppearances?: MangaAppearance[];
  voiceActors?: CharacterVoiceActor[];
  voiceActor?: {
    name: string;
    japaneseName?: string;
  };
  animeInfo?: {
    studio?: string;
    debutSeason?: string;
    episodes?: string;
    status?: string;
  };
  stats?: CharacterStat;
  abilities?: CharacterAbility[];
  specialMoves?: CharacterSpecialMove[];
  cosplayTips?: {
    wigStyling: string;
    makeupDetails: string;
    fabricRecommendations: string;
    propGuide?: string;
  };
  personality?: CharacterPersonality;
  cosplayItems: CosplayDefaultItem[];
}

export interface CosplayItem {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  estimatedPrice: number;
  actualPrice?: number;
  notes: string;
  referenceImage?: string;
  shoppingUrl?: string;
  isCustom?: boolean;
}

export interface CosplayProject {
  id: string;
  characterId: string;
  mal_id?: number;
  characterName: string;
  characterSeries: string;
  characterImage: string;
  characterDifficulty: DifficultyLevel;
  createdAt: string;
  targetDate?: string;
  targetEvent?: string;
  budgetTotal?: number;
  items: CosplayItem[];
  notes?: string;
}

export interface DialogueMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  text: string;
  timestamp: string;
  checklistAction?: {
    type: 'suggest_item' | 'status_reminder';
    data?: any;
  };
}

export const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  Master: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const STATUS_COLORS = {
  Missing: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    iconColor: 'text-rose-500'
  },
  'In Progress': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    iconColor: 'text-amber-500'
  },
  Acquired: {
    bg: 'bg-lavender-50',
    text: 'text-lavender-700',
    border: 'border-lavender-200',
    badge: 'bg-lavender-100 text-lavender-800',
    iconColor: 'text-lavender-500'
  },
  Completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    iconColor: 'text-emerald-500'
  }
};
