import { getTopCharacters } from './jikan';
import { adaptJikanCharacterToApp } from '../utils/characterAdapter';
import { INITIAL_CHARACTERS } from '../data/characters';
import { Character } from '../types';

/**
 * Fetches trending characters from Jikan top characters with a seamless
 * fallback to initial curated characters.
 */
export async function getTrendingCharacters(limit: number = 12): Promise<Character[]> {
  try {
    const res = await getTopCharacters(1, limit);
    if (res && res.data && res.data.length > 0) {
      return res.data.map(c => adaptJikanCharacterToApp(c));
    }
  } catch (err) {
    console.warn('[Trending Service] Failed to fetch live trending, falling back to quick-picks:', err);
  }
  return INITIAL_CHARACTERS.slice(0, limit);
}
