import React from 'react';
import { 
  FolderHeart, 
  Plus, 
  Trash2, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';

interface MyCosplaysPageProps {
  onOpenChecklist: (projectId: string) => void;
  onOpenCompanion: (characterId: string) => void;
  onBrowseCharacters: () => void;
}

export const MyCosplaysPage: React.FC<MyCosplaysPageProps> = ({
  onOpenChecklist,
  onOpenCompanion,
  onBrowseCharacters
}) => {
  const { savedProjects, removeCosplayProject, currency, addCharacterToCosplay, characters } = useCosplay();

  const quickStartList = [
    characters.find(c => c.name.includes('Anya')) || {
      id: '164474',
      name: 'Anya Forger',
      series: 'Spy × Family',
      difficulty: 'Beginner',
      image: 'https://s4.anilist.co/file/anilistcdn/character/large/b164474-iUv0R3K8dYwP.png'
    },
    characters.find(c => c.name.includes('Gojo')) || {
      id: '164472',
      name: 'Gojo Satoru',
      series: 'Jujutsu Kaisen',
      difficulty: 'Intermediate',
      image: 'https://s4.anilist.co/file/anilistcdn/character/large/b127691-9zqh1xpIubn7.png'
    },
    characters.find(c => c.name.includes('Yor')) || {
      id: '170942',
      name: 'Yor Forger',
      series: 'Spy × Family',
      difficulty: 'Intermediate',
      image: 'https://s4.anilist.co/file/anilistcdn/character/large/b170942-8sE1d1JgV0lO.png'
    }
  ].filter(Boolean);

  const handleQuickStart = (char: any) => {
    const proj = addCharacterToCosplay(char);
    if (proj && proj.id) {
      onOpenChecklist(proj.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-dream-600 uppercase tracking-widest mb-1.5">
            <FolderHeart className="w-4 h-4 text-dream-500" />
            <span>My Cosplay Collection</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-dream-950 tracking-tight">
            Saved Cosplay Projects
          </h1>
          <p className="text-sm text-dream-600/80 mt-1">
            Organize outfits, track your checklist items, and budget upcoming convention appearances.
          </p>
        </div>

        <button
          onClick={onBrowseCharacters}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Plan New Cosplay</span>
        </button>
      </div>

      {/* Projects Grid or Empty State */}
      {savedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {savedProjects.map(project => {
            const totalCount = project.items.length;
            const completedCount = project.items.filter(
              i => i.status === 'Completed' || i.status === 'Acquired'
            ).length;
            const fullyDoneCount = project.items.filter(i => i.status === 'Completed').length;
            const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const estimatedBudget = project.items.reduce((s, it) => s + it.estimatedPrice, 0);

            return (
              <div
                key={project.id}
                onClick={() => onOpenChecklist(project.id)}
                className="group relative flex flex-col rounded-3xl bg-white/85 border border-lavender-200/90 shadow-soft hover:shadow-glass-hover hover:border-lavender-400 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden backdrop-blur-md"
              >
                {/* Image Banner Header */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-lavender-100">
                  <img
                    src={project.characterImage}
                    alt={project.characterName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151322]/90 via-[#151322]/30 to-transparent" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-dream-900 backdrop-blur-md">
                      {project.characterDifficulty}
                    </span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        if (confirm(`Remove "${project.characterName}" cosplay project?`)) {
                          removeCosplayProject(project.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-600 text-white/80 hover:text-white transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Text Over Image */}
                  <div className="absolute bottom-3 inset-x-4 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-lavender-300">
                      {project.characterSeries}
                    </div>
                    <h3 className="font-display font-extrabold text-xl tracking-tight leading-snug">
                      {project.characterName}
                    </h3>
                  </div>
                </div>

                {/* Progress Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-dream-700">Checklist Progress</span>
                      <span className="font-mono text-dream-950 font-black">{pct}%</span>
                    </div>

                    <div className="h-2.5 w-full bg-lavender-100 rounded-full overflow-hidden p-0.5 border border-lavender-200/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-dream-500 via-lavender-500 to-blush-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-dream-500 font-medium">
                      <span>{completedCount} / {totalCount} items complete</span>
                      <span>Est. {currency === 'INR' ? `₹${estimatedBudget.toLocaleString('en-IN')}` : `$${Math.round(estimatedBudget / 80)}`}</span>
                    </div>
                  </div>

                  {/* Actions & Companion Link */}
                  <div className="pt-2 border-t border-lavender-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenCompanion(project.characterId);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-dream-700 hover:text-dream-950 hover:bg-lavender-50 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-dream-500" />
                      <span>Ask AI</span>
                    </button>

                    <div className="flex items-center gap-1 text-xs font-bold text-dream-800 group-hover:text-dream-600 transition-colors">
                      <span>View Checklist</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-white/70 dark:bg-[#1A162B]/70 border border-lavender-200/80 dark:border-lavender-800/60 shadow-soft backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 text-dream-600 dark:text-lavender-300 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-2xl text-dream-950 dark:text-white mb-2">
              No saved cosplays yet!
            </h3>
            <p className="text-xs sm:text-sm text-dream-600/80 dark:text-lavender-300/80 mb-6 leading-relaxed max-w-md mx-auto">
              Pick your favorite anime character from our discovery gallery and click "Add to My Cosplay"
              to auto-generate your tailored checklist.
            </p>
            <button
              onClick={onBrowseCharacters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-dream-800 hover:bg-dream-900 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Discover Characters Now</span>
            </button>
          </div>

          {/* Quick Start Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-dream-700 dark:text-lavender-300 uppercase tracking-wider px-1">
              <Sparkles className="w-3.5 h-3.5 text-dream-500" />
              <span>Or quick-start with a popular cosplay:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickStartList.map(char => (
                <div
                  key={char.id}
                  onClick={() => handleQuickStart(char)}
                  className="group relative flex flex-col p-4 rounded-2xl bg-white/80 dark:bg-[#1A162B]/80 border border-lavender-200/80 dark:border-lavender-800/60 hover:border-lavender-400 dark:hover:border-lavender-600 shadow-soft hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-12 h-12 rounded-xl object-cover border border-lavender-200 dark:border-lavender-700 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-dream-500 dark:text-lavender-400 truncate">
                        {char.series}
                      </div>
                      <h4 className="font-display font-bold text-sm text-dream-950 dark:text-white truncate">
                        {char.name}
                      </h4>
                      <span className="inline-block mt-0.5 text-[9px] font-semibold px-2 py-0.2 rounded-full bg-lavender-100 dark:bg-lavender-900/60 text-dream-700 dark:text-lavender-300">
                        {char.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-lavender-100 dark:border-lavender-800/40 flex items-center justify-between text-[11px] font-bold text-dream-600 dark:text-lavender-400 group-hover:text-dream-900 dark:group-hover:text-white transition-colors">
                    <span>+ Quick Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
