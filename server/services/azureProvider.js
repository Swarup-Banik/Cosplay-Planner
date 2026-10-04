/**
 * Azure Speech TTS Engine Provider
 * Secondary/backup neural synthesizer for long text (> 150 chars) and ElevenLabs failover.
 */

function escapeXml(unsafe = '') {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export class AzureSpeechProvider {
  constructor() {
    this.region = process.env.AZURE_SPEECH_REGION || 'eastus';
    this.sessionDisabled = false;
    this.sessionDisabledReason = null;
  }

  getApiKey() {
    return (process.env.AZURE_SPEECH_KEY || '').trim();
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
        region: this.region,
        disabledReason: 'No Azure Speech key in .env'
      };
    }

    if (this.sessionDisabled) {
      return {
        configured: true,
        available: false,
        region: this.region,
        disabledReason: this.sessionDisabledReason
      };
    }

    return {
      configured: true,
      available: true,
      region: this.region,
      disabledReason: null
    };
  }

  async synthesize(text, voiceName, options = {}) {
    const key = this.getApiKey();
    if (!key) {
      throw new Error('Azure Speech API key is missing');
    }

    if (this.sessionDisabled) {
      throw new Error(`Azure Speech is disabled: ${this.sessionDisabledReason}`);
    }

    const lang = options.lang || (voiceName.startsWith('ja-') ? 'ja-JP' : 'en-US');
    const pitch = options.pitch || '0%';
    const rate = options.rate || '0%';
    const escapedText = escapeXml(text);

    const ssml = `<speak version='1.0' xml:lang='${lang}'>
  <voice xml:lang='${lang}' name='${voiceName}'>
    <prosody pitch='${pitch}' rate='${rate}'>
      ${escapedText}
    </prosody>
  </voice>
</speak>`;

    const url = `https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'CosplayPlanner-TTS'
        },
        body: ssml,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const status = response.status;

        if (status === 401 || status === 403) {
          this.sessionDisabled = true;
          this.sessionDisabledReason = `Azure auth error (${status}): ${errorText}`;
          console.warn(`[TTS Server] Azure disabled for session: ${this.sessionDisabledReason}`);
        }

        throw new Error(`Azure Speech error (${status}): ${errorText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      return {
        audioBuffer,
        charactersUsed: text.length,
        voiceName,
        contentType: 'audio/mpeg'
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Azure Speech request timed out after 8s');
      }
      throw err;
    }
  }
}

export const azureSpeechProvider = new AzureSpeechProvider();
