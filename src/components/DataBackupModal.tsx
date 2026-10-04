import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  X, 
  Check, 
  AlertTriangle, 
  HardDrive, 
  FileJson,
  Sparkles
} from 'lucide-react';
import { exportFullBackup, importFullBackup } from '../services/storage';
import { sound } from '../utils/audio';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored?: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored
}) => {
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
    previewData?: any;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    sound.playSuccess();
    const backup = exportFullBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];

    const link = document.createElement('a');
    link.href = url;
    link.download = `cosplay-planner-backup-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const projectsCount = parsed.savedProjects?.length || 0;
        const favoritesCount = parsed.favorites?.length || 0;
        const hasMeasurements = !!parsed.measurements;

        setImportStatus({
          previewData: parsed,
          message: `Ready to restore: ${projectsCount} project(s), ${favoritesCount} favorite(s)${hasMeasurements ? ', measurements profile' : ''}.`
        });
      } catch {
        setImportStatus({
          success: false,
          message: 'Invalid JSON file. Please choose a valid Cosplay Planner backup file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!importStatus?.previewData) return;
    const res = importFullBackup(importStatus.previewData);
    if (res.success) {
      sound.playSuccess();
      setImportStatus({
        success: true,
        message: 'Data successfully restored! Refreshing app state...'
      });
      setTimeout(() => {
        if (onDataRestored) onDataRestored();
        window.location.reload();
      }, 1200);
    } else {
      setImportStatus({
        success: false,
        message: res.error || 'Failed to restore backup.'
      });
    }
  };

  const handleResetData = () => {
    if (window.confirm('CAUTION: This will delete all your local cosplay projects, wishlists, and photos. Continue?')) {
      localStorage.clear();
      sound.playClick();
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-[#151226]/95 backdrop-blur-2xl border border-lavender-200/90 dark:border-lavender-800/60 shadow-2xl p-6 sm:p-8 space-y-6 animate-scalePop">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-lavender-100 dark:border-lavender-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-lavender-100 dark:bg-lavender-900/60 border border-lavender-200 dark:border-lavender-800/40 flex items-center justify-center text-dream-700 dark:text-lavender-300">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-dream-950 dark:text-white">
                  Backup & Data Management
                </h3>
                <p className="text-xs text-dream-600 dark:text-lavender-400">
                  Export or restore your cosplay projects, checklists & wishlists
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-dream-400 hover:text-dream-700 dark:hover:text-white hover:bg-lavender-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Export Action Card */}
          <div className="p-4 rounded-2xl bg-lavender-50/60 dark:bg-gray-800/60 border border-lavender-200/80 dark:border-lavender-800/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-sm text-dream-900 dark:text-white flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-dream-600" />
                <span>Export Full Backup</span>
              </h4>
              <p className="text-xs text-dream-600/80 dark:text-lavender-400/80 mt-0.5">
                Save an offline JSON copy of all projects, progress & settings.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-dream-700 hover:bg-dream-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import Action Card */}
          <div className="p-4 rounded-2xl bg-lavender-50/60 dark:bg-gray-800/60 border border-lavender-200/80 dark:border-lavender-800/40 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-sm text-dream-900 dark:text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-dream-600" />
                  <span>Restore from Backup</span>
                </h4>
                <p className="text-xs text-dream-600/80 dark:text-lavender-400/80 mt-0.5">
                  Load a previously exported backup file to restore projects.
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white dark:bg-gray-700 hover:bg-lavender-50 text-dream-900 dark:text-white border border-lavender-300 dark:border-lavender-600 font-bold text-xs shadow-xs shrink-0 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>

            {/* Import Status Preview & Confirmation */}
            {importStatus && (
              <div className={`p-3 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                importStatus.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : importStatus.previewData
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-medium">{importStatus.message}</div>

                {importStatus.previewData && !importStatus.success && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setImportStatus(null)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 hover:bg-white text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmRestore}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                    >
                      Restore & Overwrite
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reset All Data (Caution) */}
          <div className="pt-4 border-t border-lavender-100 dark:border-lavender-900/60 flex items-center justify-between text-xs">
            <span className="text-dream-500 dark:text-lavender-400">
              Need a fresh start?
            </span>
            <button
              onClick={handleResetData}
              className="text-rose-500 hover:text-rose-700 font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All App Data</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
