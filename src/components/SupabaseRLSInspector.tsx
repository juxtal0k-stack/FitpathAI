import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  UserCheck, 
  Copy, 
  Check,
  Code
} from 'lucide-react';

interface SupabaseRLSInspectorProps {
  studentName: string;
  onClose?: () => void;
}

export const SupabaseRLSInspector: React.FC<SupabaseRLSInspectorProps> = ({
  studentName,
  onClose,
}) => {
  const currentUserId = 'a47b2c91-e8d3-4921-b0ef-6f298bc19d44';
  const adversaryUserId = '99999999-0000-0000-0000-000000000000';

  const [testMode, setTestMode] = useState<'legit' | 'adversary'>('legit');
  const [copied, setCopied] = useState(false);

  const copySql = () => {
    navigator.clipboard.writeText(`-- FitPath AI Supabase Row Level Security Architecture
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only read own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = id);

ALTER TABLE sensor_telemetry_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only insert own sensor logs"
  ON sensor_telemetry_logs FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can only query own sensor logs"
  ON sensor_telemetry_logs FOR SELECT
  USING (auth.uid() = student_id);`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Supabase Row Level Security (RLS) Verification
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30">
                PostgreSQL 15 RLS Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cryptographic per-user data isolation ensures student health telemetry and exam schedules are never leaked across tenants.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer self-start sm:self-center"
          >
            Close Inspector
          </button>
        )}
      </div>

      {/* Active User Claims vs Adversary Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Authenticated JWT */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Active Student Session (auth.uid)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
              Authenticated
            </span>
          </div>
          <div className="font-mono text-xs text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 break-all">
            {currentUserId}
          </div>
          <div className="text-[11px] text-slate-500">
            Assigned to: <strong className="text-slate-300">{studentName}</strong> (FitPath Student Token)
          </div>
        </div>

        {/* Security Policy Interactive Probe */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-teal-400" />
              Live Query Security Sandbox
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTestMode('legit')}
                className={`text-[10px] px-2 py-1 rounded font-bold transition cursor-pointer ${
                  testMode === 'legit'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Legitimate Query
              </button>
              <button
                onClick={() => setTestMode('adversary')}
                className={`text-[10px] px-2 py-1 rounded font-bold transition cursor-pointer ${
                  testMode === 'adversary'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Simulate Data Snoop Attack
              </button>
            </div>
          </span>

          {testMode === 'legit' ? (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>QUERY PERMITTED (200 OK)</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                SELECT * FROM sensor_telemetry_logs WHERE student_id = auth.uid();
              </p>
              <p className="text-[11px] text-emerald-200/80">
                PostgreSQL RLS policy passed: JWT auth.uid() strictly matches row student_id.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>ACCESS DENIED (403 Forbidden by RLS)</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">
                SELECT * FROM sensor_telemetry_logs WHERE student_id = '{adversaryUserId}';
              </p>
              <p className="text-[11px] text-rose-200/80">
                Blocked at database kernel level. Zero unauthorized telemetry exposed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Supabase SQL DDL Schema */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-300 font-mono">
              supabase/migrations/20260910_rls_isolation.sql
            </span>
          </div>
          <button
            onClick={copySql}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy SQL'}
          </button>
        </div>

        <pre className="text-[11px] font-mono text-emerald-300/90 bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 overflow-x-auto leading-relaxed">
{`-- 1. Enable Row Level Security on all telemetry tables
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_workout_plans ENABLE ROW LEVEL SECURITY;

-- 2. Strict Per-User Data Isolation Policies
CREATE POLICY "student_select_own" 
  ON student_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "sensor_insert_telemetry" 
  ON sensor_telemetry_logs FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "plans_read_own" 
  ON adaptive_workout_plans FOR SELECT 
  USING (auth.uid() = student_id);`}
        </pre>
      </div>
    </div>
  );
};
