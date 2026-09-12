import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, 
  Bell, 
  BellOff, 
  Clock, 
  Check, 
  X, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { playWaterChime } from '../utils/soundEffects';

interface WaterReminderBarProps {
  waterGlasses: number;
  waterTargetGlasses: number;
  onDrinkWater: (glassesDelta: number) => void;
}

export const WaterReminderBar: React.FC<WaterReminderBarProps> = ({
  waterGlasses,
  waterTargetGlasses,
  onDrinkWater,
}) => {
  // Default reminder in app is enabled by default as requested
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(45); // default 45m interval
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [recentlyLoggedToast, setRecentlyLoggedToast] = useState<boolean>(false);

  // Reset timer countdown
  const resetCountdown = useCallback((minutes: number = intervalMinutes) => {
    setSecondsRemaining(minutes * 60);
  }, [intervalMinutes]);

  // Main reminder timer ticker
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Trigger reminder alert!
          setShowNotificationPopup(true);
          if (soundEnabled) {
            playWaterChime();
          }
          // Reset countdown to the full interval for the next cycle
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isEnabled, intervalMinutes, soundEnabled]);

  // Handle drinking a glass
  const handleDrink = (glasses: number = 1) => {
    onDrinkWater(glasses);
    if (soundEnabled) {
      playWaterChime();
    }
    setShowNotificationPopup(false);
    resetCountdown();
    setRecentlyLoggedToast(true);
    setTimeout(() => setRecentlyLoggedToast(false), 2500);
  };

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.round((waterGlasses / waterTargetGlasses) * 100));
  const timeProgressPercent = Math.min(
    100,
    Math.round(((intervalMinutes * 60 - secondsRemaining) / (intervalMinutes * 60)) * 100)
  );

  return (
    <>
      {/* PERSISTENT WATER REMINDER COMPONENT */}
      <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-2xl p-3.5 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Indicator & Hydration Stats */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5 fill-sky-500/30 text-sky-600 dark:text-sky-400" />
              </div>
              {isEnabled && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Hydration Reminder
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-700">
                  Default: Active
                </span>
                {recentlyLoggedToast && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
                    <Check className="w-3 h-3" /> +250ml logged!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                <span>
                  Today:{' '}
                  <strong className="text-slate-950 dark:text-white">
                    {waterGlasses} / {waterTargetGlasses} glasses
                  </strong>{' '}
                  ({waterGlasses * 250} ml)
                </span>
                <span>•</span>
                {isEnabled ? (
                  <span className="text-sky-700 dark:text-sky-300 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" />
                    Next in: <span className="font-mono">{formatTime(secondsRemaining)}</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Paused</span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Action & Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDrink(1)}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Log 1 glass of water (250ml) and reset reminder"
            >
              <Droplet className="w-3.5 h-3.5 fill-white" />
              + Drink 1 Glass (250ml)
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
              title="Hydration Reminder Settings"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mini progress bar of water target */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-sky-200/70 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 shrink-0">
            {progressPercent}% of Daily Target
          </span>
        </div>

        {/* Collapsible Settings Dropdown */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-sky-200 dark:border-sky-800/60 overflow-hidden text-xs text-slate-800 dark:text-slate-200 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Interval selector */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Reminder Interval:
                  </span>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                    {[30, 45, 60, 90].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => {
                          setIntervalMinutes(mins);
                          resetCountdown(mins);
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                          intervalMinutes === mins
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound & Power Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
                      soundEnabled
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    {soundEnabled ? 'Chime ON' : 'Muted'}
                  </button>

                  <button
                    onClick={() => {
                      setIsEnabled(!isEnabled);
                      if (!isEnabled) resetCountdown();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all ${
                      isEnabled
                        ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    {isEnabled ? 'Enabled (Default)' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => resetCountdown()}
                    className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    title="Reset countdown to beginning of interval"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* POPUP REMINDER TOAST WHEN TIMER REACHES ZERO */}
      <AnimatePresence>
        {showNotificationPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border-2 border-sky-500 rounded-2xl p-4 shadow-2xl space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 dark:text-white">
                    Time to Drink Water! 💧
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Your scheduled hydration reminder. Drinking now prevents brain fog and workout cramping.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationPopup(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleDrink(1)}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Drank 1 Glass (+250ml)
              </button>
              <button
                onClick={() => {
                  setShowNotificationPopup(false);
                  setSecondsRemaining(10 * 60); // Snooze 10m
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Snooze 10m
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
