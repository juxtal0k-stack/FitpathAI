import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  GraduationCap, 
  Utensils, 
  Activity, 
  Smartphone, 
  Calendar, 
  Sparkles,
  DollarSign,
  ShieldCheck,
  Watch
} from 'lucide-react';
import { StudentProfile, DormFacilities } from '../types';

interface OnboardingQuizProps {
  initialProfile: StudentProfile;
  onComplete: (updatedProfile: StudentProfile) => void;
  onCancel?: () => void;
}

export const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<StudentProfile>(initialProfile);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden text-slate-100">
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Progress Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            2-Minute Student Onboarding Quiz
          </span>
          <span className="font-mono text-slate-300">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Student Demographics & Academic Timetable */}
      {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Student Academic Profile</h3>
              <p className="text-xs text-slate-400">
                FitPath AI syncs with your academic calendar to automatically reduce training intensity when finals draw near.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name / Student ID Alias
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Alex Rivera"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Degree Program / Major
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Computer Science, Pre-Med, Economics"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Upcoming Exam / Finals Date
                </label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => {
                    const selected = new Date(e.target.value);
                    const now = new Date();
                    const diffDays = Math.max(1, Math.ceil((selected.getTime() - now.getTime()) / (1000 * 3600 * 24)));
                    setFormData({
                      ...formData,
                      examDate: e.target.value,
                      daysUntilExam: diffDays,
                    });
                  }}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Days Remaining
                </label>
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-emerald-400 font-mono flex items-center justify-between">
                  <span>{formData.daysUntilExam} days away</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    formData.daysUntilExam <= 7 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {formData.daysUntilExam <= 7 ? 'High Exam Strain' : 'Standard Routine'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Living & Budget Situation ($0 Hardware Pledge) */}
      {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Living & Budget Constraints</h3>
              <p className="text-xs text-slate-400">
                FitPath AI builds meal plans around what you actually have in your dorm room without expensive groceries.
              </p>
            </div>
          </div>

          {/* $0 Hardware Cost Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">$0 Hardware Guarantee</span>
              No smartwatch, fitness band, or gym membership required. Built-in phone sensors track everything for free.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Daily Food Budget Allowance</span>
                <span className="text-emerald-400 font-mono font-bold">${formData.budgetPerDay.toFixed(2)} / day</span>
              </label>
              <input
                type="range"
                min="2.5"
                max="10.0"
                step="0.5"
                value={formData.budgetPerDay}
                onChange={(e) => setFormData({ ...formData, budgetPerDay: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>$2.50 (Hostel Survival)</span>
                <span>$5.00 (Standard)</span>
                <span>$10.00 (Comfort)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Available Dorm Cooking Facilities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'kettle-only' as DormFacilities,
                    label: 'Kettle Only',
                    desc: 'Hot water, oats, boiled eggs, tea',
                  },
                  {
                    id: 'microwave-kettle' as DormFacilities,
                    label: 'Microwave + Kettle',
                    desc: 'Mug scrambled eggs, rice, steam veggies',
                  },
                  {
                    id: 'full-shared-kitchen' as DormFacilities,
                    label: 'Shared Kitchen',
                    desc: 'Stovetop, oven, fridge access',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, dormFacilities: item.id })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.dormFacilities === item.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white mb-0.5">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Fitness Goals & Zero-Hardware Routines */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Fitness Goal & Training Setup</h3>
              <p className="text-xs text-slate-400">
                Tailored for small dorm rooms, study breaks, and outdoor campus staircases.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Primary Goal this Semester
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'stress-relief', label: 'Exam Stress Relief & Energy', sub: 'Lowers cortisol, boosts focus' },
                  { id: 'muscle-tone', label: 'Dorm Calisthenics & Strength', sub: 'Bodyweight + textbook loads' },
                  { id: 'fat-loss', label: 'Daily Step Flushes & Fat Loss', sub: 'Campus walks + interval circuits' },
                  { id: 'endurance', label: 'Study Stamina & Posture', sub: 'Desk hunch fixes + spine relief' },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, fitnessGoal: g.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.fitnessGoal === g.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white mb-0.5">{g.label}</div>
                    <div className="text-[10px] text-slate-400">{g.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Training Space
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'dorm-room', label: 'Dorm Room', icon: '🛏️' },
                  { id: 'campus-outdoors', label: 'Campus Quad / Stairs', icon: '🏛️' },
                  { id: 'student-rec-gym', label: 'Campus Free Rec Center', icon: '🏋️' },
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredLocation: loc.id as any })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.preferredLocation === loc.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xl mb-1">{loc.icon}</div>
                    <div className="text-xs font-medium text-slate-200">{loc.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Phone Sensor Sync ($0 Smartwatch) */}
      {step === 4 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Phone Sensor Permissions</h3>
              <p className="text-xs text-slate-400">
                Enable built-in phone hardware to continuously measure activity and sleep without buying any gadget.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Google Fit Integration Card */}
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
                  G
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Google Fit API (Android)</h4>
                  <p className="text-[11px] text-slate-400">
                    Reads phone accelerometer, step cadence, and screen-off sleep cycles.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sensorConnected.googleFit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sensorConnected: { ...formData.sensorConnected, googleFit: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Apple HealthKit Integration Card */}
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold text-sm">
                  
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Apple HealthKit (iOS)</h4>
                  <p className="text-[11px] text-slate-400">
                    CoreMotion pedometer, flights climbed, and resting duration.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sensorConnected.appleHealth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sensorConnected: { ...formData.sensorConnected, appleHealth: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Privacy & Supabase RLS Notice */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Protected by <strong>Supabase Row Level Security</strong>. Your health telemetry is locked to your student user ID only.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          {step === totalSteps ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Generate Baseline Plan
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
