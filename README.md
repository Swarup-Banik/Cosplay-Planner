# Cosplay Planner (コスプレ・プランナー)

> **"Turn your favorite characters into your next cosplay."**
> An elegant anime character discovery platform combined with a personal cosplay organizer and interactive character companion.

---

## ✨ Features & Architecture

### 1. 🌸 Aesthetic & Visual Design
- **Pastel Palette**: Lavender, blush pink, cream, soft blue, and deep midnight navy accents for readability.
- **Glassmorphic UI**: Translucent glass panels (`backdrop-filter: blur`), subtle gradients, soft shadows, and gentle anime glow effects.
- **Micro-Interactions & Audio**: Synthesized Web Audio API sound effects (soft glass chime on click, magical celebration chime on item completion) plus `canvas-confetti` celebrations.

### 2. 🔍 Character Discovery & Search
- **Instant Search**: Live search matching character names (English & Romanji), Japanese names, anime series, archetype tags, and role descriptions.
- **Multi-Criteria Filtering**: Filter by Series, Crafting Difficulty (Beginner, Intermediate, Advanced, Master), and Gender.
- **Curated Roster**: Rich starter database featuring:
  - **Gojo Satoru** (*Jujutsu Kaisen*)
  - **Yor Forger** (*Spy × Family*)
  - **Anya Forger** (*Spy × Family*)
  - **Frieren** (*Frieren: Beyond Journey's End*)
  - **Marin Kitagawa** (*My Dress-Up Darling*)
  - **Makima** (*Chainsaw Man*)
  - **Tanjiro Kamado** (*Demon Slayer*)
  - **Megumi Fushiguro** (*Jujutsu Kaisen*)
  - **Fern** (*Frieren: Beyond Journey's End*)

### 3. 🎭 Immersive Character Profile
- **Full-Screen Cinema Mode**: Dominated by high-resolution character artwork with blurred ambient background artwork and Kanji overlays.
- **Sections**:
  - **About & Lore**: Archetype tags, voice actor (CV) details, animation studio, and debut season.
  - **Abilities & Special Moves**: Interactive accordions detailing inherited techniques, energy costs, and domain expansions.
  - **Character Stats**: Visual attribute bars (Strength, Speed, Technique, Defense, Intelligence, Energy) labeled as community consensus ratings.
  - **Cosplay Crafting Guide**: Wig styling breakdown, makeup & lenses notes, fabric recommendations, and prop safety advice.

### 4. 📋 Cosplay Checklist & Planner
- **Automatic Item Generation**: Automatically seeds essential garments, wigs, contact lenses, footwear, and props upon adding a character to "My Cosplay".
- **Real-Time Progress Tracking**: Dynamic animated progress bar (`60% complete • 6 / 10 items ready`).
- **Status Lifecycle**: `Missing` → `In Progress` → `Acquired` → `Completed`.
- **Custom Item Creator**: Add custom props or accessories with categories, notes, budget estimates, reference images, and shopping URLs.
- **Persistent Storage**: All saved projects and custom items persist automatically across sessions via `localStorage`.

### 5. 🤖 Interactive Character Mode ("Talk to Character")
- **Live Companion**: Character portrait with speaking aura.
- **Checklist-Aware Intelligence**: Ask *"What do I still need for this cosplay?"* and the character inspects the live checklist, reporting missing and in-progress items.
- **Voice Interaction**:
  - **Speech-to-Text (STT)**: Microphone button using the browser's Web Speech API.
  - **Text-to-Speech (TTS)**: In-character voice readouts with calibrated pitch and cadence.

### 6. 📖 Community & Resources
- **Community Showcases**: Real cosplayer showcases with materials breakdowns and crafting secrets.
- **Knowledge Base**: Deep guides on EVA foam density and beveling, gravity-defying wig spiking with got2b spray, circle lens safety protocols, and the con-day SOS emergency kit.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 💖 Personal Touch
Look for the subtle heart in the footer: *"Made with love for a fellow cosplay lover ♡"*.
