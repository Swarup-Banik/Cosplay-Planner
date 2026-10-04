import React from 'react';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCosplay();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/95 border border-lavender-200/90 shadow-2xl backdrop-blur-xl text-dream-950 animate-fadeIn"
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
              {toast.type === 'info' && <Info className="w-5 h-5 text-dream-600" />}
              {toast.type === 'purple' && (
                <Sparkles className="w-5 h-5 text-lavender-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-dream-950 font-display">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-[11px] text-dream-600 mt-0.5 line-clamp-2">
                  {toast.description}
                </div>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-dream-400 hover:text-dream-700 p-0.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
