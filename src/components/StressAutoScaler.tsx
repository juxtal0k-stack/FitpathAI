import React, { useState } from 'react';
import { 
  Brain, 
  Clock, 
  Activity, 
  Check, 
  RefreshCw, 
  AlertCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { WorkoutRoutine } from '../types';

interface StressAutoScalerProps {
  daysUntilExam: number;
  sleepHours: number;
  stepsToday: number;
  baselineRoutine: WorkoutRoutine;
  scaledRoutine: WorkoutRoutine;
  onApplyScaledRoutine: (routine: WorkoutRoutine, isScaled: boolean) => void;
}

export const StressAutoScaler: React.FC<StressAutoScalerProps> = ({
  daysUntilExam: initialDays,
  sleepHours: initialSleep,
  stepsToday: initialSteps,
  baselineRoutine,
  scaledRoutine,
  onApplyScaledRoutine,
}) => {
  const [days, setDays] = useState<number>(initialDays);
  const [sleep, setSleep] = useState<number>(initialSleep);
  const [stressRPE, setStressRPE] = useState<number>(7); // 1-10
  const [steps, setSteps] = useState<number>(initialSteps);
  const [applied, setApplied] = useState<boolean>(false);

  // Compute stress score and recommendation
  // Higher stress index = exams close + low sleep + high academic stress
  const examScore = Math.max(0, 10 - days) * 4; // up to 40 pts
  const sleepPenalty = Math.max(0, 8 - sleep) * 5; // up to 20 pts
  const rpeScore = stressRPE * 4; // up to 40 pts
  const totalStressIndex = Math.min(100, Math.round(examScore + sleepPenalty + rpeScore));

  const isExamDeload = totalStressIndex >= 50;
  const sessionDuration = isExamDeload ? 18 : 45;
  const intensityReduction = isExamDeload ? 45 : 0;

  const handleApply = () => {
    if (isExamDeload) {
      onApplyScaledRoutine(scaledRoutine, true);
    } else {
      onApplyScaledRoutine(baselineRoutine, false);
    }
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Exam Stress Auto-Scaler
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Automatically scales workout duration and intensity according to upcoming exams and recovery data.
        </p>
      </div>

      {/* Interactive Sliders Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Current Conditions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Days until exam */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <label>Days Until Next Exam</label>
              <span className="font-semibold text-slate-900">{days} days</span>
            </div>
            <input
              type="range"
              min="1"
              max="21"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Tomorrow (1d)</span>
              <span>Finals (7d)</span>
              <span>Off-season (21d)</span>
            </div>
          </div>

          {/* Sleep hours */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <label>Sleep Last Night</label>
              <span className="font-semibold text-slate-900">{sleep} hours</span>
            </div>
            <input
              type="range"
              min="4"
              max="9"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>4h (All-nighter)</span>
              <span>6.5h</span>
              <span>9h (Rested)</span>
            </div>
          </div>

          {/* Study Stress Level */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <label>Study Stress Level</label>
              <span className="font-semibold text-slate-900">{stressRPE}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressRPE}
              onChange={(e) => setStressRPE(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Low (1)</span>
              <span>Moderate (5)</span>
              <span>Peak Finals (10)</span>
            </div>
          </div>

          {/* Steps Today */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
              <label>Phone Step Count</label>
              <span className="font-semibold text-slate-900">{steps.toLocaleString()} steps</span>
            </div>
            <input
              type="range"
              min="1500"
              max="12000"
              step="500"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Library Sedentary</span>
              <span>Target (8k)</span>
              <span>Active</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Calculated Result */}
        <div className="rounded-xl border p-4 bg-slate-50 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Calculated Plan Recommendation
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {isExamDeload
                  ? 'Exam Deload: 18-Minute Restorative Routine'
                  : 'Standard: 45-Minute Strength Routine'}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isExamDeload
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Stress Index: {totalStressIndex}/100
              </span>
              {intensityReduction > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                  -{intensityReduction}% Volume
                </span>
              )}
            </div>
          </div>

          {/* Plain English Rationale */}
          <div className="text-xs text-slate-600 space-y-1.5">
            {isExamDeload ? (
              <>
                <p>
                  <strong>Why volume is reduced:</strong> With exams {days} days away and {sleep}h of sleep, heavy resistance training elevates cortisol and impairs memory retention.
                </p>
                <p>
                  <strong>Target focus:</strong> Shorter 18-minute session focusing on posture relief (desk hunch, neck tension) without exhausting the central nervous system.
                </p>
              </>
            ) : (
              <p>
                <strong>Normal training conditions:</strong> Ample exam buffer ({days} days) and sufficient recovery allow for full progressive overload without burnout risk.
              </p>
            )}
          </div>

          {/* Apply Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Applies this schedule to today's active routine.
            </span>

            <div className="flex items-center gap-2">
              {applied && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Plan applied
                </span>
              )}
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 text-xs font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-sm"
              >
                Apply to Today's Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
