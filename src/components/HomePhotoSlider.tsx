import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Utensils, 
  Smartphone, 
  Brain,
  ArrowRight,
  Scale,
  Lock
} from 'lucide-react';
import { ThemeConfig } from '../theme';
import { ActiveNavTab } from './Header';

import sihFitnessHero from '../assets/images/sih_fitness_home_hero_1789070116746.jpg';
import sihDietHero from '../assets/images/sih_healthy_diet_hero_1789070162299.jpg';
import sihRunnerWallpaper from '../assets/images/sih_lockscreen_wallpaper_1789070138757.jpg';

interface SlideData {
  id: string;
  image: string;
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  highlight: string;
  description: string;
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  actionLabel: string;
  actionTab: ActiveNavTab;
}

const SLIDES: SlideData[] = [
  {
    id: 'mobility',
    image: sihFitnessHero,
    badge: 'SIH PROTOTYPE • ZERO EQUIPMENT',
    badgeIcon: Flame,
    title: '15-Minute Dorm Mobility & Posture Reset',
    highlight: 'Combat 8-Hour Study Slouch',
    description: 'Designed specifically for student rooms. Restores cervical spine alignment and decompresses lumbar discs without requiring gym memberships.',
    metric1: { label: 'Target Time', value: '15 Mins' },
    metric2: { label: 'Equip Needed', value: 'Zero (Floor/Desk)' },
    actionLabel: 'Launch Routine',
    actionTab: 'routine',
  },
  {
    id: 'measures',
    image: sihRunnerWallpaper,
    badge: 'SIH PROTOTYPE • CLINICAL BIOMETRICS',
    badgeIcon: Scale,
    title: 'Physical Measures & Dynamic Calorie Counter',
    highlight: 'BMI, BMR & Net Step Burn Tracking',
    description: 'Calculates clinical BMI classifications, basal metabolic rate, and merges phone accelerometer step burns with your daily calorie and hydration budget.',
    metric1: { label: 'BMI Analysis', value: 'Real-Time Gauge' },
    metric2: { label: 'Sensor Burn', value: '~0.04 kcal/Step' },
    actionLabel: 'Open Physical Measures',
    actionTab: 'measures',
  },
  {
    id: 'nutrition',
    image: sihDietHero,
    badge: 'SIH PROTOTYPE • FOOD NUTRITION REST API',
    badgeIcon: Sparkles,
    title: 'Instant Food Nutrition & Cognitive Impact Measure',
    highlight: 'Exact Protein, Fat, Carbs & Exam Stamina',
    description: 'Query any hostel meal, street food, or dorm recipe. Calculates precise macronutrients, micro-budget costs, and cognitive study endurance ratings.',
    metric1: { label: 'Nutrients', value: 'Protein, Fat, Carbs' },
    metric2: { label: 'Brain Analytics', value: 'Cognitive Impact' },
    actionLabel: 'Analyze Food Nutrition',
    actionTab: 'nutrition',
  },
  {
    id: 'diet',
    image: sihDietHero,
    badge: 'SIH PROTOTYPE • MICRO-BUDGET',
    badgeIcon: Utensils,
    title: 'Cognitive Focus Bowls Under ₹120 / $1.50',
    highlight: 'Kettle & Microwave Prep Only',
    description: 'High-bioavailability protein paired with low-glycemic oats and healthy fats to eliminate energy crashes during intense exam revisions.',
    metric1: { label: 'Protein / Meal', value: '24g Protein' },
    metric2: { label: 'Daily Budget', value: '< $4.50 / Day' },
    actionLabel: 'View Meal Recipes',
    actionTab: 'diet',
  },
  {
    id: 'telemetry',
    image: sihRunnerWallpaper,
    badge: 'SIH PROTOTYPE • ZERO HARDWARE',
    badgeIcon: Smartphone,
    title: 'Phone Accelerometer Cadence & Sleep Detection',
    highlight: 'No Smartwatch Required',
    description: 'Utilizes built-in smartphone motion sensors, step cadence, and screen-off heuristics to gauge fatigue and adapt your daily exercise threshold.',
    metric1: { label: 'Step Accuracy', value: '98.4%' },
    metric2: { label: 'Hardware Cost', value: '₹0 (Built-In)' },
    actionLabel: 'Sensor Telemetry',
    actionTab: 'sensors',
  },
  {
    id: 'scaler',
    image: sihFitnessHero,
    badge: 'SIH PROTOTYPE • CORTISOL SHIELD',
    badgeIcon: Brain,
    title: 'Exam Stress Auto-Scaler & Dynamic Deload',
    highlight: 'Preserve Nervous System Energy',
    description: 'When exams are within 7 days or sleep drops under 6.5 hours, the engine automatically replaces high-strain reps with parasympathetic recovery.',
    metric1: { label: 'Cortisol Drop', value: '-32% Stress' },
    metric2: { label: 'Retention Boost', value: '+28% Focus' },
    actionLabel: 'Test Auto-Scaler',
    actionTab: 'scaler',
  },
];

interface HomePhotoSliderProps {
  theme: ThemeConfig;
  onNavigateTab: (tab: ActiveNavTab) => void;
  onOpenLockScreen?: () => void;
}

export const HomePhotoSlider: React.FC<HomePhotoSliderProps> = ({
  theme,
  onNavigateTab,
  onOpenLockScreen,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Auto-play slide timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];
  const BadgeIcon = currentSlide.badgeIcon;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800 mb-6 group">
      {/* Aspect Ratio Container for Desktop & Mobile */}
      <div className="relative h-72 sm:h-84 md:h-96 w-full overflow-hidden bg-slate-950">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with optimized rendering */}
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105 transition-transform duration-7000 ease-out transform scale-100 group-hover:scale-103"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-7 md:p-8 text-white">
          {/* Top Bar inside Slide */}
          <div className="flex items-center justify-between">
            <motion.div
              key={`badge-${currentSlide.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md"
            >
              <BadgeIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentSlide.badge}</span>
            </motion.div>

            {/* Play/Pause & Counter Controls */}
            <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-xs">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white/80 hover:text-white transition cursor-pointer p-0.5"
                title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[11px] font-medium text-white/70">
                {currentIndex + 1} / {SLIDES.length}
              </span>
            </div>
          </div>

          {/* Bottom Main Content */}
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <motion.div
              key={`highlight-${currentSlide.id}`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide"
            >
              {currentSlide.highlight}
            </motion.div>

            <motion.h2
              key={`title-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-xl sm:text-2xl md:text-3xl font-bold tracking-normal leading-tight text-white drop-shadow-sm"
            >
              {currentSlide.title}
            </motion.h2>

            <motion.p
              key={`desc-${currentSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl"
            >
              {currentSlide.description}
            </motion.p>

            {/* Metrics Chips & Quick Launch Action */}
            <motion.div
              key={`actions-${currentSlide.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1"
            >
              {/* Metric 1 */}
              <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
                <span className="text-white/60 text-[10px] uppercase font-bold">{currentSlide.metric1.label}:</span>
                <span className="font-semibold text-emerald-300">{currentSlide.metric1.value}</span>
              </div>

              {/* Metric 2 */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
                <span className="text-white/60 text-[10px] uppercase font-bold">{currentSlide.metric2.label}:</span>
                <span className="font-semibold text-emerald-300">{currentSlide.metric2.value}</span>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigateTab(currentSlide.actionTab)}
                className="flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition cursor-pointer shadow-md"
              >
                <span>{currentSlide.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

              {onOpenLockScreen && (
                <button
                  onClick={onOpenLockScreen}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Lock Glance</span>
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition opacity-80 hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition opacity-80 hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              title={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
