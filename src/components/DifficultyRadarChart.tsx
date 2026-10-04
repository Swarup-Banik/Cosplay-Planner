import React, { useMemo } from 'react';
import { Activity, ShieldAlert, Sparkles, Award } from 'lucide-react';
import { Character, DifficultyLevel } from '../types';

interface DifficultyRadarChartProps {
  character: Character;
  accentColor: string;
}

interface AxisScore {
  label: string;
  score: number; // 1 to 5
  description: string;
}

export const DifficultyRadarChart: React.FC<DifficultyRadarChartProps> = ({
  character,
  accentColor
}) => {
  // Derive 5-axis craft ratings from difficulty level + item keywords
  const axes = useMemo<AxisScore[]>(() => {
    const diff = character.difficulty;
    const baseScore = diff === 'Beginner' ? 2 : diff === 'Intermediate' ? 3 : diff === 'Advanced' ? 4 : 5;
    const itemsText = character.cosplayItems.map(i => `${i.name} ${i.notes || ''}`).join(' ').toLowerCase();

    // 1. Wig styling
    const hasComplexWig = /spiked|gravity|braid|ponytail|styled wig|curled|white hair/i.test(itemsText);
    const wigScore = hasComplexWig ? Math.min(5, baseScore + 1) : Math.max(1, baseScore - 1);

    // 2. Garments & tailoring
    const hasTailoring = /coat|jacket|kimono|corset|dress|pleated|lining|leather/i.test(itemsText);
    const garmentScore = hasTailoring ? baseScore : Math.max(1, baseScore - 1);

    // 3. Props & weaponry
    const hasProps = /sword|weapon|blade|katana|staff|wand|prop|armor|daggers/i.test(itemsText);
    const propScore = hasProps ? Math.min(5, baseScore + 1) : 1;

    // 4. Makeup & lenses
    const hasMakeup = /contacts|lashes|scar|tattoos|face paint|eyes|horns/i.test(itemsText);
    const makeupScore = hasMakeup ? Math.min(5, baseScore) : Math.max(1, baseScore - 1);

    // 5. Accessories & fine detail
    const hasDetail = /jewelry|earrings|necklace|patch|belt|buckle|gloves/i.test(itemsText);
    const detailScore = hasDetail ? baseScore : Math.max(1, baseScore - 1);

    return [
      { label: 'Wig & Styling', score: wigScore, description: wigScore >= 4 ? 'High heat shaping & Got2b required' : 'Standard trim & shake out' },
      { label: 'Garment Sewing', score: garmentScore, description: garmentScore >= 4 ? 'Advanced seams & patterning' : 'Basic hems or ready-to-wear base' },
      { label: 'Props & Weapons', score: propScore, description: propScore >= 4 ? 'EVA foam fabrication / 3D print' : 'Lightweight or handheld props' },
      { label: 'Makeup & SFX', score: makeupScore, description: makeupScore >= 4 ? 'Cosmetic contact lenses & face detail' : 'Natural anime beauty makeup' },
      { label: 'Detail & Hardware', score: detailScore, description: detailScore >= 4 ? 'Multiple trims, clasps & buckles' : 'Clean minimalistic accents' }
    ];
  }, [character]);

  const totalScore = Math.round(
    (axes.reduce((sum, a) => sum + a.score, 0) / (axes.length * 5)) * 100
  );

  // SVG Radar coordinates computation (radius 80, center at 110, 110)
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const numSides = axes.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numSides) * index - Math.PI / 2;
    const r = (value / 5) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate polygon points for data
  const dataPoints = axes.map((a, i) => getCoordinates(i, a.score));
  const polygonPointsStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Background grid circles
  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-soft space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
          >
            📊
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Cosplay Crafting Difficulty Radar
            </h3>
            <p className="text-xs text-white/60">
              Technical craftsmanship breakdown across 5 disciplines.
            </p>
          </div>
        </div>

        {/* Total Score Gauge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/10">
          <Award className="w-4 h-4 text-amber-300" />
          <div className="text-right">
            <span className="text-xs font-mono font-black text-white">{totalScore}/100</span>
            <span className="text-[10px] text-white/60 block -mt-1">{character.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: SVG Radar Chart on Left, Axis Breakdown on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Radar Graphic */}
        <div className="md:col-span-5 flex justify-center py-2 relative">
          <svg width={size} height={size} className="overflow-visible select-none">
            {/* Background concentric spiderweb polygons */}
            {gridLevels.map(level => {
              const pts = Array.from({ length: numSides }, (_, i) => getCoordinates(i, level))
                .map(p => `${p.x},${p.y}`)
                .join(' ');
              return (
                <polygon
                  key={level}
                  points={pts}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radial axis lines from center */}
            {axes.map((_, i) => {
              const outer = getCoordinates(i, 5);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Filled Animated Radar Shape */}
            <polygon
              points={polygonPointsStr}
              fill={`${accentColor}44`}
              stroke={accentColor}
              strokeWidth="2.5"
              className="transition-all duration-700 ease-out filter drop-shadow-[0_0_12px_rgba(155,120,209,0.5)]"
            />

            {/* Data point glowing vertices */}
            {dataPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#ffffff"
                stroke={accentColor}
                strokeWidth="2"
                className="transition-all duration-500"
              />
            ))}
          </svg>
        </div>

        {/* Axis Breakdown Scores */}
        <div className="md:col-span-7 space-y-3">
          {axes.map((axis, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-black/25 border border-white/5 space-y-1 transition-all hover:bg-black/40"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>{axis.label}</span>
                </span>
                <span className="font-mono font-bold" style={{ color: accentColor }}>
                  {axis.score} / 5
                </span>
              </div>

              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(axis.score / 5) * 100}%`, backgroundColor: accentColor }}
                />
              </div>

              <p className="text-[11px] text-white/50 leading-tight">
                {axis.description}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
