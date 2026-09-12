import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Droplet, 
  Bell, 
  BellOff, 
  Clock, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronUp
} from 'lucide-react';
import { playWaterChime } from '../utils/soundEffects';

interface FloatingWaterReminderProps {
  waterGlasses: number;
  waterTargetGlasses: number;
  onDrinkWater: (glassesDelta: number) => void;
}

export const FloatingWaterReminder: React.FC<FloatingWaterReminderProps> = ({
  waterGlasses,
  waterTargetGlasses = 8,
  onDrinkWater,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(30); // 30m default
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Countdown timer
  useEffect(() => {
    if (!isEnabled) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Trigger reminder alert
          setShowNotificationToast(true);
          setToastMessage('Time to hydrate! Take a glass of fresh water.');
          if (soundEnabled) {
            playWaterChime();
          }
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, intervalMinutes, soundEnabled]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLog = (delta: number) => {
    onDrinkWater(delta);
    if (soundEnabled && delta > 0) {
      playWaterChime();
    }
    setSecondsRemaining(intervalMinutes * 60);
    setShowNotificationToast(false);
  };

  const progressPct = Math.min(100, Math.round((waterGlasses / Math.max(1, waterTargetGlasses)) * 100));

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Reminder Alert Banner Toast */}
      <AnimatePresence>
        {showNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="mb-3 max-w-xs bg-cyan-900 text-white p-3.5 rounded-2xl shadow-xl border border-cyan-500/40 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 mt-0.5 animate-bounce">
              <Droplet className="w-4 h-4 text-white fill-current" />
            </div>
            <div className="flex-1 text-xs">
              <span className="font-extrabold text-cyan-200 block">Hydration Reminder</span>
              <p className="text-cyan-100 text-[11px] mt-0.5">{toastMessage}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLog(1)}
                  className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Drank 1 Glass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNotificationToast(false)}
                  className="text-cyan-300 hover:text-white text-[10px] cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Quick Hydration Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-80 bg-white dark:bg-slate-900 border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl text-slate-900 dark:text-white space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Droplet className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight text-slate-950 dark:text-white">
                    Water Reminder
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Default active reminder
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Daily Count & Visual Bar */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 rounded-2xl p-3.5 border border-cyan-100 dark:border-cyan-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-800 dark:text-cyan-300">
                    Today's Hydration
                  </span>
                  <div className="text-2xl font-black text-cyan-950 dark:text-white">
                    {waterGlasses}{' '}
                    <span className="text-xs font-normal text-cyan-800/70 dark:text-cyan-300/70">
                      / {waterTargetGlasses} glasses ({waterGlasses * 250} ml)
                    </span>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-cyan-700 dark:text-cyan-400">
                  {progressPct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-cyan-200/50 dark:bg-cyan-900/50 h-2.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-cyan-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Quick Logging Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLog(1)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/20 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Glass (250ml)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLog(-1)}
                disabled={waterGlasses <= 0}
                className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Decrease 1 glass"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {/* Interval & Sound Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Next Reminder:</span>
                </span>
                <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                  {isEnabled ? formatTime(secondsRemaining) : 'Paused'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Interval:</span>
                <div className="flex items-center gap-1">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setIntervalMinutes(mins);
                        setSecondsRemaining(mins * 60);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                        intervalMinutes === mins
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setIsEnabled(!isEnabled)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
                >
                  {isEnabled ? (
                    <>
                      <Bell className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reminder Active</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reminder Paused</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) playWaterChime();
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                    title={soundEnabled ? 'Chime Sound Enabled' : 'Chime Sound Muted'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => playWaterChime()}
                    className="text-[10px] text-cyan-600 hover:underline font-bold cursor-pointer"
                  >
                    Test Sound
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-600/30 border-2 border-white/30 cursor-pointer transition select-none"
        title="Water Hydration Reminder - Click to view and log"
      >
        {/* Animated Water Ripple Effect Ring */}
        {isEnabled && (
          <span className="absolute -inset-1 rounded-full border-2 border-cyan-400/40 animate-ping pointer-events-none" />
        )}

        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Droplet className="w-4 h-4 fill-current text-cyan-100" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-cyan-100 leading-tight">
            Water ({waterGlasses}/{waterTargetGlasses})
          </span>
          <span className="text-[9px] font-mono text-cyan-200">
            {isEnabled ? `💧 In ${formatTime(secondsRemaining)}` : 'Paused'}
          </span>
        </div>

        <ChevronUp className={`w-3.5 h-3.5 text-cyan-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
    </div>
  );
};
