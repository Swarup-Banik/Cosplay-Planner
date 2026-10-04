import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  RotateCcw, 
  Scissors, 
  Clock, 
  Coins, 
  Tv, 
  Layers,
  Heart,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { Character, DifficultyLevel } from '../types';
import { ProgressRing } from './ProgressRing';
import { sound } from '../utils/audio';

interface CosplayMatchQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (characterId: string) => void;
  onAddToCosplay: (characterId: string) => void;
}

interface QuizAnswers {
  skillLevel?: DifficultyLevel;
  budget?: 'Budget' | 'Moderate' | 'Premium';
  timeframe?: 'Rush' | 'Medium' | 'Long';
  focus?: 'Wig' | 'Props' | 'Garments' | 'Balanced';
  genre?: 'DarkFantasy' | 'Shonen' | 'CozyFantasy' | 'All';
}

interface ScoredMatch {
  character: Character;
  matchPercent: number;
  matchReasons: string[];
}

const STORAGE_QUIZ_KEY = 'cosplay_quiz_last_result';

export const CosplayMatchQuiz: React.FC<CosplayMatchQuizProps> = ({
  isOpen,
  onClose,
  onSelectCharacter,
  onAddToCosplay
}) => {
  const { characters, trendingCharacters, triggerCelebration, addToast } = useCosplay();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [matches, setMatches] = useState<ScoredMatch[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Restore previous result from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_QUIZ_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.matches && parsed.matches.length > 0) {
          // Keep saved answers ready
          setAnswers(parsed.answers || {});
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Crafting Experience',
      question: 'What is your cosplay crafting experience level?',
      subtitle: 'Pick the complexity level you feel most comfortable taking on.',
      icon: Scissors,
      key: 'skillLevel' as const,
      options: [
        {
          value: 'Beginner' as DifficultyLevel,
          title: 'Beginner / First-Time',
          desc: 'Simple off-the-shelf garments, natural hair or easy styling, no heavy crafting.'
        },
        {
          value: 'Intermediate' as DifficultyLevel,
          title: 'Intermediate Maker',
          desc: 'Comfortable with wig cutting/heat styling, basic sewing, or minor prop assembling.'
        },
        {
          value: 'Advanced' as DifficultyLevel,
          title: 'Advanced Crafter',
          desc: 'Experienced with EVA foam armor, garment drafting, wig spiking, or detailed props.'
        },
        {
          value: 'Master' as DifficultyLevel,
          title: 'Master Artisan',
          desc: 'Intricate tailoring, multi-piece heavy armor, electronics/LEDs, or complex builds.'
        }
      ]
    },
    {
      title: 'Target Budget',
      question: 'What is your target budget for this project?',
      subtitle: 'We will recommend builds that respect your financial comfort zone.',
      icon: Coins,
      key: 'budget' as const,
      options: [
        {
          value: 'Budget' as const,
          title: 'Budget-Friendly (₹1,500 – ₹4,000 / ~$25 – $50)',
          desc: 'Thriftable staples, accessible wigs, smart DIY shortcuts.'
        },
        {
          value: 'Moderate' as const,
          title: 'Balanced Project (₹4,000 – ₹9,000 / ~$50 – $110)',
          desc: 'Quality heat-resistant wig, custom uniform or dress, signature props.'
        },
        {
          value: 'Premium' as const,
          title: 'All-Out Craft (₹9,000+ / ~$110+)',
          desc: 'High-density foam armor, layered silk/brocade, high-end styling & lenses.'
        }
      ]
    },
    {
      title: 'Available Time',
      question: 'How much time do you have before the convention?',
      subtitle: 'Ensures you have plenty of time for shipping and fabrication.',
      icon: Clock,
      key: 'timeframe' as const,
      options: [
        {
          value: 'Rush' as const,
          title: 'Under 3 Weeks (Rush Mode)',
          desc: 'Need fast turnaround, simple parts, and quick assembly.'
        },
        {
          value: 'Medium' as const,
          title: '1 to 3 Months (Standard)',
          desc: 'Healthy pacing to order materials, style wigs, and test fittings.'
        },
        {
          value: 'Long' as const,
          title: '3+ Months (Long-Term Dream Build)',
          desc: 'Time to learn new crafting techniques, 3D print, and perfect details.'
        }
      ]
    },
    {
      title: 'Craft Focus',
      question: 'What element excites you the most to wear or create?',
      subtitle: 'Select the visual centerpiece of your anime transformation.',
      icon: Layers,
      key: 'focus' as const,
      options: [
        {
          value: 'Wig' as const,
          title: 'Iconic Wig & Makeup Focus',
          desc: 'Signature hair silhouettes, vibrant hues, anime contact lenses.'
        },
        {
          value: 'Props' as const,
          title: 'Epic Weapons, Props or Armor',
          desc: 'Katana blades, sci-fi weapons, EVA foam shields or breastplates.'
        },
        {
          value: 'Garments' as const,
          title: 'Comfortable, Stylish Uniforms / Garments',
          desc: 'Iconic coats, academy uniforms, and dresses you can wear comfortably all day.'
        },
        {
          value: 'Balanced' as const,
          title: 'Complete Iconic Anime Vibe',
          desc: 'A well-rounded, instantly recognizable anime character look.'
        }
      ]
    },
    {
      title: 'Anime Universe Vibe',
      question: 'What genre or anime universe inspires you right now?',
      subtitle: 'We will match the personality and aesthetics of your favorite series.',
      icon: Tv,
      key: 'genre' as const,
      options: [
        {
          value: 'DarkFantasy' as const,
          title: 'Dark Fantasy & Supernatural',
          desc: 'Jujutsu Kaisen, Demon Slayer, Attack on Titan, Tokyo Ghoul.'
        },
        {
          value: 'Shonen' as const,
          title: 'Epic Shonen & High Energy Action',
          desc: 'One Piece, Hunter x Hunter, My Hero Academia, Naruto.'
        },
        {
          value: 'CozyFantasy' as const,
          title: 'Fantasy, Magic & Cozy Slice of Life',
          desc: 'Frieren: Beyond Journey\'s End, Spy x Family, Rom-Coms, Cosplay anime.'
        },
        {
          value: 'All' as const,
          title: 'Open to Any Iconic Character',
          desc: 'Surprise me with any crowd-favorite anime character!'
        }
      ]
    }
  ];

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  const handleSelectOption = (key: keyof QuizAnswers, value: any) => {
    sound.playClick();
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate matches on final step
      calculateResults(updated);
    }
  };

  const calculateResults = (finalAnswers: QuizAnswers) => {
    // Combine local & trending characters into a unique pool
    const poolMap = new Map<string, Character>();
    [...characters, ...trendingCharacters].forEach(c => {
      const id = String(c.id || c.mal_id);
      if (!poolMap.has(id)) {
        poolMap.set(id, c);
      }
    });

    const pool = Array.from(poolMap.values());

    const scored: ScoredMatch[] = pool.map(char => {
      let score = 50; // base score
      const reasons: string[] = [];

      // 1. Difficulty Match
      if (finalAnswers.skillLevel) {
        if (char.difficulty === finalAnswers.skillLevel) {
          score += 30;
          reasons.push(`Perfect match for ${char.difficulty} skill level`);
        } else {
          score += 15;
        }
      }

      // 2. Budget Match
      const totalBudget = char.cosplayItems?.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0) || 5000;
      if (finalAnswers.budget === 'Budget' && totalBudget <= 4500) {
        score += 25;
        reasons.push('Cost-effective build with accessible pieces');
      } else if (finalAnswers.budget === 'Moderate' && totalBudget >= 3000 && totalBudget <= 9500) {
        score += 25;
        reasons.push('Fits comfortably within your target budget');
      } else if (finalAnswers.budget === 'Premium') {
        score += 25;
        reasons.push('Allows full artisanal customization');
      }

      // 3. Timeframe Match
      if (finalAnswers.timeframe === 'Rush') {
        if (char.difficulty === 'Beginner' || char.cosplayItems.length <= 4) {
          score += 20;
          reasons.push('Quick to source for fast turnaround');
        }
      } else {
        score += 15;
      }

      // 4. Focus Match
      const nameLower = char.name.toLowerCase();
      const seriesLower = char.series.toLowerCase();

      if (finalAnswers.focus === 'Wig') {
        if (nameLower.includes('anya') || nameLower.includes('gojo') || nameLower.includes('nezuko') || nameLower.includes('marin')) {
          score += 25;
          reasons.push('Signature, high-impact wig silhouette');
        } else {
          score += 10;
        }
      } else if (finalAnswers.focus === 'Props') {
        if (nameLower.includes('zoro') || nameLower.includes('tanjiro') || nameLower.includes('yor') || nameLower.includes('eren')) {
          score += 25;
          reasons.push('Includes iconic weapons and crafting props');
        } else {
          score += 10;
        }
      } else if (finalAnswers.focus === 'Garments') {
        if (nameLower.includes('frieren') || nameLower.includes('luffy') || nameLower.includes('killua') || nameLower.includes('yor')) {
          score += 25;
          reasons.push('Stylish uniform/outfit with high convention comfort');
        } else {
          score += 10;
        }
      } else {
        score += 15;
      }

      // 5. Genre Match
      if (finalAnswers.genre === 'DarkFantasy') {
        if (seriesLower.includes('jujutsu') || seriesLower.includes('demon') || seriesLower.includes('titan')) {
          score += 25;
          reasons.push(`From your favorite ${char.series} dark fantasy universe`);
        }
      } else if (finalAnswers.genre === 'Shonen') {
        if (seriesLower.includes('piece') || seriesLower.includes('hunter') || seriesLower.includes('naruto')) {
          score += 25;
          reasons.push(`High-energy shonen icon from ${char.series}`);
        }
      } else if (finalAnswers.genre === 'CozyFantasy') {
        if (seriesLower.includes('spy') || seriesLower.includes('frieren') || seriesLower.includes('dress-up')) {
          score += 25;
          reasons.push(`Beloved fan-favorite from ${char.series}`);
        }
      } else {
        score += 15;
      }

      // Small jitter based on popularity so ties break organically
      const popularityBoost = (char.popularity || 0) % 5;
      score += popularityBoost;

      // Cap score to percentage between 84% and 98%
      const matchPercent = Math.min(99, Math.max(82, Math.round((score / 170) * 100)));

      // Default fallback reason if none matched directly
      if (reasons.length === 0) {
        reasons.push('Crowd favorite with strong cosplay community guides');
      }

      return {
        character: char,
        matchPercent,
        matchReasons: reasons.slice(0, 3)
      };
    });

    // Sort descending by match percent
    scored.sort((a, b) => b.matchPercent - a.matchPercent);
    const top3 = scored.slice(0, 3);

    setMatches(top3);
    setIsCompleted(true);
    triggerCelebration();

    // Persist result
    try {
      localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify({
        timestamp: new Date().toISOString(),
        answers: finalAnswers,
        matches: top3.map(m => ({ id: m.character.id || m.character.mal_id, percent: m.matchPercent }))
      }));
    } catch {}
  };

  const handleRetake = () => {
    sound.playClick();
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-b from-[#1C182B] to-[#120F20] text-white rounded-3xl border border-lavender-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        
        {/* Atmosphere Glowing Gradient */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-dream-500/20 via-blush-500/10 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/25 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-lavender-500 to-blush-500 text-white shadow-glow-lavender">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                Find My Cosplay Match
              </h3>
              <p className="text-[11px] text-white/60">
                AI Matchmaker • Powered by your crafting preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Close quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-8">
          
          {!isCompleted ? (
            /* STEP QUESTIONS */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Progress Bar & Step Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-lavender-300">
                  <span className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-lavender-500/20 text-lavender-300 font-mono text-[10px]">
                      STEP {currentStep + 1} OF {totalSteps}
                    </span>
                    <span>{currentStepData.title}</span>
                  </span>
                  <span className="font-mono text-white/60">
                    {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                  </span>
                </div>

                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-dream-500 via-lavender-400 to-blush-400 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Header */}
              <div className="space-y-1.5 pt-2">
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight leading-snug">
                  {currentStepData.question}
                </h2>
                <p className="text-xs sm:text-sm text-white/60 font-light">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Big Tappable Options Grid */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5 pt-2">
                {currentStepData.options.map((opt, idx) => {
                  const isSelected = answers[currentStepData.key] === opt.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentStepData.key, opt.value)}
                      className={`group w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-4 hover:-translate-y-0.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-dream-600/30 to-lavender-600/30 border-lavender-400 shadow-glow-lavender'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-lavender-400/40'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'border-lavender-400 bg-lavender-400 text-[#120F20]'
                            : 'border-white/30 group-hover:border-lavender-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-base font-bold text-white font-display group-hover:text-lavender-200 transition-colors">
                          {opt.title}
                        </div>
                        <div className="text-xs text-white/60 mt-1 leading-relaxed font-light">
                          {opt.desc}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>

              {/* Navigation Back */}
              {currentStep > 0 && (
                <div className="pt-2 flex justify-start">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(prev => prev - 1);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Question</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* RESULTS SCREEN */
            <div className="space-y-6 animate-fadeIn">
              
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-lavender-500/20 text-lavender-300 border border-lavender-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Matches Computed</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                  Your Top 3 Cosplay Matches
                </h2>
                <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto font-light">
                  Based on your skill level, budget, and universe preferences, these characters will make unforgettable projects!
                </p>
              </div>

              {/* Top 3 Match Cards */}
              <div className="space-y-4 pt-2">
                {matches.map((match, idx) => {
                  const char = match.character;
                  const charId = String(char.id || char.mal_id);
                  const isTopPick = idx === 0;

                  return (
                    <div
                      key={charId}
                      className={`relative p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
                        isTopPick
                          ? 'bg-gradient-to-r from-dream-900/50 via-lavender-900/30 to-black/50 border-lavender-400/80 shadow-glow-lavender'
                          : 'bg-white/5 border-white/10 hover:border-lavender-400/40'
                      }`}
                    >
                      {isTopPick && (
                        <div className="absolute -top-3 left-6 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-rose-400 text-black shadow-md">
                          <Flame className="w-3 h-3 fill-black" />
                          <span>#1 Best Match</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        
                        {/* Character Details */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-lavender-400/60 shadow-md">
                            <img
                              src={char.image}
                              alt={char.name}
                              className="w-full h-full object-cover object-[center_top]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-dream-400 uppercase tracking-wider truncate">
                              {char.series}
                            </div>
                            <h3 className="text-lg sm:text-xl font-display font-extrabold text-white truncate">
                              {char.name}
                            </h3>

                            {/* Match Reasons Chips */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {match.matchReasons.map((reason, rIdx) => (
                                <span
                                  key={rIdx}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-lavender-200"
                                >
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Match Percentage & Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
                          <div className="flex items-center gap-3">
                            <ProgressRing
                              progress={match.matchPercent}
                              size={58}
                              strokeWidth={5}
                              color="#AC7DE8"
                              bgColor="rgba(255,255,255,0.1)"
                            >
                              <div className="flex flex-col items-center">
                                <span className="font-display font-extrabold text-xs text-white">
                                  {match.matchPercent}%
                                </span>
                              </div>
                            </ProgressRing>

                            <div className="text-left sm:text-right">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-lavender-400">
                                Match Score
                              </div>
                              <div className="text-xs text-white/60">
                                {char.difficulty}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                sound.playClick();
                                onClose();
                                onSelectCharacter(charId);
                              }}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                            >
                              View Profile
                            </button>

                            <button
                              onClick={() => {
                                sound.playSuccess();
                                onAddToCosplay(charId);
                                addToast(`Added ${char.name}!`, 'Project checklist created', 'purple');
                              }}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-dream-600 to-blush-500 hover:opacity-90 text-white shadow-sm transition-all"
                            >
                              + Add Plan
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  onClick={handleRetake}
                  className="inline-flex items-center gap-1.5 text-lavender-300 hover:text-white font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Cosplay Match Quiz</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
