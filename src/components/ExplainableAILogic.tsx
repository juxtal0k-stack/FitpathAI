import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Scale, 
  BookOpen, 
  Layers, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { StudentProfile, WorkoutRoutine } from '../types';

interface ExplainableAILogicProps {
  profile: StudentProfile;
  currentWorkout: WorkoutRoutine;
  isAutoScaled: boolean;
}

export const ExplainableAILogic: React.FC<ExplainableAILogicProps> = ({
  profile,
  currentWorkout,
  isAutoScaled,
}) => {
  const [userQuery, setUserQuery] = useState<string>('');
  const [qaHistory, setQaHistory] = useState<{ query: string; answer: string }[]>([
    {
      query: 'Why did my workout get reduced from 45 mins to 18 mins?',
      answer: 'Your upcoming finals date (7 days away) coupled with phone sensors detecting 5.6 hours of sleep increased your calculated Stress Index to 68/100. High-intensity resistance training under sleep debt elevates injury risk by 2.3x and depletes glycogen needed for memory consolidation. The 18-minute restorative routine provides autonomic nervous down-regulation and spine relief without fatiguing your central nervous system.',
    },
    {
      query: 'Will scaling back during exam week make me lose my muscle gains?',
      answer: 'No. Clinical exercise physiology demonstrates that muscle mass is preserved for 3-4 weeks even on maintenance volume (1/3 of standard sets). In fact, deloading during peak exam stress prevents chronic cortisol elevation, which is catabolic to muscle tissue.',
    },
  ]);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  const handleAskQuestion = async (queryText?: string) => {
    const q = queryText || userQuery;
    if (!q.trim()) return;

    setIsAsking(true);
    setUserQuery('');

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: currentWorkout,
          studentContext: `Student major: ${profile.major}, days to exam: ${profile.daysUntilExam}, budget: $${profile.budgetPerDay}/day`,
          reasons: [q],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const expl = data.explanation;
        const answer = expl.summary + ' ' + (expl.biologicalReasoning || expl.guiltFreeMessage || '');
        setQaHistory((prev) => [...prev, { query: q, answer }]);
      } else {
        setQaHistory((prev) => [
          ...prev,
          {
            query: q,
            answer: 'FitPath AI prioritizes central nervous recovery during heavy academic loads. Consistency and avoiding injury matter more than any single high-strain session.',
          },
        ]);
      }
    } catch (err) {
      setQaHistory((prev) => [
        ...prev,
        {
          query: q,
          answer: 'FitPath AI uses transparent decision rules to prevent student burnout. Restorative mobility protects your brain and posture.',
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Explainable AI (XAI) & Trust Engine
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Most fitness apps act as "black boxes"—arbitrarily altering your streaks or demanding unreasonable workouts. FitPath AI explains the exact mathematical and biological logic behind every single adjustment.
            </p>
          </div>
        </div>
      </div>

      {/* Decision Rules Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-400" />
          Transparent Scikit-Learn Decision Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Condition: Calm Academic Period
            </div>
            <p className="text-[11px] text-slate-400">
              Exam countdown &gt; 14 days + Sleep &ge; 7.0h + Steps &ge; 7,000.
            </p>
            <div className="text-[11px] font-mono text-slate-300 pt-1 border-t border-slate-800/60">
              Action: Full Progressive Overload (45m, 85% Intensity).
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-teal-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              Condition: Moderate Midterm Strain
            </div>
            <p className="text-[11px] text-slate-400">
              Exam countdown 8–14 days OR Sleep 6.0–6.9h.
            </p>
            <div className="text-[11px] font-mono text-slate-300 pt-1 border-t border-slate-800/60">
              Action: Volume reduced by 22% (30m circuit, lower eccentric sets).
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Condition: Finals Week / Sleep Deficit
            </div>
            <p className="text-[11px] text-slate-400">
              Exam countdown &le; 7 days OR Sleep &lt; 6.0h.
            </p>
            <div className="text-[11px] font-mono text-slate-300 pt-1 border-t border-slate-800/60">
              Action: Full Deload (18m restorative spine & mobility decomp).
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Student Q&A Assistant */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Ask FitPath Explainability AI
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">Gemini 3.8 Flash Grounded</span>
        </div>

        {/* Preset Question Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            'Can I workout while studying for a 9am exam?',
            'What is the cheapest student protein source?',
            'Why does desk hunch make my neck sore?',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-purple-400" />
              {q}
            </button>
          ))}
        </div>

        {/* Conversation Q&A stream */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {qaHistory.map((item, i) => (
            <div key={i} className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200 font-semibold flex items-center gap-2">
                <span className="text-purple-400 font-mono">Q:</span>
                <span>{item.query}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-mono font-bold block mb-1">Explainable AI Answer:</span>
                {item.answer}
              </div>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion();
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask anything about your auto-scaled plan or student budget nutrition..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={isAsking || !userQuery.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isAsking ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};
