/**
 * ElevenLabs TTS Engine Provider
 * Primary neural voice synthesizer for short lines and catchphrases (<= 150 chars).
 */

export class ElevenLabsProvider {
  constructor() {
    this.modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';
    this.sessionDisabled = false;
    this.sessionDisabledReason = null;
  }

  getApiKey() {
    return (process.env.ELEVENLABS_API_KEY || '').trim();
  }

  isConfigured() {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  getStatus() {
    const key = this.getApiKey();
    if (!key) {
      return {
        configured: false,
        available: false,
        modelId: this.modelId,
        disabledReason: 'No ElevenLabs API key found in .env'
      };
    }

    if (this.sessionDisabled) {
      return {
        configured: true,
        available: false,
        modelId: this.modelId,
        disabledReason: this.sessionDisabledReason
      };
    }

    // Proactive check: ElevenLabs secret keys always start with 'sk_'
    if (!key.startsWith('sk_') && key.length === 64) {
      return {
        configured: true,
        available: false,
        modelId: this.modelId,
        disabledReason: 'API key ID provided instead of secret key (must start with sk_)'
      };
    }

    return {
      configured: true,
      available: true,
      modelId: this.modelId,
      disabledReason: null
    };
  }

  async synthesize(text, voiceId, options = {}) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('ElevenLabs API key is missing');
    }

    if (this.sessionDisabled) {
      throw new Error(`ElevenLabs is disabled for this session: ${this.sessionDisabledReason}`);
    }

    // Check if user passed Key ID instead of secret key
    if (!key.startsWith('sk_') && key.length === 64) {
      this.sessionDisabled = true;
      this.sessionDisabledReason = 'API key ID provided instead of secret key (must start with sk_). Check ElevenLabs dashboard.';
      console.warn(`[TTS Server] ElevenLabs warning: ${this.sessionDisabledReason}`);
      throw new Error(this.sessionDisabledReason);
    }

    const model = options.modelId || this.modelId;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': key,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text,
          model_id: model,
          voice_settings: {
            stability: options.stability ?? 0.5,
            similarity_boost: options.similarityBoost ?? 0.75
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let parsedError = {};
        try { parsedError = JSON.parse(errorText); } catch {}

        const status = response.status;
        const msg = parsedError.detail?.message || parsedError.message || errorText;

        // Auth or subscription/plan errors -> disable for current session
        if (status === 401 || status === 402 || status === 403 || parsedError.detail?.status === 'api_key_id_used_as_api_key') {
          this.sessionDisabled = true;
          this.sessionDisabledReason = `ElevenLabs auth/plan error (${status}): ${msg}`;
          console.warn(`[TTS Server] ElevenLabs disabled for session: ${this.sessionDisabledReason}`);
        }

        throw new Error(`ElevenLabs error (${status}): ${msg}`);
      }

      // Read credits charged from headers if available
      const charCostHeader = response.headers.get('character-cost') || response.headers.get('x-character-cost');
      let creditsUsed = 0;
      if (charCostHeader && !isNaN(Number(charCostHeader))) {
        creditsUsed = Number(charCostHeader);
      } else {
        // Fallback estimate: Flash models typically charge ~0.5-1 credit per character
        const multiplier = model.includes('flash') ? 0.5 : 1.0;
        creditsUsed = Math.ceil(text.length * multiplier);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      return {
        audioBuffer,
        creditsUsed,
        model,
        contentType: 'audio/mpeg'
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('ElevenLabs request timed out after 8s');
      }
      throw err;
    }
  }
}

export const elevenLabsProvider = new ElevenLabsProvider();
