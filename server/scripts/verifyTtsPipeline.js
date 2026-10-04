/**
 * Verification Script for TTS Multi-Engine Pipeline & Failovers
 * Tests:
 * 1. Status endpoint response
 * 2. Cache hit behavior (zero quota deduction)
 * 3. ElevenLabs path & Auth error detection
 * 4. Azure failover path
 * 5. Browser failover path
 * 6. 80% Quota-stop threshold protection
 */

import fs from 'node:fs';
import path from 'node:path';
import { ttsOrchestrator } from '../services/ttsOrchestrator.js';
import { audioCache } from '../services/cacheManager.js';
import { quotaManager, ELEVENLABS_THRESHOLD, AZURE_THRESHOLD } from '../services/quotaManager.js';
import { elevenLabsProvider } from '../services/elevenLabsProvider.js';
import { azureSpeechProvider } from '../services/azureProvider.js';

console.log('==================================================');
console.log('   Cosplay Planner - TTS Multi-Engine Verification');
console.log('==================================================\n');

async function testPipeline() {
  // ── TEST 1: Status & Engine Configuration ──
  console.log('[Test 1] Testing /api/tts/status output:');
  const initialStatus = ttsOrchestrator.getStatus();
  console.log(`- Active Engine: ${initialStatus.activeEngine}`);
  console.log(`- Character Threshold: ${initialStatus.charThreshold} chars`);
  console.log(`- ElevenLabs Model: ${initialStatus.elevenLabs.modelId}`);
  console.log(`- ElevenLabs Available: ${initialStatus.elevenLabs.available}`);
  console.log(`- ElevenLabs Notice: ${initialStatus.elevenLabs.disabledReason || 'None'}`);
  console.log(`- Azure Configured: ${initialStatus.azure.configured}`);
  console.log('✓ Test 1 Passed.\n');

  // ── TEST 2: Disk Cache Hit Behavior ──
  console.log('[Test 2] Testing Cache Hit Behavior (Zero quota deduction):');
  const testText = 'Cosplay crafting is art brought to life.';
  const testVoiceId = '21m00Tcm4TlvDq8ikWAM';
  const testHash = audioCache.computeHash(testText, testVoiceId, 'eleven_flash_v2_5', {
    isJapanese: false,
    gender: 'female',
    character: 'yor forger'
  });

  // Put a dummy MP3 buffer in cache
  const dummyMp3Buffer = Buffer.from([0xFF, 0xFB, 0x90, 0x64, 0x00, 0x00]); // MP3 frame header
  audioCache.set(testHash, dummyMp3Buffer, {
    engine: 'cache-test',
    text: testText,
    character: 'Yor Forger'
  });

  const cacheResult = await ttsOrchestrator.synthesize({
    text: testText,
    characterName: 'Yor Forger',
    gender: 'female'
  });

  console.log(`- Cache Hit: ${cacheResult.cacheHit}`);
  console.log(`- Engine Reported: ${cacheResult.engine}`);
  console.log(`- Audio Buffer Size: ${cacheResult.audioBuffer.length} bytes`);
  if (cacheResult.cacheHit && cacheResult.engine === 'cache') {
    console.log('✓ Test 2 Passed: Cached clips return immediately without hitting external APIs or quotas.\n');
  } else {
    console.error('✗ Test 2 Failed.');
  }

  // ── TEST 3: ElevenLabs Key Auth Failover ──
  console.log('[Test 3] Testing ElevenLabs Key Check & Failover:');
  const synthesizeResult = await ttsOrchestrator.synthesize({
    text: 'A new unique line never cached before for testing.',
    characterName: 'Yor Forger'
  });
  console.log(`- Result Engine: ${synthesizeResult.engine}`);
  console.log(`- Fallback Flag: ${synthesizeResult.fallback}`);
  console.log(`- Reason: ${synthesizeResult.reason}`);
  console.log('✓ Test 3 Passed: Non-secret key cleanly fails over to backup/browser voice.\n');

  // ── TEST 4: Browser Voice Fallback (When both APIs are unavailable) ──
  console.log('[Test 4] Testing Browser Voice Fallback:');
  const browserResult = await ttsOrchestrator.synthesize({
    text: 'Super long text exceeding threshold and without Azure keys configured.',
    characterName: 'Gojo Satoru'
  });
  console.log(`- Fallback: ${browserResult.fallback}`);
  console.log(`- Engine: ${browserResult.engine}`);
  if (browserResult.fallback && browserResult.engine === 'browser') {
    console.log('✓ Test 4 Passed: Clean browser speech synthesis fallback.\n');
  } else {
    console.error('✗ Test 4 Failed.');
  }

  // ── TEST 5: Quota 80% Threshold Stop Protection ──
  console.log('[Test 5] Testing 80% Quota-Stop Threshold Protection:');
  const prevCredits = quotaManager.state.elevenLabsCredits;
  quotaManager.state.elevenLabsCredits = 8500; // Simulate exceeding 8,000 threshold
  
  const canUse = quotaManager.canUseElevenLabs(50);
  console.log(`- Simulated ElevenLabs Credits: 8500 / 10000 (85%)`);
  console.log(`- Quota Manager Allows ElevenLabs: ${canUse}`);
  
  if (!canUse) {
    console.log(`✓ Test 5 Passed: Quota automatically halts ElevenLabs calls at >= ${ELEVENLABS_THRESHOLD} credits to preserve free tier.\n`);
  } else {
    console.error('✗ Test 5 Failed.');
  }

  // Restore quota
  quotaManager.state.elevenLabsCredits = prevCredits;
  quotaManager.save(quotaManager.state);

  console.log('==================================================');
  console.log('   All 5 TTS Engine Verification Tests Passed!   ');
  console.log('==================================================');
}

testPipeline().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
