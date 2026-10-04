import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ArrowLeft, 
  MessageSquare, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  Filter, 
  Tag, 
  Check, 
  ChevronRight,
  ShoppingBag,
  List,
  Kanban,
  Award,
  Printer,
  Ruler,
  Camera,
  Image as ImageIcon,
  CheckSquare,
  Share2
} from 'lucide-react';
import { useCosplay } from '../context/CosplayContext';
import { CosplayItem, ItemStatus, ItemCategory, STATUS_COLORS } from '../types';
import { CustomItemModal } from './CustomItemModal';
import { ProgressRing } from './ProgressRing';
import { ConventionTimeline } from './ConventionTimeline';
import { CostTrackingCard } from './CostTrackingCard';
import { MoodboardGallery } from './MoodboardGallery';
import { PhotoshootPlanner } from './PhotoshootPlanner';
import { KanbanBoard } from './KanbanBoard';

const MeasurementsModal = React.lazy(() =>
  import('./MeasurementsModal').then(m => ({ default: m.MeasurementsModal }))
);
const SharePlanModal = React.lazy(() =>
  import('./SharePlanModal').then(m => ({ default: m.SharePlanModal }))
);
import { 
  awardItemCompletion, 
  awardProjectCompletion, 
  getGamificationState, 
  UserGamificationState 
} from '../utils/gamification';
import { sound } from '../utils/audio';

interface CosplayChecklistPageProps {
  projectId: string;
  onBack: () => void;
  onOpenCompanion: (characterId: string) => void;
  onViewCharacterProfile: (characterId: string) => void;
}

export const CosplayChecklistPage: React.FC<CosplayChecklistPageProps> = ({
  projectId,
  onBack,
  onOpenCompanion,
  onViewCharacterProfile
}) => {
  const { 
    savedProjects, 
    updateItemStatus, 
    addCustomItem, 
    updateItem, 
    deleteItem, 
    updateProjectMeta,
    currency,
    triggerCelebration,
    addToast
  } = useCosplay();

  const project = savedProjects.find(p => p.id === projectId);

  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CosplayItem | null>(null);
  const [gameState, setGameState] = useState<UserGamificationState>(getGamificationState());
  const [isMeasurementsOpen, setIsMeasurementsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'checklist' | 'moodboard' | 'photoshoot'>('checklist');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-dream-900 mb-2">Project not found</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-dream-700 text-white text-xs font-semibold"
        >
          Back to Cosplays
        </button>
      </div>
    );
  }

  // Calculate metrics
  const totalItems = project.items.length;
  const completedItems = project.items.filter(i => i.status === 'Completed').length;
  const acquiredItems = project.items.filter(i => i.status === 'Acquired').length;
  const inProgressItems = project.items.filter(i => i.status === 'In Progress').length;
  const missingItems = project.items.filter(i => i.status === 'Missing').length;

  const progressPercent = totalItems > 0 ? Math.round(((completedItems + acquiredItems) / totalItems) * 100) : 0;
  const fullyDonePercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const totalEstimatedCost = project.items.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const totalSpent = project.items.reduce((sum, item) => {
    if (item.status === 'Completed' || item.status === 'Acquired') {
      return sum + (item.actualPrice || item.estimatedPrice);
    }
    return sum;
  }, 0);

  // Filtered items
  const filteredItems = project.items.filter(item => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
    return true;
  });

  const handleItemCompleted = (item: CosplayItem) => {
    sound.playSuccess();
    const result = awardItemCompletion(item.category);
    setGameState(getGamificationState());
    
    if (result.newBadges.length > 0) {
      result.newBadges.forEach(b => {
        addToast(`🏆 Badge Unlocked: ${b.title}`, `${b.icon} ${b.description} (+35 XP)`, 'purple');
      });
    }

    // Check if 100% complete
    const remaining = project.items.filter(i => i.id !== item.id && i.status !== 'Completed' && i.status !== 'Acquired').length;
    if (remaining === 0) {
      triggerCelebration();
      const projBadge = awardProjectCompletion();
      if (projBadge) {
        addToast(`🌟 Milestone Achieved: ${projBadge.title}`, `${projBadge.icon} ${projBadge.description} (+100 XP)`, 'purple');
      }
    }
  };

  const handleStatusChange = (itemId: string, newStatus: ItemStatus) => {
    sound.playClick();
    updateItemStatus(project.id, itemId, newStatus);
    if (newStatus === 'Completed') {
      const itm = project.items.find(i => i.id === itemId);
      if (itm) handleItemCompleted(itm);
    }
  };

  const handleToggleCompleted = (item: CosplayItem) => {
    if (item.status === 'Completed') {
      handleStatusChange(item.id, 'Missing');
    } else {
      handleStatusChange(item.id, 'Completed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-8 animate-fadeIn">
      
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-dream-700 hover:text-dream-950 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-dream-500 group-hover:-translate-x-1 transition-transform" />
          <span>Back to My Cosplays</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Social Share Plan Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-blush-500/15 to-lavender-500/15 border border-blush-300/60 dark:border-blush-700/50 text-dream-800 dark:text-lavender-200 hover:scale-105 transition-all shadow-xs"
            title="Generate social share card for Instagram, Twitter & Discord"
          >
            <Share2 className="w-3.5 h-3.5 text-blush-500" />
            <span>Share Plan</span>
          </button>

          <button
            onClick={() => setIsMeasurementsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-lavender-200 text-dream-700 hover:bg-lavender-50 transition-colors"
            title="View or edit your body measurements profile"
          >
            <Ruler className="w-3.5 h-3.5 text-dream-500" />
            <span>Measurements</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-lavender-200 text-dream-700 hover:bg-lavender-50 transition-colors"
            title="Print or export checklist to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-dream-500" />
            <span>Export Checklist</span>
          </button>
          <button
            onClick={() => onViewCharacterProfile(project.characterId)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-lavender-200 text-dream-700 hover:bg-lavender-50 transition-colors"
          >
            Character Lore
          </button>
          <button
            onClick={() => onOpenCompanion(project.characterId)}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-dream-600 to-blush-500 text-white shadow-sm hover:opacity-95 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask {project.characterName.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* 100% Completion Celebration Banner */}
      {completedItems === totalItems && totalItems > 0 && (
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 text-white shadow-xl shadow-emerald-500/20 border border-emerald-300/40 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                  <span>You're 100% Ready for the Convention!</span>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/25 font-black text-white">100% Complete</span>
                </h3>
                <p className="text-xs sm:text-sm text-white/90 mt-0.5 font-medium">
                  Pack your bags and have an amazing time! Every craft item, garment, and prop is completed.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  triggerCelebration();
                  sound.playSuccess();
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <span>Re-trigger Confetti 🎊</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. PROJECT HERO CARD WITH PROGRESS BAR & RING */}
      <div className="relative overflow-hidden rounded-3xl bg-white/90 border border-lavender-200/90 shadow-soft p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-lavender-200">
              <img
                src={project.characterImage}
                alt={project.characterName}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-dream-500">
                {project.characterSeries}
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-dream-950 tracking-tight">
                {project.characterName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-dream-600">
                <span className="px-2.5 py-0.5 rounded-full bg-lavender-100 font-semibold text-dream-800">
                  {project.characterDifficulty}
                </span>
                {project.targetEvent && (
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-dream-400" />
                    <span>Target: {project.targetEvent}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Progress Ring */}
          <div className="flex items-center gap-5 pt-4 md:pt-0 border-t md:border-t-0 border-lavender-100">
            <ProgressRing
              progress={progressPercent}
              size={80}
              strokeWidth={7}
              color="#9B78D1"
            >
              <div className="flex flex-col items-center justify-center">
                <span className="font-display font-black text-base text-dream-950 leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[9px] font-bold text-dream-500">READY</span>
              </div>
            </ProgressRing>

            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-dream-500 uppercase tracking-wider">
                Cosplay Progress
              </div>
              <div className="text-xs font-semibold text-dream-700 bg-lavender-50 px-3 py-1 rounded-xl border border-lavender-200">
                {completedItems + acquiredItems} / {totalItems} items ready
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lavender-100/90 border border-lavender-200 text-dream-800">
                <Award className="w-3 h-3 text-dream-600" />
                <span>Lv. {gameState.level} Crafter</span>
                <span className="text-dream-500 font-mono">({gameState.xp} XP)</span>
              </div>
            </div>
          </div>

        </div>

        {/* PROGRESS BAR (Anime Style Gradient) */}
        <div className="mt-8 pt-6 border-t border-lavender-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-dream-700">
            <span>Overall Readiness</span>
            <span className="font-mono">{progressPercent}%</span>
          </div>

          <div className="h-4 w-full bg-lavender-100 rounded-full overflow-hidden p-0.5 border border-lavender-200/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-dream-500 via-lavender-500 to-blush-500 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-dream-500 pt-1">
            <span>{missingItems} Missing</span>
            <span>{inProgressItems} In Progress</span>
            <span>{acquiredItems} Acquired</span>
            <span className="font-semibold text-emerald-700">{completedItems} Completed</span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-lavender-100 text-xs">
          <div className="p-3 rounded-2xl bg-lavender-50/60 border border-lavender-100">
            <div className="text-dream-500 font-medium">Estimated Budget</div>
            <div className="text-base font-bold font-mono text-dream-950 mt-0.5">
              {currency === 'INR' ? `₹${totalEstimatedCost.toLocaleString('en-IN')}` : `$${Math.round(totalEstimatedCost / 80)}`}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-lavender-50/60 border border-lavender-100">
            <div className="text-dream-500 font-medium">Acquired / Spent</div>
            <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
              {currency === 'INR' ? `₹${totalSpent.toLocaleString('en-IN')}` : `$${Math.round(totalSpent / 80)}`}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-lavender-50/60 border border-lavender-100 flex items-center justify-between">
            <div>
              <div className="text-dream-500 font-medium">Items Status</div>
              <div className="text-xs font-bold text-dream-900 mt-0.5">
                {completedItems === totalItems ? 'Ready for Convention!' : `${missingItems} items to source`}
              </div>
            </div>
            {completedItems === totalItems && (
              <button
                onClick={triggerCelebration}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold"
              >
                🎉 Celebrate
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Convention Timeline with Auto-Generated Backward Milestones */}
      <ConventionTimeline
        projectId={project.id}
        targetEvent={project.targetEvent}
        targetDate={project.targetDate}
        onUpdateTargetDate={(d) => updateProjectMeta(project.id, { targetDate: d })}
        onUpdateTargetEvent={(ev) => updateProjectMeta(project.id, { targetEvent: ev })}
      />

      {/* Cost Tracking & Spend Analytics Card */}
      <CostTrackingCard
        items={project.items}
        budgetTotal={project.budgetTotal}
        currency={currency}
      />

      {/* Project Planning Module Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-lavender-200/80 dark:border-lavender-800/60 shadow-sm overflow-x-auto max-w-full">
        <button
          onClick={() => {
            sound.playClick();
            setActiveSection('checklist');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'checklist'
              ? 'bg-gradient-to-r from-dream-700 to-lavender-600 text-white shadow-sm'
              : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900 dark:hover:text-white hover:bg-lavender-50 dark:hover:bg-gray-700/60'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Checklist & Craft</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
            activeSection === 'checklist' ? 'bg-white/20 text-white' : 'bg-lavender-200 dark:bg-gray-700 text-dream-800 dark:text-white'
          }`}>
            {totalItems}
          </span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSection('moodboard');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'moodboard'
              ? 'bg-gradient-to-r from-dream-700 to-lavender-600 text-white shadow-sm'
              : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900 dark:hover:text-white hover:bg-lavender-50 dark:hover:bg-gray-700/60'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Moodboard & References</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSection('photoshoot');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSection === 'photoshoot'
              ? 'bg-gradient-to-r from-dream-700 to-lavender-600 text-white shadow-sm'
              : 'text-dream-600 dark:text-lavender-300 hover:text-dream-900 dark:hover:text-white hover:bg-lavender-50 dark:hover:bg-gray-700/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photoshoot & Poses</span>
        </button>
      </div>

      {activeSection === 'checklist' && (
      <>
      {/* 2. CHECKLIST HEADER & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-dream-950">
            Cosplay Requirements Checklist
          </h2>
          <p className="text-xs text-dream-600">
            Track garments, wigs, props, lenses, and custom craft pieces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: List vs Kanban Board */}
          <div className="flex items-center bg-white/80 p-1 rounded-2xl border border-lavender-200 shadow-2xs">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('list');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-dream-700 text-white shadow-xs'
                  : 'text-dream-600 hover:text-dream-900'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('board');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'board'
                  ? 'bg-dream-700 text-white shadow-xs'
                  : 'text-dream-600 hover:text-dream-900'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsCustomModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Custom Item</span>
          </button>
        </div>
      </div>

      {/* 3. KANBAN BOARD OR LIST VIEW */}
      {viewMode === 'board' ? (
        <KanbanBoard
          items={project.items}
          currency={currency}
          onUpdateStatus={handleStatusChange}
          onItemCompleted={handleItemCompleted}
        />
      ) : (
        <>
          {/* Category & Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 border border-lavender-200">
            
            {/* Category filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-dream-500 mr-1">Category:</span>
              {(['All', 'Garment', 'Wig', 'Prop', 'Accessories', 'Makeup', 'Footwear'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-dream-700 text-white shadow-sm'
                      : 'text-dream-700 hover:bg-lavender-100/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status filters */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-dream-500 mr-1">Status:</span>
              {(['All', 'Missing', 'In Progress', 'Acquired', 'Completed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-dream-900 text-white'
                      : 'text-dream-600 hover:bg-lavender-100/70'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>

      {/* 4. CHECKLIST ITEMS LIST */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const isCompleted = item.status === 'Completed';
            const statusConfig = STATUS_COLORS[item.status];

            return (
              <div
                key={item.id}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : 'bg-white/80 border-lavender-200/80 hover:border-lavender-300 shadow-sm'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  
                  {/* Left: Checkbox & Name */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    
                    {/* Interactive Completion Circle */}
                    <button
                      type="button"
                      onClick={() => handleToggleCompleted(item)}
                      className={`mt-0.5 sm:mt-0 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                          : 'border-2 border-lavender-300 hover:border-dream-500 text-transparent'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm sm:text-base font-bold transition-all ${
                            isCompleted
                              ? 'line-through text-gray-500'
                              : 'text-dream-950 font-display'
                          }`}
                        >
                          {item.name}
                        </span>

                        {/* Category Tag */}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-lavender-100 text-dream-800 border border-lavender-200">
                          {item.category}
                        </span>

                        {item.isCustom && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blush-100 text-blush-700">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Notes / Tips */}
                      {item.notes && (
                        <p className="text-xs text-dream-600 mt-1 line-clamp-2">
                          {item.notes}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Right: Status Dropdown & Price */}
                  <div className="flex items-center gap-3 shrink-0">
                    
                    {/* Price */}
                    <div className="hidden sm:block text-right">
                      <div className="text-xs font-mono font-bold text-dream-900">
                        {currency === 'INR'
                          ? `₹${item.estimatedPrice.toLocaleString('en-IN')}`
                          : `$${Math.round(item.estimatedPrice / 80)}`}
                      </div>
                      <div className="text-[10px] text-dream-400">Est. Price</div>
                    </div>

                    {/* Interactive Status Selector */}
                    <select
                      value={item.status}
                      onChange={e => handleStatusChange(item.id, e.target.value as ItemStatus)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                        statusConfig.badge
                      } ${statusConfig.border}`}
                    >
                      <option value="Missing">Missing</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Acquired">Acquired</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {/* Edit Custom Item */}
                    {item.isCustom && (
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsCustomModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-dream-400 hover:text-dream-700 hover:bg-lavender-100 transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete Item */}
                    <button
                      onClick={() => deleteItem(project.id, item.id)}
                      className="p-1.5 rounded-lg text-dream-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>

                {/* Shopping & Craft Tutorial Shortcuts */}
                <div className="mt-3 pt-2.5 border-t border-lavender-100 dark:border-lavender-800/40 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-dream-400 dark:text-lavender-400 mr-1 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      <span>Search:</span>
                    </span>
                    <a
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(`${project.characterName} ${item.name} cosplay`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Amazon</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                    <a
                      href={`https://www.etsy.com/search?q=${encodeURIComponent(`${project.characterName} ${item.name} cosplay`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200/80 font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Etsy</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                    <a
                      href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${project.characterName} ${item.name} cosplay`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>eBay</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* YouTube Tutorial Finder */}
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`how to make ${item.name} cosplay tutorial ${project.characterName}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800/40 font-semibold transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Tutorial</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    {item.shoppingUrl && (
                      <a
                        href={item.shoppingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-dream-600 hover:text-dream-900 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Custom Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white/60 border border-lavender-200">
            <p className="text-xs text-dream-600">
              No items match the current category or status filter.
            </p>
          </div>
        )}
      </div>
      </>
      )}
      </>
      )}

      {/* Moodboard & Visual Inspiration Section */}
      {activeSection === 'moodboard' && (
        <MoodboardGallery
          projectId={project.id}
          characterName={project.characterName}
        />
      )}

      {/* Photoshoot Planner & Shot List Section */}
      {activeSection === 'photoshoot' && (
        <PhotoshootPlanner
          projectId={project.id}
          characterName={project.characterName}
        />
      )}

      {/* Custom Item Modal */}
      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => {
          setIsCustomModalOpen(false);
          setEditingItem(null);
        }}
        initialItem={editingItem}
        onSave={itemData => {
          if (editingItem) {
            updateItem(project.id, editingItem.id, itemData);
          } else {
            addCustomItem(project.id, itemData);
          }
        }}
      />

      {/* Measurements Profile Modal */}
      <React.Suspense fallback={null}>
        {isMeasurementsOpen && (
          <MeasurementsModal
            isOpen={isMeasurementsOpen}
            onClose={() => setIsMeasurementsOpen(false)}
          />
        )}
      </React.Suspense>

      {/* Social Media Share Card Modal */}
      <React.Suspense fallback={null}>
        {isShareModalOpen && (
          <SharePlanModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            project={project}
            progressPercent={progressPercent}
          />
        )}
      </React.Suspense>

    </div>
  );
};
