import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Check, 
  MessageSquare, 
  BookOpen, 
  Scissors, 
  Palette, 
  ExternalLink,
  Layers,
  Activity,
  Tv,
  Mic2,
  Image as ImageIcon,
  Book,
  Tag,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Mic,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character, DIFFICULTY_COLORS } from '../types';
import { useCosplay } from '../context/CosplayContext';
import { sound } from '../utils/audio';
import { extractDominantColor } from '../utils/colorExtractor';
import { CharacterColorPalette } from './CharacterColorPalette';
import { LivingPortrait } from './LivingPortrait';
import { PaperDollTracker } from './PaperDollTracker';
import { HeightComparisonWidget } from './HeightComparisonWidget';
import { DifficultyRadarChart } from './DifficultyRadarChart';
import { VoiceSettingsPopover } from './VoiceSettingsPopover';
import { 
  getCharacterVoiceProfile, 
  getCharacterDialogues, 
  characterVoice, 
  CharacterDialogue 
} from '../services/characterVoiceService';

interface ImmersiveCharacterProfileProps {
  character: Character;
  onClose: () => void;
  onOpenChecklist: (projectId: string) => void;
  onOpenCompanion: (characterId: string) => void;
  onSearchAnime?: (animeTitle: string) => void;
}

const getLanguageBadge = (lang: string) => {
  const l = (lang || '').toLowerCase();
  if (l.includes('japanese')) return { label: 'Japanese', flag: '🇯🇵', color: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
  if (l.includes('english')) return { label: 'English', flag: '🇺🇸', color: 'bg-sky-500/10 text-sky-300 border-sky-500/30' };
  if (l.includes('spanish')) return { label: 'Spanish', flag: '🇪🇸', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
  if (l.includes('french')) return { label: 'French', flag: '🇫🇷', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' };
  if (l.includes('german')) return { label: 'German', flag: '🇩🇪', color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' };
  if (l.includes('italian')) return { label: 'Italian', flag: '🇮🇹', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
  if (l.includes('korean')) return { label: 'Korean', flag: '🇰🇷', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
  if (l.includes('portuguese') || l.includes('brazilian')) return { label: 'Portuguese', flag: '🇧🇷', color: 'bg-teal-500/10 text-teal-300 border-teal-500/30' };
  return { label: lang || 'Voice Cast', flag: '🎙️', color: 'bg-white/10 text-white/80 border-white/20' };
};

export const ImmersiveCharacterProfile: React.FC<ImmersiveCharacterProfileProps> = ({
  character,
  onClose,
  onOpenChecklist,
  onOpenCompanion,
  onSearchAnime
}) => {
  const [flyItem, setFlyItem] = useState<{ x: number; y: number } | null>(null);
  const [isFlying, setIsFlying] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [tabIndicatorStyle, setTabIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const { addCharacterToCosplay, getProjectForCharacter, currency } = useCosplay();
  const [activeTab, setActiveTab] = useState<'about' | 'animeography' | 'cosplay' | 'gallery'>('about');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string>(character.image);
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [themeColors, setThemeColors] = useState({
    accent: '#9B78D1',
    accentSoft: 'rgba(155, 120, 209, 0.15)',
    accentGlow: 'rgba(155, 120, 209, 0.35)'
  });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setTabIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab]);

  // Interactive Talking Mode State
  const [isTalking, setIsTalking] = useState(false);
  const [talkAmplitude, setTalkAmplitude] = useState(0);
  const [activeDialogue, setActiveDialogue] = useState<CharacterDialogue | null>(null);
  const [typedDialogue, setTypedDialogue] = useState('');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState(!sound.enabled);

  const dialogues = useMemo(() => getCharacterDialogues(character.name, character.series), [character.name, character.series]);
  const voiceProfile = useMemo(() => getCharacterVoiceProfile(character.name), [character.name]);

  // Clean speech synthesis on unmount or character change
  useEffect(() => {
    return () => {
      characterVoice.stop();
    };
  }, [character]);

  const handleStopSpeaking = () => {
    characterVoice.stop();
    setIsTalking(false);
    setTalkAmplitude(0);
    setActiveDialogue(null);
    setTypedDialogue('');
  };

  const handleSayHi = () => {
    if (isTalking) {
      handleStopSpeaking();
      return;
    }

    const nextIdx = dialogueIndex % dialogues.length;
    const dialogue = dialogues[nextIdx];
    setDialogueIndex(prev => prev + 1);
    setActiveDialogue(dialogue);
    setTypedDialogue('');
    setIsTalking(true);

    let charIdx = 0;
    const fullText = dialogue.text;
    const timer = setInterval(() => {
      charIdx++;
      setTypedDialogue(fullText.slice(0, charIdx));
      if (charIdx >= fullText.length) {
        clearInterval(timer);
      }
    }, 25);

    if (!isVoiceMuted && sound.enabled) {
      characterVoice.speak(fullText, voiceProfile, {
        characterName: character.name,
        onStart: () => setIsTalking(true),
        onAmplitude: (amp) => setTalkAmplitude(amp),
        onEnd: () => {
          setIsTalking(false);
          setTalkAmplitude(0);
          clearInterval(timer);
          setTypedDialogue(fullText);
        },
        onError: () => {
          setIsTalking(false);
          setTalkAmplitude(0);
          clearInterval(timer);
          setTypedDialogue(fullText);
        }
      });
    } else {
      setTimeout(() => {
        setIsTalking(false);
        setTalkAmplitude(0);
        clearInterval(timer);
        setTypedDialogue(fullText);
      }, Math.max(2500, fullText.length * 45));
    }
  };

  const handleSayJapanese = () => {
    if (isTalking) {
      handleStopSpeaking();
      return;
    }

    const jpDialogue = dialogues.find(d => d.japaneseText) || {
      id: 'jp-default',
      category: 'greeting' as const,
      text: `${character.name} です！よろしくね！`,
      japaneseText: `${character.japaneseName || character.name} です！よろしくね！`,
      romajiText: `${character.romanjiName || character.name} desu! Yoroshiku ne!`,
      mood: 'happy' as const,
      emote: '🎌'
    };

    setActiveDialogue(jpDialogue);
    setTypedDialogue(jpDialogue.japaneseText || jpDialogue.text);
    setIsTalking(true);

    const jpProfile = { ...voiceProfile, lang: 'ja-JP', pitch: voiceProfile.pitch * 1.05 };

    if (!isVoiceMuted && sound.enabled) {
      characterVoice.speak(jpDialogue.japaneseText || jpDialogue.text, jpProfile, {
        characterName: character.name,
        isJapanese: true,
        onStart: () => setIsTalking(true),
        onAmplitude: (amp) => setTalkAmplitude(amp),
        onEnd: () => {
          setIsTalking(false);
          setTalkAmplitude(0);
        },
        onError: () => {
          setIsTalking(false);
          setTalkAmplitude(0);
        }
      });
    } else {
      setTimeout(() => {
        setIsTalking(false);
        setTalkAmplitude(0);
      }, 3200);
    }
  };

  const existingProject = getProjectForCharacter(character.id || character.mal_id);

  const allGalleryImages = [
    character.image,
    ...(character.pictures || []).filter(p => p !== character.image)
  ];

  useEffect(() => {
    sound.playSwoop();
    setSelectedGalleryImg(character.image);
    setIsBannerLoaded(false);
    extractDominantColor(character.image, character.name).then(setThemeColors);

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [character]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex(prev => (prev !== null && prev < allGalleryImages.length - 1 ? prev + 1 : 0));
        }
        if (e.key === 'ArrowLeft') {
          setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : allGalleryImages.length - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allGalleryImages.length, onClose]);

  const handleCosplayAction = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (existingProject) {
      onOpenChecklist(existingProject.id);
      return;
    }

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      setFlyItem({ x: startX, y: startY });
      setIsFlying(false);

      requestAnimationFrame(() => {
        setIsFlying(true);
      });

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: {
            x: startX / window.innerWidth,
            y: startY / window.innerHeight,
          },
          colors: [themeColors.accent || '#A78BFA', '#A78BFA', '#F472B6', '#38BDF8', '#34D399', '#FBBF24'],
        });
      } catch (err) {
        // Fallback gracefully if canvas is blocked
      }
    }

    sound.playSuccess();
    const newProj = addCharacterToCosplay(character);

    // Auto-clear flyItem after animation
    setTimeout(() => {
      setFlyItem(null);
      setIsFlying(false);
    }, 850);
  };

  // Safe checks for available sections
  const hasAnimeAppearances = Boolean(character.animeAppearances && character.animeAppearances.length > 0);
  const hasVoiceActors = Boolean(character.voiceActors && character.voiceActors.length > 0);
  const hasMangaAppearances = Boolean(character.mangaAppearances && character.mangaAppearances.length > 0);
  const hasPictures = Boolean(character.pictures && character.pictures.length > 1);

  return (
    <div
      onScroll={e => setScrollY(e.currentTarget.scrollTop)}
      style={{
        '--accent': themeColors.accent,
        '--accent-soft': themeColors.accentSoft,
        '--accent-glow': themeColors.accentGlow,
      } as React.CSSProperties}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0E0C18]/95 text-white backdrop-blur-2xl animate-fadeIn transition-colors duration-500"
    >
      
      {/* 0. FLY-TO-TAB CELEBRATORY VISUAL FEEDBACK */}
      {flyItem && (
        <div
          className="fixed z-[9999] pointer-events-none flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-dream-500 via-lavender-500 to-blush-500 text-white shadow-2xl border border-white/50 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: isFlying ? (typeof window !== 'undefined' && window.innerWidth > 768 ? '80%' : '50%') : `${flyItem.x}px`,
            top: isFlying ? '30px' : `${flyItem.y}px`,
            transform: `translate(-50%, -50%) scale(${isFlying ? 0.35 : 1})`,
            opacity: isFlying ? 0 : 1,
            boxShadow: `0 0 30px ${themeColors.accent || '#A78BFA'}aa`
          }}
        >
          <img
            src={character.image}
            alt={character.name}
            className="w-8 h-8 rounded-xl object-cover border border-white/40 shadow-sm"
          />
          <span className="font-bold text-xs pr-1 tracking-wide">Saved to Cosplays! ✨</span>
        </div>
      )}

      {/* 1. CINEMATIC BLURRED BACKGROUND ARTWORK */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-20 transform transition-all duration-1000"
          style={{ backgroundImage: `url(${selectedGalleryImg || character.image})` }}
        />
        {/* Layered ethereal atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C18] via-[#0E0C18]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0C18] via-[#0E0C18]/70 to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lavender-500/20 rounded-full blur-[120px]" />
        {/* Manga Speed-Lines Overlay */}
        <div className="absolute inset-0 manga-speed-lines opacity-40 pointer-events-none" />
      </div>

      {/* Top Floating Bar */}
      <div className="sticky top-0 z-50 px-3 sm:px-8 py-3 sm:py-4 flex items-center justify-between bg-[#0E0C18]/85 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-lavender-300 max-w-[130px] sm:max-w-none truncate">
            {character.series}
          </span>
          {character.japaneseName && (
            <>
              <span className="hidden sm:inline-block text-white/30">•</span>
              <span className="hidden sm:inline-block text-xs text-white/70 font-jp tracking-wider truncate">
                {character.japaneseName}
              </span>
            </>
          )}
          {character.mal_id && (
            <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-white/60">
              MAL ID: #{character.mal_id}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Talk Button */}
          <button
            onClick={() => onOpenCompanion(String(character.id || character.mal_id))}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-dream-600 to-blush-500 hover:from-dream-500 hover:to-blush-400 text-white text-xs font-bold shadow-glow-lavender transition-all hover:scale-105 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Talk to {character.name.split(' ')[0]}</span>
            <span className="sm:hidden">Companion</span>
          </button>

          {/* Close Profile */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-all hover:rotate-90 active:scale-95"
            aria-label="Close character profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. HERO ANIME INTRODUCTION DISPLAY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[72vh]">
          
          {/* Left Column: Dominant Hero Typography */}
          <div className="lg:col-span-6 space-y-6 z-10">
            
            {/* Series Pill & Mal badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-lavender-200 backdrop-blur-md">
              <span className="text-lavender-300 font-bold">
                {character.series}
              </span>
              {character.url && (
                <a
                  href={character.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1"
                  title="View on MyAnimeList"
                >
                  <ExternalLink className="w-3 h-3 text-dream-400" />
                </a>
              )}
            </div>

            {/* Huge Stylized Character Name Display */}
            <div className="relative">
              {character.japaneseName && (
                <div
                  className="absolute -top-12 -left-6 font-jp text-[100px] sm:text-[160px] font-black text-white/[0.04] select-none pointer-events-none -z-10 leading-none tracking-tighter"
                  style={{ transform: `translateY(${Math.min(scrollY * 0.08, 30)}px)` }}
                >
                  {character.japaneseName}
                </div>
              )}
              <div className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-white">
                {character.name.toUpperCase().split(' ').map((part, i) => (
                  <span key={i} className="block">
                    {part}
                  </span>
                ))}
              </div>
              {character.japaneseName && (
                <div className="font-jp text-lg tracking-widest text-lavender-300/80 font-bold mt-2">
                  {character.japaneseName}
                </div>
              )}
              {character.nicknames && character.nicknames.length > 0 && (
                <div className="text-xs text-white/60 mt-1">
                  Also known as: <span className="text-white/80 font-medium">{character.nicknames.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Character Description / Bio snippet */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light max-w-xl line-clamp-4">
              {character.description}
            </p>

            {/* Interactive Hero Actions & Talking Mode */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Primary Action Button: "Add to My Cosplay" */}
                <button
                  onClick={(e) => handleCosplayAction(e)}
                  className={`flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    existingProject
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-dream-500 via-lavender-500 to-blush-500 text-white shadow-glow-lavender hover:opacity-95'
                  }`}
                >
                  {existingProject ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>In My Cosplays</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                      <span>Add to My Cosplay</span>
                    </>
                  )}
                </button>

                {/* Interactive "Say Hi" Button */}
                <button
                  onClick={handleSayHi}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
                    isTalking && activeDialogue?.category !== 'greeting'
                      ? 'bg-lavender-500/30 border-lavender-300 text-white shadow-glow-lavender'
                      : 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                  }`}
                  title="Hear the character speak an in-character line or cosplay advice"
                >
                  <Mic className="w-4 h-4 text-lavender-300" />
                  <span>{isTalking ? 'Pause Voice' : 'Say Hi 👋'}</span>
                </button>

                {/* "Say it in Japanese" Button */}
                <button
                  onClick={handleSayJapanese}
                  className="flex items-center gap-1.5 px-3.5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
                  title="Speak the character's Japanese greeting"
                >
                  <Globe className="w-4 h-4 text-pink-300" />
                  <span>日本語で話す 🎌</span>
                </button>

                {/* Mute / Volume Quick Toggle */}
                <button
                  onClick={() => {
                    setIsVoiceMuted(!isVoiceMuted);
                    if (isTalking) handleStopSpeaking();
                  }}
                  className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white/80 hover:text-white transition-all hover:scale-105"
                  title={isVoiceMuted ? 'Unmute character voice' : 'Mute character voice'}
                  aria-label={isVoiceMuted ? 'Unmute character voice' : 'Mute character voice'}
                >
                  {isVoiceMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-300" />
                  )}
                </button>

                {/* Multi-tier Voice Engine & Quota Status Popover */}
                <VoiceSettingsPopover characterName={character.name} />

                {/* Deep AI Chat Companion modal launcher */}
                <button
                  onClick={() => onOpenCompanion(String(character.id || character.mal_id))}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs transition-all"
                  title="Open companion mode for deep AI Q&A"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-dream-400" />
                  <span>AI Companion</span>
                </button>
              </div>

              {/* Dynamic In-Character Speech Bubble with Typing Animation */}
              {activeDialogue && (
                <div className="relative p-4 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-soft animate-scalePop space-y-1.5 max-w-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl animate-bounce">{activeDialogue.emote}</span>
                      <span className="text-xs font-bold text-white font-display">
                        {character.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/90 border"
                        style={{
                          backgroundColor: `${themeColors.accent}33`,
                          borderColor: `${themeColors.accent}66`
                        }}
                      >
                        {activeDialogue.category}
                      </span>
                      {isTalking && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono animate-pulse">
                          <span>Speaking</span>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleStopSpeaking}
                      className="text-white/50 hover:text-white text-xs p-1 rounded-lg hover:bg-white/10 transition-colors"
                      title="Dismiss dialogue"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Speech Text */}
                  <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed">
                    "{typedDialogue}"
                    {isTalking && <span className="inline-block w-1.5 h-4 ml-1 bg-lavender-400 animate-pulse align-middle" />}
                  </p>

                  {/* Japanese Romaji Subtitle if speaking Japanese */}
                  {activeDialogue.romajiText && (
                    <div className="pt-1 border-t border-white/10 text-xs text-lavender-300 font-jp">
                      <span className="text-white/50 text-[10px] font-mono mr-1.5">ROMAJI:</span>
                      {activeDialogue.romajiText}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-white/60">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                Difficulty: <span className="text-lavender-300 font-semibold">{character.difficulty}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                Checklist: <span className="text-white font-semibold">{character.cosplayItems.length} Items</span>
              </div>
              {character.popularity && (
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  Popularity: <span className="text-emerald-400 font-semibold">{character.popularity}%</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: LIVING PORTRAIT WITH POP-OUT PARALLAX */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <LivingPortrait
              character={character}
              accentColor={themeColors.accent}
              onOpenLightbox={() => setLightboxIndex(0)}
              isTalking={isTalking}
              talkAmplitude={talkAmplitude}
            />
          </div>

        </div>

      </div>

      {/* 3. DETAILED INFORMATION SECTIONS & TABS */}
      <div className="border-t border-white/10 bg-[#120F20]/90 backdrop-blur-xl relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Navigation Tabs Bar - Sticky with Animated Underline */}
          <div className="sticky top-[60px] z-30 bg-[#120F20]/95 backdrop-blur-xl py-2.5 mb-8 border-b border-white/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar relative">
              {/* Animated Background Pill */}
              <div
                className="absolute top-1 bottom-1 rounded-2xl bg-white/[0.08] transition-all duration-300 ease-out pointer-events-none -z-10"
                style={{
                  left: `${tabIndicatorStyle.left}px`,
                  width: `${tabIndicatorStyle.width}px`,
                  opacity: tabIndicatorStyle.width > 0 ? 1 : 0,
                }}
              />

              {/* Animated Sliding Underline */}
              <div
                className="absolute bottom-0 h-0.5 rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${tabIndicatorStyle.left + 12}px`,
                  width: `${Math.max(tabIndicatorStyle.width - 24, 0)}px`,
                  backgroundColor: themeColors.accent || '#9B78D1',
                  boxShadow: `0 0 10px ${themeColors.accent || '#9B78D1'}`,
                  opacity: tabIndicatorStyle.width > 0 ? 1 : 0,
                }}
              />

              {[
                { id: 'about', label: 'BIOGRAPHY & LORE', icon: BookOpen },
                { id: 'animeography', label: 'ANIME & VOICE ACTORS', icon: Tv },
                { id: 'cosplay', label: 'COSPLAY CRAFTING GUIDE', icon: Scissors },
                ...(hasPictures ? [{ id: 'gallery', label: 'PICTURE GALLERY', icon: ImageIcon }] : []),
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={el => { tabRefs.current[tab.id] = el; }}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id as any);
                    }}
                    className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? themeColors.accent || '#9B78D1' : undefined }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: BIOGRAPHY & LORE */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
              
              {/* Full Biography from API */}
              <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-lavender-400" />
                  <span>Character Biography</span>
                </h3>
                <div className="text-xs sm:text-sm text-white/80 leading-relaxed font-light whitespace-pre-line space-y-3">
                  {character.description}
                </div>
              </div>

              {/* Character Details & Nicknames */}
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blush-400" />
                  <span>Character Profile</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5">
                    <div className="text-white/50 text-[11px]">Primary Series</div>
                    <div className="text-white font-bold text-sm mt-0.5">{character.series}</div>
                  </div>

                  {character.japaneseName && (
                    <div className="p-3 rounded-2xl bg-white/5">
                      <div className="text-white/50 text-[11px]">Japanese Name</div>
                      <div className="text-white font-jp font-bold text-sm mt-0.5">{character.japaneseName}</div>
                    </div>
                  )}

                  {character.nicknames && character.nicknames.length > 0 && (
                    <div className="p-3 rounded-2xl bg-white/5">
                      <div className="text-white/50 text-[11px]">Nicknames / Aliases</div>
                      <div className="text-white font-medium mt-1 space-y-1">
                        {character.nicknames.map((nick, idx) => (
                          <div key={idx} className="text-xs text-lavender-300">• {nick}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-2xl bg-white/5">
                    <div className="text-white/50 text-[11px]">Crafting Difficulty</div>
                    <div className="text-lavender-300 font-bold mt-0.5">{character.difficulty}</div>
                  </div>
                </div>
              </div>

              {/* Height Comparison Widget */}
              <div className="md:col-span-3">
                <HeightComparisonWidget
                  description={character.description}
                  characterName={character.name}
                  accentColor={themeColors.accent}
                />
              </div>

              {/* Character Signature Color Palette Swatches */}
              <div className="md:col-span-3">
                <CharacterColorPalette
                  imageUrl={character.image}
                  characterName={character.name}
                />
              </div>

            </div>
          )}

          {/* TAB 2: ANIME & VOICE ACTORS */}
          {activeTab === 'animeography' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Anime Appearances */}
              {hasAnimeAppearances && (
                <div>
                  <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                    <Tv className="w-5 h-5 text-softblue-400" />
                    <span>Anime Appearances</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {character.animeAppearances!.map((appearance, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 hover:border-lavender-400/50 transition-colors"
                      >
                        {appearance.image && (
                          <img
                            src={appearance.image}
                            alt={appearance.title}
                            className="w-12 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => onSearchAnime && onSearchAnime(appearance.title)}
                            className="text-xs sm:text-sm font-bold text-white hover:text-lavender-300 transition-colors text-left line-clamp-2"
                            title={`Search characters from ${appearance.title}`}
                          >
                            {appearance.title}
                          </button>
                          {appearance.role && (
                            <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-white/10 text-lavender-300">
                              {appearance.role}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Actors (CVs) */}
              {hasVoiceActors && (
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                      <Mic2 className="w-5 h-5 text-rose-400" />
                      <span>Voice Actors (Cast)</span>
                    </h3>
                    <span className="text-xs text-white/50">
                      {character.voiceActors!.length} voices recorded
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {character.voiceActors!.map((va, idx) => {
                      const badge = getLanguageBadge(va.language);
                      return (
                        <div
                          key={idx}
                          className="group relative p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-lavender-400/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {va.image ? (
                              <img
                                src={va.image}
                                alt={va.name}
                                className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-white/15 shadow-md group-hover:scale-105 group-hover:border-lavender-400/50 transition-all duration-300"
                              />
                            ) : (
                              <div
                                className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-bold text-sm text-white/90 border border-white/10 shadow-sm"
                                style={{
                                  backgroundColor: `${themeColors.accent || '#A78BFA'}22`,
                                  borderColor: `${themeColors.accent || '#A78BFA'}44`,
                                }}
                              >
                                {va.name.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-lavender-300 transition-colors truncate" title={va.name}>
                                {va.name}
                              </div>
                              {va.japaneseName && (
                                <div className="text-[11px] font-jp text-white/40 truncate">
                                  {va.japaneseName}
                                </div>
                              )}
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}>
                                  <span>{badge.flag}</span>
                                  <span>{badge.label}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* External MAL / Voice Actor Roles Link */}
                          <a
                            href={`https://myanimelist.net/people.php?q=${encodeURIComponent(va.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all opacity-70 group-hover:opacity-100 hover:scale-110 shrink-0"
                            title={`Search ${va.name}'s roles on MyAnimeList`}
                            aria-label={`Search ${va.name}'s roles on MyAnimeList`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Manga Appearances */}
              {hasMangaAppearances && (
                <div className="pt-4">
                  <h3 className="text-base font-bold text-white font-display mb-3 flex items-center gap-2">
                    <Book className="w-4 h-4 text-amber-400" />
                    <span>Manga Appearances</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {character.mangaAppearances!.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80"
                      >
                        📖 {m.title} {m.role && `(${m.role})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: COSPLAY CRAFTING GUIDE */}
          {activeTab === 'cosplay' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Interactive Paper-Doll Outfit Tracker */}
              <PaperDollTracker
                items={existingProject ? existingProject.items : character.cosplayItems}
                accentColor={themeColors.accent}
              />

              {/* Crafting Difficulty Radar Chart */}
              <DifficultyRadarChart
                character={character}
                accentColor={themeColors.accent}
              />

              {/* Character Signature Color Palette Swatches */}
              <CharacterColorPalette
                imageUrl={character.image}
                characterName={character.name}
              />

              {/* Cosplay Guide Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Wig Styling */}
                {character.cosplayTips?.wigStyling && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-lavender-500/20 text-lavender-300 flex items-center justify-center">
                      <Scissors className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white font-display">Wig Styling Guide</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {character.cosplayTips.wigStyling}
                    </p>
                  </div>
                )}

                {/* Makeup & Eyes */}
                {character.cosplayTips?.makeupDetails && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blush-500/20 text-blush-300 flex items-center justify-center">
                      <Palette className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white font-display">Makeup & Lenses</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {character.cosplayTips.makeupDetails}
                    </p>
                  </div>
                )}

                {/* Fabrics & Prop */}
                {character.cosplayTips?.fabricRecommendations && (
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-softblue-500/20 text-softblue-300 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white font-display">Fabrics & Prop Tips</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {character.cosplayTips.fabricRecommendations}
                    </p>
                  </div>
                )}

              </div>

              {/* Required Items Preview */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-white font-display">
                      Required Cosplay Items ({character.cosplayItems.length} Pieces)
                    </h4>
                    <p className="text-xs text-white/60">
                      Adding to "My Cosplay" will automatically build this checklist for tracking.
                    </p>
                  </div>
                  <button
                    onClick={handleCosplayAction}
                    className="px-5 py-2.5 rounded-xl bg-dream-600 hover:bg-dream-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
                  >
                    {existingProject ? 'Open Active Plan' : 'Generate This Checklist'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {character.cosplayItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[11px] text-white/50">{item.category}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-lavender-300">
                        {currency === 'INR' ? `₹${item.estimatedPrice.toLocaleString('en-IN')}` : `$${Math.round(item.estimatedPrice / 80)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GALLERY PICTURES */}
          {activeTab === 'gallery' && hasPictures && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-lavender-400" />
                <span>MyAnimeList Character Gallery</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {character.pictures!.map((pic, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedGalleryImg(pic);
                      setLightboxIndex(idx);
                    }}
                    className={`aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all cursor-zoom-in ${
                      selectedGalleryImg === pic
                        ? 'border-lavender-400 shadow-glow-lavender scale-105'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    title="Click to view full photo"
                  >
                    <img
                      src={pic}
                      alt={`${character.name} picture ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 4. FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {lightboxIndex !== null && allGalleryImages[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn"
        >
          {/* Close Lightbox */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 hover:rotate-90"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Image */}
          {allGalleryImages.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : allGalleryImages.length - 1));
              }}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Image Viewport */}
          <div
            onClick={e => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center animate-scalePop"
          >
            <img
              src={allGalleryImages[lightboxIndex]}
              alt={`${character.name} artwork`}
              className="max-w-full max-h-[78vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <div className="mt-4 flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs text-white/80 font-mono">
              <span>{lightboxIndex + 1} of {allGalleryImages.length}</span>
              <span>•</span>
              <span className="font-bold font-sans">{character.name}</span>
            </div>
          </div>

          {/* Next Image */}
          {allGalleryImages.length > 1 && (
            <button
              onClick={e => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev !== null && prev < allGalleryImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

    </div>
  );
};
