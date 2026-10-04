/**
 * Voice Catalog & Character Mapping Configuration
 * Maps character archetypes to pre-made ElevenLabs voices and Azure Neural voices.
 * All voices are original style interpretations (no cloning, no actor impersonation).
 */

export const ELEVENLABS_CHAR_LIMIT = 150; // Threshold: <= 150 chars -> ElevenLabs, > 150 chars -> Azure

export const ELEVENLABS_PREMADE_VOICES = {
  Rachel: '21m00Tcm4TlvDq8ikWAM', // Calm, warm female
  Domi: 'AZnzlk1XvdvUeBnXmlld',   // Energetic, spirited young female
  Bella: 'EXAVITQu4vr4xnSDxMaL',  // Sweet, playful, child/young female
  Antoni: 'ErXwobaYiN019PkySvjV', // Confident, warm young male
  Adam: 'pNInz6obpgDQGcFmaJgB',   // Deep, commanding, charismatic male
  Arnold: 'VR6AewLTigWG4xSOukaG', // Stoic, crisp, cool male
  Josh: 'TxGEqnHWrfWFTfGW9XjX',   // Energetic, youthful male
  Elli: 'MF3mGyEYCl7XYWbV9V6O',   // Soft, quiet, polite female
  Sam: 'yoZ06a0pkUpdaAbNChDu'     // Dynamic, casual male
};

export const CHARACTER_VOICE_MAP = {
  // Spy x Family
  'yor forger': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Rachel,
    azureVoice: 'en-US-JennyNeural',
    azurePitch: '+10%',
    azureRate: '-5%',
    jaAzureVoice: 'ja-JP-NanamiNeural',
    gender: 'female',
    style: 'gentle, polite, lethal assassin warmth'
  },
  'anya forger': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Bella,
    azureVoice: 'en-US-AnaNeural',
    azurePitch: '+28%',
    azureRate: '+5%',
    jaAzureVoice: 'ja-JP-AoiNeural',
    gender: 'child',
    style: 'cute, expressive telepath child'
  },
  'loid forger': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Antoni,
    azureVoice: 'en-US-GuyNeural',
    azurePitch: '-4%',
    azureRate: '0%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'analytical, composed spy'
  },

  // Jujutsu Kaisen
  'gojo satoru': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Adam,
    azureVoice: 'en-US-DavisNeural',
    azurePitch: '+5%',
    azureRate: '+5%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'confident, playful sorcerer'
  },
  'satoru gojou': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Adam,
    azureVoice: 'en-US-DavisNeural',
    azurePitch: '+5%',
    azureRate: '+5%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'confident, playful sorcerer'
  },
  'megumi fushiguro': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Arnold,
    azureVoice: 'en-US-DavisNeural',
    azurePitch: '-10%',
    azureRate: '-5%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'stoic, serious student'
  },
  'nobara kugisaki': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Domi,
    azureVoice: 'en-US-AmandaNeural',
    azurePitch: '+8%',
    azureRate: '+5%',
    jaAzureVoice: 'ja-JP-NanamiNeural',
    gender: 'female',
    style: 'bold, feisty, stylish'
  },

  // Demon Slayer
  'nezuko kamado': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Bella,
    azureVoice: 'en-US-AnaNeural',
    azurePitch: '+18%',
    azureRate: '-5%',
    jaAzureVoice: 'ja-JP-AoiNeural',
    gender: 'female',
    style: 'sweet, protective demon girl'
  },
  'tanjiro kamado': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Antoni,
    azureVoice: 'en-US-BrianNeural',
    azurePitch: '+4%',
    azureRate: '0%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'earnest, compassionate swordsman'
  },
  'tanjirou kamado': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Antoni,
    azureVoice: 'en-US-BrianNeural',
    azurePitch: '+4%',
    azureRate: '0%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'earnest, compassionate swordsman'
  },

  // My Dress-Up Darling
  'marin kitagawa': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Domi,
    azureVoice: 'en-US-AmandaNeural',
    azurePitch: '+16%',
    azureRate: '+10%',
    jaAzureVoice: 'ja-JP-AoiNeural',
    gender: 'female',
    style: 'bubbly, enthusiastic cosplay gyaru'
  },

  // Shingeki no Kyojin
  'levi': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Arnold,
    azureVoice: 'en-US-DavisNeural',
    azurePitch: '-14%',
    azureRate: '-6%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'dry, stoic, commanding captain'
  },
  'levi ackerman': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Arnold,
    azureVoice: 'en-US-DavisNeural',
    azurePitch: '-14%',
    azureRate: '-6%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'dry, stoic, commanding captain'
  },
  'mikasa ackerman': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Rachel,
    azureVoice: 'en-US-AvaNeural',
    azurePitch: '-6%',
    azureRate: '-6%',
    jaAzureVoice: 'ja-JP-NanamiNeural',
    gender: 'female',
    style: 'quiet, resolute, protective'
  },

  // Frieren: Beyond Journey's End
  'frieren': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Rachel,
    azureVoice: 'en-US-AvaNeural',
    azurePitch: '+2%',
    azureRate: '-14%',
    jaAzureVoice: 'ja-JP-NanamiNeural',
    gender: 'female',
    style: 'calm, ethereal, contemplative mage'
  },
  'fern': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Elli,
    azureVoice: 'en-US-JennyNeural',
    azurePitch: '0%',
    azureRate: '-8%',
    jaAzureVoice: 'ja-JP-NanamiNeural',
    gender: 'female',
    style: 'polite, reserved, disciplined'
  },

  // Shonen Icons
  'luffy': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Josh,
    azureVoice: 'en-US-ChristopherNeural',
    azurePitch: '+10%',
    azureRate: '+12%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'wild, energetic, fearless pirate'
  },
  'monkey d. luffy': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Josh,
    azureVoice: 'en-US-ChristopherNeural',
    azurePitch: '+10%',
    azureRate: '+12%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'wild, energetic, fearless pirate'
  },
  'naruto uzumaki': {
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Josh,
    azureVoice: 'en-US-ChristopherNeural',
    azurePitch: '+8%',
    azureRate: '+10%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'spirited, loud, determined ninja'
  }
};

/**
 * Resolves voice configurations for a character name or fallback archetype
 */
export function resolveCharacterVoice(characterName = '', genderHint = 'neutral') {
  const norm = characterName.toLowerCase().trim();
  for (const [key, mapping] of Object.entries(CHARACTER_VOICE_MAP)) {
    if (norm.includes(key)) {
      return { characterKey: key, ...mapping };
    }
  }

  // Heuristic fallbacks
  const isFemale = genderHint === 'female' || /(a|i|ko|mi|ka|na|ne|sa|ri|e)$/i.test(norm.split(' ')[0]);
  const isChild = genderHint === 'child';

  if (isChild) {
    return {
      characterKey: 'default_child',
      elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Bella,
      azureVoice: 'en-US-AnaNeural',
      azurePitch: '+25%',
      azureRate: '+5%',
      jaAzureVoice: 'ja-JP-AoiNeural',
      gender: 'child',
      style: 'youthful anime child'
    };
  }

  if (isFemale) {
    return {
      characterKey: 'default_female',
      elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Rachel,
      azureVoice: 'en-US-JennyNeural',
      azurePitch: '+8%',
      azureRate: '0%',
      jaAzureVoice: 'ja-JP-NanamiNeural',
      gender: 'female',
      style: 'expressive anime heroine'
    };
  }

  return {
    characterKey: 'default_male',
    elevenLabsVoiceId: ELEVENLABS_PREMADE_VOICES.Antoni,
    azureVoice: 'en-US-GuyNeural',
    azurePitch: '-2%',
    azureRate: '0%',
    jaAzureVoice: 'ja-JP-KeitaNeural',
    gender: 'male',
    style: 'expressive anime hero'
  };
}
