import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Wallet,
  ArrowRight
} from 'lucide-react';
import { CosplayItem, ItemCategory } from '../types';

interface CostTrackingCardProps {
  items: CosplayItem[];
  budgetTotal?: number;
  currency: 'INR' | 'USD';
}

const CATEGORY_COLORS: Record<ItemCategory, string> = {
  Garment: '#9B78D1', // Dream/Lavender
  Wig: '#F472B6',     // Blush
  Prop: '#56B0DC',    // Soft blue
  Makeup: '#F59E0B',  // Amber
  Footwear: '#10B981',// Emerald
  Accessories: '#8B5CF6' // Purple
};

export const CostTrackingCard: React.FC<CostTrackingCardProps> = ({
  items,
  budgetTotal,
  currency
}) => {
  const formatMoney = (amount: number) => {
    if (currency === 'INR') {
      return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    }
    return `$${Math.round(amount / 80).toLocaleString('en-US')}`;
  };

  // Aggregate spending by category
  const categories: ItemCategory[] = ['Garment', 'Wig', 'Prop', 'Makeup', 'Footwear', 'Accessories'];

  const categoryData = categories.map(cat => {
    const catItems = items.filter(i => i.category === cat);
    const estimated = catItems.reduce((acc, it) => acc + (it.estimatedPrice || 0), 0);
    const actual = catItems.reduce((acc, it) => {
      if (it.status === 'Completed' || it.status === 'Acquired') {
        return acc + (it.actualPrice !== undefined ? it.actualPrice : it.estimatedPrice || 0);
      }
      return acc;
    }, 0);
    return {
      category: cat,
      count: catItems.length,
      estimated,
      actual,
      color: CATEGORY_COLORS[cat]
    };
  }).filter(c => c.estimated > 0 || c.actual > 0);

  const totalEstimated = items.reduce((acc, it) => acc + (it.estimatedPrice || 0), 0);
  const totalActual = items.reduce((acc, it) => {
    if (it.status === 'Completed' || it.status === 'Acquired') {
      return acc + (it.actualPrice !== undefined ? it.actualPrice : it.estimatedPrice || 0);
    }
    return acc;
  }, 0);

  const allocatedBudget = budgetTotal && budgetTotal > 0 ? budgetTotal : totalEstimated;
  const remainingBudget = allocatedBudget - totalActual;
  const isOverBudget = remainingBudget < 0;

  // SVG Donut calculation
  const totalCategoryEstimated = categoryData.reduce((acc, c) => acc + c.estimated, 0) || 1;
  let accumulatedAngle = 0;
  const donutSegments = categoryData.map(c => {
    const slicePercentage = c.estimated / totalCategoryEstimated;
    const strokeDasharray = `${slicePercentage * 100} ${100 - slicePercentage * 100}`;
    const strokeDashoffset = -accumulatedAngle;
    accumulatedAngle += slicePercentage * 100;
    return {
      ...c,
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="rounded-3xl bg-white/90 dark:bg-gray-800/80 border border-lavender-200/90 dark:border-lavender-800/60 shadow-soft p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 border border-lavender-200 dark:border-lavender-800/40 flex items-center justify-center text-dream-700 dark:text-lavender-300">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-dream-950 dark:text-white">
              Cosplay Cost & Budget Analytics
            </h3>
            <p className="text-xs text-dream-600 dark:text-lavender-400">
              Live estimated vs actual spend comparison ({currency})
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-dream-500 dark:text-lavender-400">
            Remaining Budget
          </div>
          <div className={`text-sm sm:text-base font-extrabold font-mono ${
            isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-300'
          }`}>
            {formatMoney(Math.abs(remainingBudget))} {isOverBudget ? 'over' : 'left'}
          </div>
        </div>
      </div>

      {/* Comparison Progress Bar */}
      <div className="space-y-2 bg-lavender-50/70 dark:bg-gray-900/40 p-4 rounded-2xl border border-lavender-100 dark:border-lavender-800/40">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-dream-700 dark:text-lavender-300">
            Spend vs Estimated Target
          </span>
          <span className="font-mono text-dream-900 dark:text-white font-bold">
            {formatMoney(totalActual)} / {formatMoney(allocatedBudget)}
          </span>
        </div>

        {/* Dual Bar */}
        <div className="h-3 w-full bg-lavender-200/80 dark:bg-gray-700 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverBudget
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-dream-500 to-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.round((totalActual / (allocatedBudget || 1)) * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-dream-500 dark:text-lavender-400 pt-1">
          <span>Actual Spent: <strong className="text-dream-900 dark:text-white">{formatMoney(totalActual)}</strong></span>
          <span>Estimated Total: <strong className="text-dream-900 dark:text-white">{formatMoney(totalEstimated)}</strong></span>
        </div>
      </div>

      {/* Donut Chart & Category Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Donut Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 transform">
              {/* Background ring */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                className="text-lavender-100 dark:text-gray-700"
              />
              {/* Donut segments */}
              {donutSegments.map(seg => (
                <circle
                  key={seg.category}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="3.2"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-dream-400 uppercase">Total</span>
              <span className="font-display font-extrabold text-xs sm:text-sm text-dream-900 dark:text-white font-mono">
                {formatMoney(totalEstimated)}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-dream-500 dark:text-lavender-400 mt-2">
            Cost distribution by craft category
          </span>
        </div>

        {/* Category List */}
        <div className="md:col-span-7 space-y-2.5">
          {categoryData.length > 0 ? (
            categoryData.map(cat => {
              const pct = Math.round((cat.estimated / totalCategoryEstimated) * 100);
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: cat.color }} 
                      />
                      <span className="font-semibold text-dream-800 dark:text-lavender-200">
                        {cat.category}
                      </span>
                      <span className="text-[10px] text-dream-400 font-mono">
                        ({cat.count} items)
                      </span>
                    </div>
                    <div className="font-mono font-bold text-dream-900 dark:text-white">
                      {formatMoney(cat.estimated)} <span className="text-[10px] font-normal text-dream-400">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-lavender-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-dream-500 text-center py-4">
              Add checklist items with estimated prices to see the cost distribution.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
