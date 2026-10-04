import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Edit2, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Hourglass, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ConventionTimelineProps {
  projectId: string;
  targetEvent?: string;
  targetDate?: string;
  onUpdateTargetDate: (date: string) => void;
  onUpdateTargetEvent?: (event: string) => void;
}

interface MilestoneDef {
  id: string;
  title: string;
  daysBefore: number;
  description: string;
}

const DEFAULT_MILESTONES: MilestoneDef[] = [
  {
    id: 'wig-order',
    title: 'Order Wig & Color Contacts',
    daysBefore: 60,
    description: 'Account for international shipping times & customs clearance.'
  },
  {
    id: 'fabric-supplies',
    title: 'Acquire Fabric, Patterns & EVA Foam',
    daysBefore: 50,
    description: 'Gather reference sheets, notions, zippers, and crafting materials.'
  },
  {
    id: 'base-garment',
    title: 'Complete Base Garments & Sewing',
    daysBefore: 30,
    description: 'Finish primary stitching, tailoring, hems, and lining.'
  },
  {
    id: 'props-armor',
    title: 'Props, Armor & Weapon Detailing',
    daysBefore: 20,
    description: 'Priming, airbrushing, electronics/LEDs, and clear protective coats.'
  },
  {
    id: 'fittings-wig',
    title: 'Full Fitting & Wig Styling Session',
    daysBefore: 10,
    description: 'Spiking, got2b glue, hair spray, and complete makeup practice run.'
  },
  {
    id: 'final-touches',
    title: 'Final Touches & Emergency Repair Kit',
    daysBefore: 3,
    description: 'Safety pins, hot glue, bobby pins, top-coat touchups, packing.'
  },
  {
    id: 'convention-day',
    title: 'Convention Day & Photoshoot',
    daysBefore: 0,
    description: 'Showtime! Have fun and showcase your hard work!'
  }
];

export const ConventionTimeline: React.FC<ConventionTimelineProps> = ({
  projectId,
  targetEvent = 'Upcoming Convention',
  targetDate,
  onUpdateTargetDate,
  onUpdateTargetEvent
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dateInput, setDateInput] = useState(targetDate || '');
  const [eventInput, setEventInput] = useState(targetEvent);
  const [isExpanded, setIsExpanded] = useState(true);

  // Completed milestone IDs stored in localStorage per project
  const storageKey = `cosplay_milestones_${projectId}`;
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedMilestones));
    } catch {}
  }, [completedMilestones, storageKey]);

  // Countdown clock state
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setCountdown(null);
      return;
    }

    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, isPassed: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleToggleMilestone = (id: string) => {
    sound.playClick();
    setCompletedMilestones(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (dateInput) {
      onUpdateTargetDate(dateInput);
      if (onUpdateTargetEvent && eventInput) {
        onUpdateTargetEvent(eventInput);
      }
      setIsEditing(false);
      sound.playSuccess();
    }
  };

  // Compute calculated milestone dates
  const milestonesWithDates = targetDate
    ? DEFAULT_MILESTONES.map(m => {
        const conDate = new Date(targetDate);
        const milestoneDate = new Date(conDate.getTime() - m.daysBefore * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diffMs = milestoneDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const isDone = completedMilestones.includes(m.id);

        let status: 'completed' | 'overdue' | 'due-soon' | 'on-track';
        if (isDone) {
          status = 'completed';
        } else if (daysDiff < 0) {
          status = 'overdue';
        } else if (daysDiff <= 7) {
          status = 'due-soon';
        } else {
          status = 'on-track';
        }

        return {
          ...m,
          dateObj: milestoneDate,
          formattedDate: milestoneDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          daysDiff,
          isDone,
          status
        };
      })
    : [];

  return (
    <div className="rounded-3xl bg-white/90 dark:bg-gray-800/80 border border-lavender-200/90 dark:border-lavender-800/60 shadow-soft overflow-hidden transition-all">
      
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-lavender-100 dark:border-lavender-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 border border-lavender-200 dark:border-lavender-800/40 flex items-center justify-center text-dream-700 dark:text-lavender-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-dream-950 dark:text-white flex items-center gap-2">
              <span>Convention Timeline</span>
              {countdown && !countdown.isPassed && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-dream-100 dark:bg-dream-900/60 text-dream-800 dark:text-lavender-200 font-semibold font-mono">
                  {countdown.days}d left
                </span>
              )}
            </h3>
            <p className="text-xs text-dream-600 dark:text-lavender-400">
              {targetEvent} {targetDate ? `• ${new Date(targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : '• No date scheduled'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-lavender-50 hover:bg-lavender-100 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-dream-700 dark:text-lavender-200 border border-lavender-200/80 dark:border-lavender-700 flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-dream-500" />
            <span>{isEditing ? 'Cancel' : targetDate ? 'Change Date' : 'Set Date'}</span>
          </button>

          {targetDate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl text-dream-500 hover:text-dream-800 dark:hover:text-white hover:bg-lavender-50 dark:hover:bg-gray-700/60 transition-colors"
              title={isExpanded ? 'Collapse timeline' : 'Expand timeline'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="p-5 bg-lavender-50/70 dark:bg-gray-900/40 border-b border-lavender-100 dark:border-lavender-900/60 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <div>
              <label className="block text-[11px] font-bold text-dream-700 dark:text-lavender-300 mb-1">
                Convention / Event Name
              </label>
              <input
                type="text"
                value={eventInput}
                onChange={e => setEventInput(e.target.value)}
                placeholder="Anime Con 2026, Otakon..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-lavender-300 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-dream-700 dark:text-lavender-300 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={e => setDateInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-lavender-300 dark:border-lavender-700 bg-white dark:bg-gray-800 text-dream-900 dark:text-white font-mono"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-dream-600 dark:text-lavender-400 hover:bg-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-dream-700 hover:bg-dream-800 text-white shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      )}

      {/* Countdown Digits View */}
      {countdown && !countdown.isPassed ? (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-lavender-50/50 via-white to-blush-50/40 dark:from-gray-900/60 dark:to-gray-800/60 border-b border-lavender-100 dark:border-lavender-900/50">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center max-w-lg mx-auto">
            {[
              { label: 'DAYS', val: countdown.days },
              { label: 'HOURS', val: countdown.hours },
              { label: 'MINUTES', val: countdown.minutes },
              { label: 'SECONDS', val: countdown.seconds }
            ].map(unit => (
              <div 
                key={unit.label}
                className="p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-gray-800 border border-lavender-200/90 dark:border-lavender-700/60 shadow-sm"
              >
                <div className="font-display font-black text-2xl sm:text-4xl text-dream-900 dark:text-white font-mono tracking-tight">
                  {String(unit.val).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-bold text-dream-500 dark:text-lavender-400 mt-0.5 tracking-wider">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : countdown?.isPassed ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
          🎉 The event has arrived! Good luck with your cosplay!
        </div>
      ) : null}

      {/* Vertical Animated Milestone Timeline */}
      {targetDate && isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-dream-800 dark:text-lavender-200">
              Milestone Progress: {completedMilestones.length} of {DEFAULT_MILESTONES.length} Completed
            </span>
            <span className="text-dream-500 dark:text-lavender-400">
              Generated backward from con date
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-lavender-200 dark:before:bg-lavender-800">
            {milestonesWithDates.map((m, idx) => {
              const isOverdue = m.status === 'overdue';
              const isDueSoon = m.status === 'due-soon';
              const isCompleted = m.isDone;

              return (
                <div key={m.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <button
                    type="button"
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-100 dark:ring-emerald-950'
                        : isOverdue
                        ? 'bg-rose-500 text-white shadow-sm ring-4 ring-rose-100 dark:ring-rose-950 animate-pulse'
                        : isDueSoon
                        ? 'bg-amber-500 text-white shadow-sm ring-4 ring-amber-100 dark:ring-amber-950'
                        : 'bg-white dark:bg-gray-800 border-2 border-lavender-300 dark:border-lavender-700 text-transparent'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : isOverdue ? (
                      <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                    ) : isDueSoon ? (
                      <Hourglass className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-dream-400" />
                    )}
                  </button>

                  {/* Milestone Card */}
                  <div
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                        : isOverdue
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                        : isDueSoon
                        ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                        : 'bg-white dark:bg-gray-800/60 border-lavender-200/80 dark:border-lavender-800/40 hover:border-lavender-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold ${
                          isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-dream-950 dark:text-white'
                        }`}>
                          {m.title}
                        </span>

                        {/* Status Chip */}
                        {isCompleted ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                            Completed
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                            Overdue ({Math.abs(m.daysDiff)}d ago)
                          </span>
                        ) : isDueSoon ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200">
                            Due Soon ({m.daysDiff}d left)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-lavender-100 dark:bg-gray-700 text-dream-800 dark:text-lavender-300">
                            On Track ({m.daysDiff}d left)
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono font-medium text-dream-600 dark:text-lavender-400 shrink-0">
                        {m.formattedDate}
                      </div>
                    </div>

                    <p className="text-xs text-dream-600/80 dark:text-lavender-400/80 mt-1">
                      {m.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!targetDate && (
        <div className="p-8 text-center space-y-3">
          <Clock className="w-10 h-10 text-dream-300 dark:text-lavender-700 mx-auto" />
          <h4 className="font-display font-bold text-sm text-dream-900 dark:text-white">
            No Convention Date Configured
          </h4>
          <p className="text-xs text-dream-600 dark:text-lavender-400 max-w-sm mx-auto">
            Set your target convention date to auto-generate backward milestones for wigs, garments, and armor crafting!
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-dream-700 hover:bg-dream-800 text-white font-semibold text-xs transition-colors"
          >
            Set Convention Date
          </button>
        </div>
      )}

    </div>
  );
};
