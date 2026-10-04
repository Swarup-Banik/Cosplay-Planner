# 🎙️ Voice & TTS Setup Guide — Cosplay Planner

Cosplay Planner uses a 3-tier hybrid speech synthesis architecture designed to maximize voice quality while strictly protecting free-tier allowances:

1. **ElevenLabs (Primary Neural Engine)**: Used for short, curated lines (≤ 150 characters), catchphrases, and greetings.
2. **Azure Speech (Backup Neural Engine)**: Used for long replies (> 150 characters, e.g. companion chat or bios) and automatic failover.
3. **Web Speech API (Browser Fallback Engine)**: Always-available zero-dependency fallback when offline or when API limits are reached.

---

## 1. Quick Start (.env Configuration)

Create or update your `.env` file in the project root:

```bash
# ElevenLabs Settings (Primary Engine)
# IMPORTANT: In ElevenLabs dashboard, copy the secret key starting with 'sk_' (NOT the key ID)
ELEVENLABS_API_KEY=sk_your_actual_elevenlabs_secret_key_here
ELEVENLABS_MODEL_ID=eleven_flash_v2_5

# Azure Speech Settings (Backup Engine - Optional)
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=eastus

# Server Proxy Port (default 3001)
PORT=3001
```

> **Security Note**: Never commit `.env` to Git. `.env` is already included in `.gitignore`.

---

## 2. Setting Up ElevenLabs (Free Tier)

### Step 1: Create an Account
1. Visit [elevenlabs.io](https://elevenlabs.io) and sign up for a free account.
2. The free tier includes **10,000 credits/month** (resets monthly).

### Step 2: Generate an API Key (Secret Key)
1. In the bottom-left corner of the ElevenLabs dashboard, click your **Profile** icon and select **API Keys**.
2. Click **+ Create API Key**.
3. ⚠️ **CRITICAL**: ElevenLabs displays two values:
   - **Key ID**: A 64-character hexadecimal string. *(Do NOT use this as your key).*
   - **Secret Key**: A string starting with **`sk_`** (e.g., `sk_4a8b...`).
4. **Copy the Secret Key starting with `sk_`** and paste it into `.env`:
   ```bash
   ELEVENLABS_API_KEY=sk_your_secret_key_here
   ```

### Step 3: Choose a Model
By default, Cosplay Planner uses `eleven_flash_v2_5`, a low-latency model that costs only ~0.5 credits per character:
- `eleven_flash_v2_5` (Recommended, 2x credit efficiency)
- `eleven_turbo_v2_5`
- `eleven_multilingual_v2`

---

## 3. Setting Up Azure Speech (Optional Backup)

Azure Speech provides **500,000 characters/month** free on the F0 tier.

1. Go to the [Azure Portal](https://portal.azure.com/).
2. Create a resource -> **Cognitive Services** -> **Speech Service**.
3. Under Pricing Tier, select **Free F0 (500,000 Characters per month)**.
4. Once deployed, open **Keys and Endpoint**:
   - Copy **Key 1** to `AZURE_SPEECH_KEY` in `.env`.
   - Copy **Location/Region** (e.g. `eastus`, `westeurope`) to `AZURE_SPEECH_REGION` in `.env`.

---

## 4. Running the Development Server

### Option A: Standard Development (Recommended)
Vite dev server has built-in middleware for `/api/tts/*`, so you only need to run:
```bash
npm run dev
```
Both the frontend and the secure voice proxy run together on `http://localhost:5173`.

### Option B: Standalone Proxy Server
If you want to run the proxy on a dedicated port (3001) alongside Vite:
```bash
npm run dev:all
# or in two separate terminals:
# Terminal 1: npm run proxy
# Terminal 2: npm run dev
```

---

## 5. Pre-Generating Curated Character Voices (`voices:generate`)

To avoid repeated API calls, you can pre-generate all curated lines in batch. Clips are permanently saved to `server/cache/audio/` and served at zero credit cost thereafter.

### Dry-Run (Preview Cost without API Calls)
```bash
npm run voices:generate -- --dry-run
```
Output:
```text
Scan Summary:
- Total Curated Lines: 60
- Already Cached Clips: 0
- Pending Clips to Generate: 60
- Total Characters: 4401
- Estimated ElevenLabs Credits: ~2201 credits
```

### Full Generation Run
```bash
npm run voices:generate
```
- Skips clips that are already cached.
- Automatically asks for confirmation if the batch exceeds 60% (6,000 credits) of your monthly allowance.
- You can pass `--force` to bypass prompts in CI.

---

## 6. How Quota Protection Works

- **ElevenLabs Free Cap**: 10,000 credits/month.
  - Hard stop at **80% (8,000 credits)**. Calls automatically fail over to Azure Speech or browser voices to prevent account suspension.
- **Azure Speech Free Cap**: 500,000 characters/month.
  - Hard stop at **80% (400,000 characters)**.
- **Automatic Reset**: Counters automatically reset on the 1st of each calendar month.
- **Disk & IndexedDB Caching**: Every audio clip is cached by hash (`text + voice + model`). Cache hits **never** consume API credits or characters.

---

## 7. Voice Settings & Diagnostics in UI

Click the voice engine badge (`ElevenLabs` / `Azure Backup` / `Basic Voice`) next to the sound controls on any character profile to inspect:
- Currently active engine.
- Real-time remaining quota progress bars for ElevenLabs and Azure.
- Warnings (e.g. if an invalid key or key ID was supplied).
- A one-click **"Preview Active Voice"** test button.

---

## 8. Attribution Requirements

As required by ElevenLabs Free Tier terms of service:
- Footer attribution is displayed across the app:
  > *"Some voices generated with ElevenLabs. All voices are AI-generated, original character-style voices, not the actual voice actors. Fan project, not for commercial use."*
