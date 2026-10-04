/**
 * Voice Pre-Generation CLI Script
 * Pre-generates curated in-character dialogue lines with ElevenLabs.
 * Usage:
 *   node server/scripts/generateVoices.js [--dry-run] [--force]
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

import { resolveCharacterVoice } from '../config/voiceMap.js';
import { audioCache } from '../services/cacheManager.js';
import { quotaManager, ELEVENLABS_MONTHLY_CAP } from '../services/quotaManager.js';
import { elevenLabsProvider } from '../services/elevenLabsProvider.js';

// Curated character lines (strictly under 100 chars, original dialogue)
export const CURATED_LINES = {
  'Yor Forger': [
    "Hello! Let's ensure your craftsmanship is precise and elegant today.",
    "A sharp silhouette requires patience and careful stitching. You're doing splendidly!",
    "Remember to measure twice before cutting your fabrics. Safety always comes first!",
    "Every seam brings you closer to perfection. I believe in your cosplay passion!"
  ],
  'Anya Forger': [
    "Waku waku! Your anime outfit is looking super cool and magical!",
    "Anya wants peanuts! And Anya wants your cosplay to win the costume contest!",
    "Hehehe, secret spy mission: craft the best costume in the whole world!",
    "Don't give up! Anya is cheering for your epic tailoring skills!"
  ],
  'Loid Forger': [
    "Operation Starlight is a go. Precision and preparation guarantee success.",
    "Inspect each seam thoroughly. A flawless costume begins with diligent planning.",
    "Keep your budget organized and stick to the schedule. Mission accomplished.",
    "A proper cosplayer never leaves preparations to the final night before the convention."
  ],
  'Gojo Satoru': [
    "Yo! Don't worry, you're the strongest crafter here. Show off those skills!",
    "Throughout heaven and earth, your cosplay alone will be the honored one!",
    "Wig styling giving you trouble? Just expand your domain and take it one spike at a time.",
    "Looking stylish already! Make sure you pose with absolute confidence on stage!"
  ],
  'Megumi Fushiguro': [
    "Take your time with the props. Rushing will only lead to uneven paint.",
    "Focus on the foundation first. A solid craft speaks louder than flashiness.",
    "Shadow techniques work best when the contrast is sharp and clean.",
    "Good work today. Consistency is what turns rough fabric into armor."
  ],
  'Nobara Kugisaki': [
    "Make it fierce! If we're hitting the convention floor, we're doing it in total style!",
    "Cheaping out on the wig? Absolutely not! Pick the right shade and rock that look!",
    "Cosplay is about feeling empowered and unstoppable in your own skin. Own it!",
    "Hammer those rivets down clean! Perfection is the only standard we accept!"
  ],
  'Marin Kitagawa': [
    "OMG, that looks so totally incredible! Your stitching is super on point!",
    "Cosplaying the characters you adore is literally the best feeling in the universe!",
    "Don't stress over tiny mistakes! Con day is about having tons of fun with friends!",
    "Gojou-kun would be super proud of this craftsmanship! Keep up that amazing energy!"
  ],
  'Nezuko Kamado': [
    "Mmh mmph! Keep moving forward, your cosplay journey is truly inspiring!",
    "A warm smile and a kind heart make every costume shine brighter.",
    "Family and friends will cheer you on when you debut this look!",
    "Stay strong, rest your hands, and craft with your whole heart!"
  ],
  'Tanjiro Kamado': [
    "Set your heart ablaze! No matter how difficult the craft, never give up!",
    "Focus your breathing and take each seam one stitch at a time.",
    "I can smell your dedication! This cosplay will bring smiles to so many people.",
    "Even when your needles break, forge ahead with honor and determination!"
  ],
  'Levi Ackerman': [
    "Tch. Keep your workspace clean. Clutter ruins the finish on your gear.",
    "The decision you made to craft this: own it, and make it without regrets.",
    "Tighten the harness straps securely. Sloppy fittings won't survive the convention.",
    "Not bad. With enough practice, your craftsmanship might actually impress me."
  ],
  'Mikasa Ackerman': [
    "This world is cruel, but bringing stories to life makes it beautiful.",
    "I will stand by your side while you finish this project. Stay focused.",
    "A sturdy stitch will hold through anything. Keep your hands steady.",
    "Wrap your scarf, hold your head high, and be proud of what you've created."
  ],
  'Frieren': [
    "A thousand years from now, memories of crafting this with friends will remain.",
    "Magic takes time and patient study. So does fine embroidery.",
    "There is no need to rush. Enjoy each quiet moment of making something new.",
    "Let's collect another rare grimoire—or perhaps just another roll of quality fabric."
  ],
  'Fern': [
    "Mage Frieren said we must practice every day. Have you finished your daily stitching?",
    "A neat and tidy costume reflects proper discipline. Well done.",
    "Please do not stay up all night crafting. Sufficient rest is essential.",
    "Your progress is quite impressive. I am glad to see your dedication."
  ],
  'Monkey D. Luffy': [
    "I'm gonna be King of the Cosplayers! Let's build the greatest crew and costume!",
    "Need more energy for crafting? Eat some meat and get right back to building!",
    "No one laughs at your dream! Put on that hat and embark on the grand line!",
    "Shishishi! That outfit looks so awesome, I wanna wear it right now!"
  ],
  'Naruto Uzumaki': [
    "Believe it! Never going back on my word—that's my ninja crafting way!",
    "Shadow clone jutsu would make sewing ten times faster! But hard work pays off!",
    "From genin crafter to hokage-level artisan! Keep pushing your limits!",
    "When people see you at the convention, they're gonna know your name!"
  ]
};

async function confirmPrompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${question} (y/N): `, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isForce = args.includes('--force');

  console.log('====================================================');
  console.log('  Cosplay Planner - ElevenLabs Voice Pre-Generator  ');
  console.log('====================================================');

  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5';
  const apiKey = (process.env.ELEVENLABS_API_KEY || '').trim();

  const status = quotaManager.getStatus();
  console.log(`Model: ${modelId}`);
  console.log(`Current Month: ${status.month}`);
  console.log(`ElevenLabs Credits Used: ${status.elevenLabs.creditsUsed} / ${ELEVENLABS_MONTHLY_CAP} (${status.elevenLabs.percentUsed}%)`);

  // Calculate ungenerated clips
  const pendingClips = [];
  let existingCount = 0;
  let totalChars = 0;

  for (const [charName, lines] of Object.entries(CURATED_LINES)) {
    const charVoice = resolveCharacterVoice(charName);
    const voiceId = charVoice.elevenLabsVoiceId;

    for (const text of lines) {
      const cacheSettings = { isJapanese: false, gender: charVoice.gender, character: charVoice.characterKey };
      const hash = audioCache.computeHash(text, voiceId, modelId, cacheSettings);

      if (audioCache.has(hash)) {
        existingCount++;
      } else {
        const charCost = text.length;
        totalChars += charCost;
        pendingClips.push({
          character: charName,
          text,
          voiceId,
          hash,
          charCount: charCost
        });
      }
    }
  }

  // Multiplier: Flash models charge ~0.5 credits per character
  const multiplier = modelId.includes('flash') ? 0.5 : 1.0;
  const estimatedCredits = Math.ceil(totalChars * multiplier);

  console.log(`\nScan Summary:`);
  console.log(`- Total Curated Lines: ${existingCount + pendingClips.length}`);
  console.log(`- Already Cached Clips: ${existingCount}`);
  console.log(`- Pending Clips to Generate: ${pendingClips.length}`);
  console.log(`- Total Characters: ${totalChars}`);
  console.log(`- Estimated ElevenLabs Credits: ~${estimatedCredits} credits`);

  if (pendingClips.length === 0) {
    console.log(`\n✨ All curated lines are already generated and cached! Nothing to do.`);
    process.exit(0);
  }

  // Free-tier 60% allowance check (6,000 credits)
  const allowanceThreshold = ELEVENLABS_MONTHLY_CAP * 0.6; // 6,000 credits
  if (estimatedCredits > allowanceThreshold) {
    console.warn(`\n⚠️  WARNING: This run would use ~${estimatedCredits} credits (> 60% of monthly 10,000 credit cap).`);
    if (!isForce && !isDryRun) {
      const confirmed = await confirmPrompt('Do you wish to proceed with generating these clips?');
      if (!confirmed) {
        console.log('Aborted by user.');
        process.exit(0);
      }
    }
  }

  if (isDryRun) {
    console.log(`\n[DRY RUN] Execution plan verified. No external API requests were sent.`);
    console.log(`Run 'npm run voices:generate' to perform the generation.`);
    process.exit(0);
  }

  // Verify API Key
  if (!apiKey) {
    console.error(`\n❌ Error: ELEVENLABS_API_KEY is not set in .env. Please configure your key.`);
    process.exit(1);
  }

  if (!apiKey.startsWith('sk_')) {
    console.warn(`\n⚠️  Notice: The current ELEVENLABS_API_KEY does not start with 'sk_'.`);
    console.warn(`ElevenLabs requires the secret API key (starts with 'sk_'), not the Key ID.`);
    console.warn(`If ElevenLabs returns an auth error, clips will fall back to browser voice in the UI.`);
  }

  console.log(`\nStarting voice synthesis for ${pendingClips.length} clips...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pendingClips.length; i++) {
    const item = pendingClips[i];
    process.stdout.write(`[${i + 1}/${pendingClips.length}] ${item.character}: "${item.text.slice(0, 32)}..." `);

    try {
      const result = await elevenLabsProvider.synthesize(item.text, item.voiceId, { modelId });
      quotaManager.recordElevenLabsUsage(result.creditsUsed);
      audioCache.set(item.hash, result.audioBuffer, {
        engine: 'elevenlabs',
        character: item.character,
        text: item.text,
        credits: result.creditsUsed
      });

      console.log(`✓ (${result.creditsUsed} credits)`);
      successCount++;

      // Brief sleep between requests
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.log(`✗ Failed: ${err.message}`);
      failCount++;

      if (
        err.message.includes('auth') ||
        err.message.includes('disabled') ||
        err.message.includes('API key ID') ||
        err.message.includes('secret key') ||
        err.message.includes('api_key_id_used_as_api_key')
      ) {
        console.error(`\n❌ Stopping batch: ElevenLabs key authentication rejected.`);
        console.error(`Please update ELEVENLABS_API_KEY in .env with your 'sk_...' secret key from https://elevenlabs.io.`);
        break;
      }
    }
  }

  console.log(`\n====================================================`);
  console.log(`Pre-generation Complete:`);
  console.log(`- Successfully Generated: ${successCount}`);
  console.log(`- Failed: ${failCount}`);
  console.log(`- Total Cached Clips Now: ${audioCache.count()}`);
  console.log(`====================================================`);
}

run().catch(err => {
  console.error('Fatal script error:', err);
  process.exit(1);
});
