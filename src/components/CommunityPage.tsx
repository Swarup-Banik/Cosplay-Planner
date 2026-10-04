import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Share2, Tag, Scissors, Camera, MessageCircle, Plus, Trash2, ShieldCheck, X, Image as ImageIcon } from 'lucide-react';
import { COMMUNITY_POSTS, CommunityPost } from '../data/community';
import { useCosplay } from '../context/CosplayContext';
import { sound } from '../utils/audio';

const LOCAL_SHOWCASE_KEY = 'cosplay_local_showcase_v1';

export const CommunityPage: React.FC = () => {
  const { savedProjects } = useCosplay();
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_SHOWCASE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Pin Form State
  const [pinCharacterName, setPinCharacterName] = useState('');
  const [pinSeries, setPinSeries] = useState('');
  const [pinImage, setPinImage] = useState('');
  const [pinCaption, setPinCaption] = useState('');
  const [pinTip, setPinTip] = useState('');
  const [pinMaterials, setPinMaterials] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_SHOWCASE_KEY, JSON.stringify(localPosts));
    } catch {}
  }, [localPosts]);

  const handleToggleLike = (id: string) => {
    sound.playClick();
    const isCurrentlyLiked = likedPosts[id];
    setLikedPosts(prev => ({ ...prev, [id]: !isCurrentlyLiked }));
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        return {
          ...p,
          likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1
        };
      })
    );
  };

  const handleCreatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCharacterName.trim() || !pinImage.trim()) return;

    sound.playSuccess();
    const newPost: CommunityPost = {
      id: `local-pin-${Date.now()}`,
      author: 'You',
      handle: '@crafter_local',
      characterName: pinCharacterName.trim(),
      series: pinSeries.trim() || 'Anime / Manga',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      image: pinImage.trim(),
      likes: 1,
      tags: ['Handmade', 'MyCosplay', 'LocalPin'],
      caption: pinCaption.trim() || 'Debut ready! Sanded, sewn, and assembled with love.',
      craftingTip: pinTip.trim() || 'Always heat seal foam before applying primer!',
      materialsUsed: pinMaterials
        ? pinMaterials.split(',').map(s => s.trim()).filter(Boolean)
        : ['EVA Foam', 'Fabric', 'Wig']
    };

    setLocalPosts(prev => [newPost, ...prev]);
    setIsPinModalOpen(false);

    // Reset form
    setPinCharacterName('');
    setPinSeries('');
    setPinImage('');
    setPinCaption('');
    setPinTip('');
    setPinMaterials('');
  };

  const handleDeleteLocalPin = (id: string) => {
    sound.playClick();
    setLocalPosts(prev => prev.filter(p => p.id !== id));
  };

  const allDisplayPosts = [...localPosts, ...posts];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-lavender-200/60 dark:border-lavender-800/40">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-dream-600 dark:text-lavender-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-dream-500" />
            <span>Cosplayer Showcase & Local Pinboard</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-dream-950 dark:text-white tracking-tight">
            Community Showcases
          </h1>
          <p className="text-sm text-dream-700/80 dark:text-lavender-300/80">
            Pin your finished cosplays with photos, notes, and backstage craft secrets. Stored privately on your device.
          </p>
        </div>

        <button
          onClick={() => setIsPinModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto hover:scale-105 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Pin My Finished Cosplay</span>
        </button>
      </div>

      {/* Local Privacy Notice Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-lavender-100/60 dark:bg-lavender-900/30 border border-lavender-200/80 dark:border-lavender-800/50 text-xs text-dream-800 dark:text-lavender-200">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <strong className="font-bold">Private & Local Showcase:</strong> Your pinned cosplays are stored strictly inside your browser's local storage. No accounts, backend tracking, or cloud servers are required.
        </div>
      </div>

      {/* Grid of Community Showcases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allDisplayPosts.map(post => {
          const isLiked = likedPosts[post.id];
          const isUserPin = post.id.startsWith('local-pin-');

          return (
            <div
              key={post.id}
              className="rounded-3xl bg-white/90 dark:bg-[#1A162B]/90 border border-lavender-200/90 dark:border-lavender-800/70 shadow-soft overflow-hidden backdrop-blur-xl flex flex-col justify-between"
            >
              {/* Post Header with Author */}
              <div className="p-5 flex items-center justify-between border-b border-lavender-100 dark:border-lavender-800/40">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover border border-lavender-200 dark:border-lavender-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-dream-950 dark:text-white font-display">
                      {post.author}
                    </div>
                    <div className="text-xs text-dream-500 dark:text-lavender-400">{post.handle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isUserPin && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      Your Pin
                    </span>
                  )}
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/60 text-dream-800 dark:text-lavender-200 border border-lavender-200 dark:border-lavender-800/60">
                    {post.series}
                  </span>
                  {isUserPin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLocalPin(post.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete your pin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Showcase Artwork */}
              <div className="relative aspect-[16/10] overflow-hidden bg-lavender-100 dark:bg-gray-800">
                <img
                  src={post.image}
                  alt={post.characterName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                  {post.characterName}
                </div>
              </div>

              {/* Post Content & Crafting Tip */}
              <div className="p-6 space-y-4 flex-1">
                <p className="text-xs sm:text-sm text-dream-900 dark:text-lavender-100 leading-relaxed font-light">
                  {post.caption}
                </p>

                {/* Golden Crafting Tip Box */}
                <div className="p-4 rounded-2xl bg-lavender-50/70 dark:bg-lavender-900/30 border border-lavender-200/80 dark:border-lavender-800/50 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-dream-800 dark:text-lavender-200">
                    <Scissors className="w-3.5 h-3.5 text-dream-600 dark:text-lavender-400" />
                    <span>Cosplayer's Crafting Secret:</span>
                  </div>
                  <p className="text-xs text-dream-700 dark:text-lavender-300 leading-relaxed font-light">
                    "{post.craftingTip}"
                  </p>
                </div>

                {/* Materials Used Tags */}
                <div>
                  <div className="text-[11px] font-bold text-dream-400 dark:text-lavender-400 uppercase tracking-wider mb-2">
                    Materials Breakdown:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {post.materialsUsed.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-gray-800 border border-lavender-200 dark:border-lavender-700 text-dream-800 dark:text-lavender-200 font-medium"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Likes & Tags */}
              <div className="p-5 border-t border-lavender-100 dark:border-lavender-800/40 bg-lavender-50/30 dark:bg-lavender-900/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isLiked
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        : 'bg-white dark:bg-gray-800 text-dream-700 dark:text-lavender-200 border border-lavender-200 dark:border-lavender-700 hover:bg-lavender-50'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{post.likes}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[11px] text-dream-500 dark:text-lavender-400">
                  {post.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx}>#{t}</span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pin Finished Cosplay Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1A162B] text-dream-950 dark:text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-lavender-200 dark:border-lavender-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-lavender-100 dark:border-lavender-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lavender-400 to-dream-600 text-white flex items-center justify-center shadow-sm">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-lg">
                  Pin Your Finished Cosplay
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-lavender-100 dark:hover:bg-lavender-900/40 text-dream-400 hover:text-dream-800 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePin} className="space-y-4 text-xs">
              {/* Autofill from saved projects option if available */}
              {savedProjects.length > 0 && (
                <div>
                  <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                    Quick-Fill from Saved Project:
                  </label>
                  <select
                    onChange={e => {
                      const proj = savedProjects.find(p => p.id === e.target.value);
                      if (proj) {
                        setPinCharacterName(proj.characterName);
                        setPinSeries(proj.characterSeries);
                        setPinImage(proj.characterImage);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white"
                  >
                    <option value="">Select saved project...</option>
                    {savedProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.characterName} ({p.characterSeries})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                  Character Name *
                </label>
                <input
                  type="text"
                  required
                  value={pinCharacterName}
                  onChange={e => setPinCharacterName(e.target.value)}
                  placeholder="e.g. Yor Forger, Gojo Satoru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white focus:outline-none focus:border-dream-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                  Anime / Series
                </label>
                <input
                  type="text"
                  value={pinSeries}
                  onChange={e => setPinSeries(e.target.value)}
                  placeholder="e.g. Spy × Family"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white focus:outline-none focus:border-dream-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                  Photo URL *
                </label>
                <input
                  type="url"
                  required
                  value={pinImage}
                  onChange={e => setPinImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or image link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white focus:outline-none focus:border-dream-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                  Showcase Note / Debut Story
                </label>
                <textarea
                  rows={2}
                  value={pinCaption}
                  onChange={e => setPinCaption(e.target.value)}
                  placeholder="How was the convention debut? What did you love crafting most?"
                  className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white focus:outline-none focus:border-dream-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                  Your Golden Crafting Tip
                </label>
                <input
                  type="text"
                  value={pinTip}
                  onChange={e => setPinTip(e.target.value)}
                  placeholder="e.g. Use heat-resistant contact cement for shoe armor"
                  className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white focus:outline-none focus:border-dream-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dream-700 dark:text-lavender-300 mb-1">
                  Materials Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={pinMaterials}
                  onChange={e => setPinMaterials(e.target.value)}
                  placeholder="EVA Foam 5mm, Worbla, Silk, got2b glued"
                  className="w-full px-3.5 py-2 rounded-xl border border-lavender-200 dark:border-lavender-800 bg-white dark:bg-gray-800 text-dream-900 dark:text-white focus:outline-none focus:border-dream-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-lavender-200 dark:border-lavender-800 text-dream-700 dark:text-lavender-300 hover:bg-lavender-50 dark:hover:bg-lavender-900/40 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-dream-600 to-lavender-600 text-white font-bold shadow-md hover:opacity-95"
                >
                  Pin to Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
