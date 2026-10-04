import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { sound } from '../utils/audio';

interface FloatingCompanionPillProps {
  onOpenCompanion: (characterId: string) => void;
}

export const FloatingCompanionPill: React.FC<FloatingCompanionPillProps> = ({
  onOpenCompanion
}) => {
  const { savedProjects, characters, companionCharacterId } = useCosplay();

  // Pick companion: either from first saved project, or first character
  const defaultCompanion = savedProjects.length > 0
    ? {
        id: savedProjects[0].characterId,
        name: savedProjects[0].characterName.split(' ')[0],
        image: savedProjects[0].characterImage
      }
    : characters.length > 0
    ? {
        id: characters[0].id,
        name: characters[0].name.split(' ')[0],
        image: characters[0].image
      }
    : null;

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0
  });
  const hasMovedRef = useRef(false);

  // Default position: bottom right corner, responsive to window size
  useEffect(() => {
    if (typeof window !== 'undefined' && !position) {
      const defaultX = Math.max(16, window.innerWidth - 240);
      const defaultY = Math.max(16, window.innerHeight - 100);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [position]);

  if (!defaultCompanion || companionCharacterId) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position?.x || 0,
      posY: position?.y || 0
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMovedRef.current = true;
    }

    const newX = Math.min(window.innerWidth - 210, Math.max(16, dragStartRef.current.posX + dx));
    const newY = Math.min(window.innerHeight - 80, Math.max(16, dragStartRef.current.posY + dy));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // If user clicked without dragging, trigger open
    if (!hasMovedRef.current) {
      sound.playClick();
      onOpenCompanion(defaultCompanion.id);
    }
  };

  return (
    <div
      style={{
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        touchAction: 'none'
      }}
      className={`fixed z-40 select-none ${
        !isDragging ? 'animate-bob transition-[left,top] duration-75' : 'cursor-grabbing'
      }`}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="group relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/90 dark:bg-gray-900/90 border border-lavender-300/80 shadow-[0_8px_30px_rgba(155,120,209,0.25)] hover:shadow-[0_12px_36px_rgba(155,120,209,0.35)] backdrop-blur-xl cursor-grab transition-transform hover:scale-105 active:scale-95"
      >
        {/* Subtle breathing aura */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-dream-400/20 via-blush-400/20 to-lavender-400/20 animate-pulse pointer-events-none" />

        {/* Character Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-lavender-400 shadow-xs shrink-0">
          <img
            src={defaultCompanion.image}
            alt={defaultCompanion.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
        </div>

        {/* Text Label */}
        <div className="flex flex-col text-left pr-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-dream-600 leading-none">
            Companion
          </span>
          <span className="text-xs font-display font-extrabold text-dream-950 mt-0.5 leading-tight">
            Ask {defaultCompanion.name}
          </span>
        </div>

        <div className="p-1 rounded-full bg-lavender-100 text-dream-700 group-hover:rotate-12 transition-transform">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
