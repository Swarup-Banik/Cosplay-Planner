/**
 * Character Voice & Dialogue Service
 * Provides per-character TTS voice profiling, original in-character dialogues,
 * and Japanese voice synthesis. Structured behind a modular interface for future neural TTS proxying.
 */

export interface VoiceProfile {
  gender: 'female' | 'male' | 'child' | 'neutral';
  pitch: number; // 0.5 - 2.0
  rate: number;  // 0.7 - 1.4
  lang: string;  // 'en-US', 'ja-JP', etc.
  preferredKeywords?: string[];
}

export interface CharacterDialogue {
  id: string;
  category: 'greeting' | 'motivational' | 'cosplay-advice' | 'one-liner';
  text: string;
  japaneseText?: string;
  romajiText?: string;
  mood: 'happy' | 'motivational' | 'calm' | 'surprised' | 'annoyed';
  emote: string;
}

// Preset Voice Profiles for Popular Archetypes & Characters
const KNOWN_VOICE_PROFILES: Record<string, Partial<VoiceProfile>> = {
  // Spy x Family
  'yor forger': { gender: 'female', pitch: 1.15, rate: 0.95 },
  'anya forger': { gender: 'child', pitch: 1.45, rate: 1.08 },
  'loid forger': { gender: 'male', pitch: 0.92, rate: 0.98 },

  // Jujutsu Kaisen
  'gojo satoru': { gender: 'male', pitch: 0.95, rate: 1.05 },
  'satoru gojou': { gender: 'male', pitch: 0.95, rate: 1.05 },
  'megumi fushiguro': { gender: 'male', pitch: 0.88, rate: 0.92 },
  'nobara kugisaki': { gender: 'female', pitch: 1.1, rate: 1.05 },

  // Demon Slayer
  'nezuko kamado': { gender: 'female', pitch: 1.25, rate: 0.92 },
  'tanjiro kamado': { gender: 'male', pitch: 1.02, rate: 1.0 },
  'tanjirou kamado': { gender: 'male', pitch: 1.02, rate: 1.0 },

  // My Dress-Up Darling
  'marin kitagawa': { gender: 'female', pitch: 1.22, rate: 1.12 },

  // Shingeki no Kyojin
  'levi': { gender: 'male', pitch: 0.82, rate: 0.92 },
  'levi ackerman': { gender: 'male', pitch: 0.82, rate: 0.92 },
  'mikasa ackerman': { gender: 'female', pitch: 0.92, rate: 0.9 },

  // Frieren
  'frieren': { gender: 'female', pitch: 1.05, rate: 0.86 },
  'fern': { gender: 'female', pitch: 1.0, rate: 0.92 },

  // One Piece & Naruto
  'luffy': { gender: 'male', pitch: 1.05, rate: 1.15 },
  'monkey d. luffy': { gender: 'male', pitch: 1.05, rate: 1.15 },
  'naruto uzumaki': { gender: 'male', pitch: 1.0, rate: 1.08 }
};

/**
 * Returns tailored voice profile parameters for any character.
 */
export function getCharacterVoiceProfile(characterName: string, genderHint?: string): VoiceProfile {
  const normName = characterName.toLowerCase().trim();
  for (const [key, profile] of Object.entries(KNOWN_VOICE_PROFILES)) {
    if (normName.includes(key)) {
      return {
        gender: profile.gender || 'neutral',
        pitch: profile.pitch ?? 1.0,
        rate: profile.rate ?? 1.0,
        lang: 'en-US'
      };
    }
  }

  // Heuristic based on gender hint or name endings
  const isLikelyFemale =
    genderHint === 'female' ||
    /(a|i|ko|mi|ka|na|ne|sa|ri|e)$/i.test(normName.split(' ')[0]);

  return {
    gender: isLikelyFemale ? 'female' : 'male',
    pitch: isLikelyFemale ? 1.12 : 0.92,
    rate: 1.0,
    lang: 'en-US'
  };
}

/**
 * Retrieves original in-character dialogues designed specifically for Cosplay Planner.
 * (All lines are original motivational and cosplay craftsmanship lines without copyrighted quotes.)
 */
export function getCharacterDialogues(name: string, series: string): CharacterDialogue[] {
  const norm = name.toLowerCase();

  if (norm.includes('yor')) {
    return [
      {
        id: 'yor-1',
        category: 'greeting',
        text: `Hello there! Working on your cosplay project? I'll support you with all my heart.`,
        japaneseText: `ヨルです！コスプレ制作、頑張ってくださいね。`,
        romajiText: `Yor desu! Kosupure seisaku, ganbatte kudasai ne.`,
        mood: 'happy',
        emote: '🌸'
      },
      {
        id: 'yor-2',
        category: 'cosplay-advice',
        text: `Cosplay takes such precision... remember to hem your dress seams tightly and take soft, steady strides!`,
        mood: 'calm',
        emote: '🪡'
      },
      {
        id: 'yor-3',
        category: 'motivational',
        text: `Don't rush through the crafting steps. With enough patience, your outfit will turn out breathtaking!`,
        mood: 'motivational',
        emote: '✨'
      },
      {
        id: 'yor-4',
        category: 'one-liner',
        text: `Grace and sharpness belong together—both on the stage and in your stitches.`,
        mood: 'calm',
        emote: '🌹'
      }
    ];
  }

  if (norm.includes('gojo')) {
    return [
      {
        id: 'gojo-1',
        category: 'greeting',
        text: `Yo! Ready to stand at the top of the convention floor? You know you've got this!`,
        japaneseText: `五条悟だよ！君のコスプレ、最高にカッコよくしちゃおう！`,
        romajiText: `Gojo Satoru da yo! Kimi no kosupure, saikou ni kakko yoku shichaou!`,
        mood: 'happy',
        emote: '🕶️'
      },
      {
        id: 'gojo-2',
        category: 'cosplay-advice',
        text: `Pro tip: Got2b freeze spray is basically limitless energy for spiked white wigs. Go big or go home!`,
        mood: 'surprised',
        emote: '⚡'
      },
      {
        id: 'gojo-3',
        category: 'motivational',
        text: `Confidence is 90% of the costume. Walk into that hall like you own the entire floor!`,
        mood: 'motivational',
        emote: '🤞'
      },
      {
        id: 'gojo-4',
        category: 'one-liner',
        text: `Don't worry about perfection—when you're having fun, you're already the strongest!`,
        mood: 'happy',
        emote: '✨'
      }
    ];
  }

  if (norm.includes('marin')) {
    return [
      {
        id: 'marin-1',
        category: 'greeting',
        text: `Omg heyyy!! Cosplay is literally the best feeling in the entire world! Let's craft something amazing!`,
        japaneseText: `まりんだよっ！コスプレ一緒に全力で楽しもーね！`,
        romajiText: `Marin da yo! Kosupure issho ni zenryoku de tanoshimou ne!`,
        mood: 'happy',
        emote: '💖'
      },
      {
        id: 'marin-2',
        category: 'cosplay-advice',
        text: `Always steam your fabrics before the con and test your colored contacts beforehand! Safety first, always!`,
        mood: 'surprised',
        emote: '📸'
      },
      {
        id: 'marin-3',
        category: 'motivational',
        text: `Looking in the mirror and seeing your favorite character staring right back at you? Pure happiness!`,
        mood: 'motivational',
        emote: '🌟'
      }
    ];
  }

  if (norm.includes('frieren')) {
    return [
      {
        id: 'frieren-1',
        category: 'greeting',
        text: `Greetings... Preparing a cosplay takes time, but every single minute spent crafting has meaning.`,
        japaneseText: `フリーレンだよ。時間をかけて丁寧に作ると、きっと良い衣装になるよ。`,
        romajiText: `Frieren da yo. Jikan o kakete teinei ni tsukuru to, kitto yoi ishou ni naru yo.`,
        mood: 'calm',
        emote: '🍃'
      },
      {
        id: 'frieren-2',
        category: 'cosplay-advice',
        text: `Measure twice, cut once. It saves hundreds of hours down the road.`,
        mood: 'calm',
        emote: '⏳'
      },
      {
        id: 'frieren-3',
        category: 'motivational',
        text: `Even small daily stitches add up to grand garments across your journey. Keep going.`,
        mood: 'motivational',
        emote: '✨'
      }
    ];
  }

  // Sensible dynamic default set for any character
  const firstName = name.split(' ')[0];
  return [
    {
      id: `${norm}-1`,
      category: 'greeting',
      text: `Hello! I'm ${name} from ${series}. So excited to see your cosplay planning progress!`,
      japaneseText: `${name}です！一緒に素晴らしいコスプレを作りましょう！`,
      romajiText: `${name} desu! Issho ni subarashii kosupure o tsukurimashou!`,
      mood: 'happy',
      emote: '✨'
    },
    {
      id: `${norm}-2`,
      category: 'cosplay-advice',
      text: `Every great ${series} cosplay starts with patience. Break your checklist down step by step!`,
      mood: 'calm',
      emote: '✂️'
    },
    {
      id: `${norm}-3`,
      category: 'motivational',
      text: `Wear your outfit with pride! Bringing ${firstName} to life will inspire so many fellow anime fans.`,
      mood: 'motivational',
      emote: '🔥'
    },
    {
      id: `${norm}-4`,
      category: 'one-liner',
      text: `Con day is just around the corner—keep stitching, crafting, and shining!`,
      mood: 'happy',
      emote: '🎉'
    }
  ];
}

import { computeClientHash, getCachedAudioClip, setCachedAudioClip } from './voiceCacheIndexedDB';

export interface TTSStatusResponse {
  activeEngine: 'elevenlabs' | 'azure' | 'browser';
  charThreshold: number;
  cachedClipsCount: number;
  elevenLabs: {
    configured: boolean;
    available: boolean;
    modelId: string;
    disabledReason: string | null;
    creditsUsed: number;
    cap: number;
    threshold: number;
    percentUsed: number;
    isExceeded: boolean;
    remainingCredits: number;
  };
  azure: {
    configured: boolean;
    available: boolean;
    region: string;
    disabledReason: string | null;
    charactersUsed: number;
    cap: number;
    threshold: number;
    percentUsed: number;
    isExceeded: boolean;
    remainingCharacters: number;
  };
}

export interface VoicePlaybackOptions {
  characterName?: string;
  volume?: number;
  isJapanese?: boolean;
  onStart?: (engine: string) => void;
  onEnd?: () => void;
  onBoundary?: (charIndex: number) => void;
  onAmplitude?: (amplitude: number) => void;
  onError?: (err: any) => void;
}

/**
 * Standardized Multi-Engine TTS Player.
 * Priority order: ElevenLabs (<=150 chars) -> Azure Speech (>150 chars or failover) -> Browser SpeechSynthesis.
 * Reactive amplitude tracking via Web Audio AnalyserNode.
 */
export class CharacterVoiceSynthesizer {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private animFrameId: number | null = null;
  private currentEngine: 'elevenlabs' | 'azure' | 'cache' | 'browser' = 'browser';
  private cachedStatus: TTSStatusResponse | null = null;
  private lastStatusFetch = 0;

  public stop(): void {
    // 1. Cancel browser voice
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;

    // 2. Stop audio element
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }

    // 3. Cancel animation frame
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    // 4. Suspend or close audio context if active
    if (this.audioContext && this.audioContext.state === 'running') {
      try {
        this.audioContext.suspend();
      } catch {}
    }
  }

  public getCurrentEngine(): 'elevenlabs' | 'azure' | 'cache' | 'browser' {
    return this.currentEngine;
  }

  public async getStatus(): Promise<TTSStatusResponse | null> {
    const now = Date.now();
    if (this.cachedStatus && now - this.lastStatusFetch < 10000) {
      return this.cachedStatus;
    }

    try {
      const resp = await fetch('/api/tts/status');
      if (resp.ok) {
        const data = await resp.json() as TTSStatusResponse;
        this.cachedStatus = data;
        this.lastStatusFetch = now;
        return data;
      }
    } catch {
      // Server proxy not reachable
    }

    return null;
  }

  public async speak(
    text: string,
    profile: VoiceProfile,
    options: VoicePlaybackOptions = {}
  ): Promise<void> {
    this.stop();

    const cleanText = text.trim();
    if (!cleanText) return;

    // Check client-side IndexedDB cache first
    const lang = options.isJapanese ? 'ja-JP' : profile.lang;
    const voiceKey = `${profile.gender}_${options.characterName || ''}_${options.isJapanese ? 'ja' : 'en'}`;
    const clientHash = await computeClientHash(cleanText, voiceKey, lang);

    const cachedBlob = await getCachedAudioClip(clientHash);
    if (cachedBlob) {
      console.log(`[TTS Synthesizer] Playing from local IndexedDB cache: "${cleanText.slice(0, 30)}..."`);
      this.currentEngine = 'cache';
      this.playAudioBlob(cachedBlob, 'cache', options);
      return;
    }

    // Attempt neural synthesis via server proxy
    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          characterName: options.characterName,
          gender: profile.gender,
          isJapanese: Boolean(options.isJapanese),
          lang
        })
      });

      const contentType = response.headers.get('content-type') || '';

      if (response.ok && contentType.includes('audio')) {
        const engine = (response.headers.get('X-TTS-Engine') as any) || 'elevenlabs';
        this.currentEngine = engine;

        const blob = await response.blob();
        // Persist to local IndexedDB cache for future instant replay
        setCachedAudioClip(clientHash, blob, {
          text: cleanText,
          engine,
          character: options.characterName
        });

        this.playAudioBlob(blob, engine, options);
        return;
      }

      // If JSON returned, check if fallback was requested
      if (contentType.includes('json')) {
        const json = await response.json();
        if (json.fallback) {
          console.log(`[TTS Synthesizer] Server requested fallback (${json.reason}). Using browser voice.`);
        }
      }
    } catch (err: any) {
      console.warn(`[TTS Synthesizer] Server proxy error: ${err.message}. Falling back to browser speech synthesis.`);
    }

    // Failover: Browser SpeechSynthesis
    this.currentEngine = 'browser';
    this.speakBrowser(cleanText, profile, options);
  }

  /**
   * Plays an audio blob with Web Audio AnalyserNode waveform reactivity
   */
  private playAudioBlob(blob: Blob, engineName: string, options: VoicePlaybackOptions): void {
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.volume = options.volume ?? 1.0;
    this.currentAudio = audio;

    let analyser: AnalyserNode | null = null;
    let audioCtx: AudioContext | null = null;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        this.audioContext = audioCtx;
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
      }
    } catch (err) {
      // In case browser restricts MediaElementSource (CORS or audio policy), play normally
    }

    const startAmplitudeLoop = () => {
      if (!analyser || !options.onAmplitude) return;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!this.currentAudio || this.currentAudio.paused) return;

        analyser!.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedAmp = Math.min(1.0, avg / 120);

        options.onAmplitude?.(normalizedAmp);
        this.animFrameId = requestAnimationFrame(tick);
      };

      this.animFrameId = requestAnimationFrame(tick);
    };

    audio.onplay = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      options.onStart?.(engineName);
      startAmplitudeLoop();
    };

    audio.onended = () => {
      if (this.animFrameId !== null) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      options.onAmplitude?.(0);
      options.onEnd?.();
      URL.revokeObjectURL(audioUrl);
      this.currentAudio = null;
    };

    audio.onerror = (e) => {
      if (this.animFrameId !== null) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      options.onError?.(e);
      options.onEnd?.();
      URL.revokeObjectURL(audioUrl);
      this.currentAudio = null;
    };

    audio.play().catch(err => {
      console.warn('[TTS Synthesizer] Audio play rejected:', err.message);
      options.onEnd?.();
    });
  }

  /**
   * Browser SpeechSynthesis fallback with boundary event callbacks
   */
  private speakBrowser(text: string, profile: VoiceProfile, options: VoicePlaybackOptions): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options.onError?.(new Error('Speech synthesis not supported in this browser'));
      options.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = options.volume ?? 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = (options.isJapanese ? 'ja-JP' : profile.lang).toLowerCase();
    const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));

    if (matchingVoices.length > 0) {
      let picked = matchingVoices[0];
      if (profile.gender === 'female' || profile.gender === 'child') {
        const femaleVoice = matchingVoices.find(v =>
          /female|woman|girl|samantha|zira|karen|kyoko|otoya|mei/i.test(v.name)
        );
        if (femaleVoice) picked = femaleVoice;
      } else if (profile.gender === 'male') {
        const maleVoice = matchingVoices.find(v =>
          /male|man|david|daniel|george|alex|kenji|takumi/i.test(v.name)
        );
        if (maleVoice) picked = maleVoice;
      }
      utterance.voice = picked;
    }

    utterance.onstart = () => {
      options.onStart?.('browser');
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onAmplitude?.(0);
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options.onAmplitude?.(0);
      options.onError?.(e);
      options.onEnd?.();
    };

    utterance.onboundary = (e) => {
      options.onBoundary?.(e.charIndex);
      // Simulate pulse on word boundary
      options.onAmplitude?.(0.75);
      setTimeout(() => options.onAmplitude?.(0.2), 80);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const characterVoice = new CharacterVoiceSynthesizer();

