import React from 'react';
import { motion } from 'motion/react';
import { 
  Dumbbell, 
  ClipboardCheck, 
  Scale, 
  Plus, 
  Sparkles
} from 'lucide-react';
import { ActiveNavTab } from './Header';

interface FloatingDockNavProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenQuickActions: () => void;
  onOpenPopup: (tool: 'scaler' | 'nutrition' | 'sensors') => void;
}

export const FloatingDockNav: React.FC<FloatingDockNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickActions,
  onOpenPopup,
}) => {
  const primaryTabs = [
    { id: 'routine' as ActiveNavTab, label: 'Workout', icon: Dumbbell },
    { id: 'daily-log' as ActiveNavTab, label: 'Activity & Diet', icon: ClipboardCheck },
    { id: 'nutrition' as ActiveNavTab, label: 'Nutrition', icon: Sparkles },
    { id: 'measures' as ActiveNavTab, label: 'Biometrics', icon: Scale },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 px-3 w-full max-w-lg pointer-events-none">
      <nav 
        className="pointer-events-auto mx-auto flex items-center justify-between gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-full transition-all"
        aria-label="Floating Application Navigation"
      >
        {/* Left Primary Tabs */}
        <div className="flex items-center gap-1">
          {primaryTabs.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3 sm:px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 rounded-full bg-emerald-600 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                <span className="hidden xs:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Quick Action Button (+) */}
        <div className="relative px-1">
          <button
            type="button"
            onClick={onOpenQuickActions}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer ring-4 ring-slate-900"
            title="Open Quick Actions & Floating Tools"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Primary Tabs */}
        <div className="flex items-center gap-1">
          {primaryTabs.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3 sm:px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 rounded-full bg-emerald-600 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                <span className="hidden xs:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
