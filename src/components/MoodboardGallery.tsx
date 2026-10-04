import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Database, 
  Sparkles,
  Edit2,
  Check,
  HardDrive
} from 'lucide-react';
import { 
  MoodboardImage, 
  getProjectImages, 
  addProjectImage, 
  updateImageCaption, 
  deleteProjectImage, 
  clearProjectImages, 
  downscaleImage, 
  getTotalStorageBytes 
} from '../utils/moodboardStorage';
import { sound } from '../utils/audio';

interface MoodboardGalleryProps {
  projectId: string;
  characterName: string;
}

export const MoodboardGallery: React.FC<MoodboardGalleryProps> = ({
  projectId,
  characterName
}) => {
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [totalStorageBytes, setTotalStorageBytes] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const imgs = await getProjectImages(projectId);
      setImages(imgs);
      const totalBytes = await getTotalStorageBytes();
      setTotalStorageBytes(totalBytes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const { dataUrl, width, height, sizeBytes } = await downscaleImage(file);
        await addProjectImage(projectId, dataUrl, width, height, sizeBytes, file.name.replace(/\.[^/.]+$/, ''));
      }
      sound.playSuccess();
      await loadData();
    } catch (err) {
      console.error('Failed to upload image to moodboard', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playClick();
    await deleteProjectImage(id);
    await loadData();
    if (activeLightboxIndex !== null) setActiveLightboxIndex(null);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all moodboard images for this cosplay project?')) {
      sound.playClick();
      await clearProjectImages(projectId);
      await loadData();
    }
  };

  const handleSaveCaption = async (id: string) => {
    await updateImageCaption(id, captionInput);
    setEditingCaptionId(null);
    await loadData();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const activeImage = activeLightboxIndex !== null ? images[activeLightboxIndex] : null;

  return (
    <div className="rounded-3xl bg-white/90 dark:bg-gray-800/80 border border-lavender-200/90 dark:border-lavender-800/60 shadow-soft p-5 sm:p-6 space-y-6">
      
      {/* Top Header & Storage Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-lavender-100 dark:border-lavender-900/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 border border-lavender-200 dark:border-lavender-800/40 flex items-center justify-center text-dream-700 dark:text-lavender-300">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-dream-950 dark:text-white flex items-center gap-2">
              <span>Cosplay Moodboard & Visual References</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-lavender-100 dark:bg-gray-700 text-dream-800 dark:text-lavender-200 font-mono font-bold">
                {images.length}
              </span>
            </h3>
            <p className="text-xs text-dream-600 dark:text-lavender-400">
              Save fabric swatches, wig angles, makeup tests, and poses in offline IndexedDB
            </p>
          </div>
        </div>

        {/* Right: Storage Meter & Clear Button */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lavender-50 dark:bg-gray-900/40 border border-lavender-200/80 dark:border-lavender-800 text-dream-700 dark:text-lavender-300 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-dream-500" />
            <span>{formatSize(totalStorageBytes)} used</span>
          </div>

          {images.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
            >
              Clear All
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-dream-600 to-lavender-600 hover:from-dream-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Compressing...' : 'Add Photos'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Drag & Drop Zone if Empty */}
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-lavender-300 dark:border-lavender-700 rounded-3xl p-10 text-center cursor-pointer hover:border-dream-500 dark:hover:border-lavender-400 hover:bg-lavender-50/50 dark:hover:bg-gray-800/50 transition-all space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-lavender-100 dark:bg-gray-700 flex items-center justify-center text-dream-600 dark:text-lavender-300 mx-auto">
            <Upload className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-dream-900 dark:text-white">
              Drop references, fabric swatches, or screenshots here
            </h4>
            <p className="text-xs text-dream-500 dark:text-lavender-400 mt-1">
              Supports PNG, JPG, WebP. Automatically downscaled to 1600px for offline storage.
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-lavender-300 dark:border-lavender-600 text-dream-800 dark:text-white text-xs font-semibold shadow-xs"
          >
            Browse Device Photos
          </button>
        </div>
      ) : (
        /* Masonry Grid */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-lavender-100 dark:bg-gray-700/60 border border-lavender-200/80 dark:border-lavender-800 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
            >
              <img
                src={img.dataUrl}
                alt={img.caption || characterName}
                loading="lazy"
                className="w-full object-cover group-hover:scale-102 transition-transform duration-300"
              />

              {/* Hover Overlay with Delete & Caption Action */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                <div className="flex justify-end">
                  <button
                    onClick={e => handleDelete(e, img.id)}
                    className="p-1.5 rounded-xl bg-black/60 hover:bg-rose-600 text-white transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-white space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold truncate">
                      {img.caption || 'Reference Photo'}
                    </span>
                    <span className="text-[10px] text-white/70 font-mono">
                      {formatSize(img.sizeBytes)}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/60">
                    Click to view in full lightbox
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Lightbox Topbar */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/70">
                {(activeLightboxIndex ?? 0) + 1} / {images.length}
              </span>
              <span className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                {activeImage.caption || `${characterName} Reference`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={e => handleDelete(e, activeImage.id)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Artwork Area with Prev/Next Controls */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 my-2">
            {images.length > 1 && (
              <button
                onClick={() => setActiveLightboxIndex(prev => (prev! > 0 ? prev! - 1 : images.length - 1))}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={activeImage.dataUrl}
              alt={activeImage.caption || characterName}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {images.length > 1 && (
              <button
                onClick={() => setActiveLightboxIndex(prev => (prev! < images.length - 1 ? prev! + 1 : 0))}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-md"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Caption Editor Footer */}
          <div className="max-w-lg mx-auto w-full z-10">
            {editingCaptionId === activeImage.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={captionInput}
                  onChange={e => setCaptionInput(e.target.value)}
                  placeholder="Add note or caption..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 text-white text-xs placeholder-white/50"
                  autoFocus
                />
                <button
                  onClick={() => handleSaveCaption(activeImage.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div 
                onClick={() => {
                  setEditingCaptionId(activeImage.id);
                  setCaptionInput(activeImage.caption || '');
                }}
                className="flex items-center justify-center gap-2 text-xs text-white/80 hover:text-white cursor-pointer bg-white/10 hover:bg-white/15 px-4 py-2 rounded-xl transition-colors text-center"
              >
                <Edit2 className="w-3 h-3" />
                <span>{activeImage.caption || 'Click to add caption or notes'}</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
