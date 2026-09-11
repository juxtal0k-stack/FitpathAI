import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  BatteryCharging, 
  Wifi, 
  Signal, 
  Flame, 
  Footprints, 
  Moon, 
  Bell, 
  X, 
  ChevronRight, 
  Sparkles, 
  Dumbbell, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { IndividualProfile, SensorTelemetry, WorkoutRoutine } from '../types';
import { ThemeConfig } from '../theme';

import sihRunnerWallpaper from '../assets/images/sih_lockscreen_wallpaper_1789070138757.jpg';
import sihFitnessHero from '../assets/images/sih_fitness_home_hero_1789070116746.jpg';
import sihDietHero from '../assets/images/sih_healthy_diet_hero_1789070162299.jpg';

interface LockScreenGlanceProps {
  profile: IndividualProfile;
  telemetry: SensorTelemetry;
  activeRoutine: WorkoutRoutine | null;
  isAutoScaled: boolean;
  theme: ThemeConfig;
  onClose: () => void;
  onStartWorkout: () => void;
}

const WALLPAPERS = [
  {
    id: 'runner',
    title: 'Sunrise Biometric Runner',
    category: 'Athletic Motion',
    src: sihRunnerWallpaper,
  },
  {
    id: 'stretch',
    title: 'Morning Dorm Mobility',
    category: 'Recovery',
    src: sihFitnessHero,
  },
  {
    id: 'diet',
    title: 'Student Superfood Energy',
    category: 'Nutrition',
    src: sihDietHero,
  },
];

export const LockScreenGlance: React.FC<LockScreenGlanceProps> = ({
  profile,
  telemetry,
  activeRoutine,
  isAutoScaled,
  theme,
  onClose,
  onStartWorkout,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [autoSlideWallpaper, setAutoSlideWallpaper] = useState(true);

  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide wallpaper timer
  useEffect(() => {
    if (!autoSlideWallpaper) return;
    const slideTimer = setInterval(() => {
      setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
    }, 7000);
    return () => clearInterval(slideTimer);
  }, [autoSlideWallpaper]);

  const handleNextWallpaper = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  const formattedHours = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const stepPercent = Math.min(100, Math.round((telemetry.stepsToday / telemetry.targetSteps) * 100));
  const currentWallpaper = WALLPAPERS[wallpaperIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      {/* Phone Bezel Container */}
      <div className="relative w-full max-w-[390px] h-[780px] max-h-[92vh] rounded-[42px] p-3 bg-[#1e232d] shadow-2xl border-4 border-slate-700/80 flex flex-col overflow-hidden select-none">
        
        {/* Top Speaker / Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
          <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
        </div>

        {/* Realistic Mobile Screen Canvas */}
        <div className="relative flex-1 w-full h-full rounded-[34px] overflow-hidden bg-slate-950 flex flex-col justify-between text-white">
          
          {/* Animated Wallpaper Photo Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWallpaper.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full z-0"
            >
              <img
                src={currentWallpaper.src}
                alt={currentWallpaper.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {/* Wallpaper Gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />
            </motion.div>
          </AnimatePresence>

          {/* Top Status Bar */}
          <div className="relative z-20 pt-3 px-6 flex items-center justify-between text-[11px] font-medium text-white/90">
            <span>{formattedHours}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/70">5G</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-1">
                <span>98%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Lock Screen Header & Clock */}
          <div className="relative z-20 px-6 pt-4 text-center">
            <motion.div 
              initial={{ y: -6 }} 
              animate={{ y: 0 }} 
              className="flex items-center justify-center gap-1.5 text-white/80 text-xs font-medium mb-1"
            >
              {isUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-white/70" />
              )}
              <span>FitPath Glance</span>
            </motion.div>

            <div className="text-5xl font-extralight tracking-tight text-white mb-1 font-sans drop-shadow-md">
              {formattedHours}
            </div>
            <div className="text-xs font-medium text-white/85 tracking-wide drop-shadow-sm">
              {formattedDate}
            </div>

            {/* Lock Screen Biometric Widget Bar */}
            <div className="mt-4 flex items-center justify-center gap-2 bg-black/45 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 shadow-lg">
              {/* Steps Circle */}
              <div className="flex items-center gap-2 pr-3 border-r border-white/15">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none" />
                    <circle
                      cx="16"
                      cy="16"
                      r="13"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="81.68"
                      strokeDashoffset={81.68 - (81.68 * stepPercent) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <Footprints className="w-3.5 h-3.5 text-emerald-400 absolute" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-white/60 block leading-none">Steps</span>
                  <span className="text-xs font-bold text-white leading-tight">
                    {telemetry.stepsToday.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Exam Deload Status */}
              <div className="flex items-center gap-2 pl-1 text-left">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] text-white/60 block leading-none">
                    {profile.daysUntilExam}d to Exam
                  </span>
                  <span className="text-xs font-semibold text-amber-300 leading-tight">
                    {isAutoScaled ? 'Deload Active' : 'Standard Routine'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Lock Screen Interactive Notifications */}
          <div className="relative z-20 px-5 space-y-2.5 my-auto">
            {showNotification && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-left shadow-xl"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FitPath Heuristic AI</span>
                  </div>
                  <span className="text-[10px] text-white/50">Now</span>
                </div>

                <p className="text-xs font-medium text-white mb-1">
                  {isAutoScaled
                    ? `Exam Deload Mode: 18m restorative session queued to reduce cortisol.`
                    : `Desk Posture Check: 4,200 steps logged. 3-min chest opening recommended.`}
                </p>

                <p className="text-[11px] text-white/70 mb-2">
                  Zero weights needed. Suitable for dorm room or study desk.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onStartWorkout();
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Dumbbell className="w-3 h-3" />
                    <span>Start Session</span>
                  </button>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="py-1.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}

            {/* Micro Posture / Sleep Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-indigo-300" />
                <div>
                  <span className="text-white/80 block font-medium">Sleep Recovery</span>
                  <span className="text-[10px] text-white/60">
                    {telemetry.sleepHours}h screen-off estimate
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Sufficient
              </span>
            </div>
          </div>

          {/* Bottom Controls: Wallpaper switcher & Slide to Unlock */}
          <div className="relative z-20 px-6 pb-6 text-center space-y-4">
            
            {/* Wallpaper Slide Selector Pill */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] text-white/80">
              <span className="flex items-center gap-1 text-[10px] text-white/70">
                <ImageIcon className="w-3 h-3 text-emerald-400" />
                Wallpaper {wallpaperIndex + 1}/{WALLPAPERS.length}
              </span>
              <button
                onClick={handleNextWallpaper}
                className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>Next Photo</span>
                <RefreshCw className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Slide / Click to Unlock Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUnlock}
              className="w-full py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white font-semibold text-xs tracking-wider uppercase border border-white/30 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Unlock className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>Tap to Return to FitPath</span>
              <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>

        {/* Close Button top-right outside phone */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center z-40 transition cursor-pointer"
          title="Exit Lock Screen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
