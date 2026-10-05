import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Plus, 
  RotateCcw, 
  Info, 
  Sparkles,
  Zap,
  Coffee,
  Apple,
  UtensilsCrossed,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { ThemeConfig } from '../theme';

interface LoggedMeal {
  id: string;
  name: string;
  calories: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  time: string;
}

interface CalorieMeterProps {
  currentFoodCalories?: number;
  currentFoodName?: string;
  theme: ThemeConfig;
  onLogCurrentFood?: () => void;
}

const TARGET_PRESETS = [
  { label: 'Fat Loss', calories: 1800, desc: '300-500 kcal deficit for safe student weight loss' },
  { label: 'Study Focus', calories: 2100, desc: 'Eucaloric maintenance for intense exam revision' },
  { label: 'Hybrid Athlete', calories: 2450, desc: 'Fuel for strength + cardio interval training' },
  { label: 'Mass Gain', calories: 2800, desc: 'Hypertrophy surplus for progressive muscle growth' },
];

export const CalorieMeter: React.FC<CalorieMeterProps> = ({
  currentFoodCalories = 0,
  currentFoodName = '',
  theme,
  onLogCurrentFood,
}) => {
  const [dailyTarget, setDailyTarget] = useState<number>(2100);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);

  // Load real logged meals from server on mount
  useEffect(() => {
    let isMounted = true;
    const loadLog = async () => {
      try {
        const res = await fetch('/api/user/calorie-log');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data) {
            if (Array.isArray(json.data.items)) {
              setLoggedMeals(
                json.data.items.map((item: any) => ({
                  id: item.id || `m-${Date.now()}`,
                  name: item.foodName || item.name || 'Food item',
                  calories: Number(item.calories) || 0,
                  mealType: item.mealType || 'Snack',
                  time: item.timestamp || item.time || 'Today',
                }))
              );
            }
            if (typeof json.data.targetCalories === 'number') {
              setDailyTarget(json.data.targetCalories);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load calorie log in CalorieMeter:', err);
      }
    };
    loadLog();
    return () => {
      isMounted = false;
    };
  }, []);

  const [showPresetMenu, setShowPresetMenu] = useState<boolean>(false);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Totals calculations
  const mealsList = Array.isArray(loggedMeals) ? loggedMeals : [];
  const loggedTotal = mealsList.reduce((acc, m) => acc + (m?.calories || 0), 0);
  const projectedTotal = loggedTotal + currentFoodCalories;
  const loggedPercent = Math.min(130, Math.round((loggedTotal / dailyTarget) * 100));
  const projectedPercent = Math.min(130, Math.round((projectedTotal / dailyTarget) * 100));
  const remainingCalories = Math.max(0, dailyTarget - projectedTotal);
  const isSurplus = projectedTotal > dailyTarget;
  const surplusAmount = projectedTotal - dailyTarget;

  // Status Zone determination
  const getStatusZone = (pct: number) => {
    if (pct < 70) {
      return {
        label: 'Caloric Deficit Zone',
        color: 'text-emerald-700 dark:text-emerald-300',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        strokeColor: '#059669', // emerald-600
        desc: 'Optimal for body fat reduction while retaining lean mass.',
      };
    } else if (pct <= 100) {
      return {
        label: 'Maintenance Zone',
        color: 'text-blue-700 dark:text-blue-300',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        strokeColor: '#2563eb', // blue-600
        desc: 'Steady energy curve for study stamina, cognitive recall, and recovery.',
      };
    } else if (pct <= 115) {
      return {
        label: 'Hybrid Performance Zone',
        color: 'text-amber-700 dark:text-amber-300',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        strokeColor: '#d97706', // amber-600
        desc: 'Ideal glycogen top-up for intense strength + cardio hybrid workouts.',
      };
    } else {
      return {
        label: 'Caloric Surplus Limit',
        color: 'text-rose-700 dark:text-rose-300',
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        strokeColor: '#e11d48', // rose-600
        desc: 'Exceeding target; consider higher evening physical activity or lighter snack.',
      };
    }
  };

  const status = getStatusZone(projectedPercent);

  // SVG Gauge calculations
  // Semi-circle gauge (180 degrees)
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // 251.32
  const loggedOffset = circumference - (Math.min(100, loggedPercent) / 100) * circumference;
  const projectedOffset = circumference - (Math.min(100, projectedPercent) / 100) * circumference;

  const handleAddCurrentToMeter = async () => {
    if (currentFoodCalories <= 0) return;
    const newMeal: LoggedMeal = {
      id: `m-${Date.now()}`,
      name: currentFoodName || 'Analyzed Meal',
      calories: currentFoodCalories,
      mealType: currentFoodCalories > 450 ? 'Dinner' : 'Snack',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedMeals((prev) => [newMeal, ...prev]);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);

    try {
      await fetch('/api/user/calorie-log/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: newMeal.name,
          mealType: newMeal.mealType,
          calories: newMeal.calories,
        }),
      });
    } catch (err) {
      console.warn('Failed to persist to calorie log API:', err);
    }

    if (onLogCurrentFood) onLogCurrentFood();
  };

  const handleQuickAdd = async (calories: number, name: string, type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    const newMeal: LoggedMeal = {
      id: `m-${Date.now()}`,
      name,
      calories,
      mealType: type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedMeals((prev) => [newMeal, ...prev]);

    try {
      await fetch('/api/user/calorie-log/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: name,
          mealType: type,
          calories,
        }),
      });
    } catch (err) {
      console.warn('Failed to persist quick add meal:', err);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch('/api/user/calorie-log/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.warn('Failed to delete meal from calorie log:', err);
    }
  };

  const handleResetMeter = () => {
    setLoggedMeals([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-slate-900"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700 border border-orange-200">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950 tracking-tight">
              Interactive Daily Calorie Meter
            </h3>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${status.badgeBg}`}>
              {status.label}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            Real-time visual intake speedometer calibrated against your student metabolic budget.
          </p>
        </div>

        {/* Target Selector Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-900 transition cursor-pointer shadow-2xs"
            >
              <Target className="w-3.5 h-3.5 text-emerald-700" />
              <span>Target: {dailyTarget} kcal</span>
            </button>

            {/* Presets dropdown */}
            <AnimatePresence>
              {showPresetMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  className="absolute right-0 top-full mt-2 w-64 p-2 bg-white rounded-xl border border-slate-300 shadow-lg z-30 space-y-1"
                >
                  <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1">
                    Select Daily Target Goal
                  </div>
                  {TARGET_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setDailyTarget(p.calories);
                        setShowPresetMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition text-xs flex flex-col cursor-pointer ${
                        dailyTarget === p.calories
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                          : 'hover:bg-slate-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{p.label}</span>
                        <span className="text-emerald-700 font-extrabold">{p.calories} kcal</span>
                      </div>
                      <span className="text-[10px] text-slate-600 mt-0.5">{p.desc}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={handleResetMeter}
            title="Reset today's meter"
            className="p-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gauge & Calorie Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Speedometer Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden">
          {/* SVG Semi-Circle Dial */}
          <div className="relative w-52 h-32 flex items-center justify-center">
            <svg className="w-52 h-52 -rotate-180 transform overflow-visible" viewBox="0 0 200 200">
              {/* Background Arch */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Projected + Current food arc (glow preview) */}
              {currentFoodCalories > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="#fbbf24"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={projectedOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out opacity-80"
                />
              )}

              {/* Logged so far arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={status.strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={loggedOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Gauge Centered Text */}
            <div className="absolute bottom-2 flex flex-col items-center text-center">
              <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {projectedTotal}
              </span>
              <span className="text-xs font-bold text-slate-600">
                / {dailyTarget} kcal
              </span>
              <span className="text-[11px] font-bold text-emerald-800 mt-0.5">
                {projectedPercent}% of target
              </span>
            </div>
          </div>

          {/* Calorie Legend */}
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-800 mt-3 pt-3 border-t border-slate-200 w-full">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <span>Logged: {loggedTotal}</span>
            </div>
            {currentFoodCalories > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <span>+Meal: {currentFoodCalories}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
              <span>Cap: {dailyTarget}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown & Quick Actions */}
        <div className="md:col-span-7 space-y-4">
          {/* Key Energy Metrics 3-Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Consumed / Logged */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block">Logged Today</span>
              <div className="text-xl font-extrabold text-slate-950 mt-0.5">{loggedTotal}</div>
              <span className="text-[10px] text-slate-600">{loggedMeals.length} meals saved</span>
            </div>

            {/* Analyzed Food Contribution */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-900 block">This Analyzed Meal</span>
              <div className="text-xl font-extrabold text-amber-950 mt-0.5">
                +{currentFoodCalories}
              </div>
              <span className="text-[10px] text-amber-800 truncate block">
                {currentFoodName ? currentFoodName.slice(0, 18) + '...' : 'Ready to add'}
              </span>
            </div>

            {/* Remaining / Status */}
            <div className={`p-3 rounded-xl border ${
              isSurplus 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <span className={`text-[11px] font-bold block ${
                isSurplus ? 'text-rose-900' : 'text-emerald-900'
              }`}>
                {isSurplus ? 'Surplus Reserve' : 'Remaining Fuel'}
              </span>
              <div className={`text-xl font-extrabold mt-0.5 ${
                isSurplus ? 'text-rose-950' : 'text-emerald-950'
              }`}>
                {isSurplus ? `+${surplusAmount}` : `${remainingCalories}`}
              </div>
              <span className={`text-[10px] block ${
                isSurplus ? 'text-rose-800' : 'text-emerald-800'
              }`}>
                {isSurplus ? 'kcal over target' : 'kcal to goal'}
              </span>
            </div>
          </div>

          {/* Dynamic Physiology Feedback */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <Sparkles className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span>Metabolic Pacing Insight:</span>
            </div>
            <p className="text-slate-800 text-xs leading-relaxed font-medium">
              {status.desc} With {remainingCalories} kcal still open today, your glucose stability and memory synthesis will stay primed during late-evening study hours without lethargy.
            </p>
          </div>

          {/* Quick Add This Meal Button */}
          {currentFoodCalories > 0 && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleAddCurrentToMeter}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm text-white shadow-xs transition cursor-pointer ${
                addedAnimation 
                  ? 'bg-emerald-700' 
                  : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {addedAnimation ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                  <span>Logged +{currentFoodCalories} kcal to Today's Meter!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Log "{currentFoodName || 'This Meal'}" (+{currentFoodCalories} kcal) into Meter</span>
                </>
              )}
            </motion.button>
          )}

          {/* 1-Tap Quick Add Student Snacks */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              1-Tap Quick Log Common Student Fuel:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAdd(150, 'Black Coffee & 2 Biscuits', 'Snack')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition cursor-pointer flex items-center gap-1"
              >
                <Coffee className="w-3 h-3 text-amber-800" />
                <span>Coffee + Biscuit (+150)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(120, '1 Fresh Apple / Banana', 'Snack')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition cursor-pointer flex items-center gap-1"
              >
                <Apple className="w-3 h-3 text-emerald-800" />
                <span>1 Apple / Banana (+120)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAdd(190, '1 Scoop Whey / Sattu Drink', 'Snack')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-blue-800" />
                <span>Protein Shake (+190)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logged Meals Mini-List */}
      {loggedMeals.length > 0 && (
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Today's Calorie Meter Entries ({loggedMeals.length})
            </span>
            <span className="text-xs font-extrabold text-emerald-800">
              {loggedTotal} kcal consumed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {loggedMeals.slice(0, 6).map((meal) => (
              <div
                key={meal.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-slate-950 truncate">{meal.name}</div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    {meal.mealType} • {meal.time}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-emerald-800">
                    +{meal.calories}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteEntry(meal.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
