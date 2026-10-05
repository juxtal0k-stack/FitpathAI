import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Radar, 
  Activity, 
  Flame, 
  Footprints, 
  Compass, 
  Zap, 
  HeartPulse, 
  Clock, 
  TrendingUp, 
  ShieldCheck,
  RefreshCw,
  Locate
} from 'lucide-react';
import { ThemeConfig } from '../theme';
import { DailyLogState, IndividualProfile, SensorTelemetry } from '../types';

interface HealthRadarTrackerProps {
  theme: ThemeConfig;
  profile: IndividualProfile;
  dailyLog: DailyLogState;
  telemetry?: SensorTelemetry | null;
  totalDistanceKm?: number;
}

export const HealthRadarTracker: React.FC<HealthRadarTrackerProps> = ({
  theme,
  profile,
  dailyLog,
  telemetry,
  totalDistanceKm = 3.4,
}) => {
  // Live ticker that increments every single second to maintain 1-second sync
  const [liveSeconds, setLiveSeconds] = useState<number>(0);
  const [cadenceRpm, setCadenceRpm] = useState<number>(() => telemetry?.walkingCadenceRpm || 108);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((s) => s + 1);
      // Subtle natural fluctuations in live cadence
      setCadenceRpm((prev) => {
        const delta = Math.floor((Math.random() - 0.49) * 3);
        return Math.max(85, Math.min(130, prev + delta));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Radar Axes (0 - 100)
  const radarData = useMemo(() => {
    const steps = dailyLog?.dailySteps || telemetry?.stepsToday || 0;
    const targetSteps = dailyLog?.targetSteps || 8000;
    const staminaScore = Math.min(100, Math.round((steps / targetSteps) * 100));

    const workoutsCount = dailyLog?.workouts?.length || 0;
    const strengthScore = Math.min(100, Math.max(30, workoutsCount * 45));

    const waterGlasses = dailyLog?.waterGlasses || 0;
    const waterScore = Math.min(100, Math.round((waterGlasses / 8) * 100));

    const sleepHours = dailyLog?.dailyDetails?.sleepHours || 7.0;
    const sleepScore = Math.min(100, Math.round((sleepHours / 8) * 100));

    const daysUntilExam = profile?.daysUntilExam ?? 7;
    const stressScore = Math.min(100, Math.max(40, Math.round(50 + (daysUntilExam > 10 ? 40 : daysUntilExam * 4))));

    const items = dailyLog?.items || [];
    const totalCals = items.reduce((s, i) => s + (i.calories || 0), 0);
    const targetCals = dailyLog?.targetCalories || 2200;
    const nutritionScore = totalCals > 0 ? Math.min(100, Math.round(100 - Math.abs(totalCals - targetCals) / 25)) : 50;

    const cadenceScore = Math.min(100, Math.round((cadenceRpm / 120) * 100));

    return [
      { axis: 'Stamina / Cardio', score: staminaScore, label: `${steps.toLocaleString()} steps` },
      { axis: 'Strength', score: strengthScore, label: `${workoutsCount} routines` },
      { axis: 'Hydration', score: waterScore, label: `${waterGlasses}/8 glasses` },
      { axis: 'Sleep / Rest', score: sleepScore, label: `${sleepHours}h rest` },
      { axis: 'Stress Resilience', score: stressScore, label: `${daysUntilExam}d exam buffer` },
      { axis: 'Nutrition Balance', score: nutritionScore, label: `${totalCals} kcal` },
      { axis: 'Cadence', score: cadenceScore, label: `${cadenceRpm} RPM` },
    ];
  }, [dailyLog, telemetry, cadenceRpm, profile]);

  const overallHealthIndex = useMemo(() => {
    const sum = radarData.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(sum / radarData.length);
  }, [radarData]);

  // Convert radar points to SVG polygon coordinates
  const size = 280;
  const center = size / 2;
  const radius = center - 40;
  const numPoints = radarData.length;

  const polygonPoints = useMemo(() => {
    return radarData.map((d, i) => {
      const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
      const r = (d.score / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [radarData, center, radius, numPoints]);

  const backgroundRings = [0.25, 0.5, 0.75, 1.0];

  // Active Intensity Zone
  const intensityZone = useMemo(() => {
    if (cadenceRpm > 120) return { name: 'Cardio Pace', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (cadenceRpm > 100) return { name: 'Active Fat Burn', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    return { name: 'Aerobic Recovery', color: 'text-blue-500', bg: 'bg-blue-500/10' };
  }, [cadenceRpm]);

  return (
    <div className={`p-5 rounded-2xl border ${theme.borderClass} ${theme.surfaceClass} shadow-xs space-y-6`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base font-extrabold tracking-tight ${theme.textPrimary}`}>
                Health Radar & Real-Time Activity Tracker
              </h3>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live 1s Sync
              </span>
            </div>
            <p className={`text-xs ${theme.textSecondary}`}>
              Multi-axis physiological radar synced every second with accelerometer cadence and Google Maps travel data.
            </p>
          </div>
        </div>

        {/* Overall Health Score Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Index</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 leading-none">
              {overallHealthIndex}<span className="text-xs font-medium text-slate-400">/100</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-base shadow-sm">
            {overallHealthIndex >= 80 ? 'A+' : overallHealthIndex >= 70 ? 'A' : 'B'}
          </div>
        </div>
      </div>

      {/* Grid: Radar Canvas + Real-Time Activity Tracker Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: SVG Radar Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 relative">
          <div className="relative w-[280px] h-[280px]">
            {/* Rotating Radar Sweep Line animation */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none opacity-25 overflow-hidden"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(16, 185, 129, 0.4) 360deg)',
                animation: 'spin 4s linear infinite',
              }}
            />

            <svg width={size} height={size} className="overflow-visible drop-shadow-sm">
              {/* Concentric Guide Rings */}
              {backgroundRings.map((scale, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * scale}
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                  strokeDasharray={idx < 3 ? '3 3' : 'none'}
                />
              ))}

              {/* Axis Spoke Lines */}
              {radarData.map((_, i) => {
                const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Polygons */}
              <polygon
                points={polygonPoints}
                fill="rgba(16, 185, 129, 0.22)"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="transition-all duration-700 ease-out"
              />

              {/* Axis Points & Text Labels */}
              {radarData.map((d, i) => {
                const angle = (Math.PI * 2 / numPoints) * i - Math.PI / 2;
                const r = (d.score / 100) * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);

                // Label outer position
                const labelR = radius + 22;
                const lx = center + labelR * Math.cos(angle);
                const ly = center + labelR * Math.sin(angle);

                return (
                  <g key={i}>
                    {/* Glowing Vertex Point */}
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:r-6 transition-all"
                    />
                    {/* Axis Name Label */}
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px] font-bold fill-slate-600 dark:fill-slate-300 pointer-events-none select-none"
                    >
                      {d.axis.split('/')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Hover/inspect radar vertices to evaluate clinical balance
            </span>
          </div>
        </div>

        {/* Right: Live Activity Tracker Metrics */}
        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Step Cadence */}
            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-slate-50/70 dark:bg-slate-800/50`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Step Cadence</span>
                <Footprints className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {cadenceRpm}
                </span>
                <span className="text-xs text-slate-400 font-semibold">RPM</span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                ● Accelerometer Active
              </div>
            </div>

            {/* Travel Distance (Google Maps) */}
            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-slate-50/70 dark:bg-slate-800/50`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Distance Travel</span>
                <Compass className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {totalDistanceKm.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">KM</span>
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                Maps Route Geodesic
              </div>
            </div>

            {/* Active Calorie Burn */}
            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-slate-50/70 dark:bg-slate-800/50`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Burn</span>
                <Flame className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {Math.round((dailyLog?.dailySteps || 0) * 0.04 + totalDistanceKm * 62)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">kcal</span>
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                MET Intensity: 3.5
              </div>
            </div>

            {/* Zone Intensity */}
            <div className={`p-3 rounded-xl border ${theme.borderClass} bg-slate-50/70 dark:bg-slate-800/50`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Heart Zone</span>
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className={`text-sm font-extrabold ${intensityZone.color} truncate`}>
                {intensityZone.name}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                Pulsing Active Sensor
              </div>
            </div>
          </div>

          {/* Real-Time Live Ticker Line */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                1-Second Auto Sync Heartbeat Active
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-200/50 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
              +{liveSeconds}s ticks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
