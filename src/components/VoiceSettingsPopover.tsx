import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, AlertCircle, Play, Check, ShieldCheck, X, Cpu, RefreshCw } from 'lucide-react';
import { characterVoice, TTSStatusResponse } from '../services/characterVoiceService';

interface VoiceSettingsPopoverProps {
  characterName?: string;
}

export const VoiceSettingsPopover: React.FC<VoiceSettingsPopoverProps> = ({ characterName = 'Yor Forger' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<TTSStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    const data = await characterVoice.getStatus();
    setStatus(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  // Initial light fetch
  useEffect(() => {
    characterVoice.getStatus().then(setStatus);
  }, []);

  const handlePreview = async () => {
    if (isPlayingPreview) {
      characterVoice.stop();
      setIsPlayingPreview(false);
      return;
    }

    setIsPlayingPreview(true);
    const previewText = `Hello! This is an original character voice synthesis test for ${characterName}.`;

    try {
      await characterVoice.speak(
        previewText,
        { gender: 'female', pitch: 1.0, rate: 1.0, lang: 'en-US' },
        {
          characterName,
          onEnd: () => setIsPlayingPreview(false),
          onError: () => setIsPlayingPreview(false)
        }
      );
    } catch {
      setIsPlayingPreview(false);
    }
  };

  const getEngineDisplay = () => {
    if (!status) return { label: 'Voice System', badge: 'Checking...', color: 'bg-white/10 text-white/70' };

    if (status.activeEngine === 'elevenlabs') {
      return {
        label: 'ElevenLabs',
        badge: 'ElevenLabs Neural',
        color: 'bg-dream-500/20 text-dream-300 border-dream-500/30'
      };
    }
    if (status.activeEngine === 'azure') {
      return {
        label: 'Azure Backup',
        badge: 'Azure Speech Backup',
        color: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
      };
    }
    return {
      label: 'Basic Voice',
      badge: 'Browser Voice',
      color: 'bg-white/10 text-white/80 border-white/20'
    };
  };

  const engineInfo = getEngineDisplay();

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 ${engineInfo.color}`}
        title="View Voice Synthesis Engine & Quota Status"
        aria-label="Voice settings"
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>{engineInfo.label}</span>
      </button>

      {/* Popover Modal / Dropdown */}
      {isOpen && (
        <div className="fixed inset-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 z-50 flex items-center justify-center sm:block p-4 sm:p-0">
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-sm sm:w-96 rounded-3xl bg-[#161326] border border-white/15 p-5 shadow-2xl text-white backdrop-blur-2xl animate-scalePop space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-dream-500/20 text-dream-300 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Voice TTS Engine</h4>
                  <p className="text-[10px] text-white/50">Multi-Tier Architecture & Quota Meter</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={fetchStatus}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  title="Refresh status"
                  aria-label="Refresh status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Engine Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/70">Current Active Engine:</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${engineInfo.color}`}>
                  {engineInfo.badge}
                </span>
              </div>

              {/* Status & Warning Notice */}
              {status?.elevenLabs.disabledReason && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Using backup voice:</span>
                    <span>{status.elevenLabs.disabledReason}</span>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-white/50 leading-relaxed">
                • Short lines (≤ 150 chars) route to <strong>ElevenLabs</strong>.<br />
                • Long replies (&gt; 150 chars) route to <strong>Azure Speech</strong> to preserve quota.
              </p>
            </div>

            {/* Quota & Allowance Meters */}
            <div className="space-y-3">
              {/* ElevenLabs Meter */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/90">ElevenLabs Credits</span>
                  <span className="font-mono text-[11px] text-dream-300">
                    {status?.elevenLabs.creditsUsed ?? 0} / {status?.elevenLabs.cap ?? 10000}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-dream-400 to-lavender-400 transition-all duration-500"
                    style={{ width: `${status?.elevenLabs.percentUsed ?? 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/40">
                  <span>Cap safety stop at 80% (8,000)</span>
                  <span>{status?.elevenLabs.remainingCredits ?? 8000} remaining</span>
                </div>
              </div>

              {/* Azure Speech Meter */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/90">Azure Characters (Backup)</span>
                  <span className="font-mono text-[11px] text-sky-300">
                    {(status?.azure.charactersUsed ?? 0).toLocaleString()} / {(status?.azure.cap ?? 500000).toLocaleString()}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${status?.azure.percentUsed ?? 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/40">
                  <span>Free F0 Tier (500k/mo)</span>
                  <span>{((status?.azure.remainingCharacters ?? 400000)).toLocaleString()} remaining</span>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            <button
              onClick={handlePreview}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-95"
            >
              {isPlayingPreview ? (
                <>
                  <Volume2 className="w-4 h-4 text-dream-400 animate-pulse" />
                  <span>Stop Preview</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-dream-400 fill-dream-400" />
                  <span>Preview Active Voice</span>
                </>
              )}
            </button>

            {/* Mandatory Attribution Footnote */}
            <div className="pt-2 border-t border-white/10 text-[9px] text-white/40 leading-relaxed text-center space-y-1">
              <p>Some voices generated with ElevenLabs.</p>
              <p>All voices are AI-generated, original character-style voices, not the actual voice actors. Fan project, not for commercial use.</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
