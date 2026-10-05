import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  ChevronRight, 
  Heart, 
  Activity, 
  Coffee, 
  RotateCcw, 
  Utensils, 
  Smartphone, 
  Brain, 
  HelpCircle,
  Play,
  Calendar
} from 'lucide-react';
import { WorkoutRoutine, StudentProfile, SensorTelemetry, ExerciseItem } from '../types';

interface MobileAppViewProps {
  profile: StudentProfile;
  activeRoutine: WorkoutRoutine;
  isAutoScaled: boolean;
  telemetry: SensorTelemetry;
  onOpenExplainability: () => void;
  onOpenAutoScaler: () => void;
  onCompleteWorkout: () => void;
  onRetakeQuiz: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  profile,
  activeRoutine,
  isAutoScaled,
  telemetry,
  onOpenExplainability,
  onOpenAutoScaler,
  onCompleteWorkout,
  onRetakeQuiz,
}) => {
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [workoutFinished, setWorkoutFinished] = useState<boolean>(false);
  const [showWeeklyCheckin, setShowWeeklyCheckin] = useState<boolean>(false);
  const [weeklyEnergyRpe, setWeeklyEnergyRpe] = useState<number>(7);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const toggleExercise = (name: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;
  const progressPercent = activeRoutine.exercises.length > 0 
    ? Math.round((completedCount / activeRoutine.exercises.length) * 100)
    : 0;

  return (
    <div className="space-y-5 text-slate-100 pb-8">
      {/* Student Welcome & Exam Status Pill */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 block uppercase tracking-wider">
            Today's Session &bull; {profile.major}
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Hi, {profile.name.split(' ')[0]} 👋
          </h2>
        </div>

        {/* Days to Exam Badge */}
        <button
          onClick={onOpenAutoScaler}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            profile.daysUntilExam <= 7
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
          }`}
          title="Click to tune auto-scaling parameters"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{profile.daysUntilExam}d to Finals</span>
        </button>
      </div>

      {/* Dynamic Exam Auto-Scale Alert (Explainable) */}
      {isAutoScaled ? (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4 shadow-lg space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-amber-200">
                  Exam Stress Deload Active (-45% Volume)
                </h3>
                <span className="text-[11px] text-slate-300 block">
                  Shortened from 45 min &rarr; {activeRoutine.durationMinutes} min to preserve cognitive energy
                </span>
              </div>
            </div>

            <button
              onClick={onOpenExplainability}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition shrink-0 cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Why?
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            {activeRoutine.examFriendlyNotes}
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-teal-950/30 border border-emerald-500/30 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white">Standard Hypertrophy & Calisthenics</h3>
              <span className="text-[11px] text-slate-400">Sleep & activity metrics optimal</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
            Full Load
          </span>
        </div>
      )}

      {/* Routine Main Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              {isAutoScaled ? 'Restorative Circuit' : 'Progression Circuit'}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{activeRoutine.title}</h3>
          </div>

          <div className="text-right">
            <span className="text-sm font-extrabold font-mono text-emerald-400 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5" />
              {activeRoutine.durationMinutes} min
            </span>
            <span className="text-[10px] text-slate-400">
              {activeRoutine.intensityLevel}
            </span>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Progress ({completedCount}/{activeRoutine.exercises.length} Exercises)</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-2.5 pt-1">
          {activeRoutine.exercises.map((ex, idx) => {
            const isDone = !!completedExercises[ex.name];
            return (
              <div
                key={idx}
                onClick={() => toggleExercise(ex.name)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isDone
                    ? 'bg-slate-950/60 border-emerald-500/40 opacity-75'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div>
                      <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                        {ex.name}
                      </h4>
                      <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        {ex.sets} sets &bull; {ex.repsOrDuration}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          📦 {ex.dormEquipmentNeeded}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300">
                          🧘 {ex.postureFocus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button: Finish Workout */}
        <button
          onClick={() => {
            setWorkoutFinished(true);
            onCompleteWorkout();
          }}
          className="w-full py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          {completedCount === activeRoutine.exercises.length
            ? 'Complete Session & Sync Telemetry'
            : `Log Session (${completedCount}/${activeRoutine.exercises.length} Done)`}
        </button>
      </div>

      {/* Weekly Adaptive Plan Feedback Loop Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <RotateCcw className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-xs font-bold text-white">Sunday Weekly Adaptive Recalibration</h4>
          </div>
          <button
            onClick={() => setShowWeeklyCheckin(!showWeeklyCheckin)}
            className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            {showWeeklyCheckin ? 'Hide Check-in' : 'Open Check-in'}
          </button>
        </div>

        {showWeeklyCheckin && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn text-xs">
            <span className="text-slate-300 block font-semibold">
              Weekly Perceived Fatigue & Exam Stress Score:
            </span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={weeklyEnergyRpe}
                onChange={(e) => setWeeklyEnergyRpe(parseInt(e.target.value))}
                className="flex-1 accent-teal-400"
              />
              <span className="font-mono font-bold text-teal-300 w-12 text-right">
                {weeklyEnergyRpe} / 10
              </span>
            </div>
            <button
              onClick={() => {
                setFeedbackSuccess(`Weekly feedback recorded (${weeklyEnergyRpe}/10). Baseline recalibrated!`);
                setTimeout(() => {
                  setFeedbackSuccess(null);
                  setShowWeeklyCheckin(false);
                }, 2500);
              }}
              className="w-full py-2 rounded-lg text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition cursor-pointer"
            >
              Submit Weekly Feedback
            </button>
            {feedbackSuccess && (
              <p className="text-xs text-emerald-400 font-bold text-center mt-2 animate-fadeIn">
                ✓ {feedbackSuccess}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Retake Onboarding Quiz Button */}
      <div className="text-center pt-2">
        <button
          onClick={onRetakeQuiz}
          className="text-xs text-slate-500 hover:text-slate-300 transition cursor-pointer underline"
        >
          Retake 2-Minute Onboarding Quiz
        </button>
      </div>
    </div>
  );
};
