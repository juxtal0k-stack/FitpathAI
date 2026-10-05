import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Brain, 
  Smartphone, 
  User, 
  Flame, 
  Award, 
  Lock, 
  Check, 
  Scale, 
  Sparkles, 
  ClipboardCheck, 
  Database, 
  ExternalLink,
  Compass,
  MapPin,
  Activity,
  HeartPulse,
  Wind
} from 'lucide-react';
import { StudentProfile } from '../types';
import { FitnessTheme, ThemeConfig, FITNESS_THEMES } from '../theme';

export type ActiveNavTab = 'routine' | 'daily-log' | 'nutrition' | 'map' | 'scaler' | 'measures' | 'sensors' | 'profile';

interface HeaderProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  profile: StudentProfile;
  currentTheme: FitnessTheme;
  themeConfig: ThemeConfig;
  onSelectTheme: (theme: FitnessTheme) => void;
  onOpenSIHModal: () => void;
  onOpenLockScreen: () => void;
  onOpenPresentationGuide?: () => void;
  onOpenBreathingModal?: () => void;
  isOneSecondSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  profile,
  currentTheme,
  themeConfig,
  onSelectTheme,
  onOpenSIHModal,
  onOpenLockScreen,
  onOpenBreathingModal,
  isOneSecondSyncing = true,
}) => {
  const [syncPulse, setSyncPulse] = useState(false);

  // Subtle 1-second visual pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncPulse((p) => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveNavTab; label: string; icon: React.ElementType }[] = [
    { id: 'routine', label: 'Workout', icon: Dumbbell },
    { id: 'daily-log', label: 'Activity & Diet', icon: ClipboardCheck },
    { id: 'nutrition', label: 'Food Nutrition', icon: Sparkles },
    { id: 'map', label: 'Device Map & Travel', icon: Compass },
    { id: 'scaler', label: 'Exam Adjuster', icon: Brain },
    { id: 'measures', label: 'Measures', icon: Scale },
    { id: 'sensors', label: 'Health Sync', icon: Smartphone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className={`sticky top-0 z-40 ${themeConfig.surfaceClass} border-b ${themeConfig.borderClass} shadow-xs transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Live SQLite Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className={`font-extrabold text-base tracking-tight ${themeConfig.textPrimary}`}>
                FitPath
              </span>
              <a
                href="/database-manager.html"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition shadow-2xs"
                title="Manage SQLite Database Structure & Tables"
              >
                <Database className="w-3 h-3 text-emerald-600" />
                <span>SQLite DB</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>

              {/* 1-Second Auto Sync Live Indicator */}
              <div 
                className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                title="Everything syncs within every single second"
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${syncPulse ? 'opacity-100 scale-125' : 'opacity-40 scale-100'} transition-all duration-300`} />
                <span>1s Live Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Aligned Segmented Navigation Tabs */}
        <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border ${themeConfig.borderClass} ${themeConfig.isDark ? 'bg-slate-900/90' : 'bg-slate-100/90'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `${themeConfig.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-950 font-bold'} shadow-xs border ${themeConfig.isDark ? 'border-slate-700' : 'border-slate-200/80'}`
                    : `${themeConfig.textSecondary} hover:${themeConfig.textPrimary} hover:bg-black/5 dark:hover:bg-white/5`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Database Manager Direct Link in Tab Bar */}
          <a
            href="/database-manager.html"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition cursor-pointer border border-transparent hover:border-emerald-300 dark:hover:border-emerald-800`}
            title="Open Live SQLite Structure Manager"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DB Admin</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Deep Breath Instant Calm Trigger */}
          <button
            onClick={onOpenBreathingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white transition cursor-pointer text-xs font-bold shadow-xs active:scale-95"
            title="Instant 4-7-8 Calm Breathing Exercise (Vagal Nerve Reset)"
          >
            <Wind className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="inline">Deep Breath</span>
          </button>

          {/* Obsidian Cyber Dark Theme Indicator */}
          <div 
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-semibold select-none shadow-xs"
            title="Active Theme: Obsidian Cyber Dark"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/60 ring-2 ring-emerald-500/20" />
            <span className="font-bold tracking-tight text-white">Obsidian Dark</span>
          </div>

          {/* Quick Lock Screen Glance */}
          <button
            onClick={onOpenLockScreen}
            className={`p-2 rounded-xl border ${themeConfig.borderClass} ${themeConfig.isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition cursor-pointer text-slate-600 dark:text-slate-300 hidden sm:inline-flex`}
            title="Lock Screen Glance Widget"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Profile Quick Pill */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border ${themeConfig.borderClass} ${themeConfig.isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} transition cursor-pointer`}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className={`text-xs font-bold ${themeConfig.textPrimary} max-w-[80px] truncate hidden sm:inline-block`}>
              {profile?.name ? profile.name.split(' ')[0] : 'Profile'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scrolling Aligned Segmented Bar */}
      <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        <button
          onClick={onOpenBreathingModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 whitespace-nowrap shrink-0 cursor-pointer shadow-xs active:scale-95"
        >
          <Wind className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Deep Breath</span>
        </button>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <a
          href="/database-manager.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap shrink-0"
        >
          <Database className="w-3.5 h-3.5" />
          <span>DB Admin</span>
        </a>
      </div>
    </header>
  );
};
