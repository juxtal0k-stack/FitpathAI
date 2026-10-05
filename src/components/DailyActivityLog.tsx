import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  Utensils, 
  Dumbbell, 
  Flame, 
  Droplet, 
  Footprints, 
  Moon, 
  Zap, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Scale, 
  FileText,
  Scan,
  Activity,
  HeartPulse,
  Award,
  AlertCircle
} from 'lucide-react';
import { ThemeConfig } from '../theme';
import { 
  LoggedFoodItem, 
  WorkoutHistoryItem, 
  DailyLogState, 
  IndividualProfile 
} from '../types';
import { HealthRadarTracker } from './HealthRadarTracker';

interface DailyActivityLogProps {
  theme: ThemeConfig;
  profile: IndividualProfile;
  dailyLog: DailyLogState;
  onUpdateDailyLog: (updated: DailyLogState) => void;
  onOpenFoodAnalyzer: () => void;
  onOpenWorkoutTab: () => void;
}

const COMMON_FOOD_PRESETS = [
  { name: '2 Boiled Eggs & Whole Wheat Toast', mealType: 'Breakfast' as const, calories: 230, protein: 15, carbs: 22, fat: 9 },
  { name: 'Rolled Oats with Peanut Butter & Banana', mealType: 'Breakfast' as const, calories: 420, protein: 16, carbs: 58, fat: 14 },
  { name: 'Dal Tadka with Steamed Rice (1 Bowl)', mealType: 'Lunch' as const, calories: 380, protein: 14, carbs: 64, fat: 8 },
  { name: 'Chicken / Paneer High-Protein Wrap', mealType: 'Lunch' as const, calories: 490, protein: 32, carbs: 46, fat: 18 },
  { name: 'Greek Yogurt or Curd with Roasted Peanuts', mealType: 'Snack' as const, calories: 210, protein: 15, carbs: 12, fat: 11 },
  { name: 'Microwave Scrambled Eggs & Bread', mealType: 'Dinner' as const, calories: 340, protein: 20, carbs: 30, fat: 15 },
];

export const DailyActivityLog: React.FC<DailyActivityLogProps> = ({
  theme,
  profile,
  dailyLog,
  onUpdateDailyLog,
  onOpenFoodAnalyzer,
  onOpenWorkoutTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'diet' | 'workouts' | 'notes'>('all');
  const [mealFilter, setMealFilter] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('All');
  
  // Custom Food Form Modal State
  const [showAddFoodModal, setShowAddFoodModal] = useState<boolean>(false);
  const [foodName, setFoodName] = useState<string>('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [foodCalories, setFoodCalories] = useState<number>(300);
  const [foodProtein, setFoodProtein] = useState<number>(15);
  const [foodCarbs, setFoodCarbs] = useState<number>(40);
  const [foodFat, setFoodFat] = useState<number>(8);

  // Custom Workout Form Modal State
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState<boolean>(false);
  const [workoutTitle, setWorkoutTitle] = useState<string>('Home Pushup & Squat Routine');
  const [workoutDuration, setWorkoutDuration] = useState<number>(20);
  const [workoutCalories, setWorkoutCalories] = useState<number>(160);
  const [workoutNotes, setWorkoutNotes] = useState<string>('3 sets of pushups and air squats');

  // Confirmation Reset Dialog
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Safe Accessors
  const items = Array.isArray(dailyLog?.items) ? dailyLog.items : [];
  const workouts = Array.isArray(dailyLog?.workouts) ? dailyLog.workouts : [];
  const waterGlasses = typeof dailyLog?.waterGlasses === 'number' ? dailyLog.waterGlasses : 0;
  const dailySteps = typeof dailyLog?.dailySteps === 'number' ? dailyLog.dailySteps : 0;
  const dailyDetails = dailyLog?.dailyDetails || {
    energyLevel: 3,
    sleepHours: 7.0,
    stressLevel: 'Low',
    notes: '',
  };

  // Calculations
  const totalCaloriesConsumed = items.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProteinGrams = items.reduce((sum, item) => sum + (item.proteinGrams || 0), 0);
  const totalCarbsGrams = items.reduce((sum, item) => sum + (item.carbsGrams || 0), 0);
  const totalFatGrams = items.reduce((sum, item) => sum + (item.fatGrams || 0), 0);

  const workoutCaloriesBurned = workouts.reduce((sum, w) => sum + (w.burnedCalories || 0), 0);
  const stepsCaloriesBurned = Math.round(dailySteps * 0.04);
  const totalBurned = workoutCaloriesBurned + stepsCaloriesBurned;

  const targetCalories = dailyLog?.targetCalories || 2200;
  const netCalories = totalCaloriesConsumed - totalBurned;
  const remainingCalories = targetCalories - totalCaloriesConsumed;

  const totalWorkoutMinutes = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  // Handlers for Food
  const handleAddFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const newItem: LoggedFoodItem = {
      id: `food-${Date.now()}`,
      foodName: foodName.trim(),
      mealType,
      calories: Number(foodCalories) || 0,
      proteinGrams: Number(foodProtein) || 0,
      carbsGrams: Number(foodCarbs) || 0,
      fatGrams: Number(foodFat) || 0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated: DailyLogState = {
      ...dailyLog,
      items: [newItem, ...items],
      workouts,
      dailyDetails,
    };

    onUpdateDailyLog(updated);
    setFoodName('');
    setShowAddFoodModal(false);
    triggerToast(`Logged ${newItem.foodName} (${newItem.calories} kcal)`);
  };

  const handleApplyFoodPreset = (preset: typeof COMMON_FOOD_PRESETS[0]) => {
    const newItem: LoggedFoodItem = {
      id: `food-${Date.now()}`,
      foodName: preset.name,
      mealType: preset.mealType,
      calories: preset.calories,
      proteinGrams: preset.protein,
      carbsGrams: preset.carbs,
      fatGrams: preset.fat,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated: DailyLogState = {
      ...dailyLog,
      items: [newItem, ...items],
      workouts,
      dailyDetails,
    };

    onUpdateDailyLog(updated);
    triggerToast(`Logged ${preset.name}!`);
  };

  const handleDeleteFoodItem = (id: string) => {
    const updated: DailyLogState = {
      ...dailyLog,
      items: items.filter((item) => item.id !== id),
      workouts,
      dailyDetails,
    };
    onUpdateDailyLog(updated);
    triggerToast('Item removed from food log');
  };

  // Handlers for Workout
  const handleAddCustomWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle.trim()) return;

    const newWorkout: WorkoutHistoryItem = {
      id: `workout-${Date.now()}`,
      routineTitle: workoutTitle.trim(),
      completedCount: 1,
      totalExercises: 1,
      durationMinutes: Number(workoutDuration) || 20,
      burnedCalories: Number(workoutCalories) || 150,
      exercisesCompleted: [workoutTitle.trim()],
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: workoutNotes.trim(),
    };

    const updated: DailyLogState = {
      ...dailyLog,
      items,
      workouts: [newWorkout, ...workouts],
      activeBurnCalories: (dailyLog?.activeBurnCalories || 0) + newWorkout.burnedCalories,
      dailyDetails,
    };

    onUpdateDailyLog(updated);
    setShowAddWorkoutModal(false);
    triggerToast(`Recorded workout: ${newWorkout.routineTitle}!`);
  };

  const handleDeleteWorkout = (id: string) => {
    const workoutToDelete = workouts.find((w) => w.id === id);
    const updated: DailyLogState = {
      ...dailyLog,
      items,
      workouts: workouts.filter((w) => w.id !== id),
      activeBurnCalories: Math.max(0, (dailyLog?.activeBurnCalories || 0) - (workoutToDelete?.burnedCalories || 0)),
      dailyDetails,
    };
    onUpdateDailyLog(updated);
    triggerToast('Workout removed from history');
  };

  // Water handler
  const handleUpdateWater = (delta: number) => {
    const newGlasses = Math.max(0, waterGlasses + delta);
    const updated: DailyLogState = {
      ...dailyLog,
      items,
      workouts,
      dailyDetails,
      waterGlasses: newGlasses,
    };
    onUpdateDailyLog(updated);
  };

  // Steps handler
  const handleAddSteps = (stepIncrement: number) => {
    const newSteps = dailySteps + stepIncrement;
    const updated: DailyLogState = {
      ...dailyLog,
      items,
      workouts,
      dailyDetails,
      dailySteps: newSteps,
    };
    onUpdateDailyLog(updated);
    triggerToast(`Added ${stepIncrement.toLocaleString()} steps!`);
  };

  // Daily details handler (notes, energy, sleep)
  const handleUpdateDailyDetails = (key: keyof DailyLogState['dailyDetails'], value: any) => {
    const updated: DailyLogState = {
      ...dailyLog,
      items,
      workouts,
      dailyDetails: {
        ...dailyDetails,
        [key]: value,
      },
    };
    onUpdateDailyLog(updated);
  };

  // Reset to Zero
  const handleResetDayToZero = () => {
    const zeroState: DailyLogState = {
      date: new Date().toISOString().split('T')[0],
      targetCalories: 2200,
      activeBurnCalories: 0,
      items: [],
      waterGlasses: 0,
      waterTargetGlasses: 8,
      workouts: [],
      dailySteps: 0,
      targetSteps: 8000,
      dailyDetails: {
        energyLevel: 3,
        sleepHours: 7.0,
        stressLevel: 'Low',
        notes: '',
      },
    };
    onUpdateDailyLog(zeroState);
    setShowResetConfirm(false);
    triggerToast('Day reset to zero! Clean slate ready.');
  };

  const filteredItems = mealFilter === 'All' 
    ? items 
    : items.filter((item) => item.mealType === mealFilter);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-5 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Daily Activity & Diet Log
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Real-time tracking that starts from zero and auto-saves your progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-bold">Auto-Saved to Cloud & Storage</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset today's values back to zero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Day from 0
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Reset Day */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reset Day Back to Zero?
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This will reset today's logged food items ({items.length}), recorded workouts ({workouts.length}), steps ({dailySteps}), and water back to zero so you can start clean.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetDayToZero}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                >
                  Confirm & Reset to 0
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Health Radar & Activity Tracker (User requested: Add radar and activity tracker in activity and diet tab) */}
      <HealthRadarTracker 
        theme={theme} 
        profile={profile} 
        dailyLog={dailyLog} 
        totalDistanceKm={profile?.deviceLocation?.totalDistanceKm || 3.4} 
      />

      {/* 4 CORE METRIC CARDS (STARTS FROM ZERO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Calories Consumed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              Calories Consumed
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Target: {targetCalories}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">
              {totalCaloriesConsumed.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">kcal</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalCaloriesConsumed / targetCalories) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>{Math.round((totalCaloriesConsumed / targetCalories) * 100)}% of goal</span>
            <span>{remainingCalories >= 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal surplus`}</span>
          </div>
        </div>

        {/* Metric 2: Workouts Completed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              Workouts Done
            </span>
            <span className="text-[11px] font-semibold text-slate-400">{totalWorkoutMinutes} mins total</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">
              {workouts.length}
            </span>
            <span className="text-xs font-bold text-slate-400">sessions</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1">
            <span>Burned ~{workoutCaloriesBurned} kcal</span>
            <button 
              onClick={onOpenWorkoutTab}
              className="text-emerald-400 hover:text-emerald-300 hover:underline font-bold cursor-pointer"
            >
              Start Workout →
            </button>
          </div>
        </div>

        {/* Metric 3: Water Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-sky-400" />
              Water Hydration
            </span>
            <span className="text-[11px] font-semibold text-slate-400">{waterGlasses * 250} ml</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white tracking-tight">
                {waterGlasses}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 8 glasses</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleUpdateWater(-1)}
                disabled={waterGlasses <= 0}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm disabled:opacity-30 cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => handleUpdateWater(1)}
                className="w-7 h-7 rounded-lg bg-sky-600 hover:bg-sky-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-xs"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex gap-1 pt-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-full transition-all ${
                  i < waterGlasses ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Metric 4: Daily Steps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-emerald-400" />
              Campus & Room Steps
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Goal: 8,000</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tracking-tight">
              {dailySteps.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">steps</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => handleAddSteps(500)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer"
            >
              +500
            </button>
            <button
              onClick={() => handleAddSteps(1000)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer"
            >
              +1,000
            </button>
            <button
              onClick={() => handleAddSteps(2000)}
              className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[11px] font-bold cursor-pointer"
            >
              +2,000
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setActiveSubTab('diet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'diet'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Diet Log ({items.length})
          </button>
          <button
            onClick={() => setActiveSubTab('workouts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'workouts'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Workouts Log ({workouts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'notes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Daily Notes & Wellness
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddFoodModal(true)}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Log Food
          </button>
          <button
            onClick={() => setShowAddWorkoutModal(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Log Workout
          </button>
        </div>
      </div>

      {/* SECTION 1: DIET & FOOD INTAKE LOG */}
      {(activeSubTab === 'all' || activeSubTab === 'diet') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600">
                <Utensils className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  Diet & Meals Logged Today
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Protein: <span className="font-bold text-slate-900 dark:text-white">{totalProteinGrams}g</span> • Carbs: <span className="font-bold text-slate-900 dark:text-white">{totalCarbsGrams}g</span> • Fat: <span className="font-bold text-slate-900 dark:text-white">{totalFatGrams}g</span>
                </p>
              </div>
            </div>

            {/* Meal Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setMealFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    mealFilter === filter
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                1-Tap Student Meal Presets (Quick Log)
              </span>
              <button
                onClick={onOpenFoodAnalyzer}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Scan className="w-3 h-3" />
                Scan Recipe with AI →
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_FOOD_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyFoodPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {p.calories} kcal
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Logged Foods List */}
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <Utensils className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No meals logged in this view yet
              </p>
              <p className="text-xs text-slate-500">
                Log a food item above or tap a 1-tap preset to start tracking your daily intake from zero!
              </p>
              <button
                onClick={() => setShowAddFoodModal(true)}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                + Log Food Manually
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                        {item.mealType}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.foodName}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Logged at {item.timestamp} • Protein: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.proteinGrams}g</span> • Carbs: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.carbsGrams}g</span> • Fat: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.fatGrams}g</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-slate-950 dark:text-white">
                        {item.calories}
                      </span>
                      <span className="text-xs font-bold text-slate-500 ml-1">kcal</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFoodItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Remove food"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: EXERCISE & WORKOUTS LOG */}
      {(activeSubTab === 'all' || activeSubTab === 'workouts') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                <Dumbbell className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white">
                  Exercise Sessions Logged Today
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {workouts.length} recorded session(s) • ~{workoutCaloriesBurned} total calories burned
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddWorkoutModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              + Log Custom Exercise
            </button>
          </div>

          {workouts.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <Dumbbell className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No workouts logged today yet
              </p>
              <p className="text-xs text-slate-500">
                Complete an interactive workout in the Workout tab, or log a custom dorm session here!
              </p>
              <button
                onClick={onOpenWorkoutTab}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Go to Home Workout →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {workout.routineTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Duration: <span className="font-semibold text-slate-800 dark:text-slate-200">{workout.durationMinutes} minutes</span> • Completed at {workout.time || 'Today'} • {workout.notes || 'Full routine completed'}
                    </p>
                    {workout.exercisesCompleted && workout.exercisesCompleted.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {workout.exercisesCompleted.slice(0, 4).map((ex, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {ex}
                          </span>
                        ))}
                        {workout.exercisesCompleted.length > 4 && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            +{workout.exercisesCompleted.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        ~{workout.burnedCalories}
                      </span>
                      <span className="text-xs font-bold text-slate-500 ml-1">kcal burned</span>
                    </div>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Remove workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: DAILY NOTES & WELLNESS */}
      {(activeSubTab === 'all' || activeSubTab === 'notes') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Daily Details, Energy & Reflections
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Log how your body feels today during study revisions and home exercises
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Energy Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                ⚡ Energy Level Today
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleUpdateDailyDetails('energyLevel', level)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      dailyDetails.energyLevel === level
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {level}★
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                🌙 Sleep Last Night
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="14"
                  value={dailyDetails.sleepHours}
                  onChange={(e) => handleUpdateDailyDetails('sleepHours', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs font-semibold text-slate-500">hours</span>
              </div>
            </div>

            {/* Study Stress Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                📚 Study / Exam Stress
              </label>
              <div className="flex items-center gap-1.5">
                {(['Low', 'Moderate', 'High'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleUpdateDailyDetails('stressLevel', lvl)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      dailyDetails.stressLevel === lvl
                        ? lvl === 'High' ? 'bg-rose-600 text-white border-rose-600' : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Area */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Personal Notes & Body Feedback
            </label>
            <textarea
              rows={3}
              value={dailyDetails.notes}
              onChange={(e) => handleUpdateDailyDetails('notes', e.target.value)}
              placeholder="e.g. Completed zero-equipment pushup and squat workout before afternoon library session. Drank 6 glasses of water. Lower back felt relaxed."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* MODAL: ADD FOOD */}
      <AnimatePresence>
        {showAddFoodModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                    <Utensils className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Log Custom Food Item
                  </h3>
                </div>
                <button 
                  onClick={() => setShowAddFoodModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddFoodItem} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Food or Meal Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g. Scrambled Eggs with Toast"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Meal Type
                    </label>
                    <select
                      value={mealType}
                      onChange={(e: any) => setMealType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Calories (kcal)
                    </label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={foodCalories}
                      onChange={(e) => setFoodCalories(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block">Protein (g)</label>
                    <input 
                      type="number"
                      min="0"
                      value={foodProtein}
                      onChange={(e) => setFoodProtein(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block">Carbs (g)</label>
                    <input 
                      type="number"
                      min="0"
                      value={foodCarbs}
                      onChange={(e) => setFoodCarbs(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block">Fat (g)</label>
                    <input 
                      type="number"
                      min="0"
                      value={foodFat}
                      onChange={(e) => setFoodFat(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFoodModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
                  >
                    Save to Diet Log
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD WORKOUT */}
      <AnimatePresence>
        {showAddWorkoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                    <Dumbbell className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Log Completed Workout
                  </h3>
                </div>
                <button 
                  onClick={() => setShowAddWorkoutModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomWorkout} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Workout or Routine Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    placeholder="e.g. Zero-Equipment Dorm Strength, 100 Pushups"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Duration (minutes)
                    </label>
                    <input 
                      type="number"
                      required
                      min="1"
                      value={workoutDuration}
                      onChange={(e) => setWorkoutDuration(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Estimated Burn (kcal)
                    </label>
                    <input 
                      type="number"
                      required
                      min="0"
                      value={workoutCalories}
                      onChange={(e) => setWorkoutCalories(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Exercises Performed or Notes
                  </label>
                  <input 
                    type="text"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="e.g. Incline pushups, air squats, wall sits, glute bridges"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddWorkoutModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Save to Workout History
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
