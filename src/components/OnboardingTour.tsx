import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  ArrowRight, 
  X,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Discover Millions of Characters',
    desc: 'Search any character from MyAnimeList via real-time Jikan integration. Official artwork, Japanese names, voice actors, and anime lore.',
    icon: Search,
    color: 'from-lavender-500 to-dream-600',
    highlight: 'Search Bar & Discovery'
  },
  {
    step: 2,
    title: 'Auto-Generate Cosplay Checklists',
    desc: 'Click "Add to My Cosplay" on any character to instantly generate tailored craft requirements: wigs, garments, props, contacts, and shoes.',
    icon: CheckCircle2,
    color: 'from-dream-600 to-blush-500',
    highlight: 'Checklist & Kanban'
  },
  {
    step: 3,
    title: 'Interactive AI Character Companions',
    desc: 'Chat directly with characters using speech synthesis voice lines, craft guidance, and encouraging anime quotes.',
    icon: MessageSquare,
    color: 'from-blush-500 to-purple-600',
    highlight: 'Draggable Companion Pill'
  },
  {
    step: 4,
    title: 'Timelines, Moodboards & Measurements',
    desc: 'Plan backward from your convention date, store high-res visual references in offline IndexedDB, and track measurements in cm/in.',
    icon: Calendar,
    color: 'from-purple-600 to-dream-700',
    highlight: 'Smart Planning Tools'
  }
];

const ONBOARDING_STORAGE_KEY = 'cosplay_onboarding_completed_v2';

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNext = () => {
    sound.playClick();
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    sound.playSuccess();
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {}
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleComplete();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStepIndex];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={handleComplete}
      />

      {/* Floating Tour Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/95 dark:bg-[#151226]/95 backdrop-blur-2xl border border-lavender-200/90 dark:border-lavender-800/60 shadow-2xl p-6 sm:p-8 space-y-5 animate-scalePop">
        
        {/* Step Progress Topbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <div
                key={s.step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'w-8 bg-dream-600 dark:bg-lavender-400'
                    : idx < currentStepIndex
                    ? 'w-3 bg-emerald-500'
                    : 'w-3 bg-lavender-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-dream-400 hover:text-dream-700 dark:hover:text-white transition-colors"
          >
            Skip Tour
          </button>
        </div>

        {/* Step Illustration & Icon */}
        <div className="flex items-center gap-4 pt-2">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-md shadow-dream-500/20 shrink-0`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-dream-500 dark:text-lavender-400">
              Step {step.step} of {TOUR_STEPS.length} • {step.highlight}
            </span>
            <h3 className="font-display font-extrabold text-xl text-dream-950 dark:text-white leading-tight">
              {step.title}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-dream-700 dark:text-lavender-300 leading-relaxed font-light">
          {step.desc}
        </p>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-lavender-100 dark:border-lavender-900/60 flex items-center justify-between">
          {currentStepIndex > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-dream-600 dark:text-lavender-400 hover:bg-lavender-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-md shadow-dream-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? "Let's Get Started!" : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
