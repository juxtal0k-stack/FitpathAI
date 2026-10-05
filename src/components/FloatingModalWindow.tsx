import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface FloatingModalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const FloatingModalWindow: React.FC<FloatingModalWindowProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  icon: Icon,
  children,
  maxWidth = '3xl',
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop with modern glass blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Floating Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className={`relative w-full ${maxWidthClasses} bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden my-auto max-h-[92vh] z-10`}
          >
            {/* Window Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0 bg-slate-50/60 dark:bg-slate-900/60">
              <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {title}
                    </h2>
                    {badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {badge}
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Close window (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
