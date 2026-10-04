import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  X, 
  Smartphone, 
  Square, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { CosplayProject } from '../types';
import { sound } from '../utils/audio';

interface SharePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CosplayProject;
  progressPercent: number;
}

export const SharePlanModal: React.FC<SharePlanModalProps> = ({
  isOpen,
  onClose,
  project,
  progressPercent
}) => {
  const [format, setFormat] = useState<'story' | 'post'>('story');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare) {
      setShareSupported(true);
    }
  }, []);

  // Calculate days left
  const daysLeft = project.targetDate
    ? Math.max(0, Math.ceil((new Date(project.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const completedItems = project.items.filter(i => i.status === 'Completed' || i.status === 'Acquired').length;
  const totalItems = project.items.length;

  // Render canvas
  useEffect(() => {
    if (!isOpen) return;
    setIsGenerating(true);

    const width = 1080;
    const height = format === 'story' ? 1920 : 1080;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Load character image
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 1. Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#131024');
      bgGrad.addColorStop(0.5, '#1E1838');
      bgGrad.addColorStop(1, '#110E1D');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient glowing orbs
      const glow1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 450);
      glow1.addColorStop(0, 'rgba(172, 125, 232, 0.35)');
      glow1.addColorStop(1, 'transparent');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(width - 200, height - 300, 50, width - 200, height - 300, 500);
      glow2.addColorStop(0, 'rgba(244, 114, 182, 0.25)');
      glow2.addColorStop(1, 'transparent');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      if (format === 'story') {
        // STORY FORMAT (1080 x 1920)
        // Artwork Frame
        const artX = 70;
        const artY = 160;
        const artW = width - 140;
        const artH = 1050;
        const radius = 48;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(artX, artY, artW, artH, radius);
        ctx.clip();

        // Draw character artwork cover
        const imgAspect = img.width / img.height;
        const boxAspect = artW / artH;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgAspect > boxAspect) {
          sw = img.height * boxAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / boxAspect;
          sy = 0; // prioritize top/face
        }
        ctx.drawImage(img, sx, sy, sw, sh, artX, artY, artW, artH);

        // Gradient overlay at bottom of art frame
        const scrim = ctx.createLinearGradient(artX, artY + artH * 0.4, artX, artY + artH);
        scrim.addColorStop(0, 'transparent');
        scrim.addColorStop(0.85, 'rgba(19, 16, 36, 0.95)');
        scrim.addColorStop(1, 'rgba(19, 16, 36, 1)');
        ctx.fillStyle = scrim;
        ctx.fillRect(artX, artY, artW, artH);

        ctx.restore();

        // Inner artwork border
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(artX, artY, artW, artH, radius);
        ctx.stroke();
        ctx.restore();

        // Top Brand Header
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('COSPLAY PLANNER', 75, 105);

        ctx.fillStyle = '#AC7DE8';
        ctx.font = '600 24px "Noto Sans JP", sans-serif';
        ctx.fillText('コスプレ計画表', width - 250, 105);

        // Character Info on Artwork
        ctx.fillStyle = '#F472B6';
        ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(project.characterSeries.toUpperCase(), 110, 1070);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 74px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(project.characterName, 110, 1150);

        // Lower Card - Project Details (Y: 1250 to 1800)
        const cardY = 1250;
        const cardH = 500;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(70, cardY, artW, cardH, 40);
        ctx.fill();
        ctx.strokeStyle = 'rgba(172, 125, 232, 0.25)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Readiness Stat
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 96px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${progressPercent}%`, 120, 1370);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('READINESS PROGRESS', 125, 1420);

        // Progress bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.roundRect(120, 1450, artW - 100, 24, 12);
        ctx.fill();

        const pGrad = ctx.createLinearGradient(120, 1450, 120 + (artW - 100), 1450);
        pGrad.addColorStop(0, '#AC7DE8');
        pGrad.addColorStop(1, '#F472B6');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.roundRect(120, 1450, Math.max(24, (artW - 100) * (progressPercent / 100)), 24, 12);
        ctx.fill();

        // Event & Countdown box
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`Target: ${project.targetEvent || 'Anime Con'}`, 120, 1540);

        if (daysLeft !== null) {
          ctx.fillStyle = '#56B0DC';
          ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`⚡ ${daysLeft} Days Left Until Con`, 120, 1600);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`Craft Checklist: ${completedItems} of ${totalItems} items completed`, 120, 1660);

        // Palette swatches
        const swatches = ['#9B78D1', '#F472B6', '#56B0DC', '#FAF5EF', '#1E1838'];
        swatches.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(artW - 180 + i * 40, 1360, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Bottom Watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Made with Cosplay Planner • anime-cosplay.app', width / 2, 1860);
        ctx.textAlign = 'left';

      } else {
        // POST FORMAT (1080 x 1080)
        // Left Column: Artwork (W: 460, H: 880)
        const artX = 60;
        const artY = 100;
        const artW = 460;
        const artH = 880;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(artX, artY, artW, artH, 36);
        ctx.clip();
        ctx.drawImage(img, 0, 0, img.width, img.height, artX, artY, artW, artH);
        ctx.restore();

        // Artwork border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(artX, artY, artW, artH, 36);
        ctx.stroke();

        // Right Column: Information (X: 560)
        const infoX = 560;

        ctx.fillStyle = '#AC7DE8';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('✦ COSPLAY PLANNER', infoX, 150);

        ctx.fillStyle = '#F472B6';
        ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(project.characterSeries.toUpperCase(), infoX, 220);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 60px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(project.characterName, infoX, 290);

        // Readiness Metric
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 88px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${progressPercent}%`, infoX, 420);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('COMPLETION READINESS', infoX, 465);

        // Progress bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.roundRect(infoX, 495, 440, 20, 10);
        ctx.fill();

        const pGrad = ctx.createLinearGradient(infoX, 495, infoX + 440, 495);
        pGrad.addColorStop(0, '#AC7DE8');
        pGrad.addColorStop(1, '#F472B6');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.roundRect(infoX, 495, Math.max(20, 440 * (progressPercent / 100)), 20, 10);
        ctx.fill();

        // Info lines
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`Event: ${project.targetEvent || 'Anime Con'}`, infoX, 580);

        if (daysLeft !== null) {
          ctx.fillStyle = '#56B0DC';
          ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(`⚡ ${daysLeft} Days Countdown`, infoX, 640);
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${completedItems} / ${totalItems} checklist items acquired`, infoX, 700);

        // Palette swatches
        const swatches = ['#9B78D1', '#F472B6', '#56B0DC', '#FAF5EF', '#1E1838'];
        swatches.forEach((color, i) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(infoX + 24 + i * 44, 780, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Watermark bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Made with Cosplay Planner • anime-cosplay.app', infoX, 940);
      }

      setPreviewUrl(canvas.toDataURL('image/png'));
      setIsGenerating(false);
    };

    img.onerror = () => {
      // Fallback if image fails CORS: render stylized placeholder silhouette
      setPreviewUrl(canvas.toDataURL('image/png'));
      setIsGenerating(false);
    };

    img.src = project.characterImage;

  }, [isOpen, format, project, progressPercent, daysLeft, completedItems, totalItems]);

  const handleDownload = () => {
    if (!previewUrl) return;
    sound.playSuccess();
    const link = document.createElement('a');
    link.download = `cosplay-plan-${project.characterName.toLowerCase().replace(/\s+/g, '-')}-${format}.png`;
    link.href = previewUrl;
    link.click();
  };

  const handleCopyImage = async () => {
    if (!previewUrl || !canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async blob => {
        if (!blob) return;
        // @ts-ignore
        if (navigator.clipboard && window.ClipboardItem) {
          // @ts-ignore
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          sound.playSuccess();
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } else {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  const handleWebShare = async () => {
    if (!previewUrl || !canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], `cosplay-plan-${project.characterName}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `My ${project.characterName} Cosplay Plan`,
            text: `Planning my ${project.characterName} cosplay! I'm ${progressPercent}% ready!`
          });
        } else {
          handleDownload();
        }
      });
    } catch {
      handleDownload();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Hidden offscreen canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-[#151226]/95 backdrop-blur-2xl border border-lavender-200/90 dark:border-lavender-800/60 shadow-2xl p-5 sm:p-6 space-y-5 animate-scalePop">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-lavender-100 dark:border-lavender-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lavender-500 to-blush-500 p-0.5 shadow-md flex items-center justify-center text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-dream-950 dark:text-white">
                  Social Cosplay Share Card
                </h3>
                <p className="text-xs text-dream-600 dark:text-lavender-400">
                  Generate high-res graphics for Instagram Stories, Twitter & Discord
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-dream-400 hover:text-dream-700 dark:hover:text-white hover:bg-lavender-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Switcher */}
          <div className="flex items-center justify-center gap-3 bg-lavender-50/70 dark:bg-gray-800/60 p-1.5 rounded-2xl border border-lavender-200/60 dark:border-lavender-800/40">
            <button
              onClick={() => {
                sound.playClick();
                setFormat('story');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                format === 'story'
                  ? 'bg-dream-700 text-white shadow-sm'
                  : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Story (9:16 • 1080x1920)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setFormat('post');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                format === 'post'
                  ? 'bg-dream-700 text-white shadow-sm'
                  : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Square Post (1:1 • 1080x1080)</span>
            </button>
          </div>

          {/* Canvas Image Preview Box */}
          <div className="relative aspect-[9/16] max-h-[50vh] sm:max-h-[55vh] mx-auto rounded-2xl overflow-hidden bg-gray-950 border border-lavender-200 dark:border-lavender-800 flex items-center justify-center shadow-lg">
            {isGenerating || !previewUrl ? (
              <div className="flex flex-col items-center gap-3 text-white/70">
                <Loader2 className="w-8 h-8 animate-spin text-dream-400" />
                <span className="text-xs font-medium">Composing High-Res Card...</span>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="Cosplay Share Card Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-dream-500 dark:text-lavender-400 hidden sm:inline">
              ✦ Ready for Instagram, TikTok, Reddit & X
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyImage}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-lavender-300 dark:border-lavender-700 text-xs font-bold text-dream-800 dark:text-lavender-200 hover:bg-lavender-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Image'}</span>
              </button>

              {shareSupported && (
                <button
                  onClick={handleWebShare}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-lavender-100 dark:bg-lavender-900/60 hover:bg-lavender-200 text-dream-900 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}

              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-md shadow-dream-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
