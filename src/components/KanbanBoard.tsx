import React, { useState } from 'react';
import { CosplayItem, ItemStatus } from '../types';
import { Check, Clock, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface KanbanBoardProps {
  items: CosplayItem[];
  currency: string;
  onUpdateStatus: (itemId: string, newStatus: ItemStatus) => void;
  onItemCompleted: (item: CosplayItem) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  items,
  currency,
  onUpdateStatus,
  onItemCompleted
}) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const columns: {
    id: ItemStatus;
    title: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
  }[] = [
    {
      id: 'Missing',
      title: 'To Acquire / Craft',
      icon: ShoppingBag,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50/60',
      borderColor: 'border-amber-200/70'
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      icon: Clock,
      color: 'text-sky-700',
      bgColor: 'bg-sky-50/60',
      borderColor: 'border-sky-200/70'
    },
    {
      id: 'Completed',
      title: 'Done & Ready',
      icon: Check,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-200/70'
    }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ItemStatus) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    const item = items.find(i => i.id === itemId);
    if (item && item.status !== targetStatus) {
      sound.playClick();
      onUpdateStatus(itemId, targetStatus);
      if (targetStatus === 'Completed') {
        sound.playChime();
        onItemCompleted(item);
      }
    }
    setDraggedItemId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map(col => {
        const Icon = col.icon;
        // Map items to column (Acquired and Completed both show in Done column)
        const colItems = items.filter(item => {
          if (col.id === 'Completed') {
            return item.status === 'Completed' || item.status === 'Acquired';
          }
          return item.status === col.id;
        });

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, col.id)}
            className={`rounded-3xl p-4 sm:p-5 border ${col.borderColor} ${col.bgColor} backdrop-blur-md flex flex-col min-h-[380px] transition-colors`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-white shadow-xs ${col.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm text-dream-950">
                  {col.title}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/80 text-dream-800 shadow-2xs">
                {colItems.length}
              </span>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              {colItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, item.id)}
                  className={`p-3.5 rounded-2xl bg-white border border-lavender-200/80 shadow-soft hover:shadow-glass-hover hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing group ${
                    draggedItemId === item.id ? 'opacity-40 scale-95' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-dream-500">
                        {item.category}
                      </span>
                      <h5 className="font-display font-bold text-sm text-dream-950 mt-0.5 leading-snug">
                        {item.name}
                      </h5>
                    </div>
                    <span className="text-xs font-mono font-bold text-dream-700 bg-lavender-50 px-2 py-0.5 rounded-md">
                      {currency === 'INR' ? `₹${item.estimatedPrice.toLocaleString('en-IN')}` : `$${Math.round(item.estimatedPrice / 80)}`}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-dream-600/80 mt-1.5 line-clamp-2">
                      {item.notes}
                    </p>
                  )}

                  {/* Move quick action buttons */}
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-lavender-100 text-xs">
                    {col.id !== 'Missing' ? (
                      <button
                        onClick={() => {
                          const prevStatus = col.id === 'Completed' ? 'In Progress' : 'Missing';
                          onUpdateStatus(item.id, prevStatus);
                        }}
                        className="text-[10px] font-semibold text-dream-500 hover:text-dream-800 flex items-center gap-0.5"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Move Left</span>
                      </button>
                    ) : <span />}

                    {col.id !== 'Completed' && (
                      <button
                        onClick={() => {
                          const nextStatus = col.id === 'Missing' ? 'In Progress' : 'Completed';
                          onUpdateStatus(item.id, nextStatus);
                          if (nextStatus === 'Completed') {
                            sound.playChime();
                            onItemCompleted(item);
                          }
                        }}
                        className="text-[10px] font-semibold text-dream-700 hover:text-dream-950 flex items-center gap-0.5 ml-auto"
                      >
                        <span>Move Right</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {colItems.length === 0 && (
                <div className="h-32 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center text-xs text-dream-400 font-medium">
                  Drag items here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
