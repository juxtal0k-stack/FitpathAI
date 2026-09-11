import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  X, 
  CheckCircle2, 
  Smartphone, 
  Brain, 
  Utensils, 
  ShieldCheck, 
  Cpu, 
  RotateCcw, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { ThemeConfig } from '../theme';

interface SIHPrototypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPreset: (presetKey: 'rohan' | 'priya' | 'arjun') => void;
  onResetData: () => void;
  theme: ThemeConfig;
}

export const SIHPrototypeModal: React.FC<SIHPrototypeModalProps> = ({
  isOpen,
  onClose,
  onLoadPreset,
  onResetData,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-2xl rounded-2xl ${theme.surfaceClass} border ${theme.borderClass} shadow-2xl overflow-hidden my-auto text-slate-900`}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold tracking-wider uppercase mb-2">
            <Award className="w-3.5 h-3.5" />
            Smart India Hackathon • SIH Prototype
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
            Zero-Hardware Student Wellness & Ergonomics System
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Problem Statement: High student burnout, postural desk deformities & junk diets during high-stress exam cycles.
          </p>
        </div>

        {/* Prototype Core Highlights */}
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border ${theme.borderClass} ${theme.bgClass} flex items-start gap-3`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">1. Zero-Hardware Tracking</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Eliminates the ₹15,000 smartwatch barrier. Employs phone accelerometer cadence and screen-off sleep heuristics.
                </p>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border ${theme.borderClass} ${theme.bgClass} flex items-start gap-3`}>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">2. Cortisol Auto-Scaler</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Real-time heuristic detects exam proximity & sleep deficit, dynamically switching workouts from heavy fatigue to restorative decompression.
                </p>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border ${theme.borderClass} ${theme.bgClass} flex items-start gap-3`}>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">3. Sub-₹120 Hostel Nutrition</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Engineers high-bioavailability protein meals cooked strictly using electric kettles and microwaves with zero stove requirement.
                </p>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border ${theme.borderClass} ${theme.bgClass} flex items-start gap-3`}>
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">4. Clinical Ergonomic Safety</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Automatically substitutes axial spinal compression and high-impact knee tracking with isometric stability holds.
                </p>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Evaluation Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Click Evaluator Testing Personas
              </h3>
              <span className="text-[11px] text-emerald-600 font-medium">Instant Live Demonstration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Persona 1: Rohan */}
              <button
                onClick={() => {
                  onLoadPreset('rohan');
                  onClose();
                }}
                className={`p-3 rounded-xl border ${theme.borderClass} hover:border-emerald-500 text-left transition hover:shadow-md bg-white cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Rohan (Exam Deload)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    SIH Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Exams in 4 Days • Desk Neck Strain • Deload Active • $3.50/day
                </p>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Load Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Persona 2: Priya */}
              <button
                onClick={() => {
                  onLoadPreset('priya');
                  onClose();
                }}
                className={`p-3 rounded-xl border ${theme.borderClass} hover:border-indigo-500 text-left transition hover:shadow-md bg-white cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Priya (Posture Rehab)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                    Clinical
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Medical Intern • Lower Back Pain • Kettle Only • Vegetarian
                </p>
                <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Load Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              {/* Persona 3: Arjun */}
              <button
                onClick={() => {
                  onLoadPreset('arjun');
                  onClose();
                }}
                className={`p-3 rounded-xl border ${theme.borderClass} hover:border-amber-500 text-left transition hover:shadow-md bg-white cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Arjun (Conditioning)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                    High Volume
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2">
                  Exams in 20 Days • Progressive Overload • High Protein
                </p>
                <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Load Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 text-center sm:text-left">
              Want to evaluate from scratch? Reset wipes stored data and restarts onboarding.
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetData();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-rose-400 hover:text-rose-700 text-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset / Cold Onboarding</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
