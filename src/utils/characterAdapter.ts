import { JikanCharacter } from '../services/jikan';
import { Character, AnimeAppearance, MangaAppearance, CharacterVoiceActor } from '../types';
import { getOrCreateCosplayTemplate } from '../data/cosplayTemplates';

/**
 * Transforms a raw Jikan API character response into the application's Character model,
 * marrying real MyAnimeList character data with our Cosplay Planner knowledge base.
 */
export function adaptJikanCharacterToApp(jikanChar: JikanCharacter): Character {
  const malId = jikanChar.mal_id;
  const name = jikanChar.name;
  
  // Extract primary anime series
  let primarySeries = 'Anime Series';
  const animeAppearances: AnimeAppearance[] = [];
  
  if (jikanChar.anime && jikanChar.anime.length > 0) {
    primarySeries = jikanChar.anime[0].anime.title;
    for (const item of jikanChar.anime) {
      animeAppearances.push({
        mal_id: item.anime.mal_id,
        title: item.anime.title,
        role: item.role,
        image: item.anime.images?.jpg?.large_image_url || item.anime.images?.jpg?.image_url
      });
    }
  }

  // Extract manga appearances
  const mangaAppearances: MangaAppearance[] = [];
  if (jikanChar.manga && jikanChar.manga.length > 0) {
    for (const item of jikanChar.manga) {
      mangaAppearances.push({
        mal_id: item.manga.mal_id,
        title: item.manga.title,
        role: item.role
      });
    }
  }

  // Extract voice actors (filter for Japanese and primary languages)
  const voiceActors: CharacterVoiceActor[] = [];
  if (jikanChar.voices && jikanChar.voices.length > 0) {
    for (const v of jikanChar.voices) {
      voiceActors.push({
        name: v.person.name,
        language: v.language,
        image: v.person.images?.jpg?.image_url
      });
    }
  }

  // Primary image strictly from the character's API data
  const mainImage =
    jikanChar.images?.jpg?.large_image_url ||
    jikanChar.images?.jpg?.image_url ||
    jikanChar.images?.webp?.large_image_url ||
    jikanChar.images?.webp?.image_url ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80';

  // Get or generate tailored cosplay template
  const template = getOrCreateCosplayTemplate(name, primarySeries, jikanChar.about);

  // Clean description
  const cleanDescription = (jikanChar.about || `${name} is a featured character in ${primarySeries}.`).trim();

  // Create tags
  const tags: string[] = [primarySeries];
  if (jikanChar.nicknames && jikanChar.nicknames.length > 0) {
    tags.push(...jikanChar.nicknames.slice(0, 3));
  }
  tags.push(template.difficulty);

  const primaryVoiceActor = voiceActors.find(v => v.language.toLowerCase().includes('japanese')) || voiceActors[0];

  return {
    id: String(malId),
    mal_id: malId,
    name,
    romanjiName: name,
    japaneseName: jikanChar.name_kanji,
    nicknames: jikanChar.nicknames || [],
    series: primarySeries,
    role: animeAppearances[0]?.role ? `${animeAppearances[0].role} Character` : 'Main Cast',
    difficulty: template.difficulty,
    popularity: jikanChar.favorites ? Math.min(99, Math.max(70, Math.round(jikanChar.favorites / 1000))) : 88,
    tags,
    description: cleanDescription,
    image: mainImage,
    backgroundImage: mainImage,
    pictures: jikanChar.pictures && jikanChar.pictures.length > 0 ? jikanChar.pictures : [mainImage],
    url: jikanChar.url,
    accentColor: template.accentColor || '#905CD9',
    animeAppearances,
    mangaAppearances,
    voiceActors,
    voiceActor: primaryVoiceActor ? { name: primaryVoiceActor.name } : undefined,
    animeInfo: {
      studio: 'Official Animation Studio',
      debutSeason: 'Anime Series',
      episodes: 'Television Series',
      status: 'Aired'
    },
    cosplayTips: template.cosplayTips,
    personality: {
      ...template.personality,
      voicePitch: 1.0,
      voiceRate: 1.0
    },
    cosplayItems: template.items.map((it, idx) => ({
      id: `item-${malId}-${idx}`,
      name: it.name,
      category: it.category,
      difficulty: idx % 2 === 0 ? 'Medium' : 'Easy',
      estimatedPrice: it.estimatedPrice,
      notes: it.notes,
      diyTips: it.diyTips
    }))
  };
}
