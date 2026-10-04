import React, { useState } from 'react';
import { Check, Sparkles, AlertCircle, Shirt } from 'lucide-react';
import { CosplayItem, CosplayDefaultItem } from '../types';

export type AnyCosplayItem = CosplayItem | CosplayDefaultItem;

interface PaperDollTrackerProps {
  items: AnyCosplayItem[];
  accentColor: string;
  onToggleItem?: (itemId: string) => void;
}

type BodyZone = 'head' | 'torso' | 'hands' | 'legs' | 'feet' | 'accessories';

interface ZoneDefinition {
  id: BodyZone;
  name: string;
  keywords: string[];
  icon: string;
}

const ZONES: ZoneDefinition[] = [
  { id: 'head', name: 'Head & Wig', keywords: ['wig', 'hair', 'hat', 'headband', 'horns', 'ribbon', 'hairpin', 'mask', 'cap'], icon: '💇' },
  { id: 'torso', name: 'Torso & Outfit', keywords: ['jacket', 'shirt', 'dress', 'kimono', 'robe', 'top', 'blazer', 'vest', 'cape', 'coat', 'armor', 'corset'], icon: '🥋' },
  { id: 'hands', name: 'Hands & Props', keywords: ['gloves', 'sword', 'weapon', 'prop', 'wand', 'staff', 'dagger', 'gauntlet', 'fan', 'blade', 'katana'], icon: '⚔️' },
  { id: 'legs', name: 'Legs & Bottoms', keywords: ['pants', 'skirt', 'trousers', 'shorts', 'stockings', 'tights', 'hakama', 'belt'], icon: '👖' },
  { id: 'feet', name: 'Shoes & Footwear', keywords: ['boots', 'shoes', 'sandals', 'geta', 'socks', 'tabi', 'heels'], icon: '👢' },
  { id: 'accessories', name: 'Accessories & Details', keywords: ['earrings', 'necklace', 'choker', 'badge', 'ring', 'contacts', 'makeup', 'patch', 'brooch'], icon: '✨' }
];

export const PaperDollTracker: React.FC<PaperDollTrackerProps> = ({
  items,
  accentColor,
  onToggleItem
}) => {
  const [selectedZone, setSelectedZone] = useState<BodyZone>('head');

  // Categorize items into zones by keyword matching
  const mapItemToZone = (item: AnyCosplayItem): BodyZone => {
    const text = `${item.name} ${item.category} ${item.notes || ''}`.toLowerCase();
    for (const zone of ZONES) {
      if (zone.keywords.some(kw => text.includes(kw))) {
        return zone.id;
      }
    }
    return 'accessories'; // default fallback
  };

  const zoneItemsMap: Record<BodyZone, AnyCosplayItem[]> = {
    head: [],
    torso: [],
    hands: [],
    legs: [],
    feet: [],
    accessories: []
  };

  items.forEach(item => {
    const zone = mapItemToZone(item);
    zoneItemsMap[zone].push(item);
  });

  const getZoneStats = (zone: BodyZone) => {
    const zoneItems = zoneItemsMap[zone];
    if (zoneItems.length === 0) return { total: 0, completed: 0, percent: 100, isDone: true };
    const completed = zoneItems.filter(i => (i as any).status === 'Completed').length;
    const percent = Math.round((completed / zoneItems.length) * 100);
    return { total: zoneItems.length, completed, percent, isDone: completed === zoneItems.length };
  };

  const currentZoneItems = zoneItemsMap[selectedZone];
  const currentStats = getZoneStats(selectedZone);

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base shadow-sm"
            style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
          >
            👗
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Paper-Doll Outfit Tracker
            </h3>
            <p className="text-xs text-white/60">
              Interactive mannequin map. Tap zones to inspect craft progress.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/80">
          <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span>{items.filter(i => (i as any).status === 'Completed').length} / {items.length} Ready</span>
        </div>
      </div>

      {/* Grid: Interactive Mannequin Visual on Left, Zone Item Drawer on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Stylized Silhouette SVG Mannequin */}
        <div className="md:col-span-5 relative flex flex-col items-center justify-center py-4 bg-black/30 rounded-2xl border border-white/5 p-4">
          
          <svg
            viewBox="0 0 200 360"
            className="w-48 h-80 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none"
          >
            {/* Ambient Background Grid Ring */}
            <circle cx="100" cy="180" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

            {/* 1. Head Zone */}
            <g
              onClick={() => setSelectedZone('head')}
              className="cursor-pointer transition-all duration-300 group"
            >
              <ellipse
                cx="100"
                cy="48"
                rx="28"
                ry="34"
                fill={selectedZone === 'head' ? `${accentColor}55` : getZoneStats('head').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'head' ? accentColor : getZoneStats('head').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'head' ? '2.5' : '1.5'}
                className="transition-colors group-hover:stroke-white"
              />
              <text x="100" y="52" textAnchor="middle" fontSize="14" fill="#fff" className="pointer-events-none">
                💇
              </text>
            </g>

            {/* 2. Torso Zone */}
            <g
              onClick={() => setSelectedZone('torso')}
              className="cursor-pointer transition-all duration-300 group"
            >
              <path
                d="M 68 88 L 132 88 L 122 172 L 78 172 Z"
                fill={selectedZone === 'torso' ? `${accentColor}55` : getZoneStats('torso').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'torso' ? accentColor : getZoneStats('torso').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'torso' ? '2.5' : '1.5'}
                className="transition-colors group-hover:stroke-white"
              />
              <text x="100" y="134" textAnchor="middle" fontSize="15" fill="#fff" className="pointer-events-none">
                🥋
              </text>
            </g>

            {/* 3. Hands & Props Zone (Left & Right Arms) */}
            <g
              onClick={() => setSelectedZone('hands')}
              className="cursor-pointer transition-all duration-300 group"
            >
              {/* Left Arm */}
              <rect
                x="44"
                y="94"
                width="18"
                height="80"
                rx="9"
                transform="rotate(12 44 94)"
                fill={selectedZone === 'hands' ? `${accentColor}55` : getZoneStats('hands').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'hands' ? accentColor : getZoneStats('hands').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'hands' ? '2' : '1.5'}
                className="transition-colors group-hover:stroke-white"
              />
              {/* Right Arm */}
              <rect
                x="138"
                y="98"
                width="18"
                height="80"
                rx="9"
                transform="rotate(-12 138 98)"
                fill={selectedZone === 'hands' ? `${accentColor}55` : getZoneStats('hands').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'hands' ? accentColor : getZoneStats('hands').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'hands' ? '2' : '1.5'}
                className="transition-colors group-hover:stroke-white"
              />
              <circle cx="36" cy="188" r="10" fill={selectedZone === 'hands' ? accentColor : 'rgba(255,255,255,0.15)'} />
              <circle cx="164" cy="188" r="10" fill={selectedZone === 'hands' ? accentColor : 'rgba(255,255,255,0.15)'} />
              <text x="164" y="192" textAnchor="middle" fontSize="10" fill="#fff">⚔️</text>
            </g>

            {/* 4. Legs Zone */}
            <g
              onClick={() => setSelectedZone('legs')}
              className="cursor-pointer transition-all duration-300 group"
            >
              <rect
                x="76"
                y="178"
                width="20"
                height="100"
                rx="8"
                fill={selectedZone === 'legs' ? `${accentColor}55` : getZoneStats('legs').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'legs' ? accentColor : getZoneStats('legs').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'legs' ? '2.5' : '1.5'}
                className="transition-colors group-hover:stroke-white"
              />
              <rect
                x="104"
                y="178"
                width="20"
                height="100"
                rx="8"
                fill={selectedZone === 'legs' ? `${accentColor}55` : getZoneStats('legs').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'legs' ? accentColor : getZoneStats('legs').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'legs' ? '2.5' : '1.5'}
                className="transition-colors group-hover:stroke-white"
              />
              <text x="100" y="235" textAnchor="middle" fontSize="15" fill="#fff" className="pointer-events-none">
                👖
              </text>
            </g>

            {/* 5. Feet Zone */}
            <g
              onClick={() => setSelectedZone('feet')}
              className="cursor-pointer transition-all duration-300 group"
            >
              <ellipse
                cx="84"
                cy="295"
                rx="14"
                ry="10"
                fill={selectedZone === 'feet' ? `${accentColor}55` : getZoneStats('feet').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'feet' ? accentColor : getZoneStats('feet').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'feet' ? '2.5' : '1.5'}
              />
              <ellipse
                cx="116"
                cy="295"
                rx="14"
                ry="10"
                fill={selectedZone === 'feet' ? `${accentColor}55` : getZoneStats('feet').isDone ? `${accentColor}33` : 'rgba(255,255,255,0.08)'}
                stroke={selectedZone === 'feet' ? accentColor : getZoneStats('feet').isDone ? accentColor : 'rgba(255,255,255,0.25)'}
                strokeWidth={selectedZone === 'feet' ? '2.5' : '1.5'}
              />
              <text x="100" y="325" textAnchor="middle" fontSize="14" fill="#fff">
                👢
              </text>
            </g>
          </svg>

          {/* Quick Zone Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {ZONES.map(z => {
              const isSelected = selectedZone === z.id;
              const stats = getZoneStats(z.id);
              return (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-white text-dream-950 shadow-md font-bold scale-105'
                      : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <span>{z.icon}</span>
                  <span>{z.name.split(' ')[0]}</span>
                  {stats.isDone && <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Zone Checklist Details */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                Active Wardrobe Zone
              </span>
              <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <span>{ZONES.find(z => z.id === selectedZone)?.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-white/10 text-white/80">
                  {currentStats.completed} / {currentStats.total}
                </span>
              </h4>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold" style={{ color: accentColor }}>
                {currentStats.percent}% Ready
              </div>
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${currentStats.percent}%`, backgroundColor: accentColor }}
                />
              </div>
            </div>
          </div>

          {/* Items in this zone */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {currentZoneItems.length > 0 ? (
              currentZoneItems.map(item => {
                const isCompleted = 'status' in item && (item as any).status === 'Completed';
                return (
                  <div
                    key={item.id}
                    onClick={() => onToggleItem?.(item.id)}
                    className={`flex items-start justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/90'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-white/60">
                          {item.category}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-white/60 line-clamp-1">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2 pt-0.5">
                      {item.estimatedPrice && (
                        <span className="text-[10px] font-mono text-white/50">
                          ₹{item.estimatedPrice}
                        </span>
                      )}
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-white/30 text-transparent hover:border-white/60'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center rounded-2xl bg-white/5 border border-dashed border-white/10 text-white/50 text-xs">
                No specific items allocated for this zone yet. All wardrobe essentials are ready!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
