/**
 * IndexedDB Audio Cache for Cosplay Planner Voices
 * Caches synthesized audio blobs locally in the browser so repeated lines never consume API credits.
 */

const DB_NAME = 'CosplayPlanner_VoiceDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_clips';

interface CachedClipRecord {
  hash: string;
  blob: Blob;
  text: string;
  engine: string;
  character?: string;
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'hash' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Computes a deterministic hash for a speech request
 */
export async function computeClientHash(text: string, voiceKey: string, lang = 'en-US'): Promise<string> {
  const raw = `${text.trim()}|${voiceKey}|${lang}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Retrieves a cached audio blob by hash
 */
export async function getCachedAudioClip(hash: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(hash);

      request.onsuccess = () => {
        const record = request.result as CachedClipRecord | undefined;
        resolve(record ? record.blob : null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Stores an audio blob in IndexedDB
 */
export async function setCachedAudioClip(
  hash: string,
  blob: Blob,
  metadata: { text: string; engine: string; character?: string }
): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const record: CachedClipRecord = {
        hash,
        blob,
        text: metadata.text,
        engine: metadata.engine,
        character: metadata.character,
        createdAt: Date.now()
      };
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Graceful fallback if storage quota exceeded or private mode
  }
}
