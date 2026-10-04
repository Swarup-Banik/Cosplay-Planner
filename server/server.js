/**
 * TTS Proxy Server for Cosplay Planner
 * Provides secure server-side neural TTS proxying for ElevenLabs & Azure Speech.
 * API keys remain strictly server-side in .env.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ttsOrchestrator } from './services/ttsOrchestrator.js';
import { audioCache } from './services/cacheManager.js';

// Auto-load .env if not loaded
function loadEnv() {
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
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT || '3001', 10);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
}

export function handleTtsRequest(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // 1. GET /api/tts/status
  if (req.method === 'GET' && pathname === '/api/tts/status') {
    const status = ttsOrchestrator.getStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status, null, 2));
    return;
  }

  // 2. GET /api/tts/cache/:hash
  if (req.method === 'GET' && pathname.startsWith('/api/tts/cache/')) {
    const hash = pathname.replace('/api/tts/cache/', '').replace('.mp3', '');
    if (audioCache.has(hash)) {
      const buffer = audioCache.get(hash);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'X-Cache': 'HIT',
        'X-TTS-Engine': 'cache'
      });
      res.end(buffer);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Cached clip not found' }));
    }
    return;
  }

  // 3. POST /api/tts/synthesize
  if (req.method === 'POST' && pathname === '/api/tts/synthesize') {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
      if (bodyData.length > 50000) {
        req.destroy(); // Protect against payload flood
      }
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyData || '{}');
        const result = await ttsOrchestrator.synthesize(payload);

        if (result.fallback) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }

        res.writeHead(200, {
          'Content-Type': result.contentType || 'audio/mpeg',
          'Content-Length': result.audioBuffer.length,
          'X-Cache': result.cacheHit ? 'HIT' : 'MISS',
          'X-TTS-Engine': result.engine,
          'X-TTS-Hash': result.hash || ''
        });
        res.end(result.audioBuffer);
      } catch (err) {
        console.error('[TTS Server] Synthesis handler error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message, fallback: true, engine: 'browser' }));
      }
    });
    return;
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

// Start standalone HTTP server when executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/tts')) {
      handleTtsRequest(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });

  server.listen(PORT, () => {
    console.log(`[TTS Server] Secure Voice Proxy running on http://localhost:${PORT}`);
    const status = ttsOrchestrator.getStatus();
    console.log(`[TTS Server] Primary Engine: ElevenLabs (Available: ${status.elevenLabs.available})`);
    console.log(`[TTS Server] Backup Engine: Azure Speech (Available: ${status.azure.available})`);
    console.log(`[TTS Server] Active Engine: ${status.activeEngine.toUpperCase()}`);
    if (status.elevenLabs.disabledReason) {
      console.warn(`[TTS Server] ElevenLabs Status: ${status.elevenLabs.disabledReason}`);
    }
  });
}
