/**
 * Color extraction utility for dynamic character theming and cosplay color palettes.
 * Extracts dominant vibrant color and 5-6 harmonious character swatches from an image via canvas,
 * with resilient fallback to character-derived anime pastels if CORS blocks canvas.
 */

export interface ColorSwatch {
  hex: string;
  label: string; // e.g. "Hair / Wig", "Eyes / Contacts", "Outfit / Primary", "Accent / Trim", "Shadow Tone"
  confidence?: boolean; // True if inferred from known character or confident region analysis
}

const FALLBACK_PALETTE = [
  '#9B78D1', // Dream Lavender
  '#F472B6', // Blush Pink
  '#56B0DC', // Celestial Blue
  '#10B981', // Forest Green
  '#F59E0B', // Golden Amber
  '#8B5CF6', // Royal Violet
  '#EC4899', // Sakura Rose
  '#06B6D4', // Cyan Wave
];

// Curated signature palettes for popular cosplay characters
const SIGNATURE_PALETTES: Record<string, ColorSwatch[]> = {
  yor: [
    { hex: '#1C1917', label: 'Hair / Dress', confidence: true },
    { hex: '#E11D48', label: 'Headband / Accents', confidence: true },
    { hex: '#F43F5E', label: 'Ruby Eyes', confidence: true },
    { hex: '#D97706', label: 'Gold Stilettos / Trim', confidence: true },
    { hex: '#475569', label: 'Shadow Tone', confidence: true },
    { hex: '#FEE2E2', label: 'Porcelain Skin Tone', confidence: true },
  ],
  gojo: [
    { hex: '#F8FAFC', label: 'Snow White Wig', confidence: true },
    { hex: '#0EA5E9', label: 'Six Eyes Blue', confidence: true },
    { hex: '#1E1B4B', label: 'Blindfold / Uniform', confidence: true },
    { hex: '#818CF8', label: 'Cursed Energy Aura', confidence: true },
    { hex: '#0F172A', label: 'Deep Shadow', confidence: true },
    { hex: '#E0F2FE', label: 'Bright Highlight', confidence: true },
  ],
  anya: [
    { hex: '#F472B6', label: 'Pink Wig', confidence: true },
    { hex: '#10B981', label: 'Forest Green Eyes', confidence: true },
    { hex: '#18181B', label: 'Eden Academy Uniform', confidence: true },
    { hex: '#F59E0B', label: 'Gold Embellishments', confidence: true },
    { hex: '#FEF08A', label: 'Horn Accessories', confidence: true },
    { hex: '#FCE7F3', label: 'Soft Blush Accent', confidence: true },
  ],
  nezuko: [
    { hex: '#18181B', label: 'Black Wig Base', confidence: true },
    { hex: '#F97316', label: 'Flame Orange Wig Tips', confidence: true },
    { hex: '#F472B6', label: 'Pink Kimono Pattern', confidence: true },
    { hex: '#10B981', label: 'Bamboo Muzzle', confidence: true },
    { hex: '#991B1B', label: 'Chequered Obi / Eyes', confidence: true },
    { hex: '#FEE2E2', label: 'Skin Tone Highlight', confidence: true },
  ],
  tanjiro: [
    { hex: '#991B1B', label: 'Burgundy Hair / Eyes', confidence: true },
    { hex: '#059669', label: 'Checkered Haori Green', confidence: true },
    { hex: '#18181B', label: 'Demon Slayer Uniform', confidence: true },
    { hex: '#F59E0B', label: 'Hanafuda Earring Sun', confidence: true },
    { hex: '#0284C7', label: 'Water Breathing Blue', confidence: true },
    { hex: '#334155', label: 'Shadow Tone', confidence: true },
  ],
  zoro: [
    { hex: '#22C55E', label: 'Marimo Green Wig', confidence: true },
    { hex: '#065F46', label: 'Dark Green Coat', confidence: true },
    { hex: '#F59E0B', label: 'Haramaki / Gold Earrings', confidence: true },
    { hex: '#1E293B', label: 'Katana Sheath Black', confidence: true },
    { hex: '#DC2626', label: 'Crimson Sash', confidence: true },
    { hex: '#64748B', label: 'Steel Blade Grey', confidence: true },
  ],
  frieren: [
    { hex: '#E2E8F0', label: 'Silver White Wig', confidence: true },
    { hex: '#06B6D4', label: 'Turquoise Gem Eyes', confidence: true },
    { hex: '#F8FAFC', label: 'Mage Cloak White', confidence: true },
    { hex: '#B45309', label: 'Gold Cape Clasp', confidence: true },
    { hex: '#A855F7', label: 'Mana Arc Aura', confidence: true },
    { hex: '#64748B', label: 'Staff Shadow', confidence: true },
  ],
  marin: [
    { hex: '#FDE047', label: 'Blonde Wig Base', confidence: true },
    { hex: '#FB7185', label: 'Pink Wig Ombre / Eyes', confidence: true },
    { hex: '#1E293B', label: 'School Choker / Skirt', confidence: true },
    { hex: '#EC4899', label: 'Berry Pink Nails', confidence: true },
    { hex: '#93C5FD', label: 'Contact Lenses Blue', confidence: true },
    { hex: '#FFF1F2', label: 'Soft Highlight', confidence: true },
  ],
  eren: [
    { hex: '#451A03', label: 'Dark Brown Wig', confidence: true },
    { hex: '#15803D', label: 'Emerald Scout Eyes', confidence: true },
    { hex: '#78350F', label: 'Scout Jacket Leather', confidence: true },
    { hex: '#065F46', label: 'Wings of Freedom Green', confidence: true },
    { hex: '#1E293B', label: 'Undergarment Charcoal', confidence: true },
    { hex: '#F5F5F4', label: 'Pants Cream Tone', confidence: true },
  ],
  killua: [
    { hex: '#F8FAFC', label: 'Silver Spiky Wig', confidence: true },
    { hex: '#3B82F6', label: 'Sapphire Eyes', confidence: true },
    { hex: '#4338CA', label: 'Indigo Turtleneck', confidence: true },
    { hex: '#67E8F9', label: 'Godspeed Lightning Cyan', confidence: true },
    { hex: '#1E1B4B', label: 'Deep Shadow', confidence: true },
    { hex: '#F1F5F9', label: 'Pale Highlight', confidence: true },
  ],
  luffy: [
    { hex: '#18181B', label: 'Black Wig', confidence: true },
    { hex: '#DC2626', label: 'Crimson Pirate Vest', confidence: true },
    { hex: '#F59E0B', label: 'Straw Hat Yellow', confidence: true },
    { hex: '#2563EB', label: 'Denim Shorts Blue', confidence: true },
    { hex: '#78350F', label: 'Straw Hat Ribbon', confidence: true },
    { hex: '#475569', label: 'Shadow Tone', confidence: true },
  ]
};

export async function extractDominantColor(imageUrl: string, characterName: string): Promise<{
  accent: string;
  accentSoft: string;
  accentGlow: string;
}> {
  const nameLower = characterName.toLowerCase();
  let baseColor: string | null = null;

  if (nameLower.includes('gojo') || nameLower.includes('killua')) baseColor = '#38BDF8';
  else if (nameLower.includes('zoro') || nameLower.includes('deku')) baseColor = '#10B981';
  else if (nameLower.includes('yor') || nameLower.includes('anya')) baseColor = '#F472B6';
  else if (nameLower.includes('nezuko') || nameLower.includes('tanjiro')) baseColor = '#F43F5E';
  else if (nameLower.includes('luffy') || nameLower.includes('naruto')) baseColor = '#F59E0B';
  else if (nameLower.includes('frieren')) baseColor = '#818CF8';
  else if (nameLower.includes('marin')) baseColor = '#FB7185';
  else if (nameLower.includes('mikasa')) baseColor = '#DC2626';

  if (!baseColor) {
    try {
      baseColor = await sampleImageColor(imageUrl);
    } catch {
      let hash = 0;
      for (let i = 0; i < characterName.length; i++) {
        hash = characterName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % FALLBACK_PALETTE.length;
      baseColor = FALLBACK_PALETTE[index];
    }
  }

  return {
    accent: baseColor,
    accentSoft: `${baseColor}22`,
    accentGlow: `${baseColor}50`
  };
}

/**
 * Extracts 5-6 color swatches from character artwork, with contextual labels
 * (Hair, Eyes, Outfit, Accent, Shadow) when confident, otherwise Primary/Accent/Shadow.
 */
export async function extractColorPalette(
  imageUrl: string,
  characterName: string
): Promise<ColorSwatch[]> {
  const nameLower = characterName.toLowerCase();

  // Check known signature character matches
  for (const [key, palette] of Object.entries(SIGNATURE_PALETTES)) {
    if (nameLower.includes(key)) {
      return palette;
    }
  }

  // Attempt Canvas Multi-Region Sampling
  try {
    const swatches = await sampleMultiColorPalette(imageUrl);
    if (swatches && swatches.length >= 5) {
      return swatches;
    }
  } catch {
    // Canvas failed or CORS blocked
  }

  // Resilient algorithmic fallback palette derived from character name
  return generateDeterministicPalette(characterName);
}

function sampleImageColor(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    const timeout = setTimeout(() => reject('timeout'), 1200);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('no canvas context');

        ctx.drawImage(img, 0, 0, 32, 32);
        const data = ctx.getImageData(0, 0, 32, 32).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness > 35 && brightness < 235) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }

        if (count === 0) return reject('no valid pixels');
        const hex = rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count));
        resolve(hex);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject('image load failed');
    };
  });
}

function sampleMultiColorPalette(url: string): Promise<ColorSwatch[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;

    const timeout = setTimeout(() => reject('timeout'), 1500);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('no context');

        ctx.drawImage(img, 0, 0, 48, 48);

        // Sample head / upper 35% for hair & eyes
        const topData = ctx.getImageData(0, 0, 48, 17).data;
        // Sample body / lower 65% for outfit & accents
        const bodyData = ctx.getImageData(0, 17, 48, 31).data;

        const topColors = extractDominantFromData(topData, 2);
        const bodyColors = extractDominantFromData(bodyData, 3);
        const shadowColor = extractShadowFromData(bodyData);

        const swatches: ColorSwatch[] = [];

        // Check if top colors are distinct from body colors
        const isDistinctTop = topColors.length > 0 && bodyColors.length > 0 &&
          colorDistance(topColors[0], bodyColors[0]) > 45;

        if (topColors[0]) {
          swatches.push({
            hex: topColors[0],
            label: isDistinctTop ? 'Hair / Wig' : 'Primary',
            confidence: isDistinctTop
          });
        }

        if (topColors[1]) {
          swatches.push({
            hex: topColors[1],
            label: isDistinctTop ? 'Eyes / Details' : 'Secondary',
            confidence: isDistinctTop
          });
        }

        if (bodyColors[0]) {
          swatches.push({
            hex: bodyColors[0],
            label: isDistinctTop ? 'Outfit / Primary' : 'Accent',
            confidence: isDistinctTop
          });
        }

        if (bodyColors[1]) {
          swatches.push({
            hex: bodyColors[1],
            label: isDistinctTop ? 'Accent / Trim' : 'Highlight',
            confidence: isDistinctTop
          });
        }

        if (bodyColors[2]) {
          swatches.push({
            hex: bodyColors[2],
            label: 'Trim / Embellishment',
            confidence: false
          });
        }

        if (shadowColor) {
          swatches.push({
            hex: shadowColor,
            label: 'Shadow / Deep Tone',
            confidence: true
          });
        }

        if (swatches.length >= 5) {
          resolve(swatches.slice(0, 6));
        } else {
          reject('insufficient swatches');
        }
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject('image failed');
    };
  });
}

function extractDominantFromData(data: Uint8ClampedArray, count: number): string[] {
  const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;

    // Filter out pure white or near black backgrounds
    if (brightness < 30 || brightness > 240) continue;

    // Quantize to 32 steps per channel
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;

    if (!buckets[key]) {
      buckets[key] = { r: 0, g: 0, b: 0, count: 0 };
    }
    buckets[key].r += r;
    buckets[key].g += g;
    buckets[key].b += b;
    buckets[key].count++;
  }

  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
  return sorted.slice(0, count).map(b =>
    rgbToHex(Math.round(b.r / b.count), Math.round(b.g / b.count), Math.round(b.b / b.count))
  );
}

function extractShadowFromData(data: Uint8ClampedArray): string | null {
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 16) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness >= 15 && brightness <= 70) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  if (count === 0) return '#1E293B';
  return rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count));
}

function colorDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return 0;
  return Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function generateDeterministicPalette(name: string): ColorSwatch[] {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const baseHue = Math.abs(hash) % 360;
  const h1 = baseHue;
  const h2 = (baseHue + 40) % 360;
  const h3 = (baseHue + 180) % 360;
  const h4 = (baseHue + 210) % 360;

  return [
    { hex: hslToHex(h1, 65, 45), label: 'Primary', confidence: false },
    { hex: hslToHex(h2, 75, 55), label: 'Accent', confidence: false },
    { hex: hslToHex(h3, 60, 50), label: 'Secondary', confidence: false },
    { hex: hslToHex(h4, 80, 60), label: 'Trim', confidence: false },
    { hex: hslToHex(h1, 20, 20), label: 'Shadow', confidence: false },
    { hex: hslToHex(h2, 30, 92), label: 'Highlight', confidence: false },
  ];
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
