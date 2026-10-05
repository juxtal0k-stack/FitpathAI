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
  Layers,
  Home,
  BookOpen,
  Play,
  Filter,
  Target,
  Brain
} from 'lucide-react';
import { 
  IndividualProfile, 
  WorkoutRoutine, 
  SensorTelemetry, 
  ExerciseStepGuide,
  ExerciseLevelFilter,
  BodyPartTarget 
} from '../types';
import { ExerciseStepGuideModal } from './ExerciseStepGuideModal';
import { ActiveExerciseSessionModal } from './ActiveExerciseSessionModal';
import { getExerciseGuideByName } from '../data/exerciseGuides';
import { STANDARD_GYM_ROUTINE } from '../data/gymWorkouts';

interface WorkoutViewProps {
  profile: IndividualProfile;
  activeRoutine: WorkoutRoutine;
  isAutoScaled: boolean;
  telemetry: SensorTelemetry;
  onToggleRoutine: () => void;
  onOpenAutoScaler: () => void;
  onLogWorkoutCompletion: (routineTitle?: string, completedCount?: number, durationMinutes?: number, exercises?: string[]) => void;
  onLogWater?: (glasses?: number) => void;
}

// Zero-Equipment Home & Dorm Workout Routine for users without gym equipment
const HOME_ZERO_EQUIPMENT_ROUTINE: WorkoutRoutine = {
  id: 'routine-home-zero-equipment',
  title: 'Zero-Equipment Home & Dorm Room Bodyweight Routine',
  durationMinutes: 28,
  intensityLevel: 'Moderate',
  intensityPercent: 78,
  examFriendlyNotes: 'Specifically engineered for students & professionals without gym memberships, weights, or machines. Utilizes bodyweight leverage, bed edges, study chairs, and doorframes to build strength, release desk slouching, and stimulate mental clarity.',
  medicalClearanceNotes: 'Spine decompression built-in with zero axial spinal compressive loading. Safe for knees, lower back, and tight shoulders.',
  exercises: [
    {
      name: 'Dorm/Home Incline or Floor Push-Ups',
      sets: 3,
      repsOrDuration: '10-15 reps (or 35s tempo)',
      dormEquipmentNeeded: 'Zero Equipment (Bed frame, desk edge, or floor)',
      targetBenefit: 'Pectorals, triceps, anterior deltoids & core brace',
      postureFocus: '45-degree arrow elbow angle, neutral neck, locked glutes',
      medicalSafetyNote: 'Elbows tucked to safeguard rotator cuffs'
    },
    {
      name: 'Bodyweight Tempo Air Squats (to Chair Tap)',
      sets: 4,
      repsOrDuration: '15-20 reps (2s down, 1s hold)',
      dormEquipmentNeeded: 'Zero Equipment (Floor & study chair depth guide)',
      targetBenefit: 'Quadriceps, gluteus maximus & core stabilization',
      postureFocus: 'Knees track 2nd toe, proud chest, weight through midfoot',
      medicalSafetyNote: 'Chair tap provides safe depth limit for lower back'
    },
    {
      name: 'Doorframe / Towel Isometric Scapular Rows',
      sets: 3,
      repsOrDuration: '12 reps with 2s hold',
      dormEquipmentNeeded: 'Zero Equipment (Sturdy doorframe or towel on knob)',
      targetBenefit: 'Rhomboids, lats & reversal of desk slump posture',
      postureFocus: 'Pinch shoulder blades together like holding a pencil',
      medicalSafetyNote: 'Restores cervical and thoracic alignment'
    },
    {
      name: 'Bedside Alternating Walking Lunges',
      sets: 3,
      repsOrDuration: '10-12 reps per leg',
      dormEquipmentNeeded: 'Zero Equipment (2 meters of floor space)',
      targetBenefit: 'Unilateral quad & glute power, hip flexor release',
      postureFocus: '90-degree bend at both knees, torso upright',
      medicalSafetyNote: 'Keep front knee stacked over ankle'
    },
    {
      name: 'Floor Deadbug & Hollow Body Core Hold',
      sets: 3,
      repsOrDuration: '10 slow reps per side (or 40s hold)',
      dormEquipmentNeeded: 'Zero Equipment (Floor or yoga mat)',
      targetBenefit: 'Transverse abdominis (deep core) & lumbar stabilization',
      postureFocus: 'Press lower back completely flat into the floor with zero gap',
      medicalSafetyNote: 'Safest clinical core exercise for lower back'
    },
    {
      name: 'Wall Sit with Alternating Calf Raises',
      sets: 3,
      repsOrDuration: '40 seconds hold',
      dormEquipmentNeeded: 'Zero Equipment (Any smooth wall)',
      targetBenefit: 'Isometric quad stamina & calf ankle stability',
      postureFocus: 'Thighs parallel to floor, spine flat against wall',
      medicalSafetyNote: 'Low impact on knee ligaments'
    },
    {
      name: 'Supine Glute Bridges & Hamstring Walkouts',
      sets: 3,
      repsOrDuration: '15 reps with 2s top squeeze',
      dormEquipmentNeeded: 'Zero Equipment (Floor or carpet)',
      targetBenefit: 'Glute activation & lower back decompression',
      postureFocus: 'Drive through heels, clamp glutes at top, avoid overarching',
      medicalSafetyNote: 'Relieves pelvic tilt from prolonged studying'
    },
    {
      name: 'Desk / Chair Tricep Dip Pulses',
      sets: 3,
      repsOrDuration: '12 reps',
      dormEquipmentNeeded: 'Zero Equipment (Study chair or bed edge)',
      targetBenefit: 'Triceps brachii & anterior posture opening',
      postureFocus: 'Back skims close to chair, elbows bend to 90 degrees max',
      medicalSafetyNote: 'Never drop below 90 degrees to protect shoulders'
    }
  ]
};

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
  onLogWater,
}) => {
  // Mode selection: 'standard' | 'home' | 'hybrid' | 'deload' (Default: 'standard' for authentic gym training)
  const [trainingMode, setTrainingMode] = useState<'home' | 'standard' | 'hybrid' | 'deload'>(
    isAutoScaled ? 'deload' : 'standard'
  );

  // Modal for step-by-step exercise guide
  const [selectedGuide, setSelectedGuide] = useState<ExerciseStepGuide | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Active interactive session with work timer, rest reminder chime, water tracker, and safety posture checklist
  const [activeSessionExercise, setActiveSessionExercise] = useState<ExerciseStepGuide | null>(null);

  // Exercise Filters: Level & Body Part targeting
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartTarget>('all');
  const [selectedLevel, setSelectedLevel] = useState<ExerciseLevelFilter>('all');

  // Active workout routine based on selected training mode
  const currentWorkoutBase: WorkoutRoutine = 
    trainingMode === 'home'
      ? HOME_ZERO_EQUIPMENT_ROUTINE
      : trainingMode === 'hybrid' 
        ? HYBRID_WORKOUT_ROUTINE 
        : trainingMode === 'standard'
          ? STANDARD_GYM_ROUTINE
          : initialRoutine;

  // Filter exercises dynamically according to user selection
  const filteredExercises = currentWorkoutBase.exercises.filter((ex) => {
    // Level filter
    if (selectedLevel !== 'all') {
      if (ex.level && ex.level !== selectedLevel) return false;
    }
    // Body part target filter
    if (selectedBodyPart !== 'all') {
      if (ex.bodyPart) {
        if (ex.bodyPart !== selectedBodyPart) return false;
      } else {
        const text = `${ex.name} ${ex.targetBenefit}`.toLowerCase();
        if (!text.includes(selectedBodyPart)) return false;
      }
    }
    return true;
  });

  const currentWorkout: WorkoutRoutine = {
    ...currentWorkoutBase,
    exercises: filteredExercises,
  };

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
    const completedList = Object.keys(completedExercises).filter((k) => completedExercises[k]);
    onLogWorkoutCompletion(
      currentWorkout.title,
      completedCount,
      currentWorkout.durationMinutes,
      completedList
    );
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

  const handleSwitchMode = (mode: 'home' | 'standard' | 'hybrid' | 'deload') => {
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
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      {/* TRAINING PROTOCOL SWITCHER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-md space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Select Training Protocol
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Switch seamlessly between zero-equipment home, standard gym, hybrid, or exam deload.
            </p>
          </div>

          {/* 4-Way Mode Tabs + Popup Window Action */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleSwitchMode('standard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'standard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-blue-200" />
              <span>Standard Gym</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'home'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home (No Gym)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('hybrid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'hybrid'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Hybrid</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchMode('deload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                trainingMode === 'deload'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-200" />
              <span>Exam Deload</span>
            </button>

            <button
              type="button"
              onClick={onOpenAutoScaler}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-indigo-300 hover:bg-slate-700 border border-slate-700 transition cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Open Exam Deload popup window to simulate sleep debt & exam proximity"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Tune Deload</span>
            </button>
          </div>
        </div>

        {/* Mode Highlights Banner */}
        {trainingMode === 'home' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="text-[10px] font-bold text-emerald-400 block">Equipment Required</span>
              <span className="font-extrabold text-emerald-200">100% Zero Equipment</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/60">
              <span className="text-[10px] font-bold text-blue-400 block">Environment</span>
              <span className="font-extrabold text-blue-200">Dorm / Bedside / Floor</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <span className="text-[10px] font-bold text-amber-400 block">Est. Calorie Burn</span>
              <span className="font-extrabold text-amber-200">~260 - 320 kcal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60">
              <span className="text-[10px] font-bold text-purple-400 block">Posture Recovery</span>
              <span className="font-extrabold text-purple-200">Decompresses Spine & Neck</span>
            </div>
          </motion.div>
        )}

        {/* Hybrid Training Highlights Banner */}
        {trainingMode === 'hybrid' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs"
          >
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="text-[10px] font-bold text-emerald-400 block">Hybrid Structure</span>
              <span className="font-extrabold text-emerald-200">50% Strength / 50% Cardio</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <span className="text-[10px] font-bold text-amber-400 block">Est. Calorie Burn</span>
              <span className="font-extrabold text-amber-200">~380 - 450 kcal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/60">
              <span className="text-[10px] font-bold text-blue-400 block">Heart Rate Target</span>
              <span className="font-extrabold text-blue-200">Zone 3-4 (140-165 BPM)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60">
              <span className="text-[10px] font-bold text-purple-400 block">Cognitive Impact</span>
              <span className="font-extrabold text-purple-200">Hippocampus BDNF Spike</span>
            </div>
          </motion.div>
        )}

        {/* Standard Gym Highlights Banner */}
        {trainingMode === 'standard' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs"
          >
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/60">
              <span className="text-[10px] font-bold text-blue-400 block">Gym Equipment</span>
              <span className="font-extrabold text-blue-200">Olympic Barbells & Cables</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
              <span className="text-[10px] font-bold text-emerald-400 block">Training Focus</span>
              <span className="font-extrabold text-emerald-200">Hypertrophy & Strength</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/60">
              <span className="text-[10px] font-bold text-amber-400 block">Muscle Targeting</span>
              <span className="font-extrabold text-amber-200">Biceps, Chest, Triceps, etc.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60">
              <span className="text-[10px] font-bold text-purple-400 block">Safety & Posture</span>
              <span className="font-extrabold text-purple-200">Scapular Lock & Joint Angles</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* QUICK SENSOR METRIC TILES WITH HIGH CONTRAST */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Daily Steps Tile */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Daily Steps
            </span>
            <Footprints className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">
              {telemetry.stepsToday.toLocaleString()}
            </span>
            <span className="text-xs font-extrabold text-emerald-400">
              {stepProgress}% target
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.8 }}
              className="bg-emerald-500 h-full rounded-full"
            />
          </div>
          <div className="text-xs font-semibold text-slate-400">
            ~{Math.round(telemetry.stepsToday * 0.04)} kcal phone step burn
          </div>
        </motion.div>

        {/* Sleep Duration Tile */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Sleep Recovery</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">
              {telemetry.sleepHours} hrs
            </span>
            <span className={`text-xs font-extrabold ${telemetry.sleepHours < 6 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {telemetry.sleepHours < 6 ? 'Sleep Deficit' : 'Optimal'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Screen-off estimate: {telemetry.screenOffEstimatedSleep}h
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            Auto-tunes workout CNS recovery
          </div>
        </motion.div>

        {/* Walking Cadence Tile */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Campus Cadence</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">
              {telemetry.walkingCadenceRpm} <span className="text-xs font-bold text-slate-400">RPM</span>
            </span>
            <span className="text-xs font-extrabold text-blue-400">
              {telemetry.walkingCadenceRpm > 100 ? 'Brisk Cadence' : 'Moderate'}
            </span>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {telemetry.campusStairsClimbed} stairs flights climbed today
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            Internal phone motion sensor
          </div>
        </motion.div>
      </div>

      {/* Routine Overview Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-md space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 mb-1">
              <span className="font-extrabold text-white">{profile.name}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                {currentWorkout.durationMinutes} min
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-slate-300">{currentWorkout.intensityLevel}</span>
              {trainingMode === 'hybrid' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-bold">Hybrid Athlete</span>
                </>
              )}
              {profile.medical?.jointBackIssues && profile.medical.jointBackIssues !== 'none' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-bold">Medical Safe</span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentWorkout.title}
            </h2>
          </div>

          {/* Progress Indicator */}
          <div className="sm:text-right">
            <div className="text-xs font-extrabold text-white">
              {completedCount} of {totalExercises} completed
            </div>
            <div className="w-40 bg-slate-950 h-2.5 rounded-full overflow-hidden mt-1.5 border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* EXERCISE LEVEL & BODY PART TARGETING FILTER BAR */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          {/* Level Filter: Easy, Moderate, Intense */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-300">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exercise Level:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'easy', label: '🟢 Easy (Beginner)' },
                { id: 'moderate', label: '🟡 Moderate' },
                { id: 'intense', label: '🔴 Intense' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id as ExerciseLevelFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedLevel === lvl.id
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Part Targeting: Biceps, Chest, Triceps, Back, Shoulders, Legs, Core */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-300">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Body Part:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Parts' },
                { id: 'chest', label: 'Chest' },
                { id: 'biceps', label: 'Biceps' },
                { id: 'triceps', label: 'Triceps' },
                { id: 'back', label: 'Back' },
                { id: 'shoulders', label: 'Shoulders' },
                { id: 'legs', label: 'Legs' },
                { id: 'core', label: 'Core / Abs' },
              ].map((bp) => (
                <button
                  key={bp.id}
                  type="button"
                  onClick={() => setSelectedBodyPart(bp.id as BodyPartTarget)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer capitalize ${
                    selectedBodyPart === bp.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {bp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Summary and Clear */}
          {(selectedLevel !== 'all' || selectedBodyPart !== 'all') && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-medium">
              <span>
                Showing {filteredExercises.length} of {currentWorkoutBase.exercises.length} exercises matching filters.
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedLevel('all');
                  setSelectedBodyPart('all');
                }}
                className="text-xs font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Empty filter message */}
        {currentWorkout.exercises.length === 0 && (
          <div className="p-8 text-center bg-slate-950 border border-dashed border-slate-800 rounded-2xl space-y-2">
            <p className="text-sm font-bold text-slate-300">
              No exercises match the selected level & body part combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedLevel('all');
                setSelectedBodyPart('all');
              }}
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer hover:bg-emerald-400"
            >
              Reset Filters to View All Exercises
            </button>
          </div>
        )}

        {/* EXERCISES CHECKLIST - EVERY EXERCISE AS AN ANIMATED TILE WITH DARK CRISP TEXT */}
        <div className="space-y-3 pt-1">
          {currentWorkout.exercises.map((ex, index) => {
            const isDone = !!completedExercises[ex.name];
            return (
              <motion.div
                key={ex.name}
                whileHover={{ y: -2 }}
                onClick={() => toggleExercise(ex.name)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                  isDone 
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                  aria-label={`Mark ${ex.name} as done`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm sm:text-base font-extrabold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                      {index + 1}. {ex.name}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                      {ex.sets} sets • {ex.repsOrDuration}
                    </span>

                    {/* Exercise Level Badge */}
                    {ex.level && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                        ex.level === 'intense'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : ex.level === 'moderate'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      }`}>
                        {ex.level}
                      </span>
                    )}

                    {/* Target Body Part Badge */}
                    {ex.bodyPart && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800 uppercase tracking-wider">
                        {ex.bodyPart}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium mt-1.5">
                    <span>
                      <strong className="font-extrabold text-slate-200">Equip:</strong> {ex.dormEquipmentNeeded}
                    </span>
                    <span>
                      <strong className="font-extrabold text-slate-200">Cue:</strong> {ex.postureFocus}
                    </span>
                  </div>

                  {ex.medicalSafetyNote && (
                    <div className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{ex.medicalSafetyNote}</span>
                    </div>
                  )}
                </div>

                {/* Guide & Rest / Interval Timer Controls */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const guide = getExerciseGuideByName(ex.name);
                      setActiveSessionExercise(guide);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Start active session with exercise timer, rest reminder chime, and posture safety checklist"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Timer</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const guide = getExerciseGuideByName(ex.name);
                      setSelectedGuide(guide);
                      setIsGuideModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-400 flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="View detailed step-by-step exercise instructions"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guide</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRestTimer(trainingMode === 'hybrid' ? 30 : 45);
                    }}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                    title="Start quick rest interval timer"
                  >
                    <Timer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trainingMode === 'hybrid' ? '30s Interval' : '45s Rest'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Rest Timer Banner if Active */}
        <AnimatePresence>
          {activeTimerSeconds !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Timer className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-xs sm:text-sm font-extrabold text-emerald-200">
                  Cadence / Rest Interval: {activeTimerSeconds}s remaining
                </span>
              </div>
              <button
                onClick={() => setActiveTimerSeconds(null)}
                className="text-xs text-emerald-400 font-bold cursor-pointer hover:underline"
              >
                Skip Interval
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetChecklist}
            className="text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Checklist
          </button>

          {workoutLogged ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 text-xs font-extrabold text-emerald-300 bg-emerald-950/80 px-4 py-2 rounded-2xl border border-emerald-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Workout saved to your profile
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleFinishWorkout}
              disabled={completedCount === 0}
              className={`px-5 py-2.5 text-xs font-bold rounded-2xl transition cursor-pointer shadow-xs ${
                completedCount > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
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
          className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-3"
        >
          <button
            onClick={() => setShowMedicalNotes(!showMedicalNotes)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-extrabold text-white">
                Medical & Physical Safety Rules Applied
              </h4>
            </div>
            <span className="text-xs font-bold text-slate-400 hover:text-white">
              {showMedicalNotes ? 'Hide details' : 'View details'}
            </span>
          </button>

          {showMedicalNotes && (
            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              {profile.medical?.medicalPrecautions.map((precaution, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 text-emerald-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{precaution}</span>
                </div>
              ))}
              {currentWorkout.medicalClearanceNotes && (
                <p className="text-slate-400 italic mt-1 font-medium">
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
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md"
      >
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-extrabold text-white">
              Why this routine was selected ({trainingMode.toUpperCase()} Protocol)
            </h4>
          </div>
          <span className="text-xs font-bold text-slate-400 hover:text-white">
            {showExplanation ? 'Hide rationale' : 'View rationale'}
          </span>
        </button>

        {showExplanation && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed font-medium">
            <p>{currentWorkout.examFriendlyNotes}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Deadline Countdown</span>
                <span className="text-xs font-bold text-white">{profile.daysUntilExam} days</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sleep Tracked</span>
                <span className="text-xs font-bold text-white">{telemetry.sleepHours}h last night</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Step Baseline</span>
                <span className="text-xs font-bold text-white">{telemetry.stepsToday.toLocaleString()} steps</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Step-by-Step Exercise Guide Modal */}
      <ExerciseStepGuideModal
        guide={selectedGuide}
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Active Exercise Live Session Modal with Work/Rest Timers, Audio Chimes, Water Reminder & Posture Safety */}
      <ActiveExerciseSessionModal
        guide={activeSessionExercise}
        isOpen={!!activeSessionExercise}
        onClose={() => setActiveSessionExercise(null)}
        onCompleteExercise={(exerciseName) => {
          setCompletedExercises((prev) => ({ ...prev, [exerciseName]: true }));
        }}
        onLogWater={(glasses) => {
          if (onLogWater) onLogWater(glasses);
        }}
      />
    </div>
  );
};

