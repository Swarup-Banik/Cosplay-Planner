/**
 * Server-Side Audio Cache Manager
 * Caches generated MP3 clips on disk by content hash.
 * Cache hits never consume API credits or characters.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.resolve(__dirname, '../cache/audio');

export class AudioCacheManager {
  constructor() {
    this.ensureCacheDir();
  }

  ensureCacheDir() {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  computeHash(text, voiceId, model, settings = {}) {
    const rawKey = `${text.trim()}|${voiceId}|${model}|${JSON.stringify(settings)}`;
    return crypto.createHash('sha256').update(rawKey).digest('hex').slice(0, 32);
  }

  getFilePath(hash) {
    return path.join(CACHE_DIR, `${hash}.mp3`);
  }

  getMetaPath(hash) {
    return path.join(CACHE_DIR, `${hash}.json`);
  }

  has(hash) {
    return fs.existsSync(this.getFilePath(hash));
  }

  get(hash) {
    const filePath = this.getFilePath(hash);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    return null;
  }

  set(hash, audioBuffer, metadata = {}) {
    this.ensureCacheDir();
    const filePath = this.getFilePath(hash);
    const metaPath = this.getMetaPath(hash);

    fs.writeFileSync(filePath, audioBuffer);
    fs.writeFileSync(metaPath, JSON.stringify({
      hash,
      created: new Date().toISOString(),
      ...metadata
    }, null, 2));

    console.log(`[CacheManager] Cached audio clip: ${hash} (${audioBuffer.length} bytes)`);
  }

  count() {
    try {
      this.ensureCacheDir();
      const files = fs.readdirSync(CACHE_DIR);
      return files.filter(f => f.endsWith('.mp3')).length;
    } catch {
      return 0;
    }
  }
}

export const audioCache = new AudioCacheManager();
