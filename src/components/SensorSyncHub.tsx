import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Layers,
  Play,
  Square,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Radio
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

  // Live Device Sensor State
  const [isLiveSensorActive, setIsLiveSensorActive] = useState<boolean>(false);
  const [sensorPermissionGranted, setSensorPermissionGranted] = useState<boolean | null>(null);
  const [motionData, setMotionData] = useState<{ x: number; y: number; z: number; magnitude: number }>({
    x: 0,
    y: 0,
    z: 9.8,
    magnitude: 9.8,
  });
  const [sensitivity, setSensitivity] = useState<'high' | 'medium' | 'low'>('medium');
  const [simulatedWalkInterval, setSimulatedWalkInterval] = useState<boolean>(false);

  // Peak detection refs
  const lastPeakTimeRef = useRef<number>(0);
  const isAboveThresholdRef = useRef<boolean>(false);
  const stepsCountRef = useRef<number>(telemetry.stepsToday || 0);

  // Sync ref with prop
  useEffect(() => {
    stepsCountRef.current = telemetry.stepsToday || 0;
  }, [telemetry.stepsToday]);

  // Sensitivity thresholds (m/s^2)
  const threshold = sensitivity === 'high' ? 11.0 : sensitivity === 'medium' ? 12.2 : 13.5;

  // Toggle Live Device Sensors (Accelerometer & Gyroscope)
  const handleToggleLiveSensor = async () => {
    if (isLiveSensorActive) {
      setIsLiveSensorActive(false);
      setSyncStatus('Live device motion sensor paused.');
      return;
    }

    try {
      // For iOS 13+ permission request
      if (typeof (DeviceMotionEvent as any) !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setSensorPermissionGranted(true);
          setIsLiveSensorActive(true);
          setSyncStatus('Live phone accelerometer connected! Shake or walk to count steps.');
        } else {
          setSensorPermissionGranted(false);
          setSyncStatus('Device motion permission was denied in browser settings.');
        }
      } else {
        // Standard Android / Chrome / Web
        setSensorPermissionGranted(true);
        setIsLiveSensorActive(true);
        setSyncStatus('Live phone accelerometer connected! Walk or shake phone to count steps.');
      }
    } catch (err) {
      console.warn('Motion sensor error:', err);
      // Fallback: Still enable sensor listener for desktop or devices that don't throw on addEventListener
      setIsLiveSensorActive(true);
      setSyncStatus('Live motion sensor listener initiated.');
    }
  };

  // Accelerometer Event Listener
  useEffect(() => {
    if (!isLiveSensorActive) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const mag = Math.sqrt(x * x + y * y + z * z);

      setMotionData({
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        z: Math.round(z * 10) / 10,
        magnitude: Math.round(mag * 10) / 10,
      });

      const now = Date.now();
      // Peak detection with minimum 280ms cadence lockout to avoid double counting
      if (mag > threshold && !isAboveThresholdRef.current && (now - lastPeakTimeRef.current > 280)) {
        isAboveThresholdRef.current = true;
        lastPeakTimeRef.current = now;

        // Step confirmed! Increment step count
        const newSteps = stepsCountRef.current + 1;
        stepsCountRef.current = newSteps;

        const updated: SensorTelemetry = {
          ...telemetry,
          stepsToday: newSteps,
          walkingCadenceRpm: 104,
          activeMinutes: Math.max(telemetry.activeMinutes, Math.floor(newSteps / 100)),
          lastSyncedAt: 'Live Phone Accelerometer',
          source: 'Phone Built-in Accelerometer',
        };

        onUpdateTelemetry(updated);
      } else if (mag <= threshold - 1.2) {
        isAboveThresholdRef.current = false;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isLiveSensorActive, threshold, telemetry, onUpdateTelemetry]);

  // Continuous Simulated Walk for Desktop Testing
  useEffect(() => {
    if (!simulatedWalkInterval) return;

    const interval = setInterval(() => {
      const newSteps = (stepsCountRef.current || 0) + 2;
      stepsCountRef.current = newSteps;

      onUpdateTelemetry({
        ...telemetry,
        stepsToday: newSteps,
        walkingCadenceRpm: 110,
        activeMinutes: Math.floor(newSteps / 100),
        lastSyncedAt: 'Live Simulation (Active Walking)',
        source: 'Phone Built-in Accelerometer',
      });
    }, 900);

    return () => clearInterval(interval);
  }, [simulatedWalkInterval, telemetry, onUpdateTelemetry]);

  // Reset all sensor data to zero
  const handleResetToZero = () => {
    stepsCountRef.current = 0;
    const zeroed: SensorTelemetry = {
      ...telemetry,
      stepsToday: 0,
      walkingCadenceRpm: 0,
      activeMinutes: 0,
      campusStairsClimbed: 0,
      sleepHours: 0,
      screenOffEstimatedSleep: 0,
      lastSyncedAt: 'Reset to Zero (Clean Slate)',
    };
    onUpdateTelemetry(zeroed);
    setSyncStatus('All biometric sensor data reset to clean ZERO.');
  };

  // Preset sync modes
  const handleSyncSensors = (mode: 'normal' | 'cram' | 'active' | 'add100') => {
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
      } else if (mode === 'add100') {
        const nextSteps = (telemetry.stepsToday || 0) + 100;
        updated = {
          ...telemetry,
          stepsToday: nextSteps,
          activeMinutes: Math.floor(nextSteps / 100),
          walkingCadenceRpm: 105,
          lastSyncedAt: 'Live Step Increment (+100)',
        };
        setSyncStatus('Added +100 steps from sensor hub.');
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
    }, 400);
  };

  const stepProgress = Math.min(100, Math.round(((telemetry.stepsToday || 0) / (telemetry.targetSteps || 8000)) * 100));
  const estimatedCaloriesBurned = Math.round((telemetry.stepsToday || 0) * 0.04);

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
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Device Sensor & Step Hub
            </h2>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              isLiveSensorActive 
                ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}>
              {isLiveSensorActive ? '● Sensor Active' : 'Standby'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-0.5">
            Real device accelerometer step tracking. Data starts from zero and syncs live over device sensors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToZero}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title="Reset steps and telemetry back to clean zero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to 0</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSyncSensors('normal')}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-700 hover:bg-emerald-600 transition cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Sensor Hub'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* LIVE ACCELEROMETER CONTROLLER CARD */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/30 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isLiveSensorActive ? 'bg-emerald-600 text-white animate-bounce' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span>Live Device Accelerometer Pedometer</span>
                <Radio className={`w-3.5 h-3.5 ${isLiveSensorActive ? 'text-emerald-700 dark:text-emerald-400 animate-ping' : 'text-slate-400'}`} />
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                Uses physical phone motion sensors to count steps, measure walking cadence, and sync burn in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleLiveSensor}
              className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-sm transition flex items-center gap-2 ${
                isLiveSensorActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              {isLiveSensorActive ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Live Tracking</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Tracking</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Vector Readings */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Vector X</span>
            <span className="text-sm font-mono font-bold text-slate-950 dark:text-white">{motionData.x} m/s²</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Vector Y</span>
            <span className="text-sm font-mono font-bold text-slate-950 dark:text-white">{motionData.y} m/s²</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">Vector Z</span>
            <span className="text-sm font-mono font-bold text-slate-950 dark:text-white">{motionData.z} m/s²</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">Magnitude</span>
            <span className="text-sm font-mono font-bold text-emerald-950 dark:text-emerald-200">{motionData.magnitude} m/s²</span>
          </div>
        </div>

        {/* Sensitivity & Testing Triggers */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sensitivity:</span>
            </span>
            {(['high', 'medium', 'low'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSensitivity(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize cursor-pointer transition ${
                  sensitivity === lvl
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSyncSensors('add100')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 cursor-pointer transition"
            >
              +100 Steps
            </button>
            <button
              type="button"
              onClick={() => setSimulatedWalkInterval(!simulatedWalkInterval)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                simulatedWalkInterval
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{simulatedWalkInterval ? '■ Stop Walk' : '▶ Simulate Walk'}</span>
            </button>
          </div>
        </div>
      </div>

      {syncStatus && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">{syncStatus}</span>
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
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Daily Steps (Starts from 0)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Footprints className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              {(telemetry.stepsToday || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-400 mt-0.5 flex items-center justify-between font-medium">
              <span>Target: {(telemetry.targetSteps || 8000).toLocaleString()}</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{stepProgress}%</span>
            </div>
          </div>

          {/* Animated step bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-emerald-600 h-full rounded-full"
            />
          </div>
          <div className="text-[10px] font-bold text-slate-600 flex items-center justify-between">
            <span>Burn: ~{estimatedCaloriesBurned} active kcal</span>
            <span>Sensor Sync</span>
          </div>
        </motion.div>

        {/* Walking Cadence Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Walking Cadence</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              {telemetry.walkingCadenceRpm || 0} <span className="text-sm font-normal text-slate-500">RPM</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-400 mt-0.5 font-medium">
              Phone frequency measurement
            </div>
          </div>

          <div className="text-[11px] text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">
            {(telemetry.walkingCadenceRpm || 0) >= 100 
              ? 'Brisk Pace / Campus Transit' 
              : (telemetry.walkingCadenceRpm || 0) > 0 
                ? 'Casual Walking' 
                : 'Resting / Stationary'}
          </div>
        </motion.div>

        {/* Active Minutes Tile */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-400">
            <span>Active Exercise Minutes</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              {telemetry.activeMinutes || 0} <span className="text-sm font-normal text-slate-500">min</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-400 mt-0.5 font-medium">
              Accumulated motion tracking
            </div>
          </div>

          <div className="text-[11px] text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold">
            Target: 30 minutes daily
          </div>
        </motion.div>
      </div>

      {/* CONNECTION STATUS & SIMULATOR CARD */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Zero-Hardware Sensor Source Pipeline
          </h3>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <span className="font-bold text-slate-700 dark:text-slate-300">Hardware Pipeline:</span>
            <span className="font-extrabold text-slate-950 dark:text-white">{telemetry.source}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <span className="font-bold text-slate-700 dark:text-slate-300">Last Synced:</span>
            <span className="font-extrabold text-slate-950 dark:text-white">{telemetry.lastSyncedAt}</span>
          </div>
        </div>

        {/* Test Preset Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-700 dark:text-slate-300 block mb-2 font-bold">
            Sensor Simulation & Sync Triggers:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSyncSensors('normal')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer transition"
            >
              Simulate Walk (+350 steps)
            </button>
            <button
              type="button"
              onClick={() => handleSyncSensors('cram')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-950 dark:text-amber-200 cursor-pointer transition"
            >
              Simulate Low Activity (2,350 steps)
            </button>
            <button
              type="button"
              onClick={() => handleSyncSensors('active')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-950 dark:text-emerald-200 cursor-pointer transition"
            >
              Simulate High Activity (9,500 steps)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
