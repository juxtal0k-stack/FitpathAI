import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Droplet, 
  ChevronRight, 
  ChevronLeft, 
  HeartPulse, 
  Sparkles,
  Wind,
  Check,
  Award,
  Layers,
  Activity
} from 'lucide-react';
import { ExerciseItem, ExerciseStepGuide } from '../types';
import { getExerciseGuideByName } from '../data/exerciseGuides';
import { playStartChime, playRestChime, playFinishChime, playWaterChime } from '../utils/soundEffects';

interface ActiveExerciseSessionModalProps {
  exercise: ExerciseItem | null;
  exerciseIndex: number;
  totalExercises: number;
  isOpen: boolean;
  onClose: () => void;
  onExerciseCompleted: (exerciseName: string) => void;
  onLogWater: (glasses: number) => void;
  onNextExercise?: () => void;
  onPrevExercise?: () => void;
}

export const ActiveExerciseSessionModal: React.FC<ActiveExerciseSessionModalProps> = ({
  exercise,
  exerciseIndex,
  totalExercises,
  isOpen,
  onClose,
  onExerciseCompleted,
  onLogWater,
  onNextExercise,
  onPrevExercise,
}) => {
  if (!isOpen || !exercise) return null;

  // Retrieve exercise-specific medical and posture guide
  const guide: ExerciseStepGuide = getExerciseGuideByName(exercise.name);

  // Mode: 'work' (doing the exercise) or 'rest' (rest reminder countdown)
  const [sessionPhase, setSessionPhase] = useState<'work' | 'rest'>('work');
  const [currentSet, setCurrentSet] = useState<number>(1);
  const totalSets = exercise.sets || 3;

  // Timers
  const [workSeconds, setWorkSeconds] = useState<number>(45);
  const [isWorkRunning, setIsWorkRunning] = useState<boolean>(true);

  const [restSeconds, setRestSeconds] = useState<number>(45);
  const [isRestRunning, setIsRestRunning] = useState<boolean>(false);

  const [waterLoggedNotification, setWaterLoggedNotification] = useState<boolean>(false);

  // Initialize or reset when a new exercise opens
  useEffect(() => {
    setSessionPhase('work');
    setCurrentSet(1);
    setWorkSeconds(45);
    setIsWorkRunning(true);
    setRestSeconds(45);
    setIsRestRunning(false);
    playStartChime();
  }, [exercise.name]);

  // Work Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (sessionPhase === 'work' && isWorkRunning && workSeconds > 0) {
      interval = setInterval(() => {
        setWorkSeconds((prev) => prev - 1);
      }, 1000);
    } else if (sessionPhase === 'work' && workSeconds === 0 && isWorkRunning) {
      // Work set completed automatically! Transition to Rest Reminder
      handleFinishWorkSet();
    }
    return () => clearInterval(interval);
  }, [sessionPhase, isWorkRunning, workSeconds]);

  // Rest Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (sessionPhase === 'rest' && isRestRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((prev) => prev - 1);
      }, 1000);
    } else if (sessionPhase === 'rest' && restSeconds === 0 && isRestRunning) {
      // Rest completed!
      playFinishChime();
      setIsRestRunning(false);
    }
    return () => clearInterval(interval);
  }, [sessionPhase, isRestRunning, restSeconds]);

  // Transition from Work -> Rest
  const handleFinishWorkSet = () => {
    setIsWorkRunning(false);
    playRestChime();
    setSessionPhase('rest');
    setRestSeconds(45);
    setIsRestRunning(true);
  };

  // Transition from Rest -> Next Set or Finish Exercise
  const handleStartNextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setSessionPhase('work');
      setWorkSeconds(45);
      setIsWorkRunning(true);
      setIsRestRunning(false);
      playStartChime();
    } else {
      // Completed all sets of this exercise!
      playFinishChime();
      onExerciseCompleted(exercise.name);
      if (onNextExercise) {
        onNextExercise();
      } else {
        onClose();
      }
    }
  };

  // Drink water during rest
  const handleDrinkWaterInRest = () => {
    onLogWater(1);
    playWaterChime();
    setWaterLoggedNotification(true);
    setTimeout(() => setWaterLoggedNotification(false), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Exercise {exerciseIndex + 1} of {totalExercises}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                Set {currentSet} of {totalSets}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onPrevExercise && exerciseIndex > 0 && (
                <button
                  onClick={onPrevExercise}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                  title="Previous Exercise"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {onNextExercise && exerciseIndex < totalExercises - 1 && (
                <button
                  onClick={onNextExercise}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                  title="Next Exercise"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Title & Goal */}
            <div>
              <h3 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
                {exercise.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                🎯 Target: <span className="font-bold text-slate-900 dark:text-white">{exercise.targetBenefit}</span> • 
                Target Reps: <span className="font-bold text-slate-900 dark:text-white">{exercise.repsOrDuration}</span>
              </p>
            </div>

            {/* PHASE 1: ACTIVE WORKOUT TIMER */}
            {sessionPhase === 'work' && (
              <div className="space-y-4">
                {/* Active Work Timer Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase font-black tracking-wider text-emerald-200 block">
                        Active Set Cadence Timer
                      </span>
                      <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight mt-1">
                        {formatTime(workSeconds)}
                      </div>
                      <span className="text-xs text-emerald-100 font-medium mt-0.5 block">
                        Perform repetitions with controlled tempo (2s down, 1s squeeze)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsWorkRunning(!isWorkRunning)}
                        className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        {isWorkRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isWorkRunning ? 'Pause' : 'Resume'}
                      </button>

                      <button
                        onClick={() => setWorkSeconds((prev) => prev + 15)}
                        className="px-3 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        title="Add 15 seconds"
                      >
                        +15s
                      </button>

                      <button
                        onClick={() => {
                          setWorkSeconds(45);
                          setIsWorkRunning(false);
                        }}
                        className="p-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white text-xs transition-colors cursor-pointer"
                        title="Reset set timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-500/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-100">
                      Finished target reps early?
                    </span>
                    <button
                      onClick={handleFinishWorkSet}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      Finish Set & Start Rest ({restSeconds}s)
                    </button>
                  </div>
                </div>

                {/* EXERCISE-SPECIFIC MEDICAL & PHYSICAL SAFETY RULE */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                      Exercise-Specific Medical Safety Rule
                    </h4>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                    {guide.medicalSafetyRule || exercise.medicalSafetyNote || 'Maintain neutral spine and steady breathing.'}
                  </p>
                </div>

                {/* CORRECT POSTURE CHECKLIST */}
                {guide.correctPostureChecklist && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      Correct Posture Alignment Checkpoints
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block">👤 Head & Neck:</span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight">
                          {guide.correctPostureChecklist.headAndNeck}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block">🛡️ Torso & Spine:</span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight">
                          {guide.correctPostureChecklist.torsoAndSpine}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block">⚖️ Pelvis & Hips:</span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight">
                          {guide.correctPostureChecklist.pelvisAndHips}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block">🦵 Limbs & Joints:</span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] leading-tight">
                          {guide.correctPostureChecklist.limbsAndJoints}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* INJURY PREVENTION CUE */}
                {guide.injuryPrevention && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-black text-rose-900 dark:text-rose-200 block">
                        Injury Prevention Focus: {guide.injuryPrevention.primaryRisk}
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        👉 <strong>Technique:</strong> {guide.injuryPrevention.preventionTechnique}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        💡 <strong>Biomechanical Cue:</strong> {guide.injuryPrevention.anatomicalCue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PHASE 2: REST REMINDER INTERVAL & WATER NUDGE */}
            {sessionPhase === 'rest' && (
              <div className="space-y-4">
                {/* Rest Countdown Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-lg relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
                          Rest & Posture Recovery
                        </span>
                        {isRestRunning && (
                          <span className="text-xs text-sky-200 flex items-center gap-1 animate-pulse">
                            <Wind className="w-3.5 h-3.5" /> Nasal breathing...
                          </span>
                        )}
                      </div>
                      <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight mt-1">
                        {formatTime(restSeconds)}
                      </div>
                      <span className="text-xs text-sky-100 font-medium mt-0.5 block">
                        Rest between sets lowers heart rate, replenishes ATP, and resets spinal posture
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsRestRunning(!isRestRunning)}
                        className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isRestRunning ? 'Pause Rest' : 'Resume Rest'}
                      </button>

                      <button
                        onClick={handleStartNextSet}
                        className="px-4 py-2 rounded-xl bg-white text-sky-950 font-black text-xs hover:bg-sky-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                        {currentSet < totalSets ? `Start Set ${currentSet + 1}` : 'Complete Exercise'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* WATER REMINDER DURING REST */}
                <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-300 dark:border-sky-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                      <Droplet className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-sky-950 dark:text-sky-200">
                          Water Reminder (Active Default)
                        </h4>
                        {waterLoggedNotification && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> +250ml Logged!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                        Take a sip of water during your rest break. Hydration prevents muscle cramping and stabilizes blood pressure.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDrinkWaterInRest}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
                  >
                    <Droplet className="w-3.5 h-3.5 fill-white" />
                    + Drink 1 Glass (250ml)
                  </button>
                </div>

                {/* REST POSTURE RESET */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Rest Interval Form Reset Tip
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {guide.breathingCues.inhale} Stand or sit tall with open collarbones. Relax your jaw and shoulders to eliminate tension before the next set.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {sessionPhase === 'work' ? (
                <span>Set <strong>{currentSet}</strong> of <strong>{totalSets}</strong> in progress</span>
              ) : (
                <span>Rest interval active • Ready for Set {currentSet < totalSets ? currentSet + 1 : 'Finish'}</span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Timer
              </button>

              {sessionPhase === 'work' ? (
                <button
                  onClick={handleFinishWorkSet}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Finish Set {currentSet}
                </button>
              ) : (
                <button
                  onClick={handleStartNextSet}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  {currentSet < totalSets ? `Start Set ${currentSet + 1}` : 'Finish Exercise'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
