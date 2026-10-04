export interface CraftingResource {
  id: string;
  category: 'Materials' | 'Wig Styling' | 'Makeup & Lenses' | 'Sewing & Fabrics' | 'Con Survival';
  title: string;
  description: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  content: {
    overview: string;
    keyPoints: string[];
    proTips: string[];
    recommendedTools: string[];
  };
}

export const CRAFTING_RESOURCES: CraftingResource[] = [
  {
    id: 'eva-foam-mastery',
    category: 'Materials',
    title: 'The Ultimate Guide to EVA Foam Prop Crafting',
    description: 'Learn how to cut, heat-shape, bevel, sand, and seal high-density EVA foam for anime swords, armor, and accessories.',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    tags: ['EVA Foam', 'Props', 'Armor', 'Heat Gun', 'Plasti Dip'],
    content: {
      overview: 'EVA foam (Ethylene-Vinyl Acetate) is the crown jewel of modern cosplay armor and prop building. It is lightweight, flexible, easily shaped with heat, and takes metallic paints convincingly.',
      keyPoints: [
        'Density matters: Always use high-density (100kg/m³ or higher) crafting foam rather than floor puzzle mats for clean cuts and bevels.',
        'Sharpness is safety: Always snap your utility knife blade after every 5-10 cuts. Dull blades tear the foam and leave jagged edges.',
        'Heat sealing: Run a heat gun at 300°C over bare foam until the surface sheen darkens slightly. This closes microscopic foam cells so it drinks less primer.'
      ],
      proTips: [
        'Contact cement (Barge or Renia) gives the strongest bond: apply to both sides, let get tacky for 5-8 minutes, then press firmly.',
        'Use high-grit sanding drums with a rotary tool (Dremel) at medium RPMs to bevel edges smoothly without melting the plastic.'
      ],
      recommendedTools: ['Snap-off Utility Knife', 'Dual-temp Heat Gun', 'Barge Contact Cement', 'Plasti Dip Primer Spray', 'Rotary Dremel Tool']
    }
  },
  {
    id: 'anime-wig-gravity-spikes',
    category: 'Wig Styling',
    title: 'Defying Gravity: Spiking & Styling Anime Hair',
    description: 'Master teasing, crimping, and spiking heat-resistant synthetic wigs for iconic characters like Gojo Satoru and Megumi Fushiguro.',
    readTime: '5 min read',
    difficulty: 'Intermediate',
    tags: ['Wig Care', 'Got2b', 'Crimping', 'Gravity Spikes', 'Anime Hair'],
    content: {
      overview: 'Anime hair defies the laws of physics. To make fibers stand upright without collapsing under convention humidity, you must build internal structural support using microscopic crimps and micro-spray layering.',
      keyPoints: [
        'Crimping is foundational: Micro-crimp the lower roots of the wig using a hair crimper on low heat (140°C). This quadruples fiber volume and creates a sturdy scaffolding.',
        'Layered spray technique: Work in small 1-inch sections. Hold the spike tip upward, spray got2b glued blasting freeze spray, and blast with a blowdryer on low heat for 5 seconds.',
        'Tapering tips: Use thinning shears cut vertically upward along the spike tip to avoid blunt, chunky ends.'
      ],
      proTips: [
        'Never use regular human hairspray—it lacks the synthetic resin polymer concentration required to lock plastic fibers.',
        'For extra large spikes, insert a light triangular core made of 2mm EVA foam wrapped in matching loose weft fibers.'
      ],
      recommendedTools: ['Hair Crimper (low heat)', 'got2b glued Blasting Freeze Spray', 'got2b Spiking Glue Gel', 'Thinning Shears', 'Wig Head & Clamp']
    }
  },
  {
    id: 'convention-eye-makeup-lenses',
    category: 'Makeup & Lenses',
    title: 'Con-Safe Contact Lens & Anime Eye Makeup Protocol',
    description: 'Essential hygiene, sizing guidelines, and sweat-proof makeup tips for vibrant circle lenses and dramatic anime eyeliners.',
    readTime: '4 min read',
    difficulty: 'Beginner',
    tags: ['Lenses', 'Eye Safety', 'Eyeliner', 'Waterproof', 'Setting Spray'],
    content: {
      overview: 'Anime eyes are large, expressive, and luminous. While colored lenses complete characters like Yor or Makima, eye safety and proper cosmetic layering must be top priority.',
      keyPoints: [
        'Always insert contact lenses BEFORE applying any makeup or foundation, and remove them before taking makeup off.',
        'Check base curve (BC) and diameter (DIA): Standard circle lenses are 8.6 BC and 14.2mm–14.5mm DIA. Never share lenses with anyone.',
        'Eyebrow blocking: Coat natural dark brows with Elmer\'s disappearing purple glue stick, powder with translucent powder, then draw anime-accurate colored brows.'
      ],
      proTips: [
        'Carry rewetting saline eye drops (preservative-free) in your convention pouch for instant relief in air-conditioned halls.',
        'Lock dramatic eyeliner with an alcohol-based or barrier spray (such as Ben Nye Final Seal or Kryolan Fixing Spray) to prevent smudging.'
      ],
      recommendedTools: ['Prescription-safe Colored Lenses', 'Contact Lens Solution & Mirror', 'Waterproof Gel Eyeliner', 'Disappearing Purple Glue Stick', 'Ben Nye Final Seal Spray']
    }
  },
  {
    id: 'convention-emergency-repair-kit',
    category: 'Con Survival',
    title: 'The Ultimate Con-Floor Emergency Kit (SOS Cosplay Kit)',
    description: 'The definitive packing checklist for wardrobe malfunctions, ripped seams, snapping straps, and prop first-aid.',
    readTime: '3 min read',
    difficulty: 'Beginner',
    tags: ['Con Survival', 'First Aid', 'Emergency Repair', 'Safety Pins', 'Fashion Tape'],
    content: {
      overview: 'Every seasoned cosplayer has faced a split seam, loose boot sole, or dropped prop at 2 PM on convention Saturday. Having a compact SOS pouch in your bag will save your day (and a fellow cosplayer\'s!).',
      keyPoints: [
        'Fast fixes: Heavy-duty safety pins (multiple sizes), double-sided fashion tape, and mini travel sewing kit with pre-threaded needles.',
        'Adhesive power: A tube of super glue (Krazy Glue or Gorilla Gel) and black electrical tape can fix 90% of broken armor joints on the go.',
        'Human maintenance: Hydration electrolyte packets, blister cushions (moleskin), ibuprofen/pain relief, and high-protein snack bars.'
      ],
      proTips: [
        'Keep extra wig pins (bobby pins & U-pins) inside a mint tin—they love to mysteriously vanish throughout con day.',
        'Pack flat folding flip-flops or slippers in your backpack so you can rest your feet when taking a lunch break!'
      ],
      recommendedTools: ['Assorted Safety Pins', 'Gorilla Super Glue Gel', 'Double-sided Toupee / Fashion Tape', 'Moleskin Blister Bandages', 'Electrolyte Powder Packs']
    }
  },
  {
    id: 'sewing-pattern-basics',
    category: 'Sewing & Fabrics',
    title: 'Sewing & Pattern Drafting Fundamentals',
    description: 'Master measuring mockups, choosing stable fabrics, and modifying commercial sewing patterns for anime costumes.',
    readTime: '5 min read',
    difficulty: 'Beginner',
    tags: ['Sewing', 'Patterns', 'Muslin Mockup', 'Interfacing', 'Stitch Work'],
    content: {
      overview: 'Anime garments rarely obey standard western tailoring. To create crisp anime collars, pleated skirts, and dramatic capes, proper pattern drafting and fabric selection are vital.',
      keyPoints: [
        'Always make a muslin mockup: Test the fit using cheap unbleached cotton muslin before cutting into expensive brocades or silks.',
        'Fabric weight and drape: Stiff military coats need twill or suiting; flowing kimonos or cloaks need crepe, linen, or poly-chiffon.',
        'Interfacing is magic: Use fusible medium-to-heavy interfacing inside collars, cuffs, and lapels so they maintain sharp anime silhouettes.'
      ],
      proTips: [
        'Clip curves and notch corners: Always snip triangular notches in curved seams before pressing so fabric lies completely flat.',
        'A rotary cutter and self-healing mat will give you 10x faster and straighter cuts than shears.'
      ],
      recommendedTools: ['Rotary Cutter & Cutting Mat', 'Sewing Machine with Walking Foot', 'Steam Iron', 'Fusible Interfacing', 'Chalk Fabric Marker']
    }
  },
  {
    id: 'cosplay-etiquette-and-consent',
    category: 'Con Survival',
    title: 'Cosplay Etiquette, Hallway Safety & Consent Protocol',
    description: 'Golden rules for attending conventions: "Cosplay is Not Consent", respecting personal space, prop peace-bonding, and photography etiquette.',
    readTime: '4 min read',
    difficulty: 'Beginner',
    tags: ['Etiquette', 'Consent', 'Safety', 'Prop Rules', 'Convention Guidelines'],
    content: {
      overview: 'A vibrant convention community thrives on mutual respect, empathy, and safety. Every cosplayer, photographer, and attendee deserves to feel safe and respected.',
      keyPoints: [
        'Cosplay is Not Consent: Always ask verbal permission before taking photos, recording videos, or asking for poses. Never touch a cosplayer or their costume without explicit consent.',
        'Prop Peace-Bonding: Check weapons policy at convention registration immediately upon arrival. Blunted foam and wood props must be inspected and tagged.',
        'Hallway traffic awareness: If stopping for a photoshoot, step to the side of traffic lanes away from doorways and escalators so attendees can flow freely.'
      ],
      proTips: [
        'Never criticize another cosplayer\'s costume, accuracy, body, or craftsmanship in public or online—we are all fans sharing our passion.',
        'If you see someone in costume looking distressed, overheated, or having a wardrobe failure, politely offer water or check if they need help.'
      ],
      recommendedTools: ['Peace-Bond Zip Ties', 'Hydration Pack', 'Con Map & Info Badge', 'Cosplay Business / Handle Cards']
    }
  }
];
