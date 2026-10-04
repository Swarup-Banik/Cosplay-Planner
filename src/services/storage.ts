/**
 * Migration-safe localStorage wrapper for Cosplay Planner.
 * Supports versioned schema, auto-migration from legacy v1 keys,
 * try/catch fallbacks, and quota-exceeded cache eviction.
 */

const SCHEMA_VERSION = 2;
const SCHEMA_KEY = 'cosplay_planner_schema_version';

export interface StorageBackupData {
  schemaVersion: number;
  exportedAt: string;
  savedProjects: any[];
  favorites: any[];
  measurements?: any;
  gamificationState?: any;
  quizLastResult?: any;
}

/**
 * Runs migration from previous schema versions if needed.
 */
export function initializeStorageMigration(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const currentVer = parseInt(localStorage.getItem(SCHEMA_KEY) || '1', 10);

    if (currentVer < 2) {
      // Migrate v1 saved projects to v2
      const v1Projects = localStorage.getItem('cosplay_planner_saved_projects');
      const v2Projects = localStorage.getItem('cosplay_planner_saved_projects_v2');

      if (v1Projects && !v2Projects) {
        localStorage.setItem('cosplay_planner_saved_projects_v2', v1Projects);
      }

      // Migrate v1 recent characters if present
      const v1Recent = localStorage.getItem('cosplay_planner_recent_characters');
      const v2Recent = localStorage.getItem('cosplay_planner_recent_characters_v2');
      if (v1Recent && !v2Recent) {
        localStorage.setItem('cosplay_planner_recent_characters_v2', v1Recent);
      }

      localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    }
  } catch (err) {
    console.warn('Storage migration encountered an issue:', err);
  }
}

/**
 * Clean up old search cache entries if localStorage quota is exceeded.
 */
function evictOldCacheEntries(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('jikan_cache_') || key.startsWith('jikan_char_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {}
}

export function safeStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`safeStorageGet error for key "${key}":`, err);
    return fallback;
  }
}

export function safeStorageSet<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err: any) {
    // If QuotaExceededError, evict old API cache and retry
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      evictOldCacheEntries();
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (retryErr) {
        console.error('Failed writing to storage even after cache eviction:', retryErr);
        return false;
      }
    }
    console.error(`safeStorageSet error for key "${key}":`, err);
    return false;
  }
}

export function safeStorageRemove(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`safeStorageRemove error for key "${key}":`, err);
  }
}

/**
 * Export complete application backup as JSON
 */
export function exportFullBackup(): StorageBackupData {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    savedProjects: safeStorageGet('cosplay_planner_saved_projects_v2', []),
    favorites: safeStorageGet('cosplay_favorites_v1', []),
    measurements: safeStorageGet('cosplay_measurements_profile_v1', null),
    gamificationState: safeStorageGet('cosplay_gamification_state_v1', null),
    quizLastResult: safeStorageGet('cosplay_quiz_last_result', null)
  };
}

/**
 * Validates and restores full backup from JSON
 */
export function importFullBackup(data: any): { success: boolean; error?: string; summary?: string } {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid backup file structure.' };
  }

  try {
    const projects = Array.isArray(data.savedProjects) ? data.savedProjects : [];
    const favorites = Array.isArray(data.favorites) ? data.favorites : [];

    safeStorageSet('cosplay_planner_saved_projects_v2', projects);
    safeStorageSet('cosplay_favorites_v1', favorites);

    if (data.measurements) {
      safeStorageSet('cosplay_measurements_profile_v1', data.measurements);
    }
    if (data.gamificationState) {
      safeStorageSet('cosplay_gamification_state_v1', data.gamificationState);
    }
    if (data.quizLastResult) {
      safeStorageSet('cosplay_quiz_last_result', data.quizLastResult);
    }

    return {
      success: true,
      summary: `Restored ${projects.length} project(s) and ${favorites.length} favorite character(s).`
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed restoring backup data.' };
  }
}
