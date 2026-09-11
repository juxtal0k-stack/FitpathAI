import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Presentation, 
  X, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Dumbbell, 
  Brain, 
  Scale, 
  Utensils, 
  Lock, 
  Smartphone,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { ThemeConfig } from '../theme';
import { ActiveNavTab } from './Header';

interface PresentationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveNavTab) => void;
  onLoadPreset: (presetKey: 'rohan' | 'priya' | 'arjun') => void;
  onOpenLockScreen: () => void;
  theme: ThemeConfig;
}

type GuideTab = 'pitches' | 'demo' | 'qa' | 'matrix';

export const PresentationGuideModal: React.FC<PresentationGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onLoadPreset,
  onOpenLockScreen,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('demo');
  const [pitchMode, setPitchMode] = useState<'30s' | '2m' | '5m'>('2m');
  const [expandedQa, setExpandedQa] = useState<number | null>(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Load Rohan Sharma Preset (4d to Exams)',
      description: 'Demonstrates a real student persona with upcoming semester exams, 5.5h sleep, and desk neck strain.',
      tabTarget: 'routine' as ActiveNavTab,
      action: () => onLoadPreset('rohan'),
      actionLabel: 'Load Rohan Preset',
      icon: Dumbbell,
      color: 'emerald',
    },
    {
      step: 2,
      title: 'Examine Auto-Scaled Workout & AI Explanation',
      description: 'Showcase how the 35m heavy session down-regulates to an 18m restorative mobility session with biological reasoning.',
      tabTarget: 'routine' as ActiveNavTab,
      action: () => onNavigateTab('routine'),
      actionLabel: 'View Workout Tab',
      icon: Brain,
      color: 'indigo',
    },
    {
      step: 3,
      title: 'Simulate Exam Proximity in Stress Auto-Scaler',
      description: 'Drag the exam proximity slider from 4 days to 18 days to show dynamic real-time periodization.',
      tabTarget: 'scaler' as ActiveNavTab,
      action: () => onNavigateTab('scaler'),
      actionLabel: 'Open Exam Adjuster',
      icon: Brain,
      color: 'purple',
    },
    {
      step: 4,
      title: 'Show Physical Measures (BMI, TDEE, Calorie Targets)',
      description: 'Highlight clinical biometric calculations tailored to sedentary student study schedules.',
      tabTarget: 'measures' as ActiveNavTab,
      action: () => onNavigateTab('measures'),
      actionLabel: 'Open Physical Measures',
      icon: Scale,
      color: 'blue',
    },
    {
      step: 5,
      title: 'Live Query in Food Nutrition Analyzer',
      description: 'Type any natural language food query to calculate exact macros, cognitive impact, and student affordability.',
      tabTarget: 'nutrition' as ActiveNavTab,
      action: () => onNavigateTab('nutrition'),
      actionLabel: 'Open Food Analyzer',
      icon: Sparkles,
      color: 'amber',
    },
    {
      step: 6,
      title: 'Show Sub-₹120 Dorm Nutrition Plan',
      description: 'Demonstrate budget-friendly recipes cookable strictly using only a kettle or microwave with no stove.',
      tabTarget: 'diet' as ActiveNavTab,
      action: () => onNavigateTab('diet'),
      actionLabel: 'Open Dorm Meals',
      icon: Utensils,
      color: 'emerald',
    },
    {
      step: 7,
      title: 'Launch Lock Screen Glance Simulator',
      description: 'Showcase ambient zero-distraction phone lock screen widget with exam countdown & recovery pill.',
      tabTarget: 'routine' as ActiveNavTab,
      action: () => {
        onClose();
        onOpenLockScreen();
      },
      actionLabel: 'Open Lock Screen',
      icon: Lock,
      color: 'teal',
    },
    {
      step: 8,
      title: 'Verify Phone Sensor Telemetry Hub',
      description: 'Prove zero-hardware architecture with mobile accelerometer cadence and screen-off sleep heuristics.',
      tabTarget: 'sensors' as ActiveNavTab,
      action: () => onNavigateTab('sensors'),
      actionLabel: 'Open Health Sync',
      icon: Smartphone,
      color: 'slate',
    },
  ];

  const qaItems = [
    {
      q: 'How does FitPath track metrics without any smartwatch or wearable?',
      a: 'Modern smartphones contain high-precision 3-axis accelerometers. Using HTML5 DeviceMotion and Generic Sensor APIs, we calculate step cadence (RPM) and activity intervals. For sleep, screen-inactivity heuristics track the window between nocturnal screen lock and morning alarm unlock, which research proves correlates >85% with sleep opportunity in students.',
    },
    {
      q: 'How does the system handle Gemini API rate limits or network issues?',
      a: 'We built a resilient multi-model pipeline in server.ts: gemini-3.1-flash-lite acts as primary with automatic fallback to gemini-3.8-flash, backed by exponential backoff retries for 503/429 spikes. If completely offline, an integrated clinical database serves verified routines and meal plans seamlessly.',
    },
    {
      q: 'Why scale workouts down before exams instead of training harder?',
      a: 'Intense physical training is an added systemic stressor. When academic stress is at an 8/10 and sleep is under 6 hours, high-intensity workouts elevate cortisol, risk injury, and deplete glycogen needed by the prefrontal cortex for memory recall. Scaling down to restorative mobility preserves physical habit while optimizing exam cognitive output.',
    },
    {
      q: 'How are meals kept strictly under ₹120 ($1.50 - $4.00) per day?',
      a: 'Our recipes rely exclusively on high-protein, bio-available staples: whole eggs, rolled oats, lentils, canned black beans, and peanut butter. Every meal is formulated specifically for kettle or microwave preparation with zero stove or blender requirements.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`w-full max-w-3xl rounded-2xl ${theme.surfaceClass} border ${theme.borderClass} shadow-2xl overflow-hidden my-auto text-slate-900 flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative border-b border-indigo-900/50 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
              <Presentation className="w-3.5 h-3.5" />
              Presentation & Pitch Dossier
            </span>
            <span className="text-xs text-slate-400">• SIH Demo Companion</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            FitPath Presentation & Demonstration Guide
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Follow this step-by-step presentation script and live demo sequence to showcase the app to jury members.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'demo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Live Demo Sequence (8 Steps)</span>
          </button>

          <button
            onClick={() => setActiveTab('pitches')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'pitches'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Verbal Pitch Scripts</span>
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'qa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Judge Q&A Defense</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Value Comparison Matrix</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: LIVE DEMO SEQUENCE */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">
                  Follow this exact order during your presentation. Click any step to jump straight into that feature!
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Total Time: ~3 mins
                </span>
              </div>

              <div className="space-y-2">
                {demoSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className={`p-3.5 rounded-xl border ${theme.borderClass} ${theme.bgClass} flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-400 transition`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-emerald-600" />
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          item.action();
                          onClose();
                        }}
                        className="self-end sm:self-center shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{item.actionLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: VERBAL PITCH SCRIPTS */}
          {activeTab === 'pitches' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setPitchMode('30s')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    pitchMode === '30s' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  30-Second Elevator Pitch
                </button>
                <button
                  onClick={() => setPitchMode('2m')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    pitchMode === '2m' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2-Minute SIH Round Pitch
                </button>
                <button
                  onClick={() => setPitchMode('5m')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    pitchMode === '5m' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5-Minute Deep Dive
                </button>
              </div>

              {pitchMode === '30s' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Fast & High Impact</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
                    "Over 80% of university students abandon fitness routines during exam periods due to high stress, zero budget, and lack of expensive wearables. FitPath AI is a zero-hardware health companion engineered specifically for students. It replaces smartwatches using phone accelerometer sensors, automatically scales workout intensity down when exams approach to prevent cortisol burnout, and calculates complete daily nutrition for under ₹120 using dorm appliances like a microwave or kettle. Powered by Google Gemini with dual-model fallback resilience, FitPath democratizes wellness for every student with a smartphone."
                  </p>
                </div>
              )}

              {pitchMode === '2m' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Part 1: The Problem (30s)</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      "Traditional fitness tech has a massive privilege bias: it assumes the user can afford a ₹15,000 smartwatch, a ₹2,500/month gym membership, and hours to meal-prep in a fully equipped kitchen. For hostel and university students facing semester exams, this is completely unrealistic. When academic stress peaks, students don't need heavy deadlifts—they need posture recovery, adequate sleep, and affordable nutrition."
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Part 2: The Three Innovations (60s)</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      "FitPath AI solves this through three zero-hardware pillars: First, Zero-Hardware Phone Telemetry extracting step cadence and sleep heuristics directly from phone sensors. Second, the Exam Cortisol Auto-Scaler that down-regulates 35-minute workouts to 18-minute restorative decompression when exams are within 7 days, supported by Gemini biological explanations. Third, Sub-₹120 Dorm Nutrition & AI Food Analyzer calculating exact macros and brain-fuel nutrients from plain English food queries."
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Part 3: Impact & Scalability (30s)</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      "FitPath is deployed as an offline-capable PWA with multi-model fallback resilience (gemini-3.1-flash-lite and gemini-3.8-flash) and zero hardware cost. We empower every student to stay healthy without spending a single rupee."
                    </p>
                  </div>
                </div>
              )}

              {pitchMode === '5m' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    <strong>1. Clinical Ergonomics:</strong> Students suffer from forward head posture ('text neck') and thoracic kyphosis from 8+ hours of desk study. FitPath targets isometric deep cervical flexors and glute medius stabilizers rather than generic cardio.
                  </p>
                  <p>
                    <strong>2. Explainable Periodization:</strong> Traditional fitness streaks induce psychological guilt when exams interfere. FitPath's Explainable AI validates deloading as a strategic, evidence-based phase of athletic periodization.
                  </p>
                  <p>
                    <strong>3. Resilient Architecture:</strong> The backend employs automatic model cascading with exponential backoff and deterministic clinical database fallback, ensuring 100% uptime during spotty hostel Wi-Fi.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: JUDGE Q&A DEFENSE */}
          {activeTab === 'qa' && (
            <div className="space-y-2.5">
              {qaItems.map((item, index) => {
                const isOpen = expandedQa === index;
                return (
                  <div
                    key={index}
                    className={`rounded-xl border ${theme.borderClass} ${theme.bgClass} overflow-hidden transition`}
                  >
                    <button
                      onClick={() => setExpandedQa(isOpen ? null : index)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                          Q
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.q}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-bold">{isOpen ? '−' : '+'}</span>
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                        <strong className="text-emerald-600 font-semibold block mb-1">Recommended Response:</strong>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: VALUE MATRIX */}
          {activeTab === 'matrix' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3 text-slate-500">Commercial Fitness Apps</th>
                    <th className="p-3 text-emerald-600 font-bold">FitPath AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold">Hardware Barrier</td>
                    <td className="p-3 text-slate-500">₹15,000+ Smartwatch required</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">₹0 (Phone Sensors)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Exam Proximity Handling</td>
                    <td className="p-3 text-slate-500">Rigid penalty streaks</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">Auto-Deload to 18m Restorative</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Kitchen Facilities</td>
                    <td className="p-3 text-slate-500">Full kitchen & oven required</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">Kettle & Microwave only</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Daily Meal Budget</td>
                    <td className="p-3 text-slate-500">₹400 – ₹800 / day</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">Sub-₹120 / day</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">AI Resilience</td>
                    <td className="p-3 text-slate-500">Single API failure risk</td>
                    <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">Dual-Model Fallback + Clinical Engine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Smart India Hackathon • Zero-Hardware Student Health
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </motion.div>
    </div>
  );
};
