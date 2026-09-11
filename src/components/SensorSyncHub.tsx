import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  Activity, 
  Clock, 
  Footprints, 
  RefreshCw, 
  CheckCircle2, 
  Flame, 
  Moon, 
  TrendingUp, 
  Zap, 
  Layers
} from 'lucide-react';
import { SensorTelemetry } from '../types';
import { ThemeConfig } from '../theme';

interface SensorSyncHubProps {
  telemetry: SensorTelemetry;
  onUpdateTelemetry: (newTelemetry: SensorTelemetry) => void;
  theme?: ThemeConfig;
}

export const SensorSyncHub: React.FC<SensorSyncHubProps> = ({
  telemetry,
  onUpdateTelemetry,
  theme,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSyncSensors = (mode: 'normal' | 'cram' | 'active') => {
    setIsSyncing(true);
    setTimeout(() => {
      let updated: SensorTelemetry;

      if (mode === 'cram') {
        updated = {
          stepsToday: 2350,
          targetSteps: 8000,
          sleepHours: 4.8,
          screenOffEstimatedSleep: 4.5,
          activeMinutes: 12,
          walkingCadenceRpm: 84,
          campusStairsClimbed: 2,
          lastSyncedAt: 'Just now (Phone accelerometer)',
          source: 'Google Fit API',
        };
        setSyncStatus('Low activity (2,350 steps) & 4.8h sleep detected. Auto-scaler recommended deload.');
      } else if (mode === 'active') {
        updated = {
          stepsToday: 9500,
          targetSteps: 8000,
          sleepHours: 8.0,
          screenOffEstimatedSleep: 7.9,
          activeMinutes: 45,
          walkingCadenceRpm: 116,
          campusStairsClimbed: 10,
          lastSyncedAt: 'Just now (Apple HealthKit)',
          source: 'Apple HealthKit',
        };
        setSyncStatus('High activity (9,500 steps) & 8.0h sleep detected. Full training ready.');
      } else {
        updated = {
          ...telemetry,
          stepsToday: telemetry.stepsToday + 350,
          activeMinutes: telemetry.activeMinutes + 5,
          lastSyncedAt: 'Just now (Phone accelerometer)',
        };
        setSyncStatus('Telemetry refreshed with latest phone motion data.');
      }

      onUpdateTelemetry(updated);
      setIsSyncing(false);
    }, 600);
  };

  const stepProgress = Math.min(100, Math.round((telemetry.stepsToday / telemetry.targetSteps) * 100));
  const estimatedCaloriesBurned = Math.round(telemetry.stepsToday * 0.04);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Phone Health Telemetry
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Live Phone Accelerometer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zero-hardware biometrics powered by internal phone gyroscope, accelerometer, and screen-off sleep heuristics.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSyncSensors('normal')}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Sensor Hub'}</span>
        </motion.button>
      </motion.div>

      {syncStatus && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </motion.div>
      )}

      {/* ANIMATED SENSOR METRIC TILES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Daily Steps Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Daily Steps
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Footprints className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {telemetry.stepsToday.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center justify-between">
              <span>Target: {telemetry.targetSteps.toLocaleString()}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{stepProgress}%</span>
            </div>
          </div>

          {/* Animated step bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Burn: ~{estimatedCaloriesBurned} active kcal</span>
            <span>Accelerometer Sync</span>
          </div>
        </motion.div>

        {/* Walking Cadence Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Walking Cadence</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {telemetry.walkingCadenceRpm} <span className="text-sm font-normal text-slate-400">RPM</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Phone frequency measurement
            </div>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
            {telemetry.walkingCadenceRpm >= 100 ? 'Brisk Campus Walking Pace' : 'Casual Dorm Transition'}
          </div>
          <div className="text-[10px] text-slate-400">
            Real-time step rhythm tracking
          </div>
        </motion.div>

        {/* Sleep Duration Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Sleep Duration</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {telemetry.sleepHours} <span className="text-sm font-normal text-slate-400">hrs</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Screen-off estimate: {telemetry.screenOffEstimatedSleep}h
            </div>
          </div>

          <div className={`text-[11px] px-3 py-1.5 rounded-xl border font-semibold ${
            telemetry.sleepHours < 6
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          }`}>
            {telemetry.sleepHours < 6 ? 'Sleep Deficit (Auto-Deload Ready)' : 'Full Recovery Buffer'}
          </div>
          <div className="text-[10px] text-slate-400">
            Calculated via phone stillness heuristics
          </div>
        </motion.div>

        {/* Active Minutes Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Active Minutes</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {telemetry.activeMinutes} <span className="text-sm font-normal text-slate-400">min</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Continuous body movement
            </div>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
            WHO recommendation: 30 min/day
          </div>
          <div className="text-[10px] text-slate-400">
            Walking & stair climbing time
          </div>
        </motion.div>

        {/* Campus Stairs Climbed Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Campus Stairs</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {telemetry.campusStairsClimbed} <span className="text-sm font-normal text-slate-400">flights</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Altimeter & pressure variation
            </div>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
            ~{(telemetry.campusStairsClimbed * 16)} vertical meters climbed
          </div>
          <div className="text-[10px] text-slate-400">
            Free high-intensity campus cardio
          </div>
        </motion.div>

        {/* Caloric Burn Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Phone Sensor Active Burn</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {estimatedCaloriesBurned} <span className="text-sm font-normal text-slate-400">kcal</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Synced with Calorie Counter
            </div>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
            Deducted automatically from daily net
          </div>
          <div className="text-[10px] text-slate-400">
            ~0.04 kcal burned per phone step
          </div>
        </motion.div>
      </div>

      {/* CONNECTION STATUS & SIMULATOR CARD */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Zero-Hardware Sensor Source Pipeline
          </h3>
          <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <span className="font-medium text-slate-600 dark:text-slate-400">Hardware Pipeline:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{telemetry.source}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <span className="font-medium text-slate-600 dark:text-slate-400">Last Synced:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{telemetry.lastSyncedAt}</span>
          </div>
        </div>

        {/* Test Preset Buttons for Hackathon Jury */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2 font-medium">
            Hackathon Live Sensor Simulation Triggers:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSyncSensors('normal')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer transition"
            >
              Simulate Normal Walk (+350 steps)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSyncSensors('cram')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 cursor-pointer transition"
            >
              Simulate Exam All-Nighter (4.8h sleep & 2.3k steps)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSyncSensors('active')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-300 cursor-pointer transition"
            >
              Simulate High Activity (9,500 steps & 8.0h sleep)
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
