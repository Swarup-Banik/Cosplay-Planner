import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, Sparkles } from 'lucide-react';
import { ColorSwatch, extractColorPalette } from '../utils/colorExtractor';
import { useCosplay } from '../context/CosplayContext';
import { sound } from '../utils/audio';

interface CharacterColorPaletteProps {
  imageUrl: string;
  characterName: string;
}

export const CharacterColorPalette: React.FC<CharacterColorPaletteProps> = ({
  imageUrl,
  characterName
}) => {
  const { addToast } = useCosplay();
  const [swatches, setSwatches] = useState<ColorSwatch[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    extractColorPalette(imageUrl, characterName)
      .then(colors => {
        if (isCurrent) {
          setSwatches(colors);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [imageUrl, characterName]);

  const handleCopy = (hex: string, label: string) => {
    sound.playClick();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    }
    setCopiedHex(hex);
    addToast(`Copied ${hex}!`, `Matched for ${label}`, 'purple');
    setTimeout(() => {
      setCopiedHex(null);
    }, 2000);
  };

  if (isLoading && swatches.length === 0) {
    return (
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 animate-pulse">
        <div className="h-4 w-36 bg-white/20 rounded-md mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (swatches.length === 0) return null;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-lavender-500/20 text-lavender-300">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              Character Color Swatches ({swatches.length})
            </h4>
            <p className="text-[11px] text-white/60">
              Click any swatch to copy its exact hex code
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lavender-500/20 text-lavender-300 border border-lavender-500/30 hidden sm:inline-block">
          Cosplay Palette
        </span>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {swatches.map((swatch, idx) => {
          const isCopied = copiedHex === swatch.hex;
          return (
            <button
              key={`${swatch.hex}-${idx}`}
              onClick={() => handleCopy(swatch.hex, swatch.label)}
              className="group relative flex flex-col p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-lavender-400/50 transition-all text-left hover:-translate-y-1 shadow-xs"
              title={`Copy ${swatch.hex} (${swatch.label})`}
            >
              {/* Visual Color Block */}
              <div
                className="w-full h-12 rounded-xl mb-2 relative overflow-hidden shadow-inner border border-black/10 group-hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: swatch.hex }}
              >
                {/* Copied Overlay Badge */}
                {isCopied && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center gap-1 text-[11px] font-bold text-white animate-scalePop">
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    <span>Copied!</span>
                  </div>
                )}
              </div>

              {/* Hex Code & Copy Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white tracking-wide">
                  {swatch.hex.toUpperCase()}
                </span>
                <span className="text-white/40 group-hover:text-white transition-colors">
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  )}
                </span>
              </div>

              {/* Inferred Context Label */}
              <span className="text-[11px] text-lavender-300/90 font-medium truncate mt-0.5">
                {swatch.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cosplay Tip Line */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs text-lavender-200/80">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span>
          <strong className="text-white font-semibold">Pro tip:</strong> Match your wig fibers, contact lenses, and fabric dyes to these extracted shades for convention accuracy.
        </span>
      </div>
    </div>
  );
};
