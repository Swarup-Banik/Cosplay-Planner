/**
 * TTS Synthesis Orchestrator
 * Implements priority routing: ElevenLabs (<= 150 chars) -> Azure Speech (> 150 chars or failover) -> Browser Fallback.
 * Handles automatic failover, disk caching, and quota protection.
 */

import { ELEVENLABS_CHAR_LIMIT, resolveCharacterVoice } from '../config/voiceMap.js';
import { elevenLabsProvider } from './elevenLabsProvider.js';
import { azureSpeechProvider } from './azureProvider.js';
import { audioCache } from './cacheManager.js';
import { quotaManager } from './quotaManager.js';

export class TTSOrchestrator {
  constructor() {
    this.charLimit = ELEVENLABS_CHAR_LIMIT;
  }

  getStatus() {
    const quota = quotaManager.getStatus();
    const elStatus = elevenLabsProvider.getStatus();
    const azureStatus = azureSpeechProvider.getStatus();

    let activeEngine = 'browser';
    if (elStatus.available && !quota.elevenLabs.isExceeded) {
      activeEngine = 'elevenlabs';
    } else if (azureStatus.available && !quota.azure.isExceeded) {
      activeEngine = 'azure';
    }

    return {
      activeEngine,
      charThreshold: this.charLimit,
      cachedClipsCount: audioCache.count(),
      elevenLabs: {
        ...elStatus,
        ...quota.elevenLabs
      },
      azure: {
        ...azureStatus,
        ...quota.azure
      }
    };
  }

  async synthesize(payload) {
    const {
      text,
      characterName = '',
      gender = 'neutral',
      isJapanese = false,
      lang = 'en-US'
    } = payload;

    if (!text || typeof text !== 'string' || !text.trim()) {
      throw new Error('Valid text is required for synthesis');
    }

    const cleanText = text.trim();
    const charVoice = resolveCharacterVoice(characterName, gender);

    // Pick target voice parameters
    const elevenLabsVoiceId = charVoice.elevenLabsVoiceId;
    const azureVoiceName = isJapanese ? (charVoice.jaAzureVoice || 'ja-JP-NanamiNeural') : charVoice.azureVoice;
    const modelId = elevenLabsProvider.modelId;

    // 1. Check disk cache first
    const cacheSettings = {
      isJapanese,
      gender,
      character: charVoice.characterKey
    };
    const cacheHash = audioCache.computeHash(cleanText, isJapanese ? `ja_${elevenLabsVoiceId}` : elevenLabsVoiceId, modelId, cacheSettings);

    if (audioCache.has(cacheHash)) {
      const cachedBuffer = audioCache.get(cacheHash);
      return {
        audioBuffer: cachedBuffer,
        contentType: 'audio/mpeg',
        cacheHit: true,
        engine: 'cache',
        hash: cacheHash
      };
    }

    // 2. Decide Primary Route based on text length and availability
    const isShortText = cleanText.length <= this.charLimit;
    const elAvailable = elevenLabsProvider.getStatus().available && quotaManager.canUseElevenLabs(cleanText.length);
    const azureAvailable = azureSpeechProvider.getStatus().available && quotaManager.canUseAzure(cleanText.length);

    let lastError = null;

    // Path A: Try ElevenLabs (if short text and available)
    if (isShortText && elAvailable) {
      try {
        console.log(`[TTS Orchestrator] Routing to ElevenLabs (${cleanText.length} chars <= ${this.charLimit}): "${cleanText.slice(0, 40)}..."`);
        const result = await elevenLabsProvider.synthesize(cleanText, elevenLabsVoiceId, { modelId });

        // Record quota and cache result
        quotaManager.recordElevenLabsUsage(result.creditsUsed);
        audioCache.set(cacheHash, result.audioBuffer, {
          engine: 'elevenlabs',
          character: characterName,
          text: cleanText,
          credits: result.creditsUsed
        });

        return {
          audioBuffer: result.audioBuffer,
          contentType: result.contentType,
          cacheHit: false,
          engine: 'elevenlabs',
          creditsUsed: result.creditsUsed,
          hash: cacheHash
        };
      } catch (err) {
        lastError = err;
        console.warn(`[TTS Orchestrator] ElevenLabs synthesis failed: ${err.message}. Initiating failover to Azure...`);
      }
    }

    // Path B: Try Azure (either as primary for long text, or failover from ElevenLabs)
    if (azureAvailable) {
      try {
        const reason = isShortText ? 'ElevenLabs failover' : `Long text (${cleanText.length} chars > ${this.charLimit})`;
        console.log(`[TTS Orchestrator] Routing to Azure (${reason}): "${cleanText.slice(0, 40)}..."`);

        const result = await azureSpeechProvider.synthesize(cleanText, azureVoiceName, {
          pitch: charVoice.azurePitch,
          rate: charVoice.azureRate,
          lang: isJapanese ? 'ja-JP' : lang
        });

        // Record quota and cache result
        quotaManager.recordAzureUsage(result.charactersUsed);
        audioCache.set(cacheHash, result.audioBuffer, {
          engine: 'azure',
          character: characterName,
          text: cleanText,
          characters: result.charactersUsed
        });

        return {
          audioBuffer: result.audioBuffer,
          contentType: result.contentType,
          cacheHit: false,
          engine: 'azure',
          charactersUsed: result.charactersUsed,
          hash: cacheHash
        };
      } catch (err) {
        lastError = err;
        console.warn(`[TTS Orchestrator] Azure synthesis failed: ${err.message}. Initiating failover to browser voice...`);
      }
    }

    // Path C: Both neural providers unavailable or failed -> instruct client to fall back to browser voice
    console.log(`[TTS Orchestrator] No neural provider available. Instructing client to use browser SpeechSynthesis.`);
    return {
      fallback: true,
      engine: 'browser',
      reason: lastError ? lastError.message : 'No neural TTS engine configured or quota threshold reached',
      cleanText
    };
  }
}

export const ttsOrchestrator = new TTSOrchestrator();
