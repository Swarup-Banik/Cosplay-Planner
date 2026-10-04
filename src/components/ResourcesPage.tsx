import React, { useState } from 'react';
import { BookOpen, Scissors, Sparkles, CheckCircle2, Search, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import { CRAFTING_RESOURCES, CraftingResource } from '../data/resources';

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState<CraftingResource | null>(null);

  const categories = ['All', 'Materials', 'Wig Styling', 'Sewing & Fabrics', 'Makeup & Lenses', 'Con Survival'];

  const filteredResources = CRAFTING_RESOURCES.filter(r => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-dream-600 dark:text-lavender-400 uppercase tracking-widest">
          <BookOpen className="w-4 h-4 text-dream-500" />
          <span>Knowledge & Craft Library</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-dream-950 dark:text-white tracking-tight">
          Cosplay Crafting Guides
        </h1>
        <p className="text-sm text-dream-700/80 dark:text-lavender-300/80">
          Everything from heat-shaping EVA foam armor and crimping gravity spikes to con-day first aid kits.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/80 dark:bg-[#1A162B]/80 border border-lavender-200/80 dark:border-lavender-800/60 shadow-soft backdrop-blur-md">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-dream-700 dark:bg-lavender-600 text-white shadow-sm'
                  : 'text-dream-700 dark:text-lavender-300 hover:bg-lavender-50 dark:hover:bg-lavender-900/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides, tools..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-lavender-200/80 dark:border-lavender-800/60 bg-white/70 dark:bg-gray-800/70 text-xs text-dream-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-dream-500 dark:focus:border-lavender-500"
          />
          <Search className="w-3.5 h-3.5 text-dream-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map(guide => (
          <div
            key={guide.id}
            onClick={() => setActiveGuide(guide)}
            className="p-6 sm:p-7 rounded-3xl bg-white/85 dark:bg-[#1A162B]/85 border border-lavender-200/90 dark:border-lavender-800/70 shadow-soft hover:shadow-glass-hover hover:border-lavender-400 dark:hover:border-lavender-600 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between backdrop-blur-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-lavender-100 dark:bg-lavender-900/60 text-dream-800 dark:text-lavender-200 border border-lavender-200 dark:border-lavender-800/60">
                  {guide.category}
                </span>
                <span className="text-xs text-dream-500 dark:text-lavender-400 font-mono">
                  {guide.readTime}
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-dream-950 dark:text-white group-hover:text-dream-700 dark:group-hover:text-lavender-300 transition-colors">
                {guide.title}
              </h3>

              <p className="text-xs sm:text-sm text-dream-700/80 dark:text-lavender-300/80 leading-relaxed font-light">
                {guide.description}
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-lavender-100 dark:border-lavender-800/40 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {guide.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-lavender-50 dark:bg-lavender-900/40 text-dream-600 dark:text-lavender-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-dream-700 dark:text-lavender-300 group-hover:text-dream-900 dark:group-hover:text-white transition-colors">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1A162B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-lavender-200 dark:border-lavender-800 space-y-6">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-dream-600 dark:text-lavender-400">
                  {activeGuide.category} • {activeGuide.readTime}
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-dream-950 dark:text-white mt-1">
                  {activeGuide.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-2 rounded-xl hover:bg-lavender-100 dark:hover:bg-lavender-900/60 text-dream-400 dark:text-lavender-300 hover:text-dream-800 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Overview */}
            <div className="p-4 rounded-2xl bg-lavender-50/70 dark:bg-lavender-900/30 border border-lavender-200 dark:border-lavender-800/60 text-xs sm:text-sm text-dream-800 dark:text-lavender-200 leading-relaxed font-light">
              {activeGuide.content.overview}
            </div>

            {/* Key Points */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-base text-dream-950 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Core Methodology & Steps</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-dream-800 dark:text-lavender-200">
                {activeGuide.content.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-lavender-100 dark:bg-lavender-800 text-dream-700 dark:text-lavender-200 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-base text-dream-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Cosplayer Pro Tips</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-dream-800 dark:text-lavender-200">
                {activeGuide.content.proTips.map((tip, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-dream-900 dark:text-amber-100">
                    💡 {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Tools */}
            <div className="space-y-2 pt-2 border-t border-lavender-100 dark:border-lavender-800/40">
              <div className="text-xs font-bold text-dream-500 dark:text-lavender-400 uppercase tracking-wider">
                Recommended Tooling
              </div>
              <div className="flex flex-wrap gap-2">
                {activeGuide.content.recommendedTools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-gray-800 border border-lavender-200 dark:border-lavender-700 text-dream-900 dark:text-white shadow-sm"
                  >
                    🛠 {tool}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
