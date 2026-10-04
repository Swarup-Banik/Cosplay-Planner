import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, RotateCw, Award, Clock, DollarSign, Layers } from 'lucide-react';
import { Character } from '../types';
import { removeCharacterBackground } from '../services/backgroundRemoval';
import { isReducedMotionPreferred } from '../lib/motion';

interface LivingPortraitProps {
  character: Character;
  accentColor: string;
  onOpenLightbox?: () => void;
  isTalking?: boolean;
  talkAmplitude?: number;
}

export const LivingPortrait: React.FC<LivingPortraitProps> = ({
  character,
  accentColor,
  onOpenLightbox,
  isTalking = false,
  talkAmplitude = 0
}) => {
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [isProcessingCutout, setIsProcessingCutout] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = isReducedMotionPreferred();

  // Attempt background removal on mount/character change
  useEffect(() => {
    let isMounted = true;
    setIsProcessingCutout(true);
    setCutoutUrl(null);
    setIsImgLoaded(false);

    removeCharacterBackground(character.image)
      .then(url => {
        if (isMounted) {
          setCutoutUrl(url);
          setIsProcessingCutout(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsProcessingCutout(false);
      });

    return () => {
      isMounted = false;
    };
  }, [character.image]);

  // Mouse & Device Tilt Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isCardFlipped || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 2, y: y * 2 }); // -1 to 1
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Device orientation on mobile
  useEffect(() => {
    if (reducedMotion || isCardFlipped) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.max(-1, Math.min(1, e.gamma / 25));
        const y = Math.max(-1, Math.min(1, (e.beta - 35) / 25));
        setMousePos({ x, y });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [reducedMotion, isCardFlipped]);

  // Floating particles data (8 particles)
  const particles = [
    { id: 1, top: '15%', left: '10%', size: 6, delay: '0s', dur: '4s' },
    { id: 2, top: '25%', left: '85%', size: 8, delay: '1s', dur: '5s' },
    { id: 3, top: '65%', left: '8%', size: 5, delay: '0.5s', dur: '4.5s' },
    { id: 4, top: '75%', left: '88%', size: 7, delay: '1.8s', dur: '5.2s' },
    { id: 5, top: '40%', left: '92%', size: 6, delay: '2.3s', dur: '4.8s' },
    { id: 6, top: '85%', left: '20%', size: 5, delay: '1.2s', dur: '4.2s' },
    { id: 7, top: '10%', left: '75%', size: 7, delay: '2.7s', dur: '5.5s' },
    { id: 8, top: '50%', left: '5%', size: 6, delay: '3.1s', dur: '4.6s' }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[460px] aspect-[3/4.4] mx-auto flex items-center justify-center select-none perspective-[1400px]"
    >
      {/* ── LAYER 0: RADIANT GLOW & CELESTIAL RAYS (Farthest Back) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, -40px)`
        }}
      >
        {/* Soft Radial Ambient Aura */}
        <div
          className="w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full blur-[90px] opacity-45 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, rgba(144, 92, 217, 0.4) 45%, transparent 70%)`,
            transform: isTalking ? `scale(${1 + Math.max(talkAmplitude * 0.25, 0.12)})` : 'scale(1)'
          }}
        />

        {/* Concentric sound wave rings rippling outward when speaking */}
        {isTalking && !reducedMotion && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="absolute w-[280px] h-[280px] rounded-full border-2 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] opacity-65"
              style={{ borderColor: accentColor }}
            />
            <div
              className="absolute w-[360px] h-[360px] rounded-full border-2 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] opacity-45 [animation-delay:0.6s]"
              style={{ borderColor: accentColor }}
            />
            <div
              className="absolute w-[440px] h-[440px] rounded-full border-2 animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30 [animation-delay:1.2s]"
              style={{ borderColor: accentColor }}
            />
          </div>
        )}

        {/* Ambient Rotating Light Rays */}
        <div
          className="absolute w-[440px] h-[440px] rounded-full opacity-20 pointer-events-none animate-[spin_40s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${accentColor} 20deg, transparent 40deg, ${accentColor} 80deg, transparent 100deg, ${accentColor} 160deg, transparent 180deg, ${accentColor} 240deg, transparent 260deg, ${accentColor} 320deg, transparent 360deg)`
          }}
        />
      </div>

      {/* ── LAYER 1: GIANT FADED JAPANESE KANJI WATERMARK ── */}
      {character.japaneseName && !isCardFlipped && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden transition-transform duration-300 ease-out z-0"
          style={{
            transform: reducedMotion
              ? 'none'
              : `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, -20px)`
          }}
        >
          <div
            style={{ writingMode: 'vertical-rl' }}
            className="font-jp text-[130px] sm:text-[190px] font-black text-white/[0.045] tracking-widest select-none leading-none scale-105"
          >
            {character.japaneseName}
          </div>
        </div>
      )}

      {/* ── MAIN 3D FLIPPABLE CONTAINER ── */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: isCardFlipped
            ? 'rotateY(180deg)'
            : reducedMotion
            ? 'none'
            : `translate3d(${mousePos.x * 16}px, ${mousePos.y * 16}px, 0px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
          transition: 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        className="relative w-[86%] aspect-[3/4.2] rounded-[34px] transition-transform duration-500 ease-out z-10"
      >
        
        {/* ── FRONT FACE: THE LIVING PORTRAIT ── */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-[34px] overflow-hidden border-2 border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] bg-[#120F24]/85 backdrop-blur-xl group"
        >
          {/* Card Frame Corner Accent Highlights */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
            style={{ background: accentColor }}
          />

          {/* Ambient base image inside the frame */}
          <img
            src={character.image}
            alt={character.name}
            onLoad={() => setIsImgLoaded(true)}
            className={`w-full h-full object-cover object-[center_top] transition-all duration-700 ${
              isImgLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
            } ${cutoutUrl ? 'opacity-35 scale-105 filter grayscale-[30%]' : 'opacity-100'}`}
          />

          {/* Cinematic gradient overlay at bottom of the card frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C18]/95 via-[#0E0C18]/30 to-transparent pointer-events-none" />

          {/* Bottom Card Frame Info Strip */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 z-20 pointer-events-none">
            <div className="min-w-0 pr-2">
              <div className="text-[9px] uppercase font-mono text-white/50 tracking-wider">
                {character.series}
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-display truncate">
                {character.name}
              </div>
            </div>
            {character.difficulty && (
              <span
                className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md text-white"
                style={{
                  backgroundColor: `${accentColor}33`,
                  borderColor: `${accentColor}88`
                }}
              >
                {character.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* ── POP-OUT CUTOUT (Attached to front face) ── */}
        {!isCardFlipped && cutoutUrl && (
          <div
            onClick={onOpenLightbox}
            style={{
              transform: reducedMotion
                ? 'none'
                : `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20 - 16}px, 45px) scale(1.14)`,
              cursor: onOpenLightbox ? 'zoom-in' : 'default'
            }}
            className={`absolute inset-0 flex items-center justify-center pointer-events-auto z-20 transition-transform duration-200 ease-out will-change-transform ${
              !reducedMotion ? 'animate-[floatBreathe_4.5s_ease-in-out_infinite]' : ''
            }`}
            title="Click to view full photo"
          >
            <img
              src={cutoutUrl}
              alt={`${character.name} Cutout`}
              className="w-[96%] h-[106%] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter contrast-[1.03]"
            />
          </div>
        )}

        {/* ── BACK FACE: COLLECTIBLE TRADING CARD WITH HOLOGRAPHIC FOIL ── */}
        <div
          onClick={() => setIsCardFlipped(false)}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          className="absolute inset-0 rounded-[34px] overflow-hidden border-2 border-white/30 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] bg-[#151226] p-5 flex flex-col justify-between cursor-pointer group"
        >
          {/* Holographic Rainbow Specular Foil Sheen */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity z-10 mix-blend-color-dodge"
            style={{
              background: `linear-gradient(135deg, transparent 15%, rgba(255,255,255,0.4) 35%, rgba(172,125,232,0.4) 55%, rgba(244,114,182,0.3) 75%, transparent 100%)`
            }}
          />

          {/* Faded Background Kanji */}
          {character.japaneseName && (
            <div className="absolute right-3 top-10 font-jp text-7xl font-black text-white/[0.04] pointer-events-none select-none">
              {character.japaneseName}
            </div>
          )}

          {/* Card Top: Header & Rarity */}
          <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1">
                <span>LIMITED EDITION</span>
                <span>•</span>
                <span>MAL #{character.mal_id || 'COS'}</span>
              </div>
              <h4 className="font-display font-extrabold text-base text-white truncate max-w-[200px]">
                {character.name}
              </h4>
            </div>

            <div className="text-right">
              <div className="text-amber-300 text-xs tracking-widest font-black">★★★★★</div>
              <span className="text-[10px] font-mono text-white/60">{character.difficulty}</span>
            </div>
          </div>

          {/* Card Middle: 4 Key Crafting & Lore Stats */}
          <div className="relative z-20 grid grid-cols-2 gap-2.5 my-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                <Clock className="w-3 h-3 text-lavender-300" />
                <span>CRAFT TIME</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                ~{character.cosplayItems.length * 4} Hours
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                <DollarSign className="w-3 h-3 text-emerald-300" />
                <span>BUDGET TIER</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono mt-0.5">
                ₹{character.cosplayItems.reduce((acc, i) => acc + (i.estimatedPrice || 1200), 0).toLocaleString()}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                <Award className="w-3 h-3 text-amber-300" />
                <span>POPULARITY</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                {character.popularity || 88}% Global
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                <Layers className="w-3 h-3 text-blush-300" />
                <span>WARDROBE</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-0.5">
                {character.cosplayItems.length} Checklist Items
              </div>
            </div>
          </div>

          {/* Card Lore Summary */}
          <div className="relative z-20 p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-white/70 line-clamp-2 leading-relaxed">
            {character.description}
          </div>

          {/* Card Footer */}
          <div className="relative z-20 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-white/40 font-mono">
            <span>SERIES: {character.series.slice(0, 18)}</span>
            <span className="text-lavender-300 font-semibold group-hover:underline">
              Tap to Flip ↺
            </span>
          </div>
        </div>

      </div>

      {/* ── LAYER 4: FLOATING ANIME PARTICLES (Foremost) ── */}
      {!reducedMotion && !isCardFlipped && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 45}px, ${mousePos.y * 45}px, 50px)`
          }}
        >
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full animate-pulse shadow-sm"
              style={{
                top: p.top,
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.id % 2 === 0 ? accentColor : '#ffffff',
                boxShadow: `0 0 10px ${accentColor}`,
                opacity: 0.65,
                animationDuration: p.dur,
                animationDelay: p.delay
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Flip Trading Card Button (Top Left) */}
      <button
        onClick={() => setIsCardFlipped(!isCardFlipped)}
        className="absolute top-4 left-4 z-30 flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-md text-xs font-semibold"
        title="Flip between portrait and collectible trading card"
      >
        <RotateCw className="w-3.5 h-3.5 text-lavender-300" />
        <span>{isCardFlipped ? 'Living Portrait' : 'Trading Card'}</span>
      </button>

      {/* Lightbox / Zoom Trigger Icon (Top Right) */}
      {onOpenLightbox && !isCardFlipped && (
        <button
          onClick={onOpenLightbox}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/70 hover:text-white border border-white/15 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-md"
          title="View full-resolution artwork"
          aria-label="View full-resolution artwork"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Breathing Keyframe Style Definition */}
      <style>{`
        @keyframes floatBreathe {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};
