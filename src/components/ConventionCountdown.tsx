import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Edit2, Check } from 'lucide-react';

interface ConventionCountdownProps {
  targetDate?: string;
  onUpdateTargetDate: (date: string) => void;
}

export const ConventionCountdown: React.FC<ConventionCountdownProps> = ({
  targetDate,
  onUpdateTargetDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dateInput, setDateInput] = useState(targetDate || '');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSave = () => {
    if (dateInput) {
      onUpdateTargetDate(dateInput);
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white/80 border border-lavender-200/80 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-dream-600" />
          <span className="text-xs font-bold text-dream-900 uppercase tracking-wider">
            Convention Countdown
          </span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-dream-600 hover:text-dream-800 font-semibold flex items-center gap-1 transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isEditing ? 'Cancel' : targetDate ? 'Change Date' : 'Set Date'}</span>
        </button>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="date"
            value={dateInput}
            onChange={e => setDateInput(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-lavender-300 text-xs font-medium text-dream-900 bg-white"
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-xl bg-dream-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-dream-800 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      ) : timeLeft ? (
        timeLeft.isPassed ? (
          <div className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded-xl">
            🎉 The convention has arrived! Good luck with your cosplay!
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center mt-2">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINS', val: timeLeft.minutes },
              { label: 'SECS', val: timeLeft.seconds }
            ].map((unit, i) => (
              <div
                key={i}
                className="p-2 sm:p-2.5 rounded-2xl bg-lavender-50/70 border border-lavender-100 flex flex-col items-center shadow-sm"
              >
                <span className="font-display font-extrabold text-base sm:text-lg text-dream-900 leading-none">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-dream-500 mt-1 tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-xs text-dream-500 italic mt-1">
          Set your target convention date to start the countdown.
        </p>
      )}
    </div>
  );
};
