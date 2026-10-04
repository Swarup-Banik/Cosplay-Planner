export interface CommunityPost {
  id: string;
  author: string;
  handle: string;
  characterName: string;
  series: string;
  avatar: string;
  image: string;
  likes: number;
  tags: string[];
  caption: string;
  craftingTip: string;
  materialsUsed: string[];
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'SakuraCrafts',
    handle: '@sakura_cos',
    characterName: 'Yor Forger (Thorn Princess)',
    series: 'Spy × Family',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    likes: 842,
    tags: ['ThornPrincess', 'SpyxFamily', 'GoldenStilettos', 'HandmadeDresses'],
    caption: 'Finally debuted Thorn Princess at Comic Con! Lined the inside skirt slit with custom crimson floral silk. The golden stilettos are 100% con safe EVA foam!',
    craftingTip: 'For the golden headband, use thick aluminum craft wire as an internal spine inside high-density foam roses so it conforms to your head shape without sliding down.',
    materialsUsed: ['Matte Black Scuba Knit', 'Rose Jacquard Silk', 'EVA Foam 10mm & 5mm', 'Gold Leaf Spray']
  },
  {
    id: 'post-2',
    author: 'Ren Sorcery',
    handle: '@ren_jujutsu',
    characterName: 'Gojo Satoru',
    series: 'Jujutsu Kaisen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    likes: 1205,
    tags: ['GojoSatoru', 'JJK', 'SixEyes', 'WigStyling'],
    caption: 'Spend 9 hours crimping and teasing this white wig root-by-root. It survived high wind and humidity during our sunset photoshoot!',
    craftingTip: 'To see through Gojo\'s blindfold comfortably, use two layers of black power-mesh fabric stitched together. Completely opaque from outside, but transparent from within!',
    materialsUsed: ['Heat Resistant White Wig', 'Heavy Twill Suiting Fabric', 'Breathable Power Mesh', 'got2b Freeze Spray']
  },
  {
    id: 'post-3',
    author: 'Lumi Magic',
    handle: '@lumi_cos',
    characterName: 'Frieren',
    series: 'Frieren: Beyond Journey\'s End',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    likes: 960,
    tags: ['Frieren', 'StaffCrafting', 'ElvenMage', 'Madhouse'],
    caption: 'Frieren\'s journey across the world begins here. The staff took 3 weeks of hand carving and the orb glows with an internal LED circuit!',
    craftingTip: 'For the glowing orb in Frieren\'s staff, use a hollow clear acrylic fillable ornament sphere, frost the interior with matte glass spray, and insert a 5V warm amber coin-cell LED.',
    materialsUsed: ['Pine Wood Dowel', 'Clear Acrylic 80mm Bauble', 'Coin Cell LED Circuit', 'Cream Wool Blend']
  },
  {
    id: 'post-4',
    author: 'Chii Cos',
    handle: '@chii_crafts',
    characterName: 'Marin Kitagawa',
    series: 'My Dress-Up Darling',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    likes: 1420,
    tags: ['MarinKitagawa', 'MyDressUpDarling', 'GyaruStyle', 'OmbreHair'],
    caption: 'Marin was the character that inspired me to pick up a sewing needle for the first time. Keep loving what you love without fear!!',
    craftingTip: 'To achieve Marin\'s peach-pink ombre hair tips, dip-dye the lower 6 inches of a platinum blonde synthetic wig in Rit DyeMore Synthetic (Super Pink) in warm water (60°C) for 45 seconds.',
    materialsUsed: ['Platinum Blonde Long Wig', 'Rit DyeMore Synthetic Pink', 'Plaid Tartan Suiting', 'Dolly Eye Violet Lenses']
  }
];
