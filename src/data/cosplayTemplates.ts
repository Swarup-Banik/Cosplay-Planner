import { CosplayItem, ItemCategory } from '../types';

export interface CharacterCosplayTemplate {
  characterKeywords: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  accentColor?: string;
  cosplayTips: {
    wigStyling: string;
    makeupDetails: string;
    fabricRecommendations: string;
    propGuide?: string;
  };
  personality: {
    traits: string[];
    speakingStyle: string;
    greeting: string;
    adviceTone: string;
  };
  items: Array<{
    name: string;
    category: ItemCategory;
    estimatedPrice: number;
    notes: string;
    diyTips?: string;
  }>;
}

export const COSPLAY_TEMPLATES: Record<string, CharacterCosplayTemplate> = {
  yor: {
    characterKeywords: ['yor forger', 'yor briar', 'thorn princess', 'yor'],
    difficulty: 'Intermediate',
    accentColor: '#F472B6',
    cosplayTips: {
      wigStyling: 'Part jet-black hair with twin low pigtails looped up, pinned neatly beneath the gold rose headband, with soft parted face-framing bangs.',
      makeupDetails: 'Burgundy or wine-red contacts, delicate soft winged eyeliner, and a romantic berry lip stain.',
      fabricRecommendations: 'Matte black faux leather or scuba knit for the form-fitting dress, lined with floral rose-patterned silk/satin on the inner skirt split.',
      propGuide: 'Craft the golden stilettos from 3D printed PLA or dense EVA foam sanded smooth and coated with chrome-gold leaf spray.'
    },
    personality: {
      traits: ['Polite', 'Airheaded & Sweet', 'Lethally Dedicated', 'Humble', 'Protective Mom'],
      speakingStyle: 'Incredibly courteous, polite honorifics, slightly flustered about domestic skills, but deadly serious about protecting loved ones.',
      greeting: 'Oh my goodness, hello! Are we preparing my Thorn Princess dress for an outing together?',
      adviceTone: 'Warm, slightly bashful, and gently supportive with a hint of lethal precision.'
    },
    items: [
      {
        name: 'Halter-Neck Black Assassin Dress (Rose Silk Lining)',
        category: 'Garment',
        estimatedPrice: 3200,
        notes: 'Cross-back halter strap with high side slits showing red rose-print satin lining.'
      },
      {
        name: 'Golden Rose Headband with Spikes',
        category: 'Accessories',
        estimatedPrice: 750,
        notes: 'Metallic gold headband featuring two sculptured roses and rear comb pins.'
      },
      {
        name: 'Dangling Gold Spike Earrings',
        category: 'Accessories',
        estimatedPrice: 400,
        notes: 'Long slender conical drop earrings matching the headband.'
      },
      {
        name: 'Over-the-Knee Black Leather Boots',
        category: 'Footwear',
        estimatedPrice: 2200,
        notes: 'Thigh-high faux leather boots with comfortable block heel for walking.'
      },
      {
        name: 'Fingerless Long Black Gloves',
        category: 'Garment',
        estimatedPrice: 600,
        notes: 'Faux leather or stretch vinyl reaching past the elbows.'
      },
      {
        name: 'Twin Golden Stiletto Needle Props',
        category: 'Prop',
        estimatedPrice: 1200,
        notes: 'Con-safe EVA foam or 3D-printed lightweight cosplay props with golden luster finish.'
      },
      {
        name: 'Low-Pigtail Jet Black Styled Wig',
        category: 'Wig',
        estimatedPrice: 1600,
        notes: 'Pre-separated twin low tails with curved inward face bangs.'
      }
    ]
  },

  gojo: {
    characterKeywords: ['gojo satoru', 'satoru gojo', 'satoru gojou', 'gojo'],
    difficulty: 'Intermediate',
    accentColor: '#905CD9',
    cosplayTips: {
      wigStyling: 'Use a heat-resistant, stark-white wig. Tease the root fibers lightly with got2b glued freezing spray, creating wispy, gravity-defying upward spikes without clumpiness.',
      makeupDetails: 'Brighten complexion with fair matte foundation, sculpt subtle cheekbones, and wear vibrant cerulean blue contact lenses (with mesh center for blindfold visibility).',
      fabricRecommendations: 'High-density jet black or midnight navy gabardine/matte twill for the high-collar uniform tunic and matching slim-cut pants.',
      propGuide: 'Custom four-way stretch opaque black blindfold with double-layer breathable mesh or dark round wire-frame sunglasses.'
    },
    personality: {
      traits: ['Playful', 'Supremely Confident', 'Supportive Mentor', 'Dramatic', 'Charming'],
      speakingStyle: 'Relaxed, teasing, and affectionate with casual Japanese honorifics, switching to sharp wisdom when advising on technique.',
      greeting: 'Yo! You called? Looking to bring the world\'s strongest sorcerer to your next con?',
      adviceTone: 'Encouraging, stylish, and full of high-energy flair.'
    },
    items: [
      {
        name: 'High-Collar Dark Navy Tunic Jacket',
        category: 'Garment',
        estimatedPrice: 2400,
        notes: 'Mandatory stiffened mandarin collar that stands up around the neck cleanly.'
      },
      {
        name: 'Matching Straight-Leg Trousers',
        category: 'Garment',
        estimatedPrice: 1200,
        notes: 'Slightly relaxed fit tapered at ankle for tucked or untucked boot look.'
      },
      {
        name: 'Textured Snow-White Spiky Wig',
        category: 'Wig',
        estimatedPrice: 1800,
        notes: 'Pre-styled or crimped white wig with gravity-defying spires.'
      },
      {
        name: 'Signature Black Stretch Blindfold',
        category: 'Accessories',
        estimatedPrice: 450,
        notes: 'Double layer elastic knit; ensure you can see through safely for walking con halls!'
      },
      {
        name: 'Cerulean / Electric Blue Cosplay Contact Lenses',
        category: 'Makeup',
        estimatedPrice: 950,
        notes: 'High-pigment bright blue lenses that simulate the luminous Six Eyes.'
      },
      {
        name: 'Matte Black High-Top Boots / Dress Shoes',
        category: 'Footwear',
        estimatedPrice: 1600,
        notes: 'Comfortable cushioned sole for walking 15,000+ convention steps.'
      },
      {
        name: 'Dark Wire-Frame Round Sunglasses',
        category: 'Accessories',
        estimatedPrice: 500,
        notes: 'Great for photo shoots when you pull down the blindfold!'
      }
    ]
  },

  anya: {
    characterKeywords: ['anya forger', 'anya'],
    difficulty: 'Beginner',
    accentColor: '#FFA0C2',
    cosplayTips: {
      wigStyling: 'Baby pink short bob wig with flipped outward tips and straight across fringe bangs. Keep the silhouette fluffy and light.',
      makeupDetails: 'Bright wide doe eyes, soft blush on cheeks and nose tip, and natural peachy lip gloss.',
      fabricRecommendations: 'Navy wool blend or high quality suiting fabric for the Eden uniform with gold soutache braid trim on collar and cuffs.',
      propGuide: 'A mini plush Chimera doll with lion wings and goat horns, plus a faux peanut bag.'
    },
    personality: {
      traits: ['Adorable', 'Imaginative', 'Peanut Lover', 'Secret Agent Fan', 'Dramatic'],
      speakingStyle: 'Speaks in adorable third-person ("Anya says..."), uses cute expressions like "Waku waku!" and "Heh".',
      greeting: 'Waku waku! Did you come to help Anya prepare for Eden Academy or secret spy mission?',
      adviceTone: 'Super cute, enthusiastic, and curious.'
    },
    items: [
      {
        name: 'Eden Academy Black Uniform Dress with Gold Embellishments',
        category: 'Garment',
        estimatedPrice: 2200,
        notes: 'Pleated skirt dress with gold ornate embroidery along collar and cuffs.'
      },
      {
        name: 'Signature Conical Hair Ornaments (Chimera Horns)',
        category: 'Accessories',
        estimatedPrice: 400,
        notes: 'Pair of black cone clips with gold base bands.'
      },
      {
        name: 'Soft Bubblegum Pink Short Bob Wig',
        category: 'Wig',
        estimatedPrice: 1200,
        notes: 'Short shoulder-length wig with straight front bangs.'
      },
      {
        name: 'Director Chimera Plush Doll',
        category: 'Prop',
        estimatedPrice: 900,
        notes: 'Stuffed plush toy with lion head, snake tail, and felt wings.'
      },
      {
        name: 'White Knee Socks & Brown Mary Jane Shoes',
        category: 'Footwear',
        estimatedPrice: 1100,
        notes: 'Clean white ribbed socks with classic buckle shoes.'
      }
    ]
  },

  nezuko: {
    characterKeywords: ['nezuko kamado', 'nezuko'],
    difficulty: 'Intermediate',
    accentColor: '#F472B6',
    cosplayTips: {
      wigStyling: 'Long black wavy wig with bright vermilion/orange ombre tips. Pin the front bangs up with a pink ribbon clip on the left temple.',
      makeupDetails: 'Light pink or crimson contacts with cat-slit pupils, soft skin tone, and prominent pink blush.',
      fabricRecommendations: 'Light pink linen/cotton with geometric Asanoha (hemp leaf) pattern, lined in white, with black long haori coat.',
      propGuide: 'Green bamboo muzzle wrapped with red cord, wooden box or basket backpack.'
    },
    personality: {
      traits: ['Protective', 'Gentle', 'Fierce', 'Loving Sister'],
      speakingStyle: 'Soft, affectionate sounds ("Mmh!"), fiercely loyal to friends and family.',
      greeting: 'Mmh! (Nezuko smiles warmly, waving her sleeves)',
      adviceTone: 'Protective and sweet.'
    },
    items: [
      {
        name: 'Pink Asanoha Geometric Pattern Kimono',
        category: 'Garment',
        estimatedPrice: 2200,
        notes: 'Traditional pink hemp leaf kimono with red and white checkered obi belt.'
      },
      {
        name: 'Floor-Length Black Haori Outer Coat',
        category: 'Garment',
        estimatedPrice: 1600,
        notes: 'Loose flowing jet-black haori coat.'
      },
      {
        name: 'Green Bamboo Muzzle Prop with Red Ribbon',
        category: 'Prop',
        estimatedPrice: 450,
        notes: 'Lightweight cylindrical bamboo replica with soft fabric straps.'
      },
      {
        name: 'Black to Flame-Orange Gradient Wavy Long Wig',
        category: 'Wig',
        estimatedPrice: 1700,
        notes: 'Long wavy black wig with vibrant orange dip-dyed ends and pink ribbon clip.'
      },
      {
        name: 'Pink Cat-Eye Cosplay Contact Lenses',
        category: 'Makeup',
        estimatedPrice: 950,
        notes: 'Soft pink lenses capturing Nezuko\'s demon awakening.'
      },
      {
        name: 'Black Kyahan Leg Wraps & Zori Sandals',
        category: 'Footwear',
        estimatedPrice: 850,
        notes: 'Calf wraps with light pink cords and traditional straw-look sandals.'
      }
    ]
  },

  tanjiro: {
    characterKeywords: ['tanjiro kamado', 'tanjiro'],
    difficulty: 'Advanced',
    accentColor: '#56B0DC',
    cosplayTips: {
      wigStyling: 'Dark burgundy spiky hair slicked up away from the forehead revealing his scar on the upper-left forehead.',
      makeupDetails: 'Paint the flame demon slayer scar over the left temple, with deep crimson eyes.',
      fabricRecommendations: 'Green and black checkered print haori coat made of heavy cotton twill over standard black gakuran uniform.',
      propGuide: 'Black Nichirin katana with sun flame tsuba guard and wooden Nezuko backpack box.'
    },
    personality: {
      traits: ['Deeply Compassionate', 'Resilient', 'Polite', 'Hardworking'],
      speakingStyle: 'Earnest, respectful, passionate, and always encouraging hard work.',
      greeting: 'Hello there! Let\'s do our absolute best together on this cosplay project!',
      adviceTone: 'Empowering, respectful, and full of heartfelt encouragement.'
    },
    items: [
      {
        name: 'Green & Black Checkered Haori Coat',
        category: 'Garment',
        estimatedPrice: 1600,
        notes: 'Classic geometric check pattern haori with wide sleeves.'
      },
      {
        name: 'Demon Slayer Corps Uniform (Gakuran & Hakama)',
        category: 'Garment',
        estimatedPrice: 2400,
        notes: 'White belt, calf leg wraps (kyahan), and silver back kanji "Metsu".'
      },
      {
        name: 'Spiky Burgundy-Tipped Slicked-Back Wig',
        category: 'Wig',
        estimatedPrice: 1500,
        notes: 'Black base with dark crimson tips pushed up from hairline.'
      },
      {
        name: 'Hanafuda Sun Motif Earrings',
        category: 'Accessories',
        estimatedPrice: 350,
        notes: 'Rectangular white drop earrings with rising red sun and mountain lines.'
      },
      {
        name: 'Black Blade Nichirin Katana with Flame Guard',
        category: 'Prop',
        estimatedPrice: 2200,
        notes: 'Con-safe wooden/foam katana with black blade and circular sun tsuba.'
      },
      {
        name: 'Forehead Flame Mark Tattoo / Makeup Template',
        category: 'Makeup',
        estimatedPrice: 250,
        notes: 'Waterproof temporary tattoo transfer or template.'
      },
      {
        name: 'Zori Sandals & White Tabi Socks',
        category: 'Footwear',
        estimatedPrice: 900,
        notes: 'Traditional strapped sandals with padded insole.'
      }
    ]
  },

  frieren: {
    characterKeywords: ['frieren'],
    difficulty: 'Intermediate',
    accentColor: '#8BC9E8',
    cosplayTips: {
      wigStyling: 'Pale silver-white wig tied in twin low pigtails resting over the front shoulders. Add subtle green-tinted elf ear prosthetics.',
      makeupDetails: 'Large emerald green contacts, delicate clean skin, soft arched eyebrows with calm stoic expression.',
      fabricRecommendations: 'Cream wool capelet with gold buttons, paired with a white tiered tunic and black waist belt.',
      propGuide: 'Her wooden crescent staff with red gem orb and gold metal spiral cage.'
    },
    personality: {
      traits: ['Calm', 'Nostalgic', 'Curious Spell Collector', 'Deeply Caring'],
      speakingStyle: 'Gentle, introspective, calm cadence with thoughtful pauses and fondness for reminiscing about Himmel.',
      greeting: 'Ah... hello. Have you gathered all the materials for my tunic and staff yet?',
      adviceTone: 'Serene, contemplative, and reassuring.'
    },
    items: [
      {
        name: 'Cream & Gold Short Shoulder Capelet',
        category: 'Garment',
        estimatedPrice: 1800,
        notes: 'Cream wool/twill capelet lined in black with gold trim and dual button front.'
      },
      {
        name: 'White High-Neck Long Sleeve Tunic Dress',
        category: 'Garment',
        estimatedPrice: 2000,
        notes: 'Pleated lower hem with gold horizontal stripe and dark waist belt.'
      },
      {
        name: 'Twin Low-Pigtail Silver White Wig',
        category: 'Wig',
        estimatedPrice: 1500,
        notes: 'Long white wig split into front twin tails with soft bangs.'
      },
      {
        name: 'Pointed Elven Ear Prosthetics & Red Drop Earrings',
        category: 'Accessories',
        estimatedPrice: 650,
        notes: 'Soft silicone elf ears attached with spirit gum, accompanied by elongated red drop earrings.'
      },
      {
        name: 'Frieren\'s Crescent Wand & Orb Prop Staff',
        category: 'Prop',
        estimatedPrice: 2800,
        notes: 'Full-length staff with wooden grain shaft and crescent gold head housing ruby sphere.'
      },
      {
        name: 'Brown Leather Travel Boots & Stockings',
        category: 'Footwear',
        estimatedPrice: 1600,
        notes: 'Comfortable flat vintage lace-up travel boots.'
      }
    ]
  },

  marin: {
    characterKeywords: ['marin kitagawa', 'marin'],
    difficulty: 'Beginner',
    accentColor: '#FFA0C2',
    cosplayTips: {
      wigStyling: 'Long blonde wig with salmon-pink ombré dip-dyed ends. Keep waves loose and natural with light curling wand work.',
      makeupDetails: 'Bright pink or violet contacts, dark eyeliner with winged lashes, gyaru French tip nails, and glossy pink lip gloss.',
      fabricRecommendations: 'White loose-fitting collared button-down shirt paired with blue-grey pleated plaid skirt and loose necktie.',
      propGuide: 'Multiple ear piercings/cuffs, chokers, and a smartphone with cute anime phone charms.'
    },
    personality: {
      traits: ['Super Energetic', 'Honest & Direct', 'Cosplay Addict', 'Affectionate'],
      speakingStyle: 'Excited gyaru speech with lots of laughs, exclamation points, and genuine encouragement for crafting.',
      greeting: 'Yaaaaay! Oh my gosh, are you planning a cosplay right now?! Tell me everything, I\'m so hyped!',
      adviceTone: 'Extremely enthusiastic, warm, motivating, and best-friend energy.'
    },
    items: [
      {
        name: 'Casual School Gyaru Button-Down Shirt & Tie',
        category: 'Garment',
        estimatedPrice: 1100,
        notes: 'White oversized collared shirt unbuttoned at collar with loose navy patterned tie.'
      },
      {
        name: 'Plaid Pleated High-Waist School Skirt',
        category: 'Garment',
        estimatedPrice: 900,
        notes: 'Blue-grey windowpane check pleated skirt.'
      },
      {
        name: 'Blonde to Pink Gradient Ombré Long Wig',
        category: 'Wig',
        estimatedPrice: 1700,
        notes: 'Warm honey-blonde hair flowing into soft peach-pink dipped ends.'
      },
      {
        name: 'Multiple Piercing Cuff Set & Choker',
        category: 'Accessories',
        estimatedPrice: 450,
        notes: 'Silver clip-on ear cuff chain and black lace velvet choker.'
      },
      {
        name: 'Pink/Violet Color Contact Lenses',
        category: 'Makeup',
        estimatedPrice: 850,
        notes: 'Vibrant anime dolly eye lenses.'
      },
      {
        name: 'Long Acrylic Press-On Nails Set (Pink French)',
        category: 'Makeup',
        estimatedPrice: 350,
        notes: 'Salon-style coffin or almond shaped pastel pink press-ons.'
      }
    ]
  },

  luffy: {
    characterKeywords: ['luffy', 'monkey d. luffy', 'straw hat'],
    difficulty: 'Beginner',
    accentColor: '#EF4444',
    cosplayTips: {
      wigStyling: 'Messy short shaggy jet-black hair with soft front spires resting over ears.',
      makeupDetails: 'Draw the curved crescent eye scar beneath the left eye using eyeliner pencil and chest X-scar if doing Post-Timeskip look.',
      fabricRecommendations: 'Red cotton twill vest unbuttoned, denim blue shorts rolled above knees, and yellow wrinkled sash belt.',
      propGuide: 'The iconic woven straw hat with a 2-inch red grosgrain fabric band.'
    },
    personality: {
      traits: ['Fearless', 'Carefree', 'Meat Lover', 'Loyal Captain'],
      speakingStyle: 'Loud, boisterous, laughing ("Shishishi!"), eager for grand adventures and food.',
      greeting: 'Shishishi! I\'m Luffy, the man who\'s gonna be King of the Pirates! Let\'s set sail!',
      adviceTone: 'Carefree, courageous, and direct.'
    },
    items: [
      {
        name: 'Iconic Woven Straw Hat with Red Ribbon Band',
        category: 'Accessories',
        estimatedPrice: 650,
        notes: 'Natural woven straw hat with wide flat brim and red fabric band.'
      },
      {
        name: 'Sleeveless Red Open Vest',
        category: 'Garment',
        estimatedPrice: 1100,
        notes: 'Vibrant red open button-front vest (pre or post-timeskip).'
      },
      {
        name: 'Rolled-Up Blue Denim Shorts with Fur Trim',
        category: 'Garment',
        estimatedPrice: 950,
        notes: 'Denim jean shorts cuffed above the knee with white fleece/shearling trim.'
      },
      {
        name: 'Yellow Fabric Sash Waist Belt',
        category: 'Garment',
        estimatedPrice: 400,
        notes: 'Long yellow cotton sash tied loosely at the waist.'
      },
      {
        name: 'Shaggy Short Black Cosplay Wig',
        category: 'Wig',
        estimatedPrice: 1300,
        notes: 'Tousled black anime hair with airy texture.'
      },
      {
        name: 'Traditional Woven Straw Sandals (Waraji)',
        category: 'Footwear',
        estimatedPrice: 700,
        notes: 'Lightweight woven sandals with comfortable rubber soles.'
      },
      {
        name: 'Facial & Chest Scar Body Makeup Pencil',
        category: 'Makeup',
        estimatedPrice: 300,
        notes: 'Waterproof brown/red makeup pen for eye stitch scar.'
      }
    ]
  },

  naruto: {
    characterKeywords: ['naruto uzumaki', 'naruto'],
    difficulty: 'Intermediate',
    accentColor: '#F59E0B',
    cosplayTips: {
      wigStyling: 'Vibrant lemon-yellow spiky wig with triangular spires radiating evenly outwards.',
      makeupDetails: 'Three curved whisker marks on each cheek drawn with waterproof brown cosmetic liner, and bright cerulean blue contacts.',
      fabricRecommendations: 'High-density orange cotton twill tracksuit with navy/black shoulders, white swirl crest on back, and metal forehead protector.',
      propGuide: 'Konoha Hidden Leaf Village metal headband, Kunai prop holster pouch strapped to right thigh.'
    },
    personality: {
      traits: ['Determined', 'High-Spirited', 'Ramen Lover', 'Never Gives Up'],
      speakingStyle: 'Passionate, energetic, ending sentences with "Dattebayo!" or "Believe it!".',
      greeting: 'Believe it! Let\'s make this ninja cosplay the coolest thing anyone\'s ever seen!',
      adviceTone: 'Fiery, hardworking, and deeply encouraging.'
    },
    items: [
      {
        name: 'Orange & Black Shippuden Tracksuit Jacket',
        category: 'Garment',
        estimatedPrice: 2200,
        notes: 'Black shoulder yoke with orange torso, high funnel neck, and Uzumaki swirl crest.'
      },
      {
        name: 'Matching Orange Tracksuit Trousers',
        category: 'Garment',
        estimatedPrice: 1200,
        notes: 'Elastic waist track pants with right thigh holster strap.'
      },
      {
        name: 'Hidden Leaf Village Metal Forehead Protector Headband',
        category: 'Accessories',
        estimatedPrice: 450,
        notes: 'Stamped stainless steel leaf crest plate on long black fabric tie.'
      },
      {
        name: 'Bright Spiky Blonde Anime Wig',
        category: 'Wig',
        estimatedPrice: 1600,
        notes: 'Heat-resistant vibrant yellow wig styled into outward spires.'
      },
      {
        name: 'Open-Toe Black Shinobi Ninja Sandals',
        category: 'Footwear',
        estimatedPrice: 950,
        notes: 'Classic anime ninja footwear with open toe and ankle zipper.'
      },
      {
        name: 'Leg Shuriken Holster Pouch & Kunai Dagger Prop',
        category: 'Prop',
        estimatedPrice: 800,
        notes: 'White bandage leg wraps with black holster pouch and foam kunai.'
      },
      {
        name: 'Cerulean Blue Contacts & Whisker Mark Template',
        category: 'Makeup',
        estimatedPrice: 950,
        notes: 'Bright blue lenses and waterproof cheek whisker marks.'
      }
    ]
  },

  mikasa: {
    characterKeywords: ['mikasa ackerman', 'mikasa'],
    difficulty: 'Advanced',
    accentColor: '#DC2626',
    cosplayTips: {
      wigStyling: 'Short layered jet-black bob wig with choppy parted bangs framing the cheeks.',
      makeupDetails: 'Dark grey/black contacts, clean matte skin, faint brow angle, and determined expression.',
      fabricRecommendations: 'Cropped caramel brown jacket with embroidered Scout Regiment Wings of Freedom patches on breast pocket and back.',
      propGuide: 'Dark crimson red knit scarf, full leather harness belt assembly covering chest, waist and thighs, and con-safe ODM blades.'
    },
    personality: {
      traits: ['Protective', 'Peerless Soldier', 'Quiet Strength', 'Loyal'],
      speakingStyle: 'Calm, composed, protective, speaking with quiet determination.',
      greeting: 'This world is cruel... but it is also very beautiful. Let us prepare properly.',
      adviceTone: 'Disciplined, quiet, and reliable.'
    },
    items: [
      {
        name: 'Survey Corps Scout Regiment Cropped Brown Jacket',
        category: 'Garment',
        estimatedPrice: 2500,
        notes: 'Short jacket with Wings of Freedom embroidered crests on back and sleeves.'
      },
      {
        name: 'Iconic Dark Crimson Knitted Red Scarf',
        category: 'Accessories',
        estimatedPrice: 550,
        notes: 'Soft burgundy/crimson knit scarf wrapped snugly around the neck.'
      },
      {
        name: 'White Button-Down Collared Shirt & Slim Cream Pants',
        category: 'Garment',
        estimatedPrice: 1500,
        notes: 'Fitted formal button shirt with cream riding breeches.'
      },
      {
        name: 'Full Body Omni-Directional Mobility (ODM) Leather Harness',
        category: 'Accessories',
        estimatedPrice: 2200,
        notes: 'Intricate multi-strap brown leather harness looping around torso, waist, and thighs.'
      },
      {
        name: 'Knee-High Dark Brown Riding Boots',
        category: 'Footwear',
        estimatedPrice: 2400,
        notes: 'Tall equestrian boots with harness strap loops.'
      },
      {
        name: 'Layered Short Jet Black Bob Wig',
        category: 'Wig',
        estimatedPrice: 1500,
        notes: 'Short layered black bob with parted fringe.'
      },
      {
        name: 'Twin ODM Snap-Blade Swords (Con-Safe Foam / Lightweight Wood)',
        category: 'Prop',
        estimatedPrice: 2800,
        notes: 'Survey corps utility blades with hand trigger grips.'
      }
    ]
  }
};

/**
 * Finds a matching cosplay template for a character or generates an intelligent
 * bespoke template based on their name, anime, and description.
 */
export function getOrCreateCosplayTemplate(
  characterName: string,
  animeTitle?: string,
  description?: string
): CharacterCosplayTemplate {
  const normalized = characterName.toLowerCase().trim();

  // 1. Check known templates
  for (const [key, template] of Object.entries(COSPLAY_TEMPLATES)) {
    if (template.characterKeywords.some(kw => normalized.includes(kw) || kw.includes(normalized))) {
      return template;
    }
  }

  // 2. Intelligent Bespoke Generation for ANY anime character
  const firstName = characterName.split(' ')[0] || characterName;
  const animeDisplay = animeTitle || 'Anime';

  return {
    characterKeywords: [normalized],
    difficulty: 'Intermediate',
    accentColor: '#905CD9',
    cosplayTips: {
      wigStyling: `Source a heat-resistant synthetic wig matching ${firstName}'s anime hair color and silhouette. Use a low-heat blowdryer and styling gel to capture the signature part and volume.`,
      makeupDetails: `Apply clean matte foundation, define eye contours matching ${firstName}'s anime eye shape, and consider colored contact lenses for complete fidelity.`,
      fabricRecommendations: `Use medium-weight twill, gabardine, or cotton blends suited to ${animeDisplay}'s costume design. Ensure all hems are reinforced for full day convention wear.`,
      propGuide: `Keep props convention-compliant: use lightweight high-density EVA foam or 3D prints with blunt edges and secure grip balance.`
    },
    personality: {
      traits: ['Anime Hero', 'Determined', 'Inspiring', 'Cosplay-Ready'],
      speakingStyle: `Speaks with the authentic passion and charm of ${animeDisplay}.`,
      greeting: `Hello! Excited to bring ${characterName} to life at your next convention? Let's check off everything you need!`,
      adviceTone: 'Encouraging, practical, and full of creative excitement.'
    },
    items: [
      {
        name: `Signature ${characterName} Main Garment / Tunic`,
        category: 'Garment',
        estimatedPrice: 2600,
        notes: `The primary iconic upper garment / uniform from ${animeDisplay}.`
      },
      {
        name: `Matching Trousers / Skirt / Lower Garment`,
        category: 'Garment',
        estimatedPrice: 1400,
        notes: 'Tailored lower garments matching the anime character silhouette.'
      },
      {
        name: `Character-Accurate Styled Cosplay Wig`,
        category: 'Wig',
        estimatedPrice: 1700,
        notes: `Heat-resistant wig styled to capture ${firstName}'s distinct anime hairstyle.`
      },
      {
        name: `Signature Prop / Relic / Weapon`,
        category: 'Prop',
        estimatedPrice: 2000,
        notes: 'Convention-safe EVA foam or 3D printed prop centerpiece.'
      },
      {
        name: `Character Cosplay Contact Lenses & Makeup Set`,
        category: 'Makeup',
        estimatedPrice: 950,
        notes: 'Vibrant lenses and cosmetic contour kit to replicate character eyes.'
      },
      {
        name: `Character Boots / Footwear`,
        category: 'Footwear',
        estimatedPrice: 1800,
        notes: 'Comfortable con-ready footwear matching character design.'
      },
      {
        name: `Iconic Character Accessories & Details`,
        category: 'Accessories',
        estimatedPrice: 700,
        notes: 'Belts, badges, jewelry, or signature insignia.'
      }
    ]
  };
}
