import { Character, CosplayProject } from '../types';

export interface CompanionResponse {
  text: string;
  suggestedAction?: 'view_checklist' | 'add_item';
  spokenText?: string;
}

export class CharacterCompanionService {
  /**
   * Generates a context-aware in-character response.
   * Accesses character personality, lore, and live cosplay checklist.
   */
  static generateResponse(
    character: Character,
    userQuery: string,
    currentProject?: CosplayProject | null
  ): CompanionResponse {
    const q = userQuery.toLowerCase().trim();

    // 1. Checklist and Progress Queries
    const isChecklistQuery =
      q.includes('what do i still need') ||
      q.includes('what do i need') ||
      q.includes('what is left') ||
      q.includes("what's left") ||
      q.includes('checklist') ||
      q.includes('progress') ||
      q.includes('missing') ||
      q.includes('how far') ||
      q.includes('ready');

    if (isChecklistQuery) {
      if (!currentProject || currentProject.items.length === 0) {
        return this.formatChecklistNotStartedResponse(character);
      }

      const missing = currentProject.items.filter(i => i.status === 'Missing');
      const inProgress = currentProject.items.filter(i => i.status === 'In Progress');
      const completed = currentProject.items.filter(i => i.status === 'Completed' || i.status === 'Acquired');
      const percent = Math.round((completed.length / currentProject.items.length) * 100);

      return this.formatChecklistStatusResponse(character, missing, inProgress, completed, percent);
    }

    // 2. Budget and Cost Queries
    if (q.includes('cost') || q.includes('price') || q.includes('budget') || q.includes('expensive')) {
      if (currentProject) {
        const totalEstimated = currentProject.items.reduce((sum, item) => sum + item.estimatedPrice, 0);
        return {
          text: this.wrapInCharacterVoice(
            character,
            `Our estimated planning budget is around ₹${totalEstimated.toLocaleString('en-IN')}. Focus on the signature centerpiece first—quality fabrics make all the difference on convention floor photos!`
          )
        };
      }
      return {
        text: this.wrapInCharacterVoice(
          character,
          `Cosplay costs vary depending on whether you commission or craft! For my outfit, the signature garments and props usually average around ₹${character.cosplayItems.reduce((s, i) => s + i.estimatedPrice, 0).toLocaleString('en-IN')}.`
        )
      };
    }

    // 3. Wig Styling advice
    if (q.includes('wig') || q.includes('hair') || q.includes('spikes') || q.includes('braid') || q.includes('pigtail')) {
      const wigTip = character.cosplayTips?.wigStyling || `For my hairstyle, focus on getting the base color and volume accurate. Heat-resistant synthetic fibers styled with low-heat airflow and firm hold spray will keep it in place all convention day!`;
      return {
        text: this.wrapInCharacterVoice(character, `For my hair: ${wigTip}`)
      };
    }

    // 4. Makeup & Contact Lenses
    if (q.includes('makeup') || q.includes('contact') || q.includes('eyes') || q.includes('lens') || q.includes('lenses') || q.includes('face')) {
      const makeupTip = character.cosplayTips?.makeupDetails || `For facial styling, make sure your eye contours match the anime aesthetic and consider prescription-safe colored contacts to capture my signature eye color!`;
      return {
        text: this.wrapInCharacterVoice(character, `For facial styling: ${makeupTip}`)
      };
    }

    // 5. Fabric & Sewing
    if (q.includes('fabric') || q.includes('sew') || q.includes('sewing') || q.includes('material') || q.includes('cloth') || q.includes('pattern')) {
      const fabricTip = character.cosplayTips?.fabricRecommendations || `For garments, look for breathable twill, suiting fabrics, or cotton blends with good drape so you stay comfortable during long photo walks!`;
      return {
        text: this.wrapInCharacterVoice(character, `My clothing specifications: ${fabricTip}`)
      };
    }

    // 6. Prop Crafting
    if (q.includes('prop') || q.includes('weapon') || q.includes('sword') || q.includes('staff') || q.includes('needle') || q.includes('blindfold')) {
      return {
        text: this.wrapInCharacterVoice(
          character,
          character.cosplayTips?.propGuide || `When crafting props, remember convention safety guidelines: use lightweight high-density EVA foam or 3D prints, avoid sharp metal, and ensure comfortable grip balance.`
        )
      };
    }

    // 7. Abilities and Lore
    if (q.includes('ability') || q.includes('abilities') || q.includes('power') || q.includes('technique') || q.includes('magic') || q.includes('moves')) {
      if (character.abilities && character.abilities.length > 0) {
        const topAbilities = character.abilities.map(a => `• **${a.name}**: ${a.description}`).join('\n');
        return {
          text: this.wrapInCharacterVoice(
            character,
            `Here is what you should know about my techniques:\n\n${topAbilities}`
          )
        };
      }
      return {
        text: this.wrapInCharacterVoice(
          character,
          `In ${character.series}, I am known for: ${character.description.slice(0, 300)}...`
        )
      };
    }

    // 8. Specific character keywords
    const nameLower = character.name.toLowerCase();
    if (nameLower.includes('gojo') && (q.includes('blindfold') || q.includes('eyes') || q.includes('infinity') || q.includes('purple'))) {
      return {
        text: `Haha! The Six Eyes take in way too much raw information without the blindfold. If you're wearing it at the convention, use a breathable stretch mesh so you don't bump into fellow sorcerers!`
      };
    }

    if (nameLower.includes('yor') && (q.includes('dinner') || q.includes('cook') || q.includes('loid') || q.includes('anya'))) {
      return {
        text: `Oh! Please don't ask about my cooking... Loid usually prepares dinner so nobody gets tummy aches! But if someone tries to harm Anya or you at the venue, my stilettos will resolve the matter instantly.`
      };
    }

    if (nameLower.includes('anya') && (q.includes('peanut') || q.includes('peanuts') || q.includes('waku') || q.includes('spy'))) {
      return {
        text: `*Waku waku!* Peanuts are Anya's favorite snack! Papa said if Anya does good at Eden Academy, he will buy a giant box. Don't forget my Chimera doll for your cosplay!`
      };
    }

    if (nameLower.includes('frieren') && (q.includes('himmel') || q.includes('mimic') || q.includes('chest') || q.includes('grimoire'))) {
      return {
        text: `Himmel once said that even small encounters can stay in someone's memory for eighty years... Also, if you see a treasure chest at the convention, there is a 99% chance it contains a rare spell, not a mimic. Let's check anyway.`
      };
    }

    if (nameLower.includes('luffy') && (q.includes('meat') || q.includes('ship') || q.includes('pirate') || q.includes('one piece'))) {
      return {
        text: `Shishishi! Meat is the absolute best fuel for any adventure! Pack snacks for the convention floor, grab that straw hat, and let's go!`
      };
    }

    if (nameLower.includes('naruto') && (q.includes('ramen') || q.includes('hokage') || q.includes('ninja') || q.includes('sasuke'))) {
      return {
        text: `Dattebayo! Never give up on your ninja way—or your cosplay! Let's get that headband polished and eat some delicious Ichiraku ramen after the con!`
      };
    }

    // 9. Greeting / General encouragement
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('yo') || q.includes('morning') || q.includes('evening')) {
      return {
        text: character.personality?.greeting || `Hello! Ready to plan this cosplay for ${character.name}?`
      };
    }

    // Default In-Character Reply
    return {
      text: this.wrapInCharacterVoice(
        character,
        `I am with you on this journey! Whether you need help styling the wig, checking off what's missing on the plan, or nailing the character pose, just ask me anytime.`
      )
    };
  }

  private static formatChecklistNotStartedResponse(character: Character): CompanionResponse {
    const nameLower = character.name.toLowerCase();
    if (nameLower.includes('gojo')) {
      return { text: `You haven't added me to your active cosplay list yet! Hit that **"Add to My Cosplay"** button and let's get your Six Eyes uniform prepared!` };
    }
    if (nameLower.includes('yor')) {
      return { text: `Oh my, it seems we haven't created a project file for my Thorn Princess attire yet. Please click **"Add to My Cosplay"** so we can keep our accessories organized!` };
    }
    if (nameLower.includes('anya')) {
      return { text: `*Gasp!* Anya's mission hasn't started yet! Click **"Add to My Cosplay"** so we can buy peanuts and Eden uniform!` };
    }
    if (nameLower.includes('frieren')) {
      return { text: `It appears we haven't started documenting this journey's supplies yet. Please add me to your plan so we can list the staff, capelet, and spellbook.` };
    }
    return {
      text: `You haven't started a cosplay project for me yet. Click the **"Add to My Cosplay"** button above to generate a full checklist!`
    };
  }

  private static formatChecklistStatusResponse(
    character: Character,
    missing: any[],
    inProgress: any[],
    completed: any[],
    percent: number
  ): CompanionResponse {
    if (percent === 100) {
      return {
        text: `★ **Congratulations!** Your cosplay is 100% complete! Every garment, wig, and accessory is ready. You are going to look absolutely stunning at your upcoming convention!`
      };
    }

    let statusBody = '';
    if (missing.length > 0) {
      const missingNames = missing.map(i => i.name).join(', ');
      statusBody += `You still have **${missing.length} missing items**: ${missingNames}. `;
    }

    if (inProgress.length > 0) {
      const inProgNames = inProgress.map(i => i.name).join(', ');
      statusBody += `Currently in progress: **${inProgNames}**. `;
    }

    statusBody += `Overall progress is at **${percent}%** (${completed.length} / ${missing.length + inProgress.length + completed.length} items acquired).`;

    return {
      text: this.wrapInCharacterVoice(character, statusBody)
    };
  }

  private static wrapInCharacterVoice(character: Character, message: string): string {
    const nameLower = character.name.toLowerCase();
    if (nameLower.includes('gojo')) {
      return `Heh, listen up: ${message} Don't sweat it too much—you're gonna look as honored as I am!`;
    }
    if (nameLower.includes('yor')) {
      return `Pardon me for advising, but here is my note: ${message} Please do take good care of yourself while crafting!`;
    }
    if (nameLower.includes('anya')) {
      return `*Anya's report!* ${message} Waku waku! Let's do our bestest!`;
    }
    if (nameLower.includes('frieren')) {
      return `Hmm, let's see... ${message} Take your time. Ten years or ten weeks, what matters is the diligence you pour into it.`;
    }
    if (nameLower.includes('marin')) {
      return `OMG listen! ${message} I'm cheering for you so hard! You're gonna totally rock this at the con!!`;
    }
    if (nameLower.includes('luffy')) {
      return `Shishishi! ${message} Let's do this!`;
    }
    if (nameLower.includes('naruto')) {
      return `Dattebayo! ${message} Keep moving forward with all your strength!`;
    }
    if (nameLower.includes('mikasa')) {
      return `Understood: ${message} Focus on precision and be prepared.`;
    }
    if (nameLower.includes('tanjiro')) {
      return `Stay strong! ${message} Keep moving forward with all your heart, step by step!`;
    }
    return `${message}`;
  }

  /**
   * Speak response using Web Speech Synthesis API with character-tailored voice tuning
   */
  static speak(text: string, character: Character, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Strip markdown formatting for TTS audio
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/•/g, '')
      .replace(/★/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = character.personality?.voicePitch || 1.0;
    utterance.rate = character.personality?.voiceRate || 1.0;

    // Pick pleasant natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  static stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
