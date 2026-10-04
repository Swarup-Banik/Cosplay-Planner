import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  X, 
  Check, 
  HelpCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MeasurementsProfile {
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  inseam?: number;
  head?: number;
  shoeSize?: string;
  notes?: string;
}

const MEASUREMENT_FIELDS = [
  {
    key: 'height',
    label: 'Total Height',
    tooltip: 'Stand straight without shoes from the top of your head to the floor.',
    placeholder: '170'
  },
  {
    key: 'chest',
    label: 'Chest / Bust',
    tooltip: 'Measure around the fullest part of your chest/bust under your armpits.',
    placeholder: '92'
  },
  {
    key: 'waist',
    label: 'Natural Waist',
    tooltip: 'Measure around the narrowest part of your waist, typically 1-2 inches above your navel.',
    placeholder: '74'
  },
  {
    key: 'hips',
    label: 'Full Hips',
    tooltip: 'Measure around the widest point of your hips and buttocks while standing with feet together.',
    placeholder: '98'
  },
  {
    key: 'shoulder',
    label: 'Shoulder Width',
    tooltip: 'Measure across the back from the tip of one shoulder bone across the spine to the other shoulder bone.',
    placeholder: '44'
  },
  {
    key: 'inseam',
    label: 'Inseam Leg Length',
    tooltip: 'Measure from your inner crotch down the inside of your leg to the ankle bone.',
    placeholder: '78'
  },
  {
    key: 'head',
    label: 'Head Circumference (for Wigs & Helmets)',
    tooltip: 'Wrap a soft tape around your forehead just above eyebrows and ears around the widest back point.',
    placeholder: '56'
  }
];

const STORAGE_KEY = 'cosplay_measurements_profile_v1';

export const MeasurementsModal: React.FC<MeasurementsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [measurements, setMeasurements] = useState<MeasurementsProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      height: 172,
      chest: 90,
      waist: 72,
      hips: 96,
      shoulder: 43,
      inseam: 79,
      head: 56,
      shoeSize: 'US 8.5 / EU 40',
      notes: 'Prefer slightly looser chest ease for heavy cosplay lining.'
    };
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    } catch (e) {
      console.error(e);
    }
    sound.playSuccess();
    onClose();
  };

  const handleValueChange = (key: keyof MeasurementsProfile, valueStr: string) => {
    const num = parseFloat(valueStr);
    if (isNaN(num)) {
      setMeasurements(prev => ({ ...prev, [key]: undefined }));
      return;
    }

    // Always store standardized in cm internally
    const inCm = unit === 'in' ? Math.round(num * 2.54 * 10) / 10 : num;
    setMeasurements(prev => ({ ...prev, [key]: inCm }));
  };

  const getDisplayValue = (key: keyof MeasurementsProfile): string => {
    const valInCm = measurements[key];
    if (valInCm === undefined || typeof valInCm !== 'number') return '';
    if (unit === 'in') {
      return (valInCm / 2.54).toFixed(1);
    }
    return String(valInCm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#151226]/95 backdrop-blur-2xl border border-lavender-200/90 dark:border-lavender-800/60 shadow-2xl p-6 sm:p-8 animate-scalePop">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-lavender-100 dark:border-lavender-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 border border-lavender-200 dark:border-lavender-800/40 flex items-center justify-center text-dream-700 dark:text-lavender-300">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-dream-950 dark:text-white">
                  My Measurements Profile
                </h3>
                <p className="text-xs text-dream-600 dark:text-lavender-400">
                  Universal sizing reference for sewing, wigs & tailoring
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-dream-400 hover:text-dream-700 dark:hover:text-white hover:bg-lavender-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="mt-4 flex items-center justify-between bg-lavender-50/70 dark:bg-gray-800/60 p-2 rounded-2xl border border-lavender-200/60 dark:border-lavender-800/40">
            <span className="text-xs font-semibold text-dream-700 dark:text-lavender-300 pl-2">
              Measurement Unit:
            </span>
            <div className="flex items-center bg-white dark:bg-gray-900 p-0.5 rounded-xl border border-lavender-200 dark:border-lavender-700">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unit === 'cm'
                    ? 'bg-dream-700 text-white shadow-xs'
                    : 'text-dream-600 dark:text-lavender-400'
                }`}
              >
                Centimeters (cm)
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unit === 'in'
                    ? 'bg-dream-700 text-white shadow-xs'
                    : 'text-dream-600 dark:text-lavender-400'
                }`}
              >
                Inches (in)
              </button>
            </div>
          </div>

          {/* Measurements Form Grid */}
          <div className="mt-5 space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
            {MEASUREMENT_FIELDS.map(f => (
              <div key={f.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-dream-800 dark:text-lavender-200">
                    <span>{f.label}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === f.key ? null : f.key)}
                      className="text-dream-400 hover:text-dream-700 dark:hover:text-white transition-colors"
                      title="Measuring tips"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-dream-400 font-mono">
                    {unit}
                  </span>
                </div>

                {/* Tooltip Explanation */}
                {activeTooltip === f.key && (
                  <div className="p-2.5 rounded-xl bg-dream-50 dark:bg-dream-950/40 border border-dream-200 dark:border-dream-800/40 text-[11px] text-dream-700 dark:text-lavender-300 flex items-start gap-2 animate-fadeIn">
                    <Info className="w-3.5 h-3.5 text-dream-500 shrink-0 mt-0.5" />
                    <span>{f.tooltip}</span>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={getDisplayValue(f.key as any)}
                    onChange={e => handleValueChange(f.key as any, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-lavender-400"
                  />
                  <span className="absolute right-3 inset-y-0 flex items-center pointer-events-none text-xs text-dream-400 font-medium">
                    {unit}
                  </span>
                </div>
              </div>
            ))}

            {/* Shoe Size */}
            <div className="space-y-1 pt-1">
              <label className="block text-xs font-bold text-dream-800 dark:text-lavender-200">
                Shoe Size / Footwear Reference
              </label>
              <input
                type="text"
                value={measurements.shoeSize || ''}
                onChange={e => setMeasurements(prev => ({ ...prev, shoeSize: e.target.value }))}
                placeholder="US 8.5 / EU 40 / 25.5 cm"
                className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white text-xs"
              />
            </div>

            {/* Tailoring Notes */}
            <div className="space-y-1 pt-1">
              <label className="block text-xs font-bold text-dream-800 dark:text-lavender-200">
                Fit Preferences & Tailoring Notes
              </label>
              <textarea
                rows={2}
                value={measurements.notes || ''}
                onChange={e => setMeasurements(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g. Broad shoulders, prefer loose chest ease for inner armor straps..."
                className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white text-xs resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-lavender-100 dark:border-lavender-900/60 flex items-center justify-between">
            <span className="text-[11px] text-dream-500 dark:text-lavender-400">
              Synced across all your cosplay projects
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-dream-600 dark:text-lavender-400 hover:bg-lavender-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-md shadow-dream-500/20 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
