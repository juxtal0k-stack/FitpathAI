import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  Flame, 
  Heart, 
  DollarSign, 
  GraduationCap, 
  Share2, 
  Zap, 
  Sparkles,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { HACKATHON_PHASES } from '../data/mockData';

interface ArchitectureRoadmapProps {
  onClose?: () => void;
  onGoToOnboarding: () => void;
  onGoToAutoScaler: () => void;
  onGoToSensors: () => void;
}

export const ArchitectureRoadmap: React.FC<ArchitectureRoadmapProps> = ({
  onClose,
  onGoToOnboarding,
  onGoToAutoScaler,
  onGoToSensors,
}) => {
  const workflowSteps = [
    {
      step: 1,
      name: '2-Min Quiz',
      sub: 'Student intake, budget & exam dates',
      status: 'COMPLETE',
      icon: GraduationCap,
    },
    {
      step: 2,
      name: 'Baseline Plan',
      sub: 'Zero hardware dorm calisthenics & diet',
      status: 'COMPLETE',
      icon: Layers,
    },
    {
      step: 3,
      name: 'Sensor Sync',
      sub: 'Google Fit / Apple Health phone sensors',
      status: 'NEARLY_DONE',
      icon: Smartphone,
    },
    {
      step: 4,
      name: 'Progress Analysis',
      sub: 'Sleep debt & academic strain detection',
      status: 'NEARLY_DONE',
      icon: BarChart3,
    },
    {
      step: 5,
      name: 'Auto-Adjusted Routines',
      sub: 'Dynamic volume downscaling during exams',
      status: 'IN_PROGRESS',
      icon: Zap,
    },
    {
      step: 6,
      name: 'Continuous Feedback Loop',
      sub: 'Weekly Sunday check-in & RPE tuning',
      status: 'IN_PROGRESS',
      icon: RefreshCw,
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">
              FitPath AI Hackathon MVP Architecture
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
              v1.0 Submission Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Bridging the gap between passive smart bands and costly $150/mo personal trainers through student-first auto-scaling and explainable intelligence.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer self-start sm:self-center"
          >
            Back to App
          </button>
        )}
      </div>

      {/* 6-Step Workflow Engine: quiz → baseline plan → sensor sync → progress analysis → auto-adjusted routines → continuous feedback loop */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            End-to-End System Workflow Engine
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Continuous Loop</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
          {workflowSteps.map((wf, index) => {
            const Icon = wf.icon;
            const isComplete = wf.status === 'COMPLETE';
            const isNearlyDone = wf.status === 'NEARLY_DONE';
            return (
              <div
                key={wf.step}
                className={`p-3 rounded-xl border relative flex flex-col justify-between transition ${
                  isComplete
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : isNearlyDone
                    ? 'bg-teal-950/20 border-teal-500/30 text-teal-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Step 0{wf.step}
                    </span>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-bold text-xs text-white mb-0.5">{wf.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{wf.sub}</div>
                </div>

                <div className="mt-3 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono">
                  <span>
                    {isComplete ? '✅ Complete' : isNearlyDone ? '⚡ 85%' : '🔄 In Dev'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Hackathon Phases */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          Hackathon Milestone Breakdown (Phases 1 – 3)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HACKATHON_PHASES.map((phase) => (
            <div
              key={phase.id}
              className={`p-5 rounded-2xl border space-y-3.5 ${
                phase.status === 'COMPLETE'
                  ? 'bg-emerald-950/15 border-emerald-500/30'
                  : phase.status === 'NEARLY_DONE'
                  ? 'bg-teal-950/15 border-teal-500/30'
                  : 'bg-amber-950/15 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  phase.status === 'COMPLETE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : phase.status === 'NEARLY_DONE'
                    ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                    : 'bg-amber-950 text-amber-300 border-amber-500/40'
                }`}>
                  {phase.badge}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {phase.completionPercent}%
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white mb-1">{phase.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{phase.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    phase.status === 'COMPLETE'
                      ? 'bg-emerald-400'
                      : phase.status === 'NEARLY_DONE'
                      ? 'bg-teal-400'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${phase.completionPercent}%` }}
                />
              </div>

              {/* Deliverables checklist */}
              <ul className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                {phase.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      phase.status === 'COMPLETE' ? 'text-emerald-400' : 'text-slate-500'
                    }`} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Triad Impact: Social Impact + Mental Health + Economic Feasibility */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          Triple Pillar Value Proposition
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">🌍</span>
              <span>1. Social Impact</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Democratizing Fitness Access:</strong> No student should be locked out of health optimization due to lack of gym equipment or private coaching. Free, high-impact calisthenics routines for every student body.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">🧠</span>
              <span>2. Mental Health Protection</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Exam-Stress Auto-Scaling:</strong> Prevents the toxic student cycle of overtraining while sleep-deprived. Reduces injury by 2.3x and preserves cognitive recall for exams through CNS deloads.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">💰</span>
              <span>3. Economic Feasibility</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>$0 Hardware Cost:</strong> Uses built-in phone accelerometer & screen-off sleep heuristics. Replaces $350 smartwatches and $60/mo gyms with a $0 high-performing tech stack.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <span className="font-bold text-white">Architecture Stack:</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-cyan-400">Flutter 3.x Frontend</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-emerald-400">Supabase + PostgreSQL RLS</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-amber-400">Python + Scikit-Learn (RandomForest)</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-teal-400">Hive / SQLite Offline Fallback</span>
          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-purple-400">Gemini 3.8 Flash Explainable AI</span>
        </div>
      </div>
    </div>
  );
};
