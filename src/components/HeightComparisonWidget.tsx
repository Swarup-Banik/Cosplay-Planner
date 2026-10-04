import React, { useState, useMemo } from 'react';
import { Ruler, Sparkles, Footprints, ArrowUpDown } from 'lucide-react';

interface HeightComparisonWidgetProps {
  description: string;
  characterName: string;
  accentColor: string;
}

export const HeightComparisonWidget: React.FC<HeightComparisonWidgetProps> = ({
  description,
  characterName,
  accentColor
}) => {
  // Extract Height from biography
  const characterHeight = useMemo<number | null>(() => {
    if (!description) return null;

    // Pattern 1: "Height: 170 cm" or "Height: 170cm" or "Height 175cm"
    const cmMatch = description.match(/(?:height|Height)\s*[:：\-]?\s*(\d{2,3}(?:\.\d+)?)\s*(?:cm|CM)?/i);
    if (cmMatch && cmMatch[1]) {
      const val = parseFloat(cmMatch[1]);
      if (val >= 100 && val <= 250) return Math.round(val);
    }

    // Pattern 2: "Height: 5'8"" or "5 ft 8 in"
    const ftMatch = description.match(/(?:height|Height)\s*[:：\-]?\s*(\d)['′]\s*(\d{1,2})["″]?/i);
    if (ftMatch && ftMatch[1] && ftMatch[2]) {
      const feet = parseInt(ftMatch[1], 10);
      const inches = parseInt(ftMatch[2], 10);
      const totalCm = Math.round(feet * 30.48 + inches * 2.54);
      if (totalCm >= 100 && totalCm <= 250) return totalCm;
    }

    // Pattern 3: direct "175 cm" or "182cm" preceded by height-related words
    const directMatch = description.match(/(\d{3})\s*(?:cm|CM)/);
    if (directMatch && directMatch[1]) {
      const val = parseInt(directMatch[1], 10);
      if (val >= 130 && val <= 220) return val;
    }

    return null;
  }, [description]);

  // Read saved user height from localStorage profile
  const [userHeight, setUserHeight] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cosplay_planner_measurements_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.height && Number(parsed.height) > 100) {
          return Math.round(Number(parsed.height));
        }
      }
    } catch {}
    return 168; // Default standard height in cm
  });

  const [isEditing, setIsEditing] = useState(false);

  // If no character height is found in lore, cleanly hide widget as mandated
  if (!characterHeight) {
    return null;
  }

  const diff = characterHeight - userHeight;
  const maxScale = Math.max(characterHeight, userHeight, 195);
  const charScalePercent = Math.round((characterHeight / maxScale) * 100);
  const userScalePercent = Math.round((userHeight / maxScale) * 100);

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-soft space-y-6">
      
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
          >
            📏
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Height Scale Comparison
            </h3>
            <p className="text-xs text-white/60">
              Official anime lore height vs. your cosplay measurements.
            </p>
          </div>
        </div>

        {/* User Height Editor */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-xl border border-white/20">
              <span className="text-xs text-white/60">You:</span>
              <input
                type="number"
                min="120"
                max="230"
                value={userHeight}
                onChange={e => setUserHeight(Number(e.target.value) || 168)}
                className="w-14 bg-transparent text-white font-mono text-xs font-bold text-center focus:outline-none"
              />
              <span className="text-[10px] text-white/50">cm</span>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[10px] bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded text-white font-bold"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white/80 transition-all font-mono"
            >
              <span>You: {userHeight} cm</span>
              <span className="text-[10px] text-lavender-300 underline ml-1">Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Silhouette Comparison Chart */}
      <div className="relative h-64 bg-black/30 rounded-2xl border border-white/5 flex items-end justify-center gap-12 sm:gap-20 p-6 overflow-hidden">
        
        {/* Horizontal Metric Guidelines */}
        <div className="absolute inset-x-4 top-8 border-b border-white/10 flex justify-between text-[10px] font-mono text-white/30">
          <span>{maxScale} cm</span>
          <span>Max Reference</span>
        </div>
        <div className="absolute inset-x-4 top-24 border-b border-white/10 flex justify-between text-[10px] font-mono text-white/30">
          <span>170 cm</span>
          <span>Average Con Height</span>
        </div>

        {/* Character Silhouette */}
        <div className="flex flex-col items-center gap-2 z-10 transition-all duration-700">
          <div
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            {characterHeight} cm
          </div>
          <svg
            viewBox="0 0 50 150"
            style={{ height: `${charScalePercent * 1.8}px` }}
            className="w-14 transition-all duration-700 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          >
            <circle cx="25" cy="18" r="14" fill={accentColor} />
            <path d="M 12 36 L 38 36 L 33 85 L 17 85 Z" fill={accentColor} />
            <rect x="16" y="86" width="7" height="60" rx="3" fill={accentColor} />
            <rect x="27" y="86" width="7" height="60" rx="3" fill={accentColor} />
          </svg>
          <span className="text-xs font-bold text-white truncate max-w-[100px]">
            {characterName.split(' ')[0]}
          </span>
        </div>

        {/* Difference Indicator */}
        <div className="flex flex-col items-center justify-center gap-1 z-10 pb-12">
          <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-center shadow-lg">
            <ArrowUpDown className="w-3.5 h-3.5 text-lavender-300 mx-auto mb-0.5" />
            <span className="text-xs font-mono font-bold text-white">
              {diff > 0 ? `+${diff} cm` : diff < 0 ? `${diff} cm` : 'Exact Match!'}
            </span>
          </div>
          <span className="text-[10px] text-white/50 font-mono">
            {diff > 0 ? 'Taller' : diff < 0 ? 'Shorter' : 'Identical'}
          </span>
        </div>

        {/* User Silhouette */}
        <div className="flex flex-col items-center gap-2 z-10 transition-all duration-700">
          <div className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-dream-950 bg-white shadow-md">
            {userHeight} cm
          </div>
          <svg
            viewBox="0 0 50 150"
            style={{ height: `${userScalePercent * 1.8}px` }}
            className="w-14 transition-all duration-700 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          >
            <circle cx="25" cy="18" r="14" fill="#ffffff" opacity="0.85" />
            <path d="M 12 36 L 38 36 L 33 85 L 17 85 Z" fill="#ffffff" opacity="0.85" />
            <rect x="16" y="86" width="7" height="60" rx="3" fill="#ffffff" opacity="0.85" />
            <rect x="27" y="86" width="7" height="60" rx="3" fill="#ffffff" opacity="0.85" />
          </svg>
          <span className="text-xs font-bold text-white/80">You</span>
        </div>

      </div>

      {/* Cosplay Tip Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80">
        <Footprints className="w-4 h-4 text-lavender-300 shrink-0" />
        <div>
          {diff > 4 ? (
            <span>
              💡 Cosplay Tip: Character is {diff} cm taller. Consider wearing a <strong>{Math.min(10, Math.round(diff / 2) * 2)} cm platform boot/heel insert</strong> for screen accuracy!
            </span>
          ) : diff < -4 ? (
            <span>
              💡 Cosplay Tip: You are {Math.abs(diff)} cm taller than the character. Use flat soled anime footwear or posed photography angles to accentuate their proportions!
            </span>
          ) : (
            <span>
              🎉 Perfect match! Your height naturally aligns with {characterName}'s official anime character proportions!
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
