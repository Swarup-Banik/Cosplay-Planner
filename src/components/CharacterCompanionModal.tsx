import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  User, 
  Layers, 
  HelpCircle,
  Scissors,
  CheckCircle2
} from 'lucide-react';
import { Character, DialogueMessage } from '../types';
import { useCosplay } from '../context/CosplayContext';
import { CharacterCompanionService } from '../services/characterCompanion';
import { sound } from '../utils/audio';

const AudioWaveform: React.FC<{ speaking: boolean; color?: string }> = ({ speaking, color = '#AC7DE8' }) => {
  return (
    <div className="flex items-center gap-1 h-5 px-1.5">
      {[0.1, 0.4, 0.2, 0.5, 0.3].map((delay, idx) => (
        <span
          key={idx}
          className="w-1 rounded-full transition-all duration-300"
          style={{
            backgroundColor: color,
            height: speaking ? '18px' : '4px',
            animation: speaking ? `waveBar 0.6s ease-in-out infinite alternate ${delay}s` : 'none',
            transformOrigin: 'center'
          }}
        />
      ))}
    </div>
  );
};

const TypewriterMessage: React.FC<{ text: string; isLatest: boolean }> = ({ text, isLatest }) => {
  const [displayedText, setDisplayedText] = useState(isLatest ? '' : text);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      i += 2;
      if (i >= text.length) {
        setDisplayedText(text);
        clearInterval(timer);
      } else {
        setDisplayedText(text.slice(0, i));
      }
    }, 18);

    return () => clearInterval(timer);
  }, [text, isLatest]);

  return (
    <div className="whitespace-pre-line font-light">
      {displayedText}
      {isLatest && displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 bg-lavender-400 ml-1 animate-pulse" />
      )}
    </div>
  );
};

const TypingIndicator: React.FC<{ characterName: string; accentColor?: string }> = ({ accentColor = '#AC7DE8' }) => (
  <div className="flex items-center gap-1.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md max-w-[90px] border border-white/10 animate-fadeIn">
    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '0ms' }} />
    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '150ms' }} />
    <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: '300ms' }} />
  </div>
);

interface CharacterCompanionModalProps {
  characterId: string;
  onClose: () => void;
  onOpenChecklist?: (projectId: string) => void;
}

export const CharacterCompanionModal: React.FC<CharacterCompanionModalProps> = ({
  characterId,
  onClose,
  onOpenChecklist
}) => {
  const { getCharacterById, getProjectForCharacter } = useCosplay();
  const character = getCharacterById(characterId);
  const currentProject = getProjectForCharacter(characterId);

  const [messages, setMessages] = useState<DialogueMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initial welcome message from character
  useEffect(() => {
    if (!character) return;
    sound.playSwoop();

    const greeting = character.personality?.greeting || `Hello! I'm ${character.name} from ${character.series}. Are you ready to plan this cosplay together?`;
    const welcomeMsg: DialogueMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'character',
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);

    if (voiceEnabled) {
      CharacterCompanionService.speak(greeting, character);
    }

    return () => {
      CharacterCompanionService.stopSpeaking();
    };
  }, [characterId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        CharacterCompanionService.stopSpeaking();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [character, currentProject]);

  if (!character) return null;

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your message!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        sound.playClick();
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Speech recognition error', err);
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    sound.playClick();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMessage: DialogueMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // 2. Generate Context-Aware Response
    setTimeout(() => {
      setIsTyping(false);
      const response = CharacterCompanionService.generateResponse(
        character,
        text,
        currentProject
      );

      const characterMessage: DialogueMessage = {
        id: `msg-char-${Date.now()}`,
        sender: 'character',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, characterMessage]);

      if (voiceEnabled) {
        setIsSpeaking(true);
        CharacterCompanionService.speak(response.text, character, () => {
          setIsSpeaking(false);
        });
      }
    }, 500);
  };

  const quickPrompts = [
    'What do I still need for this cosplay?',
    'Any tips for styling your wig?',
    'Which fabrics work best for your outfit?',
    'Tell me about your special abilities!'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[820px] rounded-3xl bg-gradient-to-b from-[#181528] to-[#120F20] border border-lavender-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-white flex flex-col overflow-hidden">
        
        {/* Atmosphere Glowing Ambient Gradient in Header */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-dream-600/20 via-blush-500/10 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
          
          <div className="flex items-center gap-3.5">
            {/* Character Present Avatar with Breathing Aura */}
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                  isSpeaking
                    ? 'border-blush-400 shadow-glow-pink scale-105'
                    : 'border-lavender-400 shadow-glow-lavender'
                }`}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online Indicator */}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#181528]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                  {character.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lavender-500/20 text-lavender-300 border border-lavender-500/30">
                  AI Companion
                </span>
              </div>
              <p className="text-xs text-white/60">
                {character.series} {character.personality?.traits?.length ? `• ${character.personality.traits.join(', ')}` : ''}
              </p>
            </div>
          </div>

          {/* Animated Pulsing Audio Waveform / Orb */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isSpeaking ? 'scale-125 animate-ping opacity-90' : 'opacity-40'
              }`}
              style={{ backgroundColor: character.accentColor || '#AC7DE8' }}
            />
            <AudioWaveform speaking={isSpeaking} color={character.accentColor || '#AC7DE8'} />
            <span className="text-[11px] font-mono text-white/60">
              {isSpeaking ? 'Speaking' : isTyping ? 'Thinking...' : 'Ready'}
            </span>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center gap-2">
            {/* Voice Speech Synthesis Toggle */}
            <button
              onClick={() => {
                if (voiceEnabled) {
                  CharacterCompanionService.stopSpeaking();
                }
                setVoiceEnabled(!voiceEnabled);
              }}
              className={`p-2 rounded-xl border transition-all ${
                voiceEnabled
                  ? 'bg-lavender-500/30 text-lavender-200 border-lavender-400/40'
                  : 'bg-white/5 text-white/40 border-white/10'
              }`}
              title={voiceEnabled ? 'Character Voice Readout Active' : 'Character Voice Muted'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Live Project Status Notification Bar */}
        {currentProject && (
          <div className="px-6 py-2 bg-lavender-950/40 border-b border-white/5 flex items-center justify-between text-xs text-lavender-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Active checklist: {currentProject.items.filter(i => i.status === 'Completed').length} / {currentProject.items.length} items complete
              </span>
            </div>
            {onOpenChecklist && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChecklist(currentProject.id);
                }}
                className="underline hover:text-white font-medium text-[11px]"
              >
                View Plan
              </button>
            )}
          </div>
        )}

        {/* Message History Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 border border-lavender-400/40 mt-1"
                  />
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-dream-600 to-lavender-600 text-white rounded-tr-none shadow-md'
                      : 'bg-white/10 text-white/95 rounded-tl-none border border-white/10 backdrop-blur-md shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <div className="whitespace-pre-line font-light">
                      {msg.text}
                    </div>
                  ) : (
                    <TypewriterMessage
                      text={msg.text}
                      isLatest={idx === messages.length - 1}
                    />
                  )}
                  <div
                    className={`text-[10px] mt-1.5 ${
                      isUser ? 'text-white/70 text-right' : 'text-white/40 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-dream-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <img
                src={character.image}
                alt={character.name}
                className="w-8 h-8 rounded-xl object-cover shrink-0 border border-lavender-400/40 mt-1"
              />
              <TypingIndicator characterName={character.name} accentColor={character.accentColor || '#AC7DE8'} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Suggestions */}
        <div className="px-4 sm:px-6 py-2 bg-black/20 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-lavender-400 shrink-0">
            Ask character:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 whitespace-nowrap transition-all shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Speech to Text */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#151224]/90">
          {speechError && (
            <div className="text-[11px] text-rose-300 mb-2 px-1">
              {speechError}
            </div>
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-glow-pink'
                  : 'bg-white/10 hover:bg-white/15 text-lavender-300 border-white/15'
              }`}
              title={isListening ? 'Listening... Click to stop' : 'Click to speak to character'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to your voice... Speak now...'
                  : `Ask ${character.name.split(' ')[0]} about cosplay materials, wig styling, lore...`
              }
              className="flex-1 py-3 px-4 rounded-2xl bg-white/10 border border-white/15 focus:border-lavender-400 focus:outline-none text-xs sm:text-sm text-white placeholder-white/40"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-500 text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
