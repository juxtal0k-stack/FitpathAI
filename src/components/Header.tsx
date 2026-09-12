import React, { useState } from 'react';
import { 
  Dumbbell, 
  Brain, 
  Utensils, 
  Smartphone, 
  User, 
  Wifi, 
  WifiOff, 
  Flame,
  Award,
  Lock,
  Palette,
  Check,
  Scale,
  Sparkles,
  Presentation,
  ClipboardCheck
} from 'lucide-react';
import { StudentProfile } from '../types';
import { FitnessTheme, ThemeConfig, FITNESS_THEMES } from '../theme';
import { WatermarkControlPill } from './GymWatermarkBackground';

export type ActiveNavTab = 'routine' | 'daily-log' | 'scaler' | 'measures' | 'nutrition' | 'diet' | 'sensors' | 'profile';

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
  watermarkOpacity?: 'subtle' | 'balanced' | 'prominent' | 'off';
  onChangeWatermarkOpacity?: (opacity: 'subtle' | 'balanced' | 'prominent' | 'off') => void;
  watermarkPhoto?: 'strength' | 'turf' | 'mobility';
  onChangeWatermarkPhoto?: (photo: 'strength' | 'turf' | 'mobility') => void;
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
  onOpenPresentationGuide,
  watermarkOpacity = 'balanced',
  onChangeWatermarkOpacity,
  watermarkPhoto = 'strength',
  onChangeWatermarkPhoto,
}) => {
  const [showThemePicker, setShowThemePicker] = useState(false);

  const navItems: { id: ActiveNavTab; label: string; icon: React.ElementType }[] = [
    { id: 'routine', label: 'Workout', icon: Dumbbell },
    { id: 'daily-log', label: 'Daily Activity & Diet', icon: ClipboardCheck },
    { id: 'scaler', label: 'Exam Adjuster', icon: Brain },
    { id: 'measures', label: 'Physical Measures', icon: Scale },
    { id: 'nutrition', label: 'Food Nutrition', icon: Sparkles },
    { id: 'diet', label: 'Dorm Meals', icon: Utensils },
    { id: 'sensors', label: 'Health Sync', icon: Smartphone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className={`sticky top-0 z-40 ${themeConfig.surfaceClass} border-b ${themeConfig.borderClass} shadow-xs transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo & Prototype Tag */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-base ${themeConfig.textPrimary}`}>
                FitPath
              </span>
              <button
                onClick={onOpenSIHModal}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
                title="View SIH Prototype Dossier & Presets"
              >
                <Award className="w-3 h-3 text-emerald-700" />
                <span>SIH Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={`hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border ${themeConfig.borderClass}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold border border-slate-200/70'
                    : `${themeConfig.textSecondary} hover:${themeConfig.textPrimary} hover:bg-white/50`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Watermark Control Pill */}
          {onChangeWatermarkOpacity && onChangeWatermarkPhoto && (
            <WatermarkControlPill
              currentOpacity={watermarkOpacity}
              onChangeOpacity={onChangeWatermarkOpacity}
              currentPhoto={watermarkPhoto}
              onChangePhoto={onChangeWatermarkPhoto}
              theme={themeConfig}
            />
          )}

          {/* Presentation Guide */}
          {onOpenPresentationGuide && (
            <button
              onClick={onOpenPresentationGuide}
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border ${themeConfig.borderClass} ${themeConfig.surfaceHoverClass} ${themeConfig.textPrimary} transition cursor-pointer`}
              title="Pitch Guide & Presentation Checklist"
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-600" />
              <span>Guide</span>
            </button>
          )}

          {/* Lock Screen Glance Button */}
          <button
            onClick={onOpenLockScreen}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border ${themeConfig.borderClass} ${themeConfig.surfaceHoverClass} ${themeConfig.textPrimary} transition cursor-pointer shadow-xs`}
            title="Open Smartphone Lock Screen Glance Widget"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Lock Screen</span>
          </button>

          {/* Fitness Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className={`p-1.5 rounded-xl border ${themeConfig.borderClass} ${themeConfig.surfaceHoverClass} ${themeConfig.textPrimary} transition cursor-pointer flex items-center gap-1.5 text-xs`}
              title="Change Fitness Theme"
            >
              <Palette className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline text-[11px] font-medium">{themeConfig.name.split(' ')[0]}</span>
            </button>

            {showThemePicker && (
              <div 
                className={`absolute right-0 mt-2 w-56 rounded-2xl ${themeConfig.surfaceClass} border ${themeConfig.borderClass} shadow-xl p-2 z-50`}
                onMouseLeave={() => setShowThemePicker(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-700/20 mb-1">
                  Fitness Themes
                </div>
                {(Object.keys(FITNESS_THEMES) as FitnessTheme[]).map((themeKey) => {
                  const t = FITNESS_THEMES[themeKey];
                  const isSelected = currentTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => {
                        onSelectTheme(themeKey);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                        isSelected 
                          ? `${t.badgeBg} ${t.badgeText} font-bold` 
                          : `${themeConfig.textSecondary} ${themeConfig.surfaceHoverClass}`
                      }`}
                    >
                      <div className="text-xs">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-[10px] opacity-75">{t.brandInspiration}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sync Status Button */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
              isOffline
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
            title="Toggle Offline Sensor Simulation"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Synced</span>
              </>
            )}
          </button>

          {/* Profile Quick Pill */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border ${themeConfig.borderClass} ${themeConfig.surfaceHoverClass} transition cursor-pointer`}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              {profile.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className={`text-xs font-bold ${themeConfig.textPrimary} block leading-tight`}>
                {profile.name.split(' ')[0]}
              </span>
              <span className={`text-[10px] ${themeConfig.textMuted} block leading-tight`}>
                {profile.daysUntilExam}d to exams
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Sub-nav row for medium & small desktop screens */}
      <div className={`hidden md:flex xl:hidden border-t ${themeConfig.borderClass} ${themeConfig.isDark ? 'bg-slate-950/80' : 'bg-slate-50'} px-4 py-2 items-center justify-center gap-1`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? `${themeConfig.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} font-bold shadow-xs`
                  : `${themeConfig.textMuted} hover:${themeConfig.textPrimary}`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Navigation Bar */}
      <div className={`md:hidden border-t ${themeConfig.borderClass} ${themeConfig.isDark ? 'bg-slate-950' : 'bg-slate-50'} px-2 py-1.5 flex items-center justify-between overflow-x-auto`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-medium transition cursor-pointer shrink-0 ${
                isActive
                  ? 'text-emerald-500 font-bold'
                  : `${themeConfig.textMuted} hover:${themeConfig.textPrimary}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
