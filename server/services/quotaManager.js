/**
 * Quota & Usage Manager
 * Persists monthly usage counters for ElevenLabs and Azure Speech.
 * Enforces strict 80% cap stop to protect free allowances.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const QUOTA_FILE = path.join(DATA_DIR, 'quota.json');

export const ELEVENLABS_MONTHLY_CAP = 10000;       // 10,000 credits/mo free plan
export const ELEVENLABS_THRESHOLD = 8000;          // 80% stop threshold (8,000 credits)
export const AZURE_MONTHLY_CAP = 500000;           // 500,000 characters/mo free F0 tier
export const AZURE_THRESHOLD = 400000;             // 80% stop threshold (400,000 characters)

function getCurrentMonthKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export class QuotaManager {
  constructor() {
    this.ensureDataDir();
    this.state = this.load();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  load() {
    const currentMonth = getCurrentMonthKey();
    try {
      if (fs.existsSync(QUOTA_FILE)) {
        const raw = fs.readFileSync(QUOTA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.month === currentMonth) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[QuotaManager] Error reading quota file, resetting:', err.message);
    }

    // Default or new month reset
    const freshState = {
      month: currentMonth,
      elevenLabsCredits: 0,
      azureCharacters: 0,
      lastUpdated: new Date().toISOString()
    };
    this.save(freshState);
    return freshState;
  }

  save(state) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(QUOTA_FILE, JSON.stringify(state, null, 2), 'utf-8');
      this.state = state;
    } catch (err) {
      console.error('[QuotaManager] Error saving quota:', err.message);
    }
  }

  getStatus() {
    // Check if month rolled over
    const currentMonth = getCurrentMonthKey();
    if (this.state.month !== currentMonth) {
      this.state = this.load();
    }

    const elUsed = this.state.elevenLabsCredits;
    const azureUsed = this.state.azureCharacters;

    const elAvailable = elUsed < ELEVENLABS_THRESHOLD;
    const azureAvailable = azureUsed < AZURE_THRESHOLD;

    return {
      month: this.state.month,
      elevenLabs: {
        creditsUsed: elUsed,
        cap: ELEVENLABS_MONTHLY_CAP,
        threshold: ELEVENLABS_THRESHOLD,
        percentUsed: Math.min(100, Math.round((elUsed / ELEVENLABS_MONTHLY_CAP) * 100)),
        isExceeded: !elAvailable,
        remainingCredits: Math.max(0, ELEVENLABS_THRESHOLD - elUsed)
      },
      azure: {
        charactersUsed: azureUsed,
        cap: AZURE_MONTHLY_CAP,
        threshold: AZURE_THRESHOLD,
        percentUsed: Math.min(100, Math.round((azureUsed / AZURE_MONTHLY_CAP) * 100)),
        isExceeded: !azureAvailable,
        remainingCharacters: Math.max(0, AZURE_THRESHOLD - azureUsed)
      }
    };
  }

  canUseElevenLabs(estimatedCredits = 100) {
    const status = this.getStatus();
    return (status.elevenLabs.creditsUsed + estimatedCredits) <= ELEVENLABS_THRESHOLD;
  }

  canUseAzure(estimatedChars = 100) {
    const status = this.getStatus();
    return (status.azure.charactersUsed + estimatedChars) <= AZURE_THRESHOLD;
  }

  recordElevenLabsUsage(credits) {
    const validCredits = Math.max(0, Math.round(credits));
    this.state.elevenLabsCredits += validCredits;
    this.state.lastUpdated = new Date().toISOString();
    this.save(this.state);
    console.log(`[QuotaManager] Recorded ElevenLabs usage: +${validCredits} credits (Total: ${this.state.elevenLabsCredits}/${ELEVENLABS_MONTHLY_CAP})`);
  }

  recordAzureUsage(characters) {
    const validChars = Math.max(0, Math.round(characters));
    this.state.azureCharacters += validChars;
    this.state.lastUpdated = new Date().toISOString();
    this.save(this.state);
    console.log(`[QuotaManager] Recorded Azure usage: +${validChars} characters (Total: ${this.state.azureCharacters}/${AZURE_MONTHLY_CAP})`);
  }
}

export const quotaManager = new QuotaManager();
