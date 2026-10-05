import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HeartPulse, 
  ShieldCheck, 
  CheckCircle2, 
  Brain,
  Timer
} from 'lucide-react';
import { playBreathingChime } from '../utils/soundEffects';

interface CalmBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCalmSession?: (cyclesCompleted: number, durationMinutes: number) => void;
}

type BreathPhase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'complete';

const PHASE_DURATIONS: Record<'inhale' | 'hold' | 'exhale', number> = {
  inhale: 4,
  hold: 7,
  exhale: 8,
};

export const CalmBreathingModal: React.FC<CalmBreathingModalProps> = ({
  isOpen,
  onClose,
  onLogCalmSession,
}) => {
  const [phase, setPhase] = useState<BreathPhase>('ready');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [targetCycles, setTargetCycles] = useState<number>(4);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasLoggedSession, setHasLoggedSession] = useState<boolean>(false);

  const phaseRef = useRef<BreathPhase>('ready');
  const secondsLeftRef = useRef<number>(4);
  const currentCycleRef = useRef<number>(1);
  const targetCyclesRef = useRef<number>(4);
  const soundEnabledRef = useRef<boolean>(true);

  // Keep refs in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    currentCycleRef.current = currentCycle;
  }, [currentCycle]);

  useEffect(() => {
    targetCyclesRef.current = targetCycles;
  }, [targetCycles]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Main 1-second interval breathing loop
  useEffect(() => {
    if (!isOpen || !isActive || phase === 'ready' || phase === 'complete') {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prevSec) => {
        if (prevSec > 1) {
          return prevSec - 1;
        }

        // Phase finished, transition to next phase
        const currentP = phaseRef.current;
        if (currentP === 'inhale') {
          setPhase('hold');
          if (soundEnabledRef.current) playBreathingChime('hold');
          return PHASE_DURATIONS.hold;
        } else if (currentP === 'hold') {
          setPhase('exhale');
          if (soundEnabledRef.current) playBreathingChime('exhale');
          return PHASE_DURATIONS.exhale;
        } else if (currentP === 'exhale') {
          // Check if more cycles remain
          if (currentCycleRef.current < targetCyclesRef.current) {
            setCurrentCycle((c) => c + 1);
            setPhase('inhale');
            if (soundEnabledRef.current) playBreathingChime('inhale');
            return PHASE_DURATIONS.inhale;
          } else {
            // All cycles complete
            setPhase('complete');
            setIsActive(false);
            if (soundEnabledRef.current) playBreathingChime('complete');
            return 0;
          }
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, phase]);

  // Start exercise
  const handleStart = () => {
    setPhase('inhale');
    setSecondsLeft(PHASE_DURATIONS.inhale);
    setCurrentCycle(1);
    setIsActive(true);
    if (soundEnabled) playBreathingChime('inhale');
  };

  // Pause / Resume
  const handleTogglePlay = () => {
    if (phase === 'ready' || phase === 'complete') {
      handleStart();
      return;
    }
    setIsActive((prev) => !prev);
  };

  // Reset
  const handleReset = () => {
    setIsActive(false);
    setPhase('ready');
    setSecondsLeft(PHASE_DURATIONS.inhale);
    setCurrentCycle(1);
  };

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Guidance copy based on current phase
  const getPhaseInstruction = () => {
    switch (phase) {
      case 'ready':
        return {
          title: 'Ready for Deep Calm',
          subtitle: 'Sit comfortably upright, relax your shoulders, and press Start.',
          step: 'Prep',
        };
      case 'inhale':
        return {
          title: 'Inhale through Nose',
          subtitle: 'Breathe in quietly and deeply, expanding your belly and diaphragm.',
          step: '4 Seconds',
        };
      case 'hold':
        return {
          title: 'Hold Breath Softly',
          subtitle: 'Keep your breath held effortlessly without straining your neck.',
          step: '7 Seconds',
        };
      case 'exhale':
        return {
          title: 'Exhale through Mouth',
          subtitle: 'Release all tension with a gentle, continuous whoosh through your lips.',
          step: '8 Seconds',
        };
      case 'complete':
        return {
          title: 'Nervous System Reset',
          subtitle: 'Your vagus nerve is activated and acute cortisol levels have dropped.',
          step: 'Done',
        };
    }
  };

  const instruction = getPhaseInstruction();

  // Scale computation for breathing visual
  const getOrbScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.45;
      case 'hold':
        return 1.45;
      case 'exhale':
        return 0.85;
      default:
        return 1.0;
    }
  };

  const getTransitionDuration = () => {
    switch (phase) {
      case 'inhale':
        return 4;
      case 'hold':
        return 0.3;
      case 'exhale':
        return 8;
      default:
        return 0.5;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white relative"
      >
        {/* Subtle Ambient Background Gradient */}
        <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xs">
              <Wind className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>4-7-8 Calm Breathing</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
                  Instant Stress Relief
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Pioneered for instant vagal nerve stimulation & cortisol reduction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`p-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition cursor-pointer text-slate-400 hover:text-white ${
                soundEnabled ? 'text-emerald-400' : 'text-slate-500'
              }`}
              title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 transition cursor-pointer text-slate-400 hover:text-white"
              title="Close breathing exercise"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 flex flex-col items-center justify-center relative z-10 space-y-6">
          
          {/* Target Cycles Selector (when not active or ready) */}
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Cycles:</span>
            </span>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {[2, 4, 8].map((cycles) => (
                <button
                  key={cycles}
                  disabled={isActive}
                  onClick={() => {
                    setTargetCycles(cycles);
                    if (currentCycle > cycles) setCurrentCycle(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    targetCycles === cycles
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'text-slate-400 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {cycles} {cycles === 4 ? 'Standard' : cycles === 2 ? 'Quick' : 'Deep'}
                </button>
              ))}
            </div>
          </div>

          {/* Cycle Progress Tracker */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Cycle {phase === 'complete' ? targetCycles : currentCycle} of {targetCycles}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: targetCycles }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx + 1 < currentCycle || phase === 'complete'
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                      : idx + 1 === currentCycle
                      ? 'bg-emerald-400 animate-ping'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CENTRAL GUIDED VISUAL ANIMATION */}
          <div className="relative w-64 h-64 flex items-center justify-center my-2">
            
            {/* Outer Subtle Pulse Rings */}
            <motion.div
              animate={{
                scale: phase === 'inhale' ? [1, 1.35] : phase === 'hold' ? 1.35 : [1.35, 1],
                opacity: phase === 'hold' ? [0.25, 0.45, 0.25] : [0.15, 0.35],
              }}
              transition={{
                duration: getTransitionDuration(),
                repeat: phase === 'hold' ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="absolute w-56 h-56 rounded-full border border-emerald-500/30 bg-emerald-500/5 pointer-events-none"
            />

            <motion.div
              animate={{
                scale: phase === 'inhale' ? [1, 1.2] : phase === 'hold' ? 1.2 : [1.2, 1],
                opacity: phase === 'hold' ? [0.35, 0.6, 0.35] : [0.2, 0.5],
              }}
              transition={{
                duration: getTransitionDuration(),
                repeat: phase === 'hold' ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="absolute w-44 h-44 rounded-full border border-teal-500/40 bg-teal-500/10 pointer-events-none"
            />

            {/* Central Interactive Breathing Sphere */}
            <motion.div
              animate={{
                scale: getOrbScale(),
              }}
              transition={{
                duration: getTransitionDuration(),
                ease: 'easeInOut',
              }}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl relative transition-colors duration-700 ${
                phase === 'inhale'
                  ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 shadow-emerald-500/40 ring-4 ring-emerald-400/30'
                  : phase === 'hold'
                  ? 'bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-500 shadow-cyan-500/40 ring-4 ring-cyan-400/40'
                  : phase === 'exhale'
                  ? 'bg-gradient-to-tr from-teal-800 via-emerald-900 to-slate-900 shadow-teal-500/20 ring-4 ring-teal-500/20'
                  : phase === 'complete'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/40'
                  : 'bg-gradient-to-tr from-slate-800 to-slate-900 shadow-slate-950 ring-2 ring-slate-800'
              }`}
            >
              {/* Central Seconds Countdown */}
              {phase === 'ready' ? (
                <div className="text-center">
                  <Wind className="w-8 h-8 text-emerald-400 mx-auto mb-1 opacity-90" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    4-7-8
                  </span>
                </div>
              ) : phase === 'complete' ? (
                <div className="text-center">
                  <CheckCircle2 className="w-9 h-9 text-white mx-auto mb-0.5 animate-bounce" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-white">
                    Calm
                  </span>
                </div>
              ) : (
                <div className="text-center select-none">
                  <motion.span
                    key={`${phase}-${secondsLeft}`}
                    initial={{ opacity: 0.6, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-black tracking-tight text-white block drop-shadow-md"
                  >
                    {secondsLeft}s
                  </motion.span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200 block mt-0.5">
                    {phase}
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Dynamic Phase Instructions */}
          <div className="text-center space-y-1 max-w-sm">
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {instruction.title}
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {instruction.subtitle}
            </p>
          </div>

          {/* Physiological Benefit Highlight Banner */}
          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Vagal Nerve Stimulation</span>
                <span className="text-[11px] text-slate-400">
                  {phase === 'hold' ? 'Oxygen diffusion into bloodstream' : phase === 'exhale' ? 'Slowing cardiac pacemaker rhythm' : 'Deep respiratory sinus arrhythmia'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-emerald-400 text-xs block">-28% Cortisol</span>
              <span className="text-[10px] text-slate-500">Clinical est.</span>
            </div>
          </div>

          {/* Primary Action Controls */}
          <div className="flex items-center gap-3 w-full pt-1">
            <button
              onClick={handleReset}
              className="p-3 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
              title="Reset breathing cycle"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="flex-1 py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {phase === 'ready' || phase === 'complete' ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start 4-7-8 Breathing</span>
                </>
              ) : isActive ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Exercise</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Breathing</span>
                </>
              )}
            </button>

            {phase === 'complete' && (
              <button
                onClick={() => {
                  if (onLogCalmSession && !hasLoggedSession) {
                    const durationMins = Math.round((targetCycles * 19) / 60) || 2;
                    onLogCalmSession(targetCycles, durationMins);
                    setHasLoggedSession(true);
                  }
                  onClose();
                }}
                className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save & Finish</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
