import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  User, 
  Calendar, 
  Plus, 
  Check, 
  Trash2, 
  Sparkles, 
  Lightbulb, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PhotoshootPlannerProps {
  projectId: string;
  characterName: string;
}

interface ShotItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface PhotoshootConfig {
  date: string;
  location: string;
  photographer: string;
  shots: ShotItem[];
}

const POSE_PROMPTS = [
  {
    id: 'heroic-stance',
    title: 'Heroic Power Stance',
    angle: 'Straight / Eye Level',
    tip: 'Keep chin up, shoulders squared, feet planted firmly shoulder-width apart. Look directly into the lens with absolute resolve.',
    tag: 'Classic'
  },
  {
    id: 'action-lunge',
    title: 'Dynamic Action Lunge',
    angle: 'Slightly Low Angle (30°)',
    tip: 'Drop your center of gravity. Extend front leg, brace your core, and draw your prop/weapon leading forward towards the camera.',
    tag: 'Action'
  },
  {
    id: 'look-away',
    title: 'Atmospheric Look-Away',
    angle: '3/4 Profile View',
    tip: 'Turn your face 45° away from the lens. Soften your shoulders and focus on an imaginary point in the distance for an emotional story beat.',
    tag: 'Emotional'
  },
  {
    id: 'silhouette',
    title: 'High-Contrast Silhouette',
    angle: 'Direct Backlit Angle',
    tip: 'Position yourself between the camera and a bright light source (sunset, neon sign, backlit softbox). Emphasize wig silhouette spikes and prop lines.',
    tag: 'Artistic'
  },
  {
    id: 'prop-focus',
    title: 'Signature Prop Showcase',
    angle: 'Forced Perspective / Depth',
    tip: 'Hold weapon or magical trinket close to the camera in sharp focus while your face remains slightly blurred in the background.',
    tag: 'Detail'
  },
  {
    id: 'cloak-swish',
    title: 'Dramatic Cloak Swish',
    angle: 'Wide Shot (Full Body)',
    tip: 'Have a handler or yourself swing your cape/coat on count of three. Snap the shutter at the peak of fabric billow for dynamic anime airflow.',
    tag: 'Motion'
  },
  {
    id: 'macro-portrait',
    title: 'Intimate Eye & Wig Macro',
    angle: 'Tight Headshot',
    tip: 'Focus directly on your colored contacts and crisp makeup eyeliner. Keep light soft and catchlights centered in your pupils.',
    tag: 'Beauty'
  },
  {
    id: 'boss-walk',
    title: 'Low-Angle Villain / Boss Walk',
    angle: 'Ground / Knee Level',
    tip: 'Place camera near the ground looking up. Take a deliberate forward step towards the lens with an unbothered, commanding presence.',
    tag: 'Imposing'
  }
];

export const PhotoshootPlanner: React.FC<PhotoshootPlannerProps> = ({
  projectId,
  characterName
}) => {
  const storageKey = `cosplay_photoshoot_${projectId}`;
  const [config, setConfig] = useState<PhotoshootConfig>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      date: '',
      location: 'Convention Atrium / Outdoor Garden',
      photographer: '@cosplay_lens_craft',
      shots: [
        { id: 'shot-1', title: 'Signature iconic character hero pose', isCompleted: false },
        { id: 'shot-2', title: 'Weapon / magic prop in motion with high shutter speed', isCompleted: false },
        { id: 'shot-3', title: 'Dramatic close-up on eyes, wig styling and makeup details', isCompleted: false },
        { id: 'shot-4', title: 'Full back view showing complete garment tailoring & lining', isCompleted: false }
      ]
    };
  });

  const [newShotInput, setNewShotInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  }, [config, storageKey]);

  const handleToggleShot = (id: string) => {
    sound.playClick();
    setConfig(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s)
    }));
  };

  const handleAddShot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShotInput.trim()) return;
    sound.playClick();
    const newShot: ShotItem = {
      id: `shot-${Date.now()}`,
      title: newShotInput.trim(),
      isCompleted: false
    };
    setConfig(prev => ({
      ...prev,
      shots: [...prev.shots, newShot]
    }));
    setNewShotInput('');
  };

  const handleDeleteShot = (id: string) => {
    sound.playClick();
    setConfig(prev => ({
      ...prev,
      shots: prev.shots.filter(s => s.id !== id)
    }));
  };

  const handleAddPoseToShotList = (poseTitle: string) => {
    sound.playSuccess();
    const newShot: ShotItem = {
      id: `shot-${Date.now()}`,
      title: `${poseTitle} for ${characterName}`,
      isCompleted: false
    };
    setConfig(prev => ({
      ...prev,
      shots: [...prev.shots, newShot]
    }));
  };

  return (
    <div className="rounded-3xl bg-white/90 dark:bg-gray-800/80 border border-lavender-200/90 dark:border-lavender-800/60 shadow-soft p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-lavender-100 dark:border-lavender-900/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 border border-lavender-200 dark:border-lavender-800/40 flex items-center justify-center text-dream-700 dark:text-lavender-300">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-dream-950 dark:text-white">
              Photoshoot Planner & Shot List
            </h3>
            <p className="text-xs text-dream-600 dark:text-lavender-400">
              Locations, shot checklists, photographer details, and anime pose prompt cards
            </p>
          </div>
        </div>
      </div>

      {/* Schedule & Location Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-lavender-50/60 dark:bg-gray-900/40 p-4 rounded-2xl border border-lavender-100 dark:border-lavender-800/40 text-xs">
        <div>
          <label className="block text-dream-700 dark:text-lavender-300 font-bold mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-dream-500" />
            <span>Target Shoot Date</span>
          </label>
          <input
            type="date"
            value={config.date}
            onChange={e => setConfig(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-dream-700 dark:text-lavender-300 font-bold mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-dream-500" />
            <span>Location / Setting</span>
          </label>
          <input
            type="text"
            value={config.location}
            onChange={e => setConfig(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Studio, botanical garden, con lobby..."
            className="w-full px-3 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-dream-700 dark:text-lavender-300 font-bold mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-dream-500" />
            <span>Photographer / Contact</span>
          </label>
          <input
            type="text"
            value={config.photographer}
            onChange={e => setConfig(prev => ({ ...prev, photographer: e.target.value }))}
            placeholder="@handle or phone..."
            className="w-full px-3 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white"
          />
        </div>
      </div>

      {/* Shot List Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-dream-900 dark:text-white">
          <span>
            Wanted Shot List ({config.shots.filter(s => s.isCompleted).length} / {config.shots.length} completed)
          </span>
        </div>

        <form onSubmit={handleAddShot} className="flex gap-2">
          <input
            type="text"
            value={newShotInput}
            onChange={e => setNewShotInput(e.target.value)}
            placeholder="Add specific shot: e.g. 'Dramatic sword unsheathing with fog machine'..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white text-xs focus:ring-2 focus:ring-lavender-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-dream-700 hover:bg-dream-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shot</span>
          </button>
        </form>

        <div className="space-y-2">
          {config.shots.map(shot => (
            <div
              key={shot.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                shot.isCompleted
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-gray-500 dark:text-gray-400'
                  : 'bg-white dark:bg-gray-800/70 border-lavender-200/80 dark:border-lavender-800/40 text-dream-900 dark:text-white'
              }`}
            >
              <div 
                onClick={() => handleToggleShot(shot.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  shot.isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : 'border-lavender-300 dark:border-lavender-600 text-transparent'
                }`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className={`truncate font-medium ${shot.isCompleted ? 'line-through' : ''}`}>
                  {shot.title}
                </span>
              </div>

              <button
                onClick={() => handleDeleteShot(shot.id)}
                className="p-1 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Anime Pose Ideas Generator Carousel / Grid */}
      <div className="pt-4 border-t border-lavender-100 dark:border-lavender-900/60 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-dream-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>8 Iconic Cosplay Pose Prompts</span>
          </div>
          <span className="text-[11px] text-dream-500 dark:text-lavender-400">
            Click to add directly to your shot list
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POSE_PROMPTS.map(pose => (
            <div
              key={pose.id}
              onClick={() => handleAddPoseToShotList(pose.title)}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-lavender-50/50 via-white to-blush-50/30 dark:from-gray-800 dark:to-gray-900 border border-lavender-200/80 dark:border-lavender-800/50 hover:border-dream-400 dark:hover:border-lavender-500 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-lavender-100 dark:bg-gray-700 text-dream-800 dark:text-lavender-200">
                    {pose.tag}
                  </span>
                  <span className="text-[10px] font-mono text-dream-400 dark:text-lavender-400">
                    {pose.angle}
                  </span>
                </div>

                <h4 className="font-display font-bold text-xs text-dream-950 dark:text-white group-hover:text-dream-700 dark:group-hover:text-lavender-300 transition-colors">
                  {pose.title}
                </h4>

                <p className="text-[11px] text-dream-600/80 dark:text-lavender-400/80 leading-relaxed line-clamp-3">
                  {pose.tip}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-lavender-100 dark:border-lavender-800 flex items-center justify-between text-[10px] font-semibold text-dream-600 dark:text-lavender-300 group-hover:text-dream-800">
                <span>+ Add to Shot List</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
