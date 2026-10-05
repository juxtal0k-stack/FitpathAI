import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Droplet, 
  Brain, 
  Sparkles, 
  Smartphone, 
  Lock, 
  Dumbbell, 
  Scale, 
  Palette, 
  Award, 
  Presentation,
  Check,
  ChevronRight,
  ClipboardCheck
} from 'lucide-react';

interface FloatingQuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogWater: (delta: number) => void;
  onOpenTool: (tool: 'scaler' | 'nutrition' | 'sensors' | 'lockscreen' | 'settings') => void;
  onNavigateTab: (tab: 'routine' | 'daily-log' | 'diet' | 'measures') => void;
}

export const FloatingQuickActionsModal: React.FC<FloatingQuickActionsModalProps> = ({
  isOpen,
  onClose,
  onLogWater,
  onOpenTool,
  onNavigateTab,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Floating Actions Sheet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Quick Actions Hub
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Floating Tools & Controls
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Hydration One-Tap Row */}
            <div className="mt-4 p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500 text-white flex items-center justify-center">
                  <Droplet className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Instant Hydration Log
                  </span>
                  <span className="text-[11px] text-cyan-700 dark:text-cyan-300">
                    Drank a glass of water right now?
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogWater(1);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>+1 Glass</span>
              </button>
            </div>

            {/* Floating Popups & Tools Grid */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
                Open Floating Windows
              </span>

              <div className="grid grid-cols-2 gap-2">
                {/* Exam Scaler Tool */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenTool('scaler');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 hover:border-emerald-200 dark:border-slate-700/60 text-left transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center mb-2">
                    <Brain className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    Exam Adjuster
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Stress-scaled deload
                  </span>
                </button>

                {/* AI Food Analyzer Tool */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenTool('nutrition');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 hover:border-emerald-200 dark:border-slate-700/60 text-left transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    Food AI Scanner
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Macros & budget price
                  </span>
                </button>

                {/* Device Sensor Sync */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenTool('sensors');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 hover:border-emerald-200 dark:border-slate-700/60 text-left transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-2">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    Sensor Sync Hub
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Live accelerometer
                  </span>
                </button>

                {/* Lock Screen Simulator */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenTool('lockscreen');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-100 hover:border-emerald-200 dark:border-slate-700/60 text-left transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    Lock Screen Glance
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Ambient phone preview
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  onOpenTool('settings');
                  onClose();
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Themes & Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigateTab('daily-log');
                  onClose();
                }}
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                <span>Today's Activity Log</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
