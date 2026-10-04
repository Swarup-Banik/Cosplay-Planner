import { Character } from '../types';

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: '164472',
    mal_id: 164472,
    name: 'Gojo Satoru',
    romanjiName: 'Satoru Gojō',
    japaneseName: '五条 悟',
    series: 'Jujutsu Kaisen',
    seriesJapanese: '呪術廻戦',
    role: 'Special Grade Sorcerer & Jujutsu High Teacher',
    difficulty: 'Intermediate',
    gender: 'Male',
    popularity: 99,
    tags: ['Sorcerer', 'Jujutsu Kaisen', 'Blindfold', 'White Hair', 'Teacher', 'Iconic'],
    description: 'The strongest Jujutsu sorcerer alive, renowned for his unrivaled cursed energy, blindingly blue Six Eyes, and nonchalant, playful demeanor.',
    quote: 'Throughout heaven and earth, I alone am the honored one.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png',
    accentColor: '#905CD9',
    voiceActor: {
      name: 'Yuichi Nakamura',
      japaneseName: '中村 悠一'
    },
    animeInfo: {
      studio: 'MAPPA',
      debutSeason: 'Fall 2020',
      episodes: '47+ Episodes',
      status: 'Ongoing'
    },
    stats: {
      strength: 98,
      speed: 99,
      technique: 100,
      defense: 100,
      intelligence: 95,
      energy: 100,
      note: 'Ratings curated by community consensus & official fanbook guides'
    },
    abilities: [
      {
        id: 'limitless',
        name: 'Limitless (Mukagen)',
        japaneseName: '無下限呪術',
        type: 'Passive',
        description: 'An inherited technique that manipulates space at an atomic level through mathematical division of spatial intervals.',
        details: 'Allows the user to distort and bring the concept of "Infinity" into reality, creating an impenetrable barrier.'
      },
      {
        id: 'infinity',
        name: 'Infinity (Mugen)',
        japaneseName: '無限',
        type: 'Defensive',
        description: 'The convergence of an infinite series: approaching objects slow down progressively, never actually touching Satoru.',
        details: 'Active passively around him 24/7 thanks to automated Six Eyes brain refreshing techniques.'
      },
      {
        id: 'blue-red',
        name: 'Cursed Technique Lapse: Blue & Reversal: Red',
        japaneseName: '術式反転「赫」/ 蒼',
        type: 'Offensive',
        description: 'Blue creates vacuum attraction by manifesting negative space; Red produces massive explosive divergence via positive energy.',
        details: 'Requires immense precision and reverse cursed technique mastery.'
      },
      {
        id: 'six-eyes',
        name: 'Six Eyes (Rikugan)',
        japaneseName: '六眼',
        type: 'Special',
        description: 'Inborn ocular jujutsu allowing supreme cursed energy perception down to the subatomic scale and near-zero energy consumption.',
        details: 'Fatiguing to the naked eye, explaining why he constantly wears high-grade fabric blindfolds or pitch-black sunglasses.'
      }
    ],
    specialMoves: [
      {
        id: 'hollow-purple',
        name: 'Hollow Technique: Purple (Kyoshiki: Murasaki)',
        type: 'Ultimate',
        description: 'Collision of converging Infinity (Blue) and diverging Infinity (Red) creating an imaginary mass that erases matter in its path.',
        impact: 'Complete devastation of targeted radius'
      },
      {
        id: 'infinite-void',
        name: 'Domain Expansion: Infinite Void (Muryōkūsho)',
        type: 'Domain Expansion',
        description: 'Transports targets into the metaphysical interior of the Limitless, inundating their brains with infinite raw information.',
        impact: 'Immediate catatonic sensory paralysis'
      }
    ],
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
      adviceTone: 'Encouraging, stylish, and full of high-energy flair.',
      voicePitch: 1.05,
      voiceRate: 1.0
    },
    cosplayItems: [
      {
        id: 'gojo-item-1',
        name: 'High-Collar Dark Navy Tunic Jacket',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 2400,
        notes: 'Mandatory stiffened mandarin collar that stands up around the neck cleanly.',
        diyTips: 'Add heavy iron-on interfacing inside the collar so it stays erect without sagging.'
      },
      {
        id: 'gojo-item-2',
        name: 'Matching Straight-Leg Trousers',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 1200,
        notes: 'Slightly relaxed fit tapered at ankle for tucked or untucked boot look.'
      },
      {
        id: 'gojo-item-3',
        name: 'Textured Snow-White Spiky Wig',
        category: 'Wig',
        difficulty: 'Hard',
        estimatedPrice: 1800,
        notes: 'Pre-styled or crimped white wig with gravity-defying spires.',
        diyTips: 'Use a hair dryer on low heat while holding spikes upward with got2b spray.'
      },
      {
        id: 'gojo-item-4',
        name: 'Signature Black Stretch Blindfold',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 450,
        notes: 'Double layer elastic knit; ensure you can see through safely for walking con halls!'
      },
      {
        id: 'gojo-item-5',
        name: 'Cerulean / Electric Blue Cosplay Contact Lenses',
        category: 'Makeup',
        difficulty: 'Medium',
        estimatedPrice: 950,
        notes: 'High-pigment bright blue lenses that simulate the luminous Six Eyes.'
      },
      {
        id: 'gojo-item-6',
        name: 'Matte Black High-Top Boots / Dress Shoes',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 1600,
        notes: 'Comfortable cushioned sole for walking 15,000+ convention steps.'
      },
      {
        id: 'gojo-item-7',
        name: 'Dark Wire-Frame Round Sunglasses (Alternate Look)',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 500,
        notes: 'Great for photo shoots when you pull down the blindfold!'
      }
    ]
  },
  {
    id: '170942',
    mal_id: 170942,
    name: 'Yor Forger',
    romanjiName: 'Yor Fōjā',
    japaneseName: 'ヨル・フォージャー',
    series: 'Spy × Family',
    seriesJapanese: 'SPY×FAMILY',
    role: 'Berlint City Clerk / Assassin "Thorn Princess"',
    difficulty: 'Intermediate',
    gender: 'Female',
    popularity: 98,
    tags: ['Thorn Princess', 'Spy x Family', 'Assassin', 'Gold Needles', 'Black Dress'],
    description: 'A gentle, unassuming Berlint city hall clerk by day, and the lethal underground assassin known as the "Thorn Princess" by night.',
    quote: 'Will you allow me the honor of taking your life?',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b138102-ZOAu9jI2d5ke.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b138102-ZOAu9jI2d5ke.png',
    accentColor: '#F472B6',
    voiceActor: {
      name: 'Saori Hayami',
      japaneseName: '早見 沙織'
    },
    animeInfo: {
      studio: 'WIT Studio & CloverWorks',
      debutSeason: 'Spring 2022',
      episodes: '37+ Episodes',
      status: 'Ongoing'
    },
    stats: {
      strength: 99,
      speed: 97,
      technique: 92,
      defense: 88,
      intelligence: 76,
      energy: 94,
      note: 'Physical prowess ranks at superhuman tiers in official character guides'
    },
    abilities: [
      {
        id: 'lethal-physique',
        name: 'Superhuman Physical Strength',
        japaneseName: '超人的膂力',
        type: 'Passive',
        description: 'Incredible raw muscle power capable of kicking speeding cars aside and slicing through tennis balls with sound-barrier racket swings.',
        details: 'Trained rigorously since early childhood by the Garden organization.'
      },
      {
        id: 'hypersonic-agility',
        name: 'Hypersonic Reflexes & Balance',
        japaneseName: '超絶身躱し',
        type: 'Defensive',
        description: 'Fluid, balletic dodging capabilities even while wearing stilettos and carrying groceries.',
        details: 'Can leap between balconies and evade ballistic fire effortlessly.'
      },
      {
        id: 'poison-immunity',
        name: 'Extreme Biological Resistance',
        japaneseName: '毒物耐性',
        type: 'Passive',
        description: 'Complete immunity to lethal organic poisons, including lethal pufferfish neurotoxins which merely soothe her tension headaches.',
        details: 'Rendered practically invulnerable to chemical assassination.'
      }
    ],
    specialMoves: [
      {
        id: 'thorn-strike',
        name: 'Thorn Needle Dual Precision Thrust',
        type: 'Finishing Technique',
        description: 'A lightning-speed flurry using twin stiletto-like golden stilettos targeting critical pressure points.',
        impact: 'Instant silent neutralization'
      }
    ],
    cosplayTips: {
      wigStyling: 'Part jet-black hair with low twin pigtails looped up, pinned neatly beneath the gold rose headband, with soft parted face-framing bangs.',
      makeupDetails: 'Burgundy or wine-red contacts, delicate soft winged eyeliner, and a romantic berry lip stain.',
      fabricRecommendations: 'Matte black faux leather or scuba knit for the form-fitting dress, lined with floral rose-patterned silk/satin on the inner skirt split.',
      propGuide: 'Craft the golden stilettos from 3D printed PLA or dense EVA foam sanded smooth and coated with chrome-gold leaf spray.'
    },
    personality: {
      traits: ['Polite', 'Airheaded & Sweet', 'Lethally Dedicated', 'Humble', 'Protective Mom'],
      speakingStyle: 'Incredibly courteous, polite honorifics, slightly flustered about domestic skills, but deadly serious about protecting loved ones.',
      greeting: 'Oh my goodness, hello! Are we preparing my Thorn Princess dress for an outing together?',
      adviceTone: 'Warm, slightly bashful, and gently supportive with a hint of lethal precision.',
      voicePitch: 1.15,
      voiceRate: 0.95
    },
    cosplayItems: [
      {
        id: 'yor-item-1',
        name: 'Halter-Neck Black Assassin Dress (Floral Rose Lining)',
        category: 'Garment',
        difficulty: 'Hard',
        estimatedPrice: 3200,
        notes: 'Cross-back halter strap with high side slits showing rose-print satin lining.',
        diyTips: 'Look for a pre-printed red rose satin fabric for the skirt interior lining.'
      },
      {
        id: 'yor-item-2',
        name: 'Golden Rose Headband with Spikes',
        category: 'Accessories',
        difficulty: 'Medium',
        estimatedPrice: 750,
        notes: 'Metallic gold headband featuring two sculptured roses and rear comb pins.'
      },
      {
        id: 'yor-item-3',
        name: 'Dangling Gold Spike Earrings',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 400,
        notes: 'Long slender conical drop earrings matching the headband.'
      },
      {
        id: 'yor-item-4',
        name: 'Over-the-Knee Black Leather Boots',
        category: 'Footwear',
        difficulty: 'Medium',
        estimatedPrice: 2200,
        notes: 'Stiletto or block heel thigh-high faux leather boots.'
      },
      {
        id: 'yor-item-5',
        name: 'Fingerless Long Black Gloves',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 600,
        notes: 'Faux leather or stretch vinyl reaching past the elbows.'
      },
      {
        id: 'yor-item-6',
        name: 'Twin Golden Stiletto Needle Props',
        category: 'Prop',
        difficulty: 'Medium',
        estimatedPrice: 1200,
        notes: 'Con-safe EVA foam or 3D-printed lightweight cosplay props with golden luster finish.',
        diyTips: 'Check convention weapon rules to ensure prop tips are blunt and con-compliant.'
      },
      {
        id: 'yor-item-7',
        name: 'Low-Pigtail Jet Black Styled Wig',
        category: 'Wig',
        difficulty: 'Medium',
        estimatedPrice: 1600,
        notes: 'Pre-separated twin low tails with curved inward face bangs.'
      }
    ]
  },
  {
    id: '164474',
    mal_id: 164474,
    name: 'Anya Forger',
    romanjiName: 'Anya Fōjā',
    japaneseName: 'アーニャ・フォージャー',
    series: 'Spy × Family',
    seriesJapanese: 'SPY×FAMILY',
    role: 'Eden Academy Student / Telepathic Esper',
    difficulty: 'Beginner',
    gender: 'Female',
    popularity: 97,
    tags: ['Eden Academy', 'Spy x Family', 'Telepath', 'Peanuts', 'Waku Waku', 'Cute'],
    description: 'A pint-sized telepathic runaway from an experimental research facility, now undercover as the beloved adopted daughter of Loid and Yor Forger.',
    quote: 'Waku waku! Anya wants to eat crispy peanuts and save the world!',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b138100-4Li0tWRCa5bQ.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b138100-4Li0tWRCa5bQ.png',
    accentColor: '#FFA0C2',
    voiceActor: {
      name: 'Atsumi Tanezaki',
      japaneseName: '種﨑 敦美'
    },
    animeInfo: {
      studio: 'WIT Studio & CloverWorks',
      debutSeason: 'Spring 2022',
      episodes: '37+ Episodes',
      status: 'Ongoing'
    },
    stats: {
      strength: 25,
      speed: 35,
      technique: 65,
      defense: 40,
      intelligence: 70,
      energy: 85,
      note: 'Eden Academy evaluation stats & telepathic potential'
    },
    abilities: [
      {
        id: 'telepathy',
        name: 'Telepathic Mind Reading (Heart Listening)',
        japaneseName: '心を読む力',
        type: 'Passive',
        description: 'Involuntary and voluntary listening to surface thoughts of any person or animal within her vicinity.',
        details: 'Gets overwhelmed in huge crowded auditoriums due to mental noise feedback.'
      },
      {
        id: 'waku-waku',
        name: 'Waku-Waku Excitement Surge',
        japaneseName: 'わくわく',
        type: 'Utility',
        description: 'An unstoppable aura of curious energy fueled by spy cartoons, bondman, and snacks.',
        details: 'Boosts party morale by 200%.'
      }
    ],
    specialMoves: [
      {
        id: 'anya-punch',
        name: 'Stella Star Friendship Punch',
        type: 'Physical Strike',
        description: 'A swift retaliatory punch taught through Mama Yor\'s secret training.',
        impact: 'Earns immediate disciplinary demerit Tonitrus bolt'
      }
    ],
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
      adviceTone: 'Super cute, enthusiastic, and curious.',
      voicePitch: 1.35,
      voiceRate: 1.05
    },
    cosplayItems: [
      {
        id: 'anya-item-1',
        name: 'Eden Academy Black Uniform Dress with Gold Embellishments',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 2200,
        notes: 'Pleated skirt dress with gold ornate embroidery along collar and cuffs.'
      },
      {
        id: 'anya-item-2',
        name: 'Signature Conical Hair Ornaments (Chimera Horns)',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 400,
        notes: 'Pair of black cone clips with gold base bands.'
      },
      {
        id: 'anya-item-3',
        name: 'Soft Bubblegum Pink Short Bob Wig',
        category: 'Wig',
        difficulty: 'Easy',
        estimatedPrice: 1200,
        notes: 'Short shoulder-length wig with straight front bangs.'
      },
      {
        id: 'anya-item-4',
        name: 'Director Chimera Plush Doll',
        category: 'Prop',
        difficulty: 'Medium',
        estimatedPrice: 900,
        notes: 'Stuffed plush toy with lion head, snake tail, and felt wings.'
      },
      {
        id: 'anya-item-5',
        name: 'White Knee Socks & Brown Mary Jane Shoes',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 1100,
        notes: 'Clean white ribbed socks with classic buckle shoes.'
      }
    ]
  },
  {
    id: '184000',
    mal_id: 184000,
    name: 'Frieren',
    romanjiName: 'Furīren',
    japaneseName: 'フリーレン',
    series: 'Frieren: Beyond Journey\'s End',
    seriesJapanese: '葬送のフリーレン',
    role: 'Hero Party Mage / Slayer of Demons',
    difficulty: 'Intermediate',
    gender: 'Female',
    popularity: 98,
    tags: ['Elven Mage', 'Frieren', 'Staff', 'Magic', 'Zoltraak', 'Peaceful'],
    description: 'An ancient elven mage who traveled with the Hero Party for a decade, now embarking on a quiet journey across the northern lands to understand human hearts.',
    quote: 'It was only a mere ten years. But it became the decade that changed my lifetime.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b176754-PCnpqIOkjhFk.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b176754-PCnpqIOkjhFk.png',
    accentColor: '#8BC9E8',
    voiceActor: {
      name: 'Atsumi Tanezaki',
      japaneseName: '種﨑 敦美'
    },
    animeInfo: {
      studio: 'Madhouse',
      debutSeason: 'Fall 2023',
      episodes: '28 Episodes',
      status: 'Completed Season 1'
    },
    stats: {
      strength: 60,
      speed: 82,
      technique: 98,
      defense: 94,
      intelligence: 100,
      energy: 99,
      note: 'Mana concealment suppresses 90% of her true reserves continuously'
    },
    abilities: [
      {
        id: 'mana-suppression',
        name: 'Total Mana Concealment',
        japaneseName: '魔力制限',
        type: 'Passive',
        description: 'Suppresses her vast ocean of mana down to a deceptive trickle through a millennium of non-stop discipline.',
        details: 'Baits proud demons into fatal miscalculations.'
      },
      {
        id: 'spell-collection',
        name: 'Folkloric Spell Mastery',
        japaneseName: '民間魔法',
        type: 'Utility',
        description: 'Vast repertoire of quirky magic: turning sweet grapes sour, seeing through clothes, cleaning bronze statues, producing field flowers.',
        details: 'Gifts from centuries of wandering and aiding villagers.'
      }
    ],
    specialMoves: [
      {
        id: 'zoltraak',
        name: 'Ordinary Offensive Magic: Zoltraak',
        type: 'Piercing Magic',
        description: 'Purified and optimized demon-killing piercing beam developed from Qual\'s original soul-track technique.',
        impact: 'Vaporizes demon flesh and shields cleanly'
      }
    ],
    cosplayTips: {
      wigStyling: 'Pale silver-white wig tied in twin low pigtails resting over the front shoulders. Add subtle green-tinted elf ear prosthetics.',
      makeupDetails: 'Large emerald green contacts, delicate clean skin, soft arched eyebrows with calm stoic expression.',
      fabricRecommendations: 'Cream wool capelet with gold buttons, paired with a white tiered tunic and black waist belt.',
      propGuide: 'Her wooden crescent staff with red gem orb and gold metal spiral cage.'
    },
    personality: {
      traits: ['Calm', 'Nostalgic', 'Curious Spell Collector', 'Sleepy Morning Stumbler', 'Deeply Caring'],
      speakingStyle: 'Gentle, introspective, calm cadence with thoughtful pauses and fondness for reminiscing about Himmel.',
      greeting: 'Ah... hello. Have you gathered all the materials for my tunic and staff yet?',
      adviceTone: 'Serene, contemplative, and reassuring.',
      voicePitch: 0.95,
      voiceRate: 0.9
    },
    cosplayItems: [
      {
        id: 'frieren-item-1',
        name: 'Cream & Gold Short Shoulder Capelet',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 1800,
        notes: 'Cream wool/twill capelet lined in black with gold trim and dual button front.'
      },
      {
        id: 'frieren-item-2',
        name: 'White High-Neck Long Sleeve Tunic Dress',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 2000,
        notes: 'Pleated lower hem with gold horizontal stripe and dark waist belt.'
      },
      {
        id: 'frieren-item-3',
        name: 'Twin Low-Pigtail Silver White Wig',
        category: 'Wig',
        difficulty: 'Easy',
        estimatedPrice: 1500,
        notes: 'Long white wig split into front twin tails with soft bangs.'
      },
      {
        id: 'frieren-item-4',
        name: 'Pointed Elven Ear Prosthetics & Red Drop Earrings',
        category: 'Accessories',
        difficulty: 'Medium',
        estimatedPrice: 650,
        notes: 'Soft silicone elf ears attached with spirit gum, accompanied by elongated red drop earrings.'
      },
      {
        id: 'frieren-item-5',
        name: 'Frieren\'s Crescent Wand & Orb Prop Staff',
        category: 'Prop',
        difficulty: 'Hard',
        estimatedPrice: 2800,
        notes: 'Full-length staff with wooden grain shaft and crescent gold head housing translucent ruby sphere.'
      },
      {
        id: 'frieren-item-6',
        name: 'Brown Leather Ankle Boots & Striped Stockings',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 1600,
        notes: 'Comfortable vintage lace-up travel boots.'
      }
    ]
  },
  {
    id: '177997',
    mal_id: 177997,
    name: 'Marin Kitagawa',
    romanjiName: 'Kitagawa Marin',
    japaneseName: '喜多川 海夢',
    series: 'My Dress-Up Darling',
    seriesJapanese: 'その着せ替え人形は恋をする',
    role: 'High School Gyaru & Passionate Cosplayer',
    difficulty: 'Beginner',
    gender: 'Female',
    popularity: 96,
    tags: ['Gyaru', 'My Dress-Up Darling', 'Shizuku-tan', 'Cosplay Queen', 'School Uniform'],
    description: 'An energetic, passionate anime and game enthusiast who unabashedly celebrates her favorite characters and pours her whole heart into cosplay.',
    quote: 'You shouldn\'t go along with someone just to fit in! You should only say you love what you truly love!',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b133676-kV2czE3C8Qls.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b133676-kV2czE3C8Qls.png',
    accentColor: '#FFA0C2',
    voiceActor: {
      name: 'Hina Suguta',
      japaneseName: '直田 姫奈'
    },
    animeInfo: {
      studio: 'CloverWorks',
      debutSeason: 'Winter 2022',
      episodes: '12 Episodes',
      status: 'Season 2 Announced'
    },
    stats: {
      strength: 45,
      speed: 60,
      technique: 88,
      defense: 50,
      intelligence: 75,
      energy: 98,
      note: 'Cosplay passion and enthusiasm ranked at maximum possible tier'
    },
    abilities: [
      {
        id: 'cosplay-obsession',
        name: 'Absolute Character Devotion',
        japaneseName: 'キャラ愛',
        type: 'Passive',
        description: 'Unflinching passion for recreating every tiny stitch, hemline, and eye gradient of characters she adores.',
        details: 'Can research fabric textures and makeup tutorials for 14 hours straight.'
      },
      {
        id: 'gyaru-charm',
        name: 'Radiant Gyaru Energy',
        japaneseName: 'ギャル・バイブス',
        type: 'Utility',
        description: 'Unstoppable positivity that uplifts any hesitant craftsman or friend.',
        details: 'Infuses everyone around her with confidence and creative drive.'
      }
    ],
    specialMoves: [
      {
        id: 'cosplay-reveal',
        name: 'First Fitting Magic Reveal',
        type: 'Transformation',
        description: 'Stepping out from the changing room in a completed outfit with radiant joy.',
        impact: 'Leaves viewers utterly breathless'
      }
    ],
    cosplayTips: {
      wigStyling: 'Long blonde wig with salmon-pink ombré dip-dyed ends. Keep waves loose and natural with light curling wand work.',
      makeupDetails: 'Bright pink or violet contacts, dark eyeliner with winged lashes, gyaru French tip nails, and glossy pink lip gloss.',
      fabricRecommendations: 'White loose-fitting collared button-down shirt paired with blue-grey pleated plaid skirt and loose necktie.',
      propGuide: 'Multiple ear piercings/cuffs, chokers, and a smartphone with cute anime phone charms.'
    },
    personality: {
      traits: ['Super Energetic', 'Honest & Direct', 'Pure-Hearted', 'Cosplay Addict', 'Affectionate'],
      speakingStyle: 'Excited gyaru speech with lots of laughs, exclamation points, and genuine encouragement for crafting.',
      greeting: 'Yaaaaay! Oh my gosh, are you planning a cosplay right now?! Tell me everything, I\'m so hyped!',
      adviceTone: 'Extremely enthusiastic, warm, motivating, and best-friend energy.',
      voicePitch: 1.25,
      voiceRate: 1.1
    },
    cosplayItems: [
      {
        id: 'marin-item-1',
        name: 'Casual School Gyaru Button-Down Shirt & Tie',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 1100,
        notes: 'White oversized collared shirt unbuttoned at collar with loose navy patterned tie.'
      },
      {
        id: 'marin-item-2',
        name: 'Plaid Pleated High-Waist School Skirt',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 900,
        notes: 'Blue-grey windowpane check pleated skirt.'
      },
      {
        id: 'marin-item-3',
        name: 'Blonde to Pink Gradient Ombré Long Wig',
        category: 'Wig',
        difficulty: 'Medium',
        estimatedPrice: 1700,
        notes: 'Warm honey-blonde hair flowing into soft peach-pink dipped ends.'
      },
      {
        id: 'marin-item-4',
        name: 'Multiple Piercing Cuff Set & Choker',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 450,
        notes: 'Silver clip-on ear cuff chain and black lace velvet choker.'
      },
      {
        id: 'marin-item-5',
        name: 'Long Acrylic Press-On Nails Set (Pink French)',
        category: 'Makeup',
        difficulty: 'Easy',
        estimatedPrice: 350,
        notes: 'Salon-style coffin or almond shaped pastel pink press-ons.'
      },
      {
        id: 'marin-item-6',
        name: 'Pink/Violet Color Contact Lenses',
        category: 'Makeup',
        difficulty: 'Medium',
        estimatedPrice: 850,
        notes: 'Vibrant anime dolly eye lenses.'
      }
    ]
  },
  {
    id: '170884',
    mal_id: 170884,
    name: 'Makima',
    romanjiName: 'Makima',
    japaneseName: 'マキマ',
    series: 'Chainsaw Man',
    seriesJapanese: 'チェンソーマン',
    role: 'Public Safety Special Division 4 Leader',
    difficulty: 'Beginner',
    gender: 'Female',
    popularity: 95,
    tags: ['Control Devil', 'Chainsaw Man', 'Public Safety', 'Braid', 'Suit', 'Intimidating'],
    description: 'The enigmatic and commanding head of Public Safety Devil Extermination, possessing chilling control over humans, fiends, and devils alike.',
    quote: 'A necessary evil is always controlled by the state.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b137080-UHcynYNjb5ZU.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b137080-UHcynYNjb5ZU.png',
    accentColor: '#C8A3F2',
    voiceActor: {
      name: 'Tomori Kusunoki',
      japaneseName: '楠木 ともり'
    },
    animeInfo: {
      studio: 'MAPPA',
      debutSeason: 'Fall 2022',
      episodes: '12 Episodes',
      status: 'Movie & Season 2 Confirmed'
    },
    stats: {
      strength: 95,
      speed: 92,
      technique: 96,
      defense: 99,
      intelligence: 99,
      energy: 97,
      note: 'Devil contract grants continuous redirect of fatal trauma'
    },
    abilities: [
      {
        id: 'command-domination',
        name: 'Total Control & Domination',
        japaneseName: '支配の悪魔の力',
        type: 'Special',
        description: 'Ability to command and manipulate anyone or anything she perceives as lesser or inferior to herself.',
        details: 'Can borrow senses of birds, rats, and insects globally.'
      },
      {
        id: 'bang-force',
        name: 'Compressive Kinetic Blast ("Bang")',
        japaneseName: '見えない圧縮打撃',
        type: 'Offensive',
        description: 'Points finger like a pistol and releases invisible crushing force capable of blasting targets into the upper atmosphere.',
        details: 'Unmatched speed with no casting delay.'
      }
    ],
    specialMoves: [
      {
        id: 'shrine-ritual',
        name: 'Remote High-Altitude Crushing Ritual',
        type: 'Remote Execution',
        description: 'Squashes distant targets using blood sacrifices and blindfolded mediums from sacred shrines.',
        impact: 'Instantaneous spatial collapse on victim'
      }
    ],
    cosplayTips: {
      wigStyling: 'Warm reddish-auburn hair woven into a thick low French braid over the back, with fringe bangs framing the forehead and temple strands.',
      makeupDetails: 'Ringed yellow-gold concentric circle contact lenses (spiral pattern), crisp neutral contour, and faint coral lip.',
      fabricRecommendations: 'Crisp white collared dress shirt, slender matte black tie, tailored black trousers, and heavy wool long black trench coat.',
      propGuide: 'Red tie clip, Public Safety badge lanyard, or cup of coffee.'
    },
    personality: {
      traits: ['Chillingly Calm', 'Polite', 'Authoritative', 'Manipulative', 'Impassive'],
      speakingStyle: 'Soft-spoken, measured, extremely polite, commanding undivided obedience with a faint smile.',
      greeting: 'Good evening. Have you made steady progress on our organization\'s attire?',
      adviceTone: 'Composed, authoritative, and chillingly elegant.',
      voicePitch: 0.98,
      voiceRate: 0.88
    },
    cosplayItems: [
      {
        id: 'makima-item-1',
        name: 'Tailored Public Safety Black Suit & Slacks',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 2600,
        notes: 'Crisp two-piece matte black suit with slim silhouette.'
      },
      {
        id: 'makima-item-2',
        name: 'Crisp White Button-Down Shirt & Skinny Black Tie',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 950,
        notes: 'Stiff-collared formal shirt.'
      },
      {
        id: 'makima-item-3',
        name: 'Floor-Length Heavy Black Trench Coat',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 3200,
        notes: 'Drape over shoulders like a cape for maximum presence!'
      },
      {
        id: 'makima-item-4',
        name: 'Auburn-Red Braid Styled Wig',
        category: 'Wig',
        difficulty: 'Medium',
        estimatedPrice: 1500,
        notes: 'Thick reddish-orange braid with parted fringe.'
      },
      {
        id: 'makima-item-5',
        name: 'Yellow Concentric Ring Eye Contacts',
        category: 'Makeup',
        difficulty: 'Medium',
        estimatedPrice: 950,
        notes: 'Signature hypnotic spiral iris design.'
      },
      {
        id: 'makima-item-6',
        name: 'Black Leather Dress Shoes / Pumps',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 1500,
        notes: 'Polished black formal footwear.'
      }
    ]
  },
  {
    id: '146156',
    mal_id: 146156,
    name: 'Tanjiro Kamado',
    romanjiName: 'Kamado Tanjirō',
    japaneseName: '竈門 炭治郎',
    series: 'Demon Slayer: Kimetsu no Yaiba',
    seriesJapanese: '鬼滅の刃',
    role: 'Demon Slayer Corps Swordsman (Sun Breathing)',
    difficulty: 'Advanced',
    gender: 'Male',
    popularity: 97,
    tags: ['Demon Slayer', 'Sun Breathing', 'Nichirin Sword', 'Hanafuda', 'Checkered Haori'],
    description: 'A kind-hearted boy with an unyielding sense of justice who became a demon slayer to turn his demonized sister Nezuko back into a human.',
    quote: 'Never give up! Even when it hurts, keep moving forward and burn your heart with conviction!',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b126071-BTNEc1nRIv68.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b126071-BTNEc1nRIv68.png',
    accentColor: '#56B0DC',
    voiceActor: {
      name: 'Natsuki Hanae',
      japaneseName: '花江 夏樹'
    },
    animeInfo: {
      studio: 'ufotable',
      debutSeason: 'Spring 2019',
      episodes: '55+ Episodes',
      status: 'Infinity Castle Trilogy Pending'
    },
    stats: {
      strength: 92,
      speed: 94,
      technique: 96,
      defense: 89,
      intelligence: 88,
      energy: 97,
      note: 'Mastery of Water Breathing and ancestral Hinokami Kagura'
    },
    abilities: [
      {
        id: 'hinokami-kagura',
        name: 'Hinokami Kagura (Sun Breathing)',
        japaneseName: 'ヒノカミ神楽',
        type: 'Offensive',
        description: 'The primordial breathing style passed down through the Kamado family dance, incinerating demon regenerative cells with sun flame.',
        details: 'Extremely taxing on stamina and blood vessels.'
      },
      {
        id: 'olfactory-perception',
        name: 'Superhuman Sense of Smell',
        japaneseName: '超嗅覚・隙の糸',
        type: 'Utility',
        description: 'Can smell human emotions, demon presence miles away, and see the metaphysical "opening thread" for decisive sword strikes.',
        details: 'Guides his blade straight to vulnerability.'
      }
    ],
    specialMoves: [
      {
        id: 'sun-dragon-halo',
        name: 'Dragon Sun Halo Head Dance',
        type: 'Finishing Kata',
        description: 'Unleashes a spiraling flame dragon cutting through multiple targets consecutively without pause.',
        impact: 'Simultaneous decapitation of higher demons'
      }
    ],
    cosplayTips: {
      wigStyling: 'Dark burgundy spiky hair slicked up away from the forehead revealing his scar on the upper-left forehead.',
      makeupDetails: 'Paint the flame demon slayer scar over the left temple using transfer paper or water-activated makeup, with deep crimson eyes.',
      fabricRecommendations: 'Green and black checkered print haori coat made of heavy cotton twill over standard black gakuran uniform.',
      propGuide: 'Black Nichirin katana with sun flame tsuba guard and wooden Nezuko backpack box.'
    },
    personality: {
      traits: ['Deeply Compassionate', 'Resilient', 'Polite', 'Hardworking', 'Inspiring'],
      speakingStyle: 'Earnest, respectful, passionate, and always encouraging hard work and perseverance.',
      greeting: 'Hello there! Let\'s do our absolute best together on this cosplay project!',
      adviceTone: 'Empowering, respectful, and full of heartfelt encouragement.',
      voicePitch: 1.0,
      voiceRate: 1.0
    },
    cosplayItems: [
      {
        id: 'tanjiro-item-1',
        name: 'Green & Black Checkered Haori Coat',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 1600,
        notes: 'Classic geometric check pattern haori with wide sleeves.'
      },
      {
        id: 'tanjiro-item-2',
        name: 'Demon Slayer Corps Uniform (Gakuran Jacket & Hakama Pants)',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 2400,
        notes: 'White belt, calf leg wraps (kyahan), and silver back kanji "Metsu".'
      },
      {
        id: 'tanjiro-item-3',
        name: 'Spiky Burgundy-Tipped Slicked-Back Wig',
        category: 'Wig',
        difficulty: 'Medium',
        estimatedPrice: 1500,
        notes: 'Black base with dark crimson tips pushed up from hairline.'
      },
      {
        id: 'tanjiro-item-4',
        name: 'Hanafuda Sun Motif Earrings',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 350,
        notes: 'Rectangular white drop earrings with rising red sun and mountain lines.'
      },
      {
        id: 'tanjiro-item-5',
        name: 'Black Blade Nichirin Katana with Flame Guard',
        category: 'Prop',
        difficulty: 'Hard',
        estimatedPrice: 2200,
        notes: 'Con-safe wooden/foam katana with black blade and circular sun tsuba.'
      },
      {
        id: 'tanjiro-item-6',
        name: 'Forehead Flame Mark Tattoo / Makeup Template',
        category: 'Makeup',
        difficulty: 'Easy',
        estimatedPrice: 250,
        notes: 'Waterproof temporary tattoo transfer or template.'
      },
      {
        id: 'tanjiro-item-7',
        name: 'Zori Sandals & White Tabi Socks with Cyan Straps',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 900,
        notes: 'Traditional strapped sandals with padded insole.'
      }
    ]
  },
  {
    id: '164473',
    mal_id: 164473,
    name: 'Megumi Fushiguro',
    romanjiName: 'Fushiguro Megumi',
    japaneseName: '伏黒 恵',
    series: 'Jujutsu Kaisen',
    seriesJapanese: '呪術廻戦',
    role: 'Grade 2 Jujutsu Sorcerer & Zenin Clan Prodigy',
    difficulty: 'Intermediate',
    gender: 'Male',
    popularity: 94,
    tags: ['Sorcerer', 'Jujutsu Kaisen', 'Ten Shadows', 'Shadow Puppets', 'Stoic'],
    description: 'A level-headed first-year sorcerer at Tokyo Jujutsu High who commands the Zenin clan\'s hereditary Ten Shadows Technique through shadow puppets.',
    quote: 'I have no intention of risking my life to save someone who I had no intention of saving.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b127692-a1bJzGj72jU1.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b127692-a1bJzGj72jU1.png',
    accentColor: '#56B0DC',
    voiceActor: {
      name: 'Yuma Uchida',
      japaneseName: '内田 雄馬'
    },
    animeInfo: {
      studio: 'MAPPA',
      debutSeason: 'Fall 2020',
      episodes: '47+ Episodes',
      status: 'Ongoing'
    },
    stats: {
      strength: 84,
      speed: 88,
      technique: 95,
      defense: 86,
      intelligence: 93,
      energy: 90,
      note: 'Analytical tactical prowess and shadow manipulation mastery'
    },
    abilities: [
      {
        id: 'ten-shadows',
        name: 'Ten Shadows Technique (Tokusa no Kagebōshi)',
        japaneseName: '十種影法術',
        type: 'Utility',
        description: 'Summons various powerful shikigami familiars using hand shadow silhouettes and can sink into or travel through liquid shadows.',
        details: 'Can store physical weapons inside his personal shadow.'
      },
      {
        id: 'divine-dog',
        name: 'Divine Dog: Totality (Gyokuken: Kai)',
        japaneseName: '玉犬「渾」',
        type: 'Offensive',
        description: 'A formidable wolf shikigami that inherits the deceased twin\'s strength and sharp claws.',
        details: 'Capable of lacerating Special Grade cursed spirits.'
      }
    ],
    specialMoves: [
      {
        id: 'chimera-shadow-garden',
        name: 'Domain Expansion: Chimera Shadow Garden',
        type: 'Domain Expansion',
        description: 'Floods the entire domain ground with thick shadow liquid allowing simultaneous boundless shikigami clones.',
        impact: 'Overwhelms opposition with unpredictable multi-directional assaults'
      }
    ],
    cosplayTips: {
      wigStyling: 'Messy sea-urchin spiky jet-black wig with outward pointing spikes and softer bangs framing his dark eyes.',
      makeupDetails: 'Fair complexion, dark expressive eyebrows, slight contour on bridge of nose, and neutral lip tone.',
      fabricRecommendations: 'Dark navy or black twill Tokyo Jujutsu High gakuran uniform jacket with golden swirl button and straight dark trousers.',
      propGuide: 'Small black wolf paw shadow puppet prop or wooden tonfa blades.'
    },
    personality: {
      traits: ['Stoic', 'Thoughtful', 'Quietly Caring', 'Practical', 'Protective'],
      speakingStyle: 'Calm, brief, straightforward, slightly weary of Gojo\'s antics, but deeply loyal to allies.',
      greeting: '...What is it? If you\'re planning my uniform, make sure the shadow pockets are practical.',
      adviceTone: 'Pragmatic, reserved, but dependable.',
      voicePitch: 0.9,
      voiceRate: 0.95
    },
    cosplayItems: [
      {
        id: 'megumi-item-1',
        name: 'Tokyo Jujutsu High Dark Navy Uniform Gakuran',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 2200,
        notes: 'High stand collar with golden swirl button on the left shoulder lapel.'
      },
      {
        id: 'megumi-item-2',
        name: 'Matching Straight Slacks',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 1100,
        notes: 'Standard tailored dark navy uniform pants.'
      },
      {
        id: 'megumi-item-3',
        name: 'Jet Black Sea-Urchin Spiky Wig',
        category: 'Wig',
        difficulty: 'Medium',
        estimatedPrice: 1600,
        notes: 'Multi-directional textured spiky black wig.'
      },
      {
        id: 'megumi-item-4',
        name: 'Dark Brown / Black High Boots',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 1500,
        notes: 'Rugged ankle or mid-calf combat boots.'
      },
      {
        id: 'megumi-item-5',
        name: 'Gold Swirl Jujutsu High Button Pin',
        category: 'Accessories',
        difficulty: 'Easy',
        estimatedPrice: 350,
        notes: 'Embossed spiral metal uniform button.'
      }
    ]
  },
  {
    id: '184001',
    mal_id: 184001,
    name: 'Fern',
    romanjiName: 'Fēn',
    japaneseName: 'フェルン',
    series: 'Frieren: Beyond Journey\'s End',
    seriesJapanese: '葬送のフリーレン',
    role: 'First-Class Human Mage & Frieren\'s Apprentice',
    difficulty: 'Intermediate',
    gender: 'Female',
    popularity: 96,
    tags: ['First-Class Mage', 'Frieren', 'Staff', 'Purple Hair', 'Zoltraak', 'Rapid Fire'],
    description: 'An exceptionally gifted human mage taken in and trained by Frieren, known for her astonishingly rapid spellcasting speed and mature demeanor.',
    quote: 'Mr. Stark is being ridiculous again... But we must keep moving forward.',
    image: 'https://s4.anilist.co/file/anilistcdn/character/large/b176755-fQ1pM4l92D6p.png',
    backgroundImage: 'https://s4.anilist.co/file/anilistcdn/character/large/b176755-fQ1pM4l92D6p.png',
    accentColor: '#AC7DE8',
    voiceActor: {
      name: 'Kana Ichinose',
      japaneseName: '市ノ瀬 加那'
    },
    animeInfo: {
      studio: 'Madhouse',
      debutSeason: 'Fall 2023',
      episodes: '28 Episodes',
      status: 'Completed Season 1'
    },
    stats: {
      strength: 55,
      speed: 90,
      technique: 97,
      defense: 92,
      intelligence: 94,
      energy: 95,
      note: 'Fastest Zoltraak rapid-fire incantation speed of the modern mage era'
    },
    abilities: [
      {
        id: 'rapid-zoltraak',
        name: 'Hyper-Accelerated Zoltraak Rapid Fire',
        japaneseName: '高速連射魔法',
        type: 'Offensive',
        description: 'Fires ordinary offensive magic Zoltraak with microscopic intervals, overpowering defensive shields through sheer saturation.',
        details: 'Cast without any visible windup or extraneous movement.'
      },
      {
        id: 'mana-radar',
        name: 'Sub-Conscious Mana Detection',
        japaneseName: '魔力探知',
        type: 'Passive',
        description: 'Trained by Frieren since childhood to notice even the faint flutter of concealed mana in dense forests.',
        details: 'Immune to surprise ambushes by beasts and demons.'
      }
    ],
    specialMoves: [
      {
        id: 'shield-overdrive',
        name: 'Hexagonal Defensive Field (Barriér)',
        type: 'Defensive',
        description: 'Summons multi-layered shimmering hexagonal barriers absorbing massive kinetic and magical blasts.',
        impact: 'Withstands high-tier barrage'
      }
    ],
    cosplayTips: {
      wigStyling: 'Deep violet-purple straight long wig with blunt straight bangs and low twin ties or free-flowing hair reaching mid-back.',
      makeupDetails: 'Dark purple contacts, gentle doll-like eye shape, calm pouty lip tint, and soft blush.',
      fabricRecommendations: 'Pure white ankle-length flowing dress with black buttons, layered beneath a deep navy-black long overcoat/robe with white lapel cuffs.',
      propGuide: 'Tall dark brown wooden mage staff topped with a spiraled bird/crescent finial.'
    },
    personality: {
      traits: ['Mature', 'Pouty', 'Disciplined', 'Compassionate', 'Sensible'],
      speakingStyle: 'Very polite, composed, slightly deadpan when discussing Stark or Frieren\'s sleeping habits, warm and dependable.',
      greeting: 'Mistress Frieren is still sleeping... Shall we review our travel supplies and outfit preparation?',
      adviceTone: 'Sensible, orderly, and deeply supportive.',
      voicePitch: 1.05,
      voiceRate: 0.95
    },
    cosplayItems: [
      {
        id: 'fern-item-1',
        name: 'Deep Navy Long Mage Robe / Overcoat',
        category: 'Garment',
        difficulty: 'Medium',
        estimatedPrice: 2800,
        notes: 'Floor-length heavy tailored coat with wide cuffs and lapel.'
      },
      {
        id: 'fern-item-2',
        name: 'High-Neck White Layered Dress',
        category: 'Garment',
        difficulty: 'Easy',
        estimatedPrice: 1900,
        notes: 'High-collar modest pleated maxi dress with button front.'
      },
      {
        id: 'fern-item-3',
        name: 'Straight Deep Violet / Plum Long Wig',
        category: 'Wig',
        difficulty: 'Easy',
        estimatedPrice: 1600,
        notes: 'Straight purple wig with smooth fringe bangs.'
      },
      {
        id: 'fern-item-4',
        name: 'Fern\'s Carved Wooden Mage Staff',
        category: 'Prop',
        difficulty: 'Hard',
        estimatedPrice: 2600,
        notes: 'Dark carved wooden wand with curling floral finial.'
      },
      {
        id: 'fern-item-5',
        name: 'Deep Violet Contact Lenses',
        category: 'Makeup',
        difficulty: 'Medium',
        estimatedPrice: 850,
        notes: 'Subtle anime purple circle lenses.'
      },
      {
        id: 'fern-item-6',
        name: 'Dark Brown Walking Boots',
        category: 'Footwear',
        difficulty: 'Easy',
        estimatedPrice: 1500,
        notes: 'Comfortable flat leather travel boots.'
      }
    ]
  }
];

export const DIFFICULTY_COLORS = {
  Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200',
  Master: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const STATUS_COLORS = {
  Missing: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800',
    iconColor: 'text-rose-500'
  },
  'In Progress': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    iconColor: 'text-amber-500'
  },
  Acquired: {
    bg: 'bg-lavender-50',
    text: 'text-lavender-700',
    border: 'border-lavender-200',
    badge: 'bg-lavender-100 text-lavender-800',
    iconColor: 'text-lavender-500'
  },
  Completed: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    iconColor: 'text-emerald-500'
  }
};

