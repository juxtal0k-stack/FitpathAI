import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Flame, 
  Droplets, 
  Activity, 
  TrendingUp, 
  Heart, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Zap, 
  Brain,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { IndividualProfile, SensorTelemetry, PhysicalMetrics, DailyCalorieLog } from '../types';
import { ThemeConfig } from '../theme';

interface PhysicalMeasuresProps {
  profile: IndividualProfile;
  telemetry: SensorTelemetry;
  theme: ThemeConfig;
  onNavigateToNutrition?: () => void;
}

export const PhysicalMeasures: React.FC<PhysicalMeasuresProps> = ({
  profile,
  telemetry,
  theme,
  onNavigateToNutrition,
}) => {
  // Unit toggle: Metric vs Imperial
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  
  // Local editable values for live calculation
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 173);
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 70);
  const [age, setAge] = useState<number>(profile.age || 20);
  const [gender, setGender] = useState<string>(profile.gender || 'Male');

  // Calculated metrics state
  const [metrics, setMetrics] = useState<PhysicalMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(true);

  // Calorie & Water log state
  const [calorieLog, setCalorieLog] = useState<DailyCalorieLog | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState<boolean>(false);
  const [quickFoodName, setQuickFoodName] = useState('');
  const [quickMealType, setQuickMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Snack');
  const [quickCalories, setQuickCalories] = useState('');
  const [quickProtein, setQuickProtein] = useState('');
  const [quickFat, setQuickFat] = useState('');
  const [quickCarbs, setQuickCarbs] = useState('');
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch / Calculate metrics via REST API
  const fetchMetrics = async (h: number, w: number, a: number, g: string) => {
    setIsLoadingMetrics(true);
    try {
      const res = await fetch('/api/metrics/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heightCm: h,
          weightKg: w,
          age: a,
          gender: g,
          fitnessGoal: profile.fitnessGoal,
          stepsToday: telemetry.stepsToday,
          daysUntilExam: profile.daysUntilExam,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.warn('Failed to calculate metrics via REST API:', err);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Fetch Calorie Log
  const fetchCalorieLog = async () => {
    try {
      const res = await fetch('/api/user/calorie-log');
      if (res.ok) {
        const data = await res.json();
        setCalorieLog(data.calorieLog);
      }
    } catch (err) {
      console.warn('Failed to load calorie log:', err);
    }
  };

  useEffect(() => {
    fetchMetrics(heightCm, weightKg, age, gender);
    fetchCalorieLog();
  }, [heightCm, weightKg, age, gender, telemetry.stepsToday]);

  // Handle Quick Add Food to Calorie Counter
  const handleAddQuickFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFoodName.trim() || !quickCalories) return;

    setIsSubmittingLog(true);
    try {
      const res = await fetch('/api/user/calorie-log/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: quickFoodName.trim(),
          mealType: quickMealType,
          calories: Number(quickCalories) || 0,
          proteinGrams: Number(quickProtein) || 0,
          fatGrams: Number(quickFat) || 0,
          carbsGrams: Number(quickCarbs) || 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCalorieLog(data.calorieLog);
        setShowQuickAddModal(false);
        setQuickFoodName('');
        setQuickCalories('');
        setQuickProtein('');
        setQuickFat('');
        setQuickCarbs('');
        showToast('Food logged to daily calorie counter!');
      }
    } catch (err) {
      console.warn('Failed to add food to log:', err);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Handle Delete Food from Log
  const handleDeleteFood = async (id: string) => {
    try {
      const res = await fetch('/api/user/calorie-log/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setCalorieLog(data.calorieLog);
        showToast('Item removed from log.');
      }
    } catch (err) {
      console.warn('Failed to delete item:', err);
    }
  };

  // Handle Water glasses change (+1 or -1)
  const handleWaterChange = async (change: number) => {
    try {
      const res = await fetch('/api/user/calorie-log/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change }),
      });
      if (res.ok) {
        const data = await res.json();
        setCalorieLog(data.calorieLog);
      }
    } catch (err) {
      console.warn('Failed to update water:', err);
    }
  };

  // Computations for Daily Calorie Counter
  const logItems = Array.isArray(calorieLog?.items) ? calorieLog.items : [];
  const totalCaloriesConsumed = logItems.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalProteinConsumed = logItems.reduce((acc, item) => acc + (item.proteinGrams || 0), 0);
  const totalFatConsumed = logItems.reduce((acc, item) => acc + (item.fatGrams || 0), 0);
  const totalCarbsConsumed = logItems.reduce((acc, item) => acc + (item.carbsGrams || 0), 0);

  const targetBudget = metrics?.targetCalories || 2250;
  const activeBurn = metrics?.activeBurnFromSteps || Math.round(telemetry.stepsToday * 0.04);
  const netCalories = totalCaloriesConsumed - activeBurn;
  const caloriesRemaining = Math.max(0, targetBudget - totalCaloriesConsumed);
  const caloriePercent = Math.min(100, Math.round((totalCaloriesConsumed / targetBudget) * 100));

  // BMI Position on standard gauge (15 to 35 range)
  const bmiVal = metrics?.bmi || 22.5;
  const gaugePercent = Math.min(100, Math.max(0, ((bmiVal - 15) / (35 - 15)) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl sm:text-2xl font-bold ${theme.textPrimary} tracking-tight`}>
              Physical Measures & Calorie Counter
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              REST API Verified
            </span>
          </div>
          <p className={`text-xs sm:text-sm ${theme.textMuted} mt-0.5`}>
            Clinical biometrics (BMI, BMR, TDEE) combined with real-time phone sensor step burn and macro tracking.
          </p>
        </div>

        {/* Unit toggle button */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center p-1 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                unitSystem === 'metric'
                  ? `${theme.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xs`
                  : `${theme.textMuted}`
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                unitSystem === 'imperial'
                  ? `${theme.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xs`
                  : `${theme.textMuted}`
              }`}
            >
              Imperial (lbs/ft)
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECTION 1: BMI CALCULATOR & LIVE BODY COMPOSITION GAUGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Interactive Sliders & Inputs Tile */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className={`lg:col-span-1 p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs space-y-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Physical Dimensions</h3>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              Live Input
            </span>
          </div>

          {/* Height Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className={theme.textMuted}>Height</span>
              <span className={`font-bold ${theme.textPrimary}`}>
                {unitSystem === 'metric' 
                  ? `${heightCm} cm` 
                  : `${Math.floor(heightCm / 30.48)}' ${Math.round((heightCm % 30.48) / 2.54)}"`}
              </span>
            </div>
            <input
              type="range"
              min="140"
              max="215"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>140 cm</span>
              <span>175 cm</span>
              <span>215 cm</span>
            </div>
          </div>

          {/* Weight Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className={theme.textMuted}>Weight</span>
              <span className={`font-bold ${theme.textPrimary}`}>
                {unitSystem === 'metric' 
                  ? `${weightKg} kg` 
                  : `${Math.round(weightKg * 2.20462)} lbs`}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="140"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>40 kg</span>
              <span>80 kg</span>
              <span>140 kg</span>
            </div>
          </div>

          {/* Age & Gender Selector */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${theme.textMuted}`}>Age (Years)</label>
              <input
                type="number"
                min="14"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`w-full px-3 py-1.5 rounded-lg border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs font-semibold focus:outline-emerald-500`}
              />
            </div>
            <div className="space-y-1">
              <label className={`text-[11px] font-medium ${theme.textMuted}`}>Biological Sex</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full px-2.5 py-1.5 rounded-lg border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs font-semibold focus:outline-emerald-500`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Healthy Weight Target */}
          {metrics && (
            <div className={`p-3 rounded-xl ${theme.isDark ? 'bg-slate-900/80' : 'bg-slate-50'} border ${theme.borderClass} text-xs space-y-1`}>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Clinical Ideal Weight</span>
                <span className="font-bold text-emerald-500">
                  {unitSystem === 'metric' ? `${metrics.idealBodyWeightKg} kg` : `${Math.round(metrics.idealBodyWeightKg * 2.204)} lbs`}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Normal BMI Weight Range</span>
                <span className={`font-semibold ${theme.textPrimary}`}>
                  {unitSystem === 'metric' 
                    ? `${metrics.healthyWeightMinKg} - ${metrics.healthyWeightMaxKg} kg` 
                    : `${Math.round(metrics.healthyWeightMinKg * 2.204)} - ${Math.round(metrics.healthyWeightMaxKg * 2.204)} lbs`}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* BMI Results & Visual Gauge Tile */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className={`lg:col-span-2 p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs flex flex-col justify-between space-y-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Body Mass Index (BMI)
              </span>
              <h3 className={`text-lg font-bold ${theme.textPrimary} mt-0.5`}>
                Clinical Metric & Classification
              </h3>
            </div>
            {metrics && (
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold shadow-xs border"
                style={{ 
                  backgroundColor: `${metrics.bmiClassificationColor}18`,
                  color: metrics.bmiClassificationColor,
                  borderColor: `${metrics.bmiClassificationColor}40`
                }}
              >
                {metrics.bmiCategory}
              </span>
            )}
          </div>

          {/* Big BMI Number & Status */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${theme.textPrimary}`}>
                {metrics?.bmi || '--'}
              </span>
              <span className={`text-sm ${theme.textMuted}`}>kg/m²</span>
            </div>

            <p className={`text-xs ${theme.textMuted} max-w-md`}>
              {metrics?.clinicalExplanation || 'Calculating body composition metrics via REST API...'}
            </p>
          </div>

          {/* Visual BMI Gauge Gradient Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-red-500 shadow-inner">
              {/* Pointer Marker */}
              <motion.div
                initial={{ left: '50%' }}
                animate={{ left: `${gaugePercent}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                className="absolute top-0 bottom-0 w-2.5 bg-slate-950 dark:bg-white rounded-full border-2 border-white dark:border-slate-950 shadow-md -translate-x-1/2"
              />
            </div>
            
            {/* Scale legend */}
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Underweight (&lt;18.5)</span>
              <span>Normal (18.5-24.9)</span>
              <span>Overweight (25-29.9)</span>
              <span>Obese (30+)</span>
            </div>
          </div>

          {/* BMR & TDEE Scientific Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}
            >
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Basal Metabolic Rate</span>
              </div>
              <div className={`text-base font-bold ${theme.textPrimary} mt-1`}>
                {metrics?.bmrCalories.toLocaleString() || '--'} <span className="text-[11px] font-normal text-slate-400">kcal</span>
              </div>
              <div className="text-[10px] text-slate-500">Mifflin-St Jeor formula</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900/60' : 'bg-slate-50'}`}
            >
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>TDEE (Daily Burn)</span>
              </div>
              <div className={`text-base font-bold ${theme.textPrimary} mt-1`}>
                {metrics?.tdeeCalories.toLocaleString() || '--'} <span className="text-[11px] font-normal text-slate-400">kcal</span>
              </div>
              <div className="text-[10px] text-slate-500">Includes +{metrics?.activeBurnFromSteps || 0} step burn</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900/60' : 'bg-slate-50'} col-span-2 sm:col-span-1`}
            >
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                <Brain className="w-3.5 h-3.5 text-indigo-500" />
                <span>Target for Exams</span>
              </div>
              <div className={`text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1`}>
                {metrics?.targetCalories.toLocaleString() || '--'} <span className="text-[11px] font-normal text-slate-400">kcal</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {profile.daysUntilExam}d exam cognitive buffer
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 2: DAILY CALORIE COUNTER & ENERGY BALANCE HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calorie Ring & Energy Balance Tile */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs flex flex-col justify-between space-y-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Daily Calorie Counter</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
              Active Log
            </span>
          </div>

          {/* Circular Visual Calorie Ring */}
          <div className="relative flex items-center justify-center py-2">
            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="12"
                fill="none"
              />
              {/* Animated Progress ring */}
              <motion.circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-emerald-500"
                strokeWidth="12"
                strokeDasharray={402}
                initial={{ strokeDashoffset: 402 }}
                animate={{ strokeDashoffset: 402 - (402 * caloriePercent) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Ring Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-extrabold ${theme.textPrimary}`}>
                {totalCaloriesConsumed}
              </span>
              <span className="text-[11px] text-slate-400">
                of {targetBudget} kcal
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {caloriesRemaining} kcal left
              </span>
            </div>
          </div>

          {/* Calorie Equation breakdown */}
          <div className={`p-3 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900/70' : 'bg-slate-50'} text-xs space-y-2`}>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Target Budget</span>
              <span className={`font-semibold ${theme.textPrimary}`}>{targetBudget} kcal</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Food Consumed</span>
              <span className="font-semibold text-orange-500">+{totalCaloriesConsumed} kcal</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Phone Step Active Burn</span>
              <span className="font-semibold text-emerald-500">-{activeBurn} kcal</span>
            </div>
            <div className={`pt-2 border-t ${theme.borderClass} flex justify-between items-center font-bold text-[11px]`}>
              <span className={theme.textPrimary}>Net Energy Balance</span>
              <span className={netCalories > targetBudget ? 'text-amber-500' : 'text-emerald-500'}>
                {netCalories > 0 ? `+${netCalories}` : netCalories} kcal
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Log</span>
            </button>
            {onNavigateToNutrition && (
              <button
                onClick={onNavigateToNutrition}
                className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border ${theme.borderClass} ${theme.surfaceHoverClass} ${theme.textPrimary} text-xs font-semibold transition cursor-pointer`}
              >
                <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                <span>AI Meal Scan</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Macronutrient Tracking Tiles */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs flex flex-col justify-between space-y-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Macronutrient Split</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              Daily Target Progress
            </span>
          </div>

          {/* Macro Progress Bars */}
          <div className="space-y-4 my-auto">
            {/* Protein */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-indigo-500 flex items-center gap-1">
                  <span>Protein</span>
                  <span className="text-[10px] font-normal text-slate-400">(Cognitive/Muscle)</span>
                </span>
                <span className={`font-bold ${theme.textPrimary}`}>
                  {totalProteinConsumed}g <span className="text-slate-400 font-normal">/ {metrics?.macroTargets.proteinGrams || 125}g</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, Math.round((totalProteinConsumed / (metrics?.macroTargets.proteinGrams || 125)) * 100))}%` 
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>

            {/* Carbohydrates */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-amber-500 flex items-center gap-1">
                  <span>Carbohydrates</span>
                  <span className="text-[10px] font-normal text-slate-400">(Brain Glucose)</span>
                </span>
                <span className={`font-bold ${theme.textPrimary}`}>
                  {totalCarbsConsumed}g <span className="text-slate-400 font-normal">/ {metrics?.macroTargets.carbsGrams || 230}g</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, Math.round((totalCarbsConsumed / (metrics?.macroTargets.carbsGrams || 230)) * 100))}%` 
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Fats */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-rose-500 flex items-center gap-1">
                  <span>Healthy Fats</span>
                  <span className="text-[10px] font-normal text-slate-400">(Hormone/Focus)</span>
                </span>
                <span className={`font-bold ${theme.textPrimary}`}>
                  {totalFatConsumed}g <span className="text-slate-400 font-normal">/ {metrics?.macroTargets.fatGrams || 62}g</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, Math.round((totalFatConsumed / (metrics?.macroTargets.fatGrams || 62)) * 100))}%` 
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Hydration Tracker Card */}
          <div className={`p-4 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900/60' : 'bg-slate-50'} space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-500">
                <Droplets className="w-4 h-4" />
                <span>Water Hydration</span>
              </div>
              <span className={`text-xs font-bold ${theme.textPrimary}`}>
                {(calorieLog?.waterGlasses || 0) * 0.25}L / {metrics?.hydrationTargetLiters || 2.8}L
              </span>
            </div>

            {/* Interactive Water Glasses Grid */}
            <div className="flex items-center justify-between gap-1 pt-1">
              <div className="flex items-center gap-1 flex-wrap">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const isFilled = idx < (calorieLog?.waterGlasses || 0);
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleWaterChange(isFilled ? -1 : 1)}
                      className={`w-7 h-8 rounded-md border flex items-center justify-center transition cursor-pointer ${
                        isFilled
                          ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                          : 'bg-slate-200/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}
                      title={`${(idx + 1) * 250} ml`}
                    >
                      <Droplets className="w-3.5 h-3.5" />
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleWaterChange(-1)}
                  className={`w-7 h-7 rounded-lg border ${theme.borderClass} ${theme.surfaceHoverClass} ${theme.textPrimary} text-xs font-bold flex items-center justify-center cursor-pointer`}
                >
                  -
                </button>
                <button
                  onClick={() => handleWaterChange(1)}
                  className="w-7 h-7 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Each glass = 250ml. Hydration supports optimal memory encoding & alertness.
            </div>
          </div>
        </motion.div>

        {/* Today's Logged Items Tile */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs flex flex-col justify-between space-y-3`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-500" />
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Today's Meals Logged</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {logItems.length} items
            </span>
          </div>

          {/* List of items */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {logItems.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Utensils className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs text-slate-400">No foods logged today yet.</p>
                <button
                  onClick={() => setShowQuickAddModal(true)}
                  className="text-xs text-emerald-500 font-semibold hover:underline cursor-pointer"
                >
                  + Log your first meal
                </button>
              </div>
            ) : (
              logItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`p-2.5 rounded-xl border ${theme.borderClass} ${theme.isDark ? 'bg-slate-900/50' : 'bg-slate-50'} flex items-center justify-between gap-2`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {item.mealType}
                      </span>
                      <h4 className={`text-xs font-semibold ${theme.textPrimary} truncate`}>
                        {item.foodName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{item.calories} kcal</span>
                      <span>•</span>
                      <span>P: {item.proteinGrams}g</span>
                      <span>•</span>
                      <span>F: {item.fatGrams}g</span>
                      <span>•</span>
                      <span>C: {item.carbsGrams}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFood(item.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowQuickAddModal(true)}
              className={`w-full py-2 rounded-xl border border-dashed ${theme.borderClass} ${theme.surfaceHoverClass} ${theme.textMuted} hover:${theme.textPrimary} text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Food Entry</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* QUICK ADD MODAL */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-md p-6 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xl space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-500" />
                <h3 className={`text-base font-bold ${theme.textPrimary}`}>Log Food to Calorie Counter</h3>
              </div>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className={`text-slate-400 hover:${theme.textPrimary} text-xs cursor-pointer`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuickFood} className="space-y-3">
              <div>
                <label className={`text-xs font-medium ${theme.textMuted}`}>Food / Meal Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Boiled Eggs & Whole Wheat Toast"
                  value={quickFoodName}
                  onChange={(e) => setQuickFoodName(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 rounded-xl border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs focus:outline-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium ${theme.textMuted}`}>Meal Category</label>
                  <select
                    value={quickMealType}
                    onChange={(e: any) => setQuickMealType(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-xl border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs focus:outline-emerald-500`}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Study Snack</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${theme.textMuted}`}>Calories (kcal) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 380"
                    value={quickCalories}
                    onChange={(e) => setQuickCalories(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-xl border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs focus:outline-emerald-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`text-[11px] font-medium text-indigo-500`}>Protein (g)</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={quickProtein}
                    onChange={(e) => setQuickProtein(e.target.value)}
                    className={`w-full mt-1 px-2.5 py-1.5 rounded-lg border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs focus:outline-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium text-rose-500`}>Fat (g)</label>
                  <input
                    type="number"
                    placeholder="12"
                    value={quickFat}
                    onChange={(e) => setQuickFat(e.target.value)}
                    className={`w-full mt-1 px-2.5 py-1.5 rounded-lg border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs focus:outline-emerald-500`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-medium text-amber-500`}>Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="45"
                    value={quickCarbs}
                    onChange={(e) => setQuickCarbs(e.target.value)}
                    className={`w-full mt-1 px-2.5 py-1.5 rounded-lg border ${theme.borderClass} ${theme.surfaceClass} ${theme.textPrimary} text-xs focus:outline-emerald-500`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className={`px-3 py-2 rounded-xl border ${theme.borderClass} ${theme.textMuted} text-xs font-semibold cursor-pointer`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingLog}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmittingLog ? 'Saving...' : 'Add to Calorie Counter'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
