import React from 'react';
import { 
  Palette, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Award, 
  Check, 
  Smartphone, 
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FloatingModalWindow } from './FloatingModalWindow';
import { FitnessTheme, ThemeConfig, FITNESS_THEMES } from '../theme';

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: FitnessTheme;
  themeConfig: ThemeConfig;
  onSelectTheme: (theme: FitnessTheme) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  onLoadSIHPreset: (preset: 'rohan' | 'ananya' | 'vikram') => void;
  onResetData: () => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  themeConfig,
  onSelectTheme,
  isOffline,
  setIsOffline,
  onLoadSIHPreset,
  onResetData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);
  return (
    <FloatingModalWindow
      isOpen={isOpen}
      onClose={onClose}
      title="App Settings & System Controls"
      subtitle="Theme styling, offline simulation, and demo presets"
      badge="Preferences"
      icon={Palette}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Fitness Theme Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visual Fitness Theme
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {themeConfig.name}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(FITNESS_THEMES) as FitnessTheme[]).map((themeKey) => {
              const t = FITNESS_THEMES[themeKey];
              const isSelected = currentTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => onSelectTheme(themeKey)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.name}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      {t.brandInspiration}
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Network & Offline Sensor Simulation */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isOffline 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' 
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
            }`}>
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Offline Simulation Mode
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isOffline 
                  ? 'App running in cached offline state. Server calls simulated locally.' 
                  : 'Connected to live FitPath Edge Engine.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              isOffline
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {isOffline ? 'Go Online' : 'Simulate Offline'}
          </button>
        </div>

        {/* SIH Student Presets */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
            Demo Student Profile Presets
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onLoadSIHPreset('rohan');
                onClose();
              }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 hover:border-emerald-300 text-left transition cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600">
                Rohan (Eng. Junior)
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                4 days to exams • High stress
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onLoadSIHPreset('ananya');
                onClose();
              }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 hover:border-emerald-300 text-left transition cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600">
                Ananya (Bio-Med)
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                PCOS & Knees • Plant-based
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                onLoadSIHPreset('vikram');
                onClose();
              }}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 hover:border-emerald-300 text-left transition cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600">
                Vikram (Hostel)
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Zero gym equipment • Minimal budget
              </span>
            </button>
          </div>
        </div>

        {/* Danger zone / Reset profile */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Reset individual telemetry and return to clean setup</span>
          </div>
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmReset(false);
                  onResetData();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40 text-xs font-semibold transition cursor-pointer"
            >
              Reset App Data
            </button>
          )}
        </div>
      </div>
    </FloatingModalWindow>
  );
};
