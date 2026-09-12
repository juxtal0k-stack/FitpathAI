import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Wind, 
  Home, 
  Dumbbell, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Layers,
  Activity,
  Droplet,
  HeartPulse
} from 'lucide-react';
import { ExerciseStepGuide } from '../types';
import { playStartChime, playRestChime, playFinishChime, playWaterChime } from '../utils/soundEffects';

interface ExerciseStepGuideModalProps {
  guide: ExerciseStepGuide | null;
  isOpen: boolean;
  onClose: () => void;
  onLogWater?: (glasses: number) => void;
}

export const ExerciseStepGuideModal: React.FC<ExerciseStepGuideModalProps> = ({
  guide,
  isOpen,
  onClose,
  onLogWater,
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'safety' | 'prevention' | 'breathing' | 'mistakes' | 'modifications'>('steps');
  
  // Timers: Work vs Rest
  const [timerMode, setTimerMode] = useState<'work' | 'rest'>('work');
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [waterLoggedToast, setWaterLoggedToast] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      if (timerMode === 'work') {
        // Switch to rest reminder!
        playRestChime();
        setTimerMode('rest');
        setTimerSeconds(45);
      } else {
        // Rest completed
        playFinishChime();
        setIsTimerRunning(false);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    if (timerMode === 'work') {
      playStartChime();
    } else {
      playRestChime();
    }
  };

  const handleDrinkWater = () => {
    if (onLogWater) {
      onLogWater(1);
    }
    playWaterChime();
    setWaterLoggedToast(true);
    setTimeout(() => setWaterLoggedToast(false), 2500);
  };

  if (!isOpen || !guide) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  Zero Equipment Guide
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {guide.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {guide.difficulty}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white tracking-tight pt-1">
                {guide.name}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                🎯 Primary: <span className="font-bold text-slate-900 dark:text-white">{guide.targetMuscles.primary}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Tab Selector */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('steps')}
              className={`py-3 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'steps'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Step Instructions
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`py-3 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'safety'
                  ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              Medical & Posture Safety
            </button>

            <button
              onClick={() => setActiveTab('prevention')}
              className={`py-3 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'prevention'
                  ? 'border-rose-600 text-rose-700 dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              Injury Prevention
            </button>

            <button
              onClick={() => setActiveTab('breathing')}
              className={`py-3 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'breathing'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              Breathing Pattern
            </button>

            <button
              onClick={() => setActiveTab('mistakes')}
              className={`py-3 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mistakes'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Common Mistakes
            </button>

            <button
              onClick={() => setActiveTab('modifications')}
              className={`py-3 px-3 border-b-2 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'modifications'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Zero-Equipment Scaling
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-5 overflow-y-auto space-y-4 text-slate-900 dark:text-slate-100 flex-1">
            {/* Equipment & Recommended Cadence Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                  Equipment Needed
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {guide.equipmentNeeded}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                  Recommended Target
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {guide.recommendedRepsOrTime}
                </p>
              </div>
            </div>

            {/* TAB 1: STEP-BY-STEP EXECUTION */}
            {activeTab === 'steps' && (
              <div className="space-y-4">
                {/* Starting Position */}
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Starting Position Setup
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {guide.startingPosition}
                  </p>
                </div>

                {/* Steps List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase font-bold text-slate-700 dark:text-slate-300 tracking-wider">
                    Execution Steps
                  </h4>
                  {guide.stepByStepExecution.map((step, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-emerald-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Posture Checks */}
                <div className="bg-slate-100 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Key Alignment Checkpoints
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {guide.postureChecks.map((chk, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: MEDICAL SAFETY RULES & CORRECT POSTURES */}
            {activeTab === 'safety' && (
              <div className="space-y-4">
                {/* Specific Medical Safety Rule */}
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                      Medical & Joint Safety Rule
                    </h4>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                    {guide.medicalSafetyRule || 'Maintain neutral spinal curves and avoid rapid ballistic changes in motion.'}
                  </p>
                </div>

                {/* 4-Point Posture Alignment */}
                {guide.correctPostureChecklist && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs uppercase font-bold text-slate-700 dark:text-slate-300 tracking-wider">
                      4-Point Anatomical Posture Checklist
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                          👤 Head & Cervical Spine
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          {guide.correctPostureChecklist.headAndNeck}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                          🛡️ Torso & Thoracic / Lumbar Spine
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          {guide.correctPostureChecklist.torsoAndSpine}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                          ⚖️ Pelvis & Sacroiliac Alignment
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          {guide.correctPostureChecklist.pelvisAndHips}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-black text-slate-900 dark:text-white flex items-center gap-1">
                          🦵 Limbs, Knees & Joint Tracking
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                          {guide.correctPostureChecklist.limbsAndJoints}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: INJURY PREVENTION & CONTRAINDICATIONS */}
            {activeTab === 'prevention' && (
              <div className="space-y-4">
                {guide.injuryPrevention && (
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-200">
                        Primary Injury Risk: {guide.injuryPrevention.primaryRisk}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-800 dark:text-slate-200 space-y-1.5 pt-1">
                      <p>
                        <strong>Active Prevention Technique:</strong> {guide.injuryPrevention.preventionTechnique}
                      </p>
                      <p className="text-rose-800 dark:text-rose-300 font-medium">
                        <strong>Biomechanical Cue:</strong> {guide.injuryPrevention.anatomicalCue}
                      </p>
                    </div>
                  </div>
                )}

                {guide.contraindications && guide.contraindications.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                      Clinical Contraindications (Modify or Avoid If):
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {guide.contraindications.map((contra, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{contra}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: BREATHING PATTERN */}
            {activeTab === 'breathing' && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    <Wind className="w-4 h-4 text-blue-600" />
                    Optimal Respiratory Cadence
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-800 dark:text-slate-200">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50">
                      <strong className="text-blue-700 dark:text-blue-400 block mb-0.5">💨 INHALE PHASE:</strong>
                      {guide.breathingCues.inhale}
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50">
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">🔥 EXHALE PHASE:</strong>
                      {guide.breathingCues.exhale}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: COMMON MISTAKES */}
            {activeTab === 'mistakes' && (
              <div className="space-y-3">
                {guide.commonMistakes.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Mistake: {item.mistake}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium pl-5">
                      ✅ <strong>Correction:</strong> {item.correction}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: ZERO-EQUIPMENT SCALING */}
            {activeTab === 'modifications' && (
              <div className="space-y-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-emerald-600" />
                    Home & Dorm Room Adaptations
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    No gym equipment or weights required. Scale this exercise instantly using your room's natural layout:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      🟢 Beginner / Easier Regression
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {guide.homeModifications.easier}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      🔥 Advanced / Harder Progression
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {guide.homeModifications.harder}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Practice Interval & Rest Reminder Timer Bar */}
            <div className={`p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white transition-all ${
              timerMode === 'work' ? 'bg-slate-900 dark:bg-slate-950' : 'bg-sky-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center font-mono font-black text-base shrink-0">
                  {timerSeconds}s
                </div>
                <div>
                  <span className="text-xs font-bold block">
                    {timerMode === 'work' ? '⚡ Active Exercise Cadence Timer' : '💧 Rest Interval & Hydration Break'}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {timerMode === 'work' 
                      ? 'Practice set with strict posture alignment' 
                      : 'Take a deep breath and sip a glass of water'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {timerMode === 'rest' && (
                  <button
                    onClick={handleDrinkWater}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Droplet className="w-3.5 h-3.5 fill-white" />
                    + Drink Water
                  </button>
                )}

                <button
                  onClick={isTimerRunning ? () => setIsTimerRunning(false) : handleStartTimer}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerMode('work');
                    setTimerSeconds(45);
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors cursor-pointer"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {waterLoggedToast && (
              <div className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                💧 +250ml water logged to your daily tracker!
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              💡 Form quality and joint safety always precede rep count.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
