/**
 * Jikan API Service
 * Unofficial MyAnimeList REST API Client (https://docs.api.jikan.moe/)
 * With caching, rate limiting, and resilient fallback to public Anime GraphQL API.
 */

export interface JikanImageVariant {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface JikanCharacterImage {
  jpg: JikanImageVariant;
  webp?: JikanImageVariant;
}

export interface JikanAnimeAppearance {
  role: string;
  anime: {
    mal_id: number;
    url: string;
    images: {
      jpg: JikanImageVariant;
      webp?: JikanImageVariant;
    };
    title: string;
  };
}

export interface JikanMangaAppearance {
  role: string;
  manga: {
    mal_id: number;
    url: string;
    images: {
      jpg: JikanImageVariant;
    };
    title: string;
  };
}

export interface JikanVoiceActor {
  language: string;
  person: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
  };
}

export interface JikanCharacter {
  mal_id: number;
  url: string;
  images: JikanCharacterImage;
  name: string;
  name_kanji?: string;
  nicknames: string[];
  favorites?: number;
  about?: string;
  anime?: JikanAnimeAppearance[];
  manga?: JikanMangaAppearance[];
  voices?: JikanVoiceActor[];
  pictures?: string[];
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanSearchResult {
  data: JikanCharacter[];
  pagination?: JikanPagination;
  source: 'jikan' | 'cached' | 'fallback';
  error?: string;
}

// In-Memory and Session Storage Cache with Versioning and TTL
const CACHE_VERSION = 'v4_';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
const cache = new Map<string, { timestamp: number; data: any }>();

function getCached<T>(key: string): T | null {
  const versionedKey = `${CACHE_VERSION}${key}`;
  const mem = cache.get(versionedKey);
  if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
    // Never return empty results or error payloads from cache
    if (mem.data && (!Array.isArray(mem.data.data) || mem.data.data.length > 0)) {
      return mem.data as T;
    }
  }
  try {
    const raw = sessionStorage.getItem(`jikan_cache_${versionedKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        if (parsed.data && (!Array.isArray(parsed.data.data) || parsed.data.data.length > 0)) {
          cache.set(versionedKey, parsed);
          return parsed.data as T;
        }
      }
    }
  } catch {}
  return null;
}

function setCache<T>(key: string, data: T): void {
  // Defensive cache hygiene: never store empty result sets or error envelopes
  if (!data) return;
  const dAny = data as any;
  if (dAny.error && (!dAny.data || dAny.data.length === 0)) return;
  if (Array.isArray(dAny.data) && dAny.data.length === 0) return;

  const versionedKey = `${CACHE_VERSION}${key}`;
  const item = { timestamp: Date.now(), data };
  cache.set(versionedKey, item);
  try {
    sessionStorage.setItem(`jikan_cache_${versionedKey}`, JSON.stringify(item));
  } catch {}
}

/**
 * Resilient fetch wrapper with hard AbortController timeout.
 * Prevents requests from hanging indefinitely on Cloudflare/Jikan 504 stalls.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 7000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let combinedSignal = controller.signal;
  if (options.signal) {
    if (options.signal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        controller.abort();
      });
    }
  }

  try {
    const res = await fetch(url, { ...options, signal: combinedSignal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Strictly serialized Request Throttler (respects Jikan rate limit without burst concurrency)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 350;
let throttleChain: Promise<void> = Promise.resolve();

function throttleRequest(): Promise<void> {
  throttleChain = throttleChain.then(async () => {
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;
    if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
      await new Promise(res => setTimeout(res, MIN_REQUEST_INTERVAL_MS - timeSinceLast));
    }
    lastRequestTime = Date.now();
  });
  return throttleChain;
}

// Request Priority and Prefetch Management
let searchInProgress = false;
let activePrefetchCount = 0;
const MAX_CONCURRENT_PREFETCH = 2;
const activePrefetchControllers = new Set<AbortController>();

export function isSearchActive(): boolean {
  return searchInProgress;
}

function cancelActivePrefetches(): void {
  for (const c of activePrefetchControllers) {
    try {
      c.abort();
    } catch {}
  }
  activePrefetchControllers.clear();
  activePrefetchCount = 0;
}

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Searches characters via Jikan MyAnimeList API.
 * High-priority operation: cancels low-priority background prefetches,
 * uses a strict ~3.5s timeout on Jikan, and instantly falls back to AniList
 * so the user never waits on connection hangs or 429/504 errors.
 */
export async function searchCharacters(
  query: string,
  page: number = 1,
  limit: number = 15
): Promise<JikanSearchResult> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return { data: [], source: 'cached' };
  }

  const cacheKey = `search_${cleanQuery.toLowerCase()}_p${page}_l${limit}`;
  const cached = getCached<JikanSearchResult>(cacheKey);
  if (cached) {
    return { ...cached, source: 'cached' };
  }

  searchInProgress = true;
  cancelActivePrefetches();

  try {
    // 1. Try Jikan API with quick 3.5s timeout
    try {
      await throttleRequest();
      const url = `${JIKAN_BASE_URL}/characters?q=${encodeURIComponent(cleanQuery)}&page=${page}&limit=${limit}&order_by=favorites&sort=desc`;
      const res = await fetchWithTimeout(url, {}, 3500);

      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          const result: JikanSearchResult = {
            data: json.data,
            pagination: json.pagination,
            source: 'jikan'
          };
          setCache(cacheKey, result);
          return result;
        }
      } else if (res.status === 429) {
        console.warn('[Jikan API] Rate limited (429), switching to anime fallback provider');
      } else {
        console.warn(`[Jikan API] Status ${res.status}, falling back to anime database provider`);
      }
    } catch (err) {
      console.warn('[Jikan API] Connection timeout or network error, falling back to anime database provider', err);
    }

    // 2. Resilient Fallback to AniList GraphQL (official MAL-compatible anime characters & artwork)
    try {
      const fallbackData = await searchCharactersFromAnimeDB(cleanQuery, page, limit);
      const result: JikanSearchResult = {
        data: fallbackData.characters,
        pagination: fallbackData.pagination,
        source: 'fallback'
      };
      if (result.data.length > 0) {
        setCache(cacheKey, result);
      }
      return result;
    } catch (err: any) {
      console.error('All character search providers failed', err);
      return {
        data: [],
        source: 'fallback',
        error: 'Character database is temporarily unavailable. Please try again shortly.'
      };
    }
  } finally {
    searchInProgress = false;
  }
}

/**
 * Fetches full character profile including biography, anime appearances, and voice actors.
 * Supports low-priority mode for background hover prefetches.
 */
export async function getCharacterFull(
  id: number,
  priority: 'high' | 'low' = 'high'
): Promise<{ data: JikanCharacter | null; error?: string }> {
  const cacheKey = `char_full_${id}`;
  const cached = getCached<JikanCharacter>(cacheKey);
  if (cached) {
    return { data: cached };
  }

  // If low priority prefetch and search is running or max prefetch reached, skip
  if (priority === 'low') {
    if (searchInProgress || activePrefetchCount >= MAX_CONCURRENT_PREFETCH) {
      return { data: null };
    }
  }

  const prefetchController = new AbortController();
  if (priority === 'low') {
    activePrefetchCount++;
    activePrefetchControllers.add(prefetchController);
  }

  try {
    // 1. Try Jikan Full Character Endpoint
    try {
      await throttleRequest();
      const res = await fetchWithTimeout(
        `${JIKAN_BASE_URL}/characters/${id}/full`,
        { signal: prefetchController.signal },
        priority === 'low' ? 3000 : 5000
      );
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setCache(cacheKey, json.data);
          return { data: json.data };
        }
      }
    } catch (e) {
      // Jikan failure - fallback to Anime DB below
    }

    // 2. Fallback to Anime DB
    try {
      const char = await getCharacterFromAnimeDB(id, prefetchController.signal);
      if (char) {
        setCache(cacheKey, char);
        return { data: char };
      }
    } catch (e) {
      console.error('[Anime DB] getCharacterFromAnimeDB failed', e);
    }

    return {
      data: null,
      error: 'Character details could not be loaded at this time.'
    };
  } finally {
    if (priority === 'low') {
      activePrefetchCount = Math.max(0, activePrefetchCount - 1);
      activePrefetchControllers.delete(prefetchController);
    }
  }
}

/**
 * Fetches additional character picture gallery.
 */
export async function getCharacterPictures(id: number): Promise<string[]> {
  const cacheKey = `char_pics_${id}`;
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  try {
    await throttleRequest();
    const res = await fetchWithTimeout(`${JIKAN_BASE_URL}/characters/${id}/pictures`, {}, 4000);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        const urls = json.data.map((p: any) => p.jpg?.image_url || p.webp?.image_url).filter(Boolean);
        if (urls.length > 0) {
          setCache(cacheKey, urls);
        }
        return urls;
      }
    }
  } catch {}

  return [];
}

/**
 * Fetches top popular characters for the landing/discovery page.
 */
export async function getTopCharacters(page: number = 1, limit: number = 12): Promise<JikanSearchResult> {
  const cacheKey = `top_characters_p${page}_l${limit}`;
  const cached = getCached<JikanSearchResult>(cacheKey);
  if (cached) return { ...cached, source: 'cached' };

  try {
    await throttleRequest();
    const res = await fetchWithTimeout(`${JIKAN_BASE_URL}/top/characters?page=${page}&limit=${limit}`, {}, 4000);
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        const result: JikanSearchResult = {
          data: json.data,
          pagination: json.pagination,
          source: 'jikan'
        };
        setCache(cacheKey, result);
        return result;
      }
    }
  } catch {}

  // Fallback to top characters via anime DB
  try {
    const fallback = await getTopCharactersFromAnimeDB(page, limit);
    const result: JikanSearchResult = {
      data: fallback,
      source: 'fallback'
    };
    if (result.data.length > 0) {
      setCache(cacheKey, result);
    }
    return result;
  } catch {
    return { data: [], source: 'fallback', error: 'Could not load trending characters' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Resilient Fallback Provider (AniList GraphQL)
// Maps live anime character data cleanly into identical JikanCharacter objects
// ─────────────────────────────────────────────────────────────────────────────

async function searchCharactersFromAnimeDB(
  query: string,
  page: number,
  perPage: number
): Promise<{ characters: JikanCharacter[]; pagination: JikanPagination }> {
  const cleanQuery = query.trim();
  const qLower = cleanQuery.toLowerCase();

  const charGql = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        characters(search: $search, sort: [FAVOURITES_DESC]) {
          id
          name {
            full
            native
            alternative
          }
          image {
            large
            medium
          }
          description
          siteUrl
          favourites
          media(perPage: 6, sort: [POPULARITY_DESC]) {
            edges {
              characterRole
              node {
                id
                idMal
                type
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                }
              }
              voiceActors(language: JAPANESE) {
                id
                name {
                  full
                  native
                }
                image {
                  medium
                }
              }
            }
          }
        }
      }
    }
  `;

  let rawCharacters: any[] = [];
  let pageInfo = { currentPage: page, lastPage: 1, hasNextPage: false, total: 0 };

  // 1. Primary character search
  try {
    const response = await fetchWithTimeout(
      'https://graphql.anilist.co',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: charGql,
          variables: { search: cleanQuery, page, perPage }
        })
      },
      6000
    );

    if (response.ok) {
      const json = await response.json();
      const pageData = json?.data?.Page;
      if (pageData?.characters) {
        rawCharacters = [...pageData.characters];
      }
      if (pageData?.pageInfo) {
        pageInfo = pageData.pageInfo;
      }
    }
  } catch (err) {
    console.warn('[AnimeDB] Character search fetch error', err);
  }

  // 2. Check if the query is an Anime Series title (e.g. "Jujutsu Kaisen", "Spy x Family", "Demon Slayer")
  if (page === 1) {
    try {
      const mediaGql = `
        query ($search: String) {
          Media(search: $search, type: ANIME) {
            id
            idMal
            title {
              romaji
              english
              native
            }
            characters(page: 1, perPage: 12, sort: [ROLE, RELEVANCE]) {
              edges {
                role
                node {
                  id
                  name {
                    full
                    native
                    alternative
                  }
                  image {
                    large
                    medium
                  }
                  description
                  siteUrl
                  favourites
                  media(perPage: 4, sort: [POPULARITY_DESC]) {
                    edges {
                      characterRole
                      node {
                        id
                        idMal
                        type
                        title {
                          romaji
                          english
                          native
                        }
                        coverImage {
                          large
                        }
                      }
                      voiceActors(language: JAPANESE) {
                        id
                        name {
                          full
                          native
                        }
                        image {
                          medium
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const mRes = await fetchWithTimeout(
        'https://graphql.anilist.co',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mediaGql, variables: { search: cleanQuery } })
        },
        5000
      );

      if (mRes.ok) {
        const mJson = await mRes.json();
        const media = mJson?.data?.Media;
        if (media) {
          const mTitleE = (media.title?.english || '').toLowerCase();
          const mTitleR = (media.title?.romaji || '').toLowerCase();

          // Check token matching (e.g. "Spy x Family" matching "SPY×FAMILY")
          const qTokens = qLower.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length > 1 && t !== 'x');
          const combinedTitles = `${mTitleE} ${mTitleR}`.replace(/[^a-z0-9]/g, ' ');
          const isAnimeTitleMatch = qTokens.length > 0 && qTokens.every(tok => combinedTitles.includes(tok));

          if (isAnimeTitleMatch) {
            const seriesChars = (media.characters?.edges || []).map((e: any) => e.node).filter(Boolean);
            if (seriesChars.length > 0) {
              const existingIds = new Set(rawCharacters.map(c => c.id));
              // Prepend series characters so anime search returns characters from that anime
              rawCharacters = [...seriesChars.filter((c: any) => !existingIds.has(c.id)), ...rawCharacters];
            }
          }
        }
      }
    } catch (e) {
      // Non-fatal if anime check fails
    }
  }

  // 3. Fallback for multi-word names with romaji differences (e.g. "Tanjiro Kamado" -> Tanjirou)
  if (rawCharacters.length === 0 && cleanQuery.includes(' ')) {
    const parts = cleanQuery.split(/\s+/);
    for (const part of parts) {
      if (part.length >= 3) {
        try {
          const pRes = await fetchWithTimeout(
            'https://graphql.anilist.co',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: charGql, variables: { search: part, page: 1, perPage } })
            },
            4000
          );
          if (pRes.ok) {
            const pJson = await pRes.json();
            const pChars = pJson?.data?.Page?.characters || [];
            if (pChars.length > 0) {
              rawCharacters = pChars;
              break;
            }
          }
        } catch (e) {}
      }
    }
  }

  // 4. Rank characters by relevance and favorites
  rawCharacters.sort((a, b) => {
    const aFull = (a.name?.full || '').toLowerCase();
    const bFull = (b.name?.full || '').toLowerCase();
    const aAlt = (a.name?.alternative || []).join(' ').toLowerCase();
    const bAlt = (b.name?.alternative || []).join(' ').toLowerCase();

    const aExact = aFull === qLower;
    const bExact = bFull === qLower;
    if (aExact && !bExact) return -1;
    if (bExact && !aExact) return 1;

    const aContains = aFull.includes(qLower) || aAlt.includes(qLower);
    const bContains = bFull.includes(qLower) || bAlt.includes(qLower);
    if (aContains && !bContains) return -1;
    if (bContains && !aContains) return 1;

    // Both contain or neither contains: rank by popularity/favorites
    return (b.favourites || 0) - (a.favourites || 0);
  });

  const characters: JikanCharacter[] = rawCharacters.map(mapAniListToJikan);

  const pagination: JikanPagination = {
    current_page: pageInfo.currentPage || 1,
    last_visible_page: pageInfo.lastPage || 1,
    has_next_page: pageInfo.hasNextPage || false,
    items: {
      count: characters.length,
      total: pageInfo.total || characters.length,
      per_page: perPage
    }
  };

  return { characters, pagination };
}

async function getCharacterFromAnimeDB(id: number, signal?: AbortSignal): Promise<JikanCharacter | null> {
  const gqlQuery = `
    query ($id: Int) {
      Character(id: $id) {
        id
        name {
          full
          native
          alternative
        }
        image {
          large
          medium
        }
        description
        siteUrl
        favourites
        media(perPage: 12, sort: [POPULARITY_DESC]) {
          edges {
            characterRole
            node {
              id
              idMal
              type
              title {
                romaji
                english
                native
              }
              coverImage {
                large
              }
            }
            voiceActors {
              id
              name {
                full
                native
              }
              languageV2
              image {
                medium
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetchWithTimeout(
      'https://graphql.anilist.co',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: gqlQuery,
          variables: { id }
        }),
        signal
      },
      6000
    );

    if (!response.ok) return null;
    const json = await response.json();
    const c = json?.data?.Character;
    if (!c) return null;

    return mapAniListToJikan(c);
  } catch {
    return null;
  }
}

async function getTopCharactersFromAnimeDB(page: number, perPage: number): Promise<JikanCharacter[]> {
  const gqlQuery = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        characters(sort: [FAVOURITES_DESC]) {
          id
          name {
            full
            native
            alternative
          }
          image {
            large
            medium
          }
          description
          siteUrl
          favourites
          media(perPage: 4, sort: [POPULARITY_DESC]) {
            edges {
              characterRole
              node {
                id
                idMal
                type
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetchWithTimeout(
      'https://graphql.anilist.co',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: gqlQuery,
          variables: { page, perPage }
        })
      },
      6000
    );

    if (!response.ok) return [];
    const json = await response.json();
    const chars = json?.data?.Page?.characters || [];
    return chars.map(mapAniListToJikan);
  } catch {
    return [];
  }
}

function mapAniListToJikan(c: any): JikanCharacter {
  const primaryImage = c.image?.large || c.image?.medium || '';

  // Extract anime and manga appearances
  const animeList: JikanAnimeAppearance[] = [];
  const mangaList: JikanMangaAppearance[] = [];
  const voiceList: JikanVoiceActor[] = [];

  const mediaEdges = c.media?.edges || [];
  for (const edge of mediaEdges) {
    const node = edge.node;
    if (!node) continue;

    const titleStr = node.title?.english || node.title?.romaji || node.title?.native || 'Unknown Title';
    const imgUrl = node.coverImage?.large || '';

    if (node.type === 'ANIME') {
      animeList.push({
        role: edge.characterRole || 'Main',
        anime: {
          mal_id: node.idMal || node.id,
          url: `https://myanimelist.net/anime/${node.idMal || node.id}`,
          title: titleStr,
          images: {
            jpg: { image_url: imgUrl, large_image_url: imgUrl }
          }
        }
      });
    } else if (node.type === 'MANGA') {
      mangaList.push({
        role: edge.characterRole || 'Main',
        manga: {
          mal_id: node.idMal || node.id,
          url: `https://myanimelist.net/manga/${node.idMal || node.id}`,
          title: titleStr,
          images: {
            jpg: { image_url: imgUrl }
          }
        }
      });
    }

    // Voice actors
    if (edge.voiceActors && Array.isArray(edge.voiceActors)) {
      for (const va of edge.voiceActors) {
        if (!voiceList.some(v => v.person.name === va.name?.full)) {
          voiceList.push({
            language: va.languageV2 || 'Japanese',
            person: {
              mal_id: va.id,
              url: `https://myanimelist.net/people/${va.id}`,
              name: va.name?.full || '',
              images: {
                jpg: { image_url: va.image?.medium || '' }
              }
            }
          });
        }
      }
    }
  }

  // Clean description markdown / HTML formatting
  let cleanedAbout = (c.description || '')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~!([^!]+)!~/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .trim();

  return {
    mal_id: c.id, // Stable unique ID
    url: c.siteUrl || `https://myanimelist.net/character/${c.id}`,
    name: c.name?.full || 'Unknown Character',
    name_kanji: c.name?.native || undefined,
    nicknames: c.name?.alternative || [],
    favorites: c.favourites || 0,
    about: cleanedAbout,
    images: {
      jpg: {
        image_url: primaryImage,
        large_image_url: primaryImage
      },
      webp: {
        image_url: primaryImage,
        large_image_url: primaryImage
      }
    },
    anime: animeList,
    manga: mangaList,
    voices: voiceList,
    pictures: [primaryImage]
  };
}

const defaultPagination: JikanPagination = {
  current_page: 1,
  last_visible_page: 1,
  has_next_page: false,
  items: { count: 0, total: 0, per_page: 15 }
};
