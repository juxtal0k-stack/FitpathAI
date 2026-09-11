import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  RotateCcw, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Dumbbell, 
  Info, 
  HeartPulse, 
  Footprints, 
  Moon, 
  Zap, 
  CheckCircle2, 
  Timer, 
  Flame, 
  Activity, 
  Layers 
} from 'lucide-react';
import { IndividualProfile, WorkoutRoutine, SensorTelemetry } from '../types';

interface WorkoutViewProps {
  profile: IndividualProfile;
  activeRoutine: WorkoutRoutine;
  isAutoScaled: boolean;
  telemetry: SensorTelemetry;
  onToggleRoutine: () => void;
  onOpenAutoScaler: () => void;
  onLogWorkoutCompletion: () => void;
}

// Dedicated Hybrid Training Routine combining Strength & Cardio Intervals
const HYBRID_WORKOUT_ROUTINE: WorkoutRoutine = {
  id: 'routine-hybrid-athlete',
  title: 'Hybrid Athlete: Strength-Endurance & Cardio Cadence Circuit',
  durationMinutes: 35,
  intensityLevel: 'High (Progressive Overload)',
  intensityPercent: 85,
  examFriendlyNotes: 'Hybrid training pairs compound resistance training with aerobic intervals. This stimulates BDNF neurogenesis in the hippocampus to boost exam memory retention while incinerating ~420 kcal without excessive muscle breakdown.',
  medicalClearanceNotes: 'Low-impact joint modifications included. Spinal alignment maintained during explosive high-cadence bursts.',
  exercises: [
    {
      name: 'Block 1: Tempo Goblet Squats (Backpack / Kettlebell)',
      sets: 4,
      repsOrDuration: '12 reps • 2s pause at bottom',
      dormEquipmentNeeded: 'Heavy student backpack or kettlebell',
      targetBenefit: 'Quadriceps, gluteal strength, core brace',
      postureFocus: 'Chest upright, knees track second toe, neutral spine',
      medicalSafetyNote: 'Joint safe: keep knees behind toes and maintain steady cadence',
    },
    {
      name: 'Block 1: Incline or Deficit Push-Ups (Upper Strength)',
      sets: 3,
      repsOrDuration: '12-15 reps (or 40s AMRAP)',
      dormEquipmentNeeded: 'Dorm bed frame, desk edge, or floor',
      targetBenefit: 'Pectorals, triceps, anterior serratus',
      postureFocus: 'Neutral neck, locked glutes, 45-degree elbow path',
    },
    {
      name: 'Block 2: High-Knee Cadence Sprints (Cardio Engine)',
      sets: 4,
      repsOrDuration: '45s work / 15s active rest',
      dormEquipmentNeeded: 'None (carpet / sneakers)',
      targetBenefit: 'Cardiovascular VO2 max & 140+ RPM foot cadence',
      postureFocus: 'Drive knees rhythmically, soft midfoot landing, upright posture',
      medicalSafetyNote: 'Low impact mod: brisk march with high knee drives if shins tender',
    },
    {
      name: 'Block 2: Doorframe / Towel Scapular Row (Back Strength)',
      sets: 3,
      repsOrDuration: '12 reps with 2s squeeze',
      dormEquipmentNeeded: 'Dorm doorframe or towel on handle',
      targetBenefit: 'Rhomboids, lats, desk-hunch postural reversal',
      postureFocus: 'Retract shoulder blades fully to open chest cavity',
    },
    {
      name: 'Block 3: Speed Mountain Climbers to Plank Hold (Cardio/Core)',
      sets: 4,
      repsOrDuration: '40s rapid drive + 20s solid plank',
      dormEquipmentNeeded: 'Floor or yoga mat',
      targetBenefit: 'Spikes heart rate (Zone 4) & transverse core stamina',
      postureFocus: 'Level hips, tight abdominal brace, rapid leg cycling',
    },
    {
      name: 'Block 3: Lateral Skater Hops to Balance Stick (Agility)',
      sets: 3,
      repsOrDuration: '10 reps each side (45s total)',
      dormEquipmentNeeded: '2x2 meter dorm floor space',
      targetBenefit: 'Frontal plane knee stability, ankle power & balance',
      postureFocus: 'Land softly on outside foot, stick landing for 1 full second',
    },
    {
      name: 'Finisher: Loaded Backpack Farmer Walk March (Capacity)',
      sets: 3,
      repsOrDuration: '60s continuous rhythmic march',
      dormEquipmentNeeded: 'Textbook-loaded backpack held at chest or side',
      targetBenefit: 'Trap stability, grip strength, anti-rotational core',
      postureFocus: 'Square shoulders, avoid side-leaning, deep nasal breathing',
    },
  ],
};

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  profile,
  activeRoutine: initialRoutine,
  isAutoScaled,
  telemetry,
  onToggleRoutine,
  onOpenAutoScaler,
  onLogWorkoutCompletion,
}) => {
  // Mode selection: 'standard' | 'hybrid' | 'deload'
  const [trainingMode, setTrainingMode] = useState<'standard' | 'hybrid' | 'deload'>(
    isAutoScaled ? 'deload' : 'standard'
  );

  // Active workout routine based on selected training mode
  const currentWorkout: WorkoutRoutine = 
    trainingMode === 'hybrid' 
      ? HYBRID_WORKOUT_ROUTINE 
      : initialRoutine;

  const [completedExercises, setCompletedExercises] = useState<{ [name: string]: boolean }>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showMedicalNotes, setShowMedicalNotes] = useState<boolean>(false);
  const [workoutLogged, setWorkoutLogged] = useState<boolean>(false);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number | null>(null);

  const totalExercises = currentWorkout.exercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalExercises) * 100);

  const toggleExercise = (name: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleFinishWorkout = () => {
    setWorkoutLogged(true);
    onLogWorkoutCompletion();
  };

  const handleResetChecklist = () => {
    setCompletedExercises({});
    setWorkoutLogged(false);
  };

  const handleStartRestTimer = (seconds: number = 45) => {
    setActiveTimerSeconds(seconds);
    const interval = setInterval(() => {
      setActiveTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSwitchMode = (mode: 'standard' | 'hybrid' | 'deload') => {
    setTrainingMode(mode);
    setCompletedExercises({});
    if (mode === 'deload' && !isAutoScaled) {
      onToggleRoutine();
    } else if (mode === 'standard' && isAutoScaled) {
      onToggleRoutine();
    }
  };

  const hasMedicalNotes = profile.medical?.medicalPrecautions && profile.medical.medicalPrecautions.length > 0;
  const stepProgress = Math.min(100, Math.round((telemetry.stepsToday / telemetry.targetSteps) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-900">
      {/* TRAINING PROTOCOL SWITCHER BAR */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider">
                Select Training Protocol
              </h3>
            </div>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Switch between resistance progression, high-cadence hybrid training, and exam restorative deload.
            </p>
          </div>

          {/* 3-Way Mode Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleSwitchMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'standard'
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-300'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-blue-700" />
              <span>Standard Strength</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('hybrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'hybrid'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ Hybrid Training</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('deload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'deload'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-amber-100" />
              <span>Exam Deload</span>
            </button>
          </div>
        </div>

        {/* Hybrid Training Highlights Banner */}
        {trainingMode === 'hybrid' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-900 block">Hybrid Structure</span>
              <span className="font-extrabold text-emerald-950">50% Strength / 50% Cardio</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-900 block">Est. Calorie Burn</span>
              <span className="font-extrabold text-amber-950">~380 - 450 kcal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-900 block">Heart Rate Target</span>
              <span className="font-extrabold text-blue-950">Zone 3-4 (140-165 BPM)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
              <span className="text-[10px] font-bold text-purple-900 block">Cognitive Impact</span>
              <span className="font-extrabold text-purple-950">Hippocampus BDNF Spike</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* QUICK SENSOR METRIC TILES WITH HIGH CONTRAST */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Daily Steps Tile */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Daily Steps
            </span>
            <Footprints className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-950">
              {telemetry.stepsToday.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-emerald-800">
              {stepProgress}% target
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.8 }}
              className="bg-emerald-600 h-full rounded-full"
            />
          </div>
          <div className="text-xs font-semibold text-slate-700">
            ~{Math.round(telemetry.stepsToday * 0.04)} kcal phone step burn
          </div>
        </motion.div>

        {/* Sleep Duration Tile */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Sleep Recovery</span>
            <Moon className="w-4 h-4 text-indigo-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-950">
              {telemetry.sleepHours} hrs
            </span>
            <span className={`text-xs font-extrabold ${telemetry.sleepHours < 6 ? 'text-amber-800' : 'text-emerald-800'}`}>
              {telemetry.sleepHours < 6 ? 'Sleep Deficit' : 'Optimal'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Screen-off estimate: {telemetry.screenOffEstimatedSleep}h
          </div>
          <div className="text-[11px] font-medium text-slate-600">
            Auto-tunes workout CNS recovery
          </div>
        </motion.div>

        {/* Walking Cadence Tile */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Campus Cadence</span>
            <Zap className="w-4 h-4 text-blue-700" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-950">
              {telemetry.walkingCadenceRpm} <span className="text-xs font-bold text-slate-700">RPM</span>
            </span>
            <span className="text-xs font-extrabold text-blue-800">
              {telemetry.walkingCadenceRpm > 100 ? 'Brisk Cadence' : 'Moderate'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-700">
            {telemetry.campusStairsClimbed} stairs flights climbed today
          </div>
          <div className="text-[11px] font-medium text-slate-600">
            Internal phone motion sensor
          </div>
        </motion.div>
      </div>

      {/* Routine Overview Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 mb-1">
              <span className="font-extrabold text-slate-950">{profile.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-slate-900">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                {currentWorkout.durationMinutes} min
              </span>
              <span>•</span>
              <span className="font-bold text-slate-900">{currentWorkout.intensityLevel}</span>
              {trainingMode === 'hybrid' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <Zap className="w-3 h-3 text-emerald-700" />
                  Hybrid Athlete
                </span>
              )}
              {profile.medical?.jointBackIssues && profile.medical.jointBackIssues !== 'none' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  Medical Safe
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              {currentWorkout.title}
            </h2>
          </div>

          {/* Progress Indicator */}
          <div className="sm:text-right">
            <div className="text-xs font-extrabold text-slate-950">
              {completedCount} of {totalExercises} completed
            </div>
            <div className="w-40 bg-slate-200 h-2.5 rounded-full overflow-hidden mt-1.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
                className="bg-emerald-600 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* EXERCISES CHECKLIST - EVERY EXERCISE AS AN ANIMATED TILE WITH DARK CRISP TEXT */}
        <div className="space-y-3 pt-1">
          {currentWorkout.exercises.map((ex, index) => {
            const isDone = !!completedExercises[ex.name];
            return (
              <motion.div
                key={ex.name}
                whileHover={{ y: -2 }}
                onClick={() => toggleExercise(ex.name)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                  isDone 
                    ? 'bg-slate-50 border-slate-300 opacity-75' 
                    : 'bg-white border-slate-300 hover:border-emerald-600 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                    isDone
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                  aria-label={`Mark ${ex.name} as done`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm sm:text-base font-extrabold ${isDone ? 'line-through text-slate-500' : 'text-slate-950'}`}>
                      {index + 1}. {ex.name}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-950 border border-slate-300">
                      {ex.sets} sets • {ex.repsOrDuration}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-800 font-medium mt-1.5">
                    <span>
                      <strong className="font-extrabold text-slate-950">Equip:</strong> {ex.dormEquipmentNeeded}
                    </span>
                    <span>
                      <strong className="font-extrabold text-slate-950">Cue:</strong> {ex.postureFocus}
                    </span>
                  </div>

                  {ex.medicalSafetyNote && (
                    <div className="text-xs text-emerald-900 mt-1.5 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{ex.medicalSafetyNote}</span>
                    </div>
                  )}
                </div>

                {/* Rest / Interval Timer Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartRestTimer(trainingMode === 'hybrid' ? 30 : 45);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-900 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  title="Start interval timer"
                >
                  <Timer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{trainingMode === 'hybrid' ? '30s Interval' : '45s Rest'}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Live Rest Timer Pill if Active */}
        <AnimatePresence>
          {activeTimerSeconds !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Timer className="w-5 h-5 text-emerald-800 animate-spin" />
                <span className="text-xs sm:text-sm font-extrabold text-emerald-950">
                  Cadence / Rest Interval: {activeTimerSeconds}s remaining
                </span>
              </div>
              <button
                onClick={() => setActiveTimerSeconds(null)}
                className="text-xs text-emerald-900 font-bold cursor-pointer hover:underline"
              >
                Skip Interval
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetChecklist}
            className="text-xs font-bold text-slate-800 hover:text-slate-950 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Checklist
          </button>

          {workoutLogged ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Workout saved to your profile
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleFinishWorkout}
              disabled={completedCount === 0}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-xs ${
                completedCount > 0
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              Complete Workout ({completedCount}/{totalExercises})
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Medical Safety & Physiological Rationale */}
      {hasMedicalNotes && (
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm space-y-3"
        >
          <button
            onClick={() => setShowMedicalNotes(!showMedicalNotes)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-700" />
              <h4 className="text-sm font-extrabold text-slate-950">
                Medical & Physical Safety Rules Applied
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-800 hover:text-slate-950">
              {showMedicalNotes ? 'Hide details' : 'View details'}
            </span>
          </button>

          {showMedicalNotes && (
            <div className="pt-2 border-t border-slate-200 space-y-2 text-xs text-slate-900">
              {profile.medical?.medicalPrecautions.map((precaution, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{precaution}</span>
                </div>
              ))}
              {currentWorkout.medicalClearanceNotes && (
                <p className="text-slate-800 italic mt-1 font-medium">
                  Physiology notes: {currentWorkout.medicalClearanceNotes}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Routine Logic & Rationale */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm"
      >
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-700" />
            <h4 className="text-sm font-extrabold text-slate-950">
              Why this routine was selected ({trainingMode.toUpperCase()} Protocol)
            </h4>
          </div>
          <span className="text-xs font-bold text-slate-800 hover:text-slate-950">
            {showExplanation ? 'Hide rationale' : 'View rationale'}
          </span>
        </button>

        {showExplanation && (
          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-900 space-y-2 leading-relaxed font-medium">
            <p>{currentWorkout.examFriendlyNotes}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">Deadline Countdown</span>
                <span className="text-xs font-bold text-slate-950">{profile.daysUntilExam} days</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">Sleep Tracked</span>
                <span className="text-xs font-bold text-slate-950">{telemetry.sleepHours}h last night</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-700 block">Step Baseline</span>
                <span className="text-xs font-bold text-slate-950">{telemetry.stepsToday.toLocaleString()} steps</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

