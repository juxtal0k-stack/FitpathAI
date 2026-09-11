import React, { useState } from 'react';
import { 
  WifiOff, 
  Wifi, 
  Database, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { OfflineSyncStatus } from '../types';

interface OfflineCacheModalProps {
  isOffline: boolean;
  onToggleOffline: (offline: boolean) => void;
  pendingSyncQueue: { id: string; action: string; timestamp: string }[];
  onAddOfflineAction: (actionText: string) => void;
  onFlushSyncQueue: () => void;
  onClose: () => void;
}

export const OfflineCacheModal: React.FC<OfflineCacheModalProps> = ({
  isOffline,
  onToggleOffline,
  pendingSyncQueue,
  onAddOfflineAction,
  onFlushSyncQueue,
  onClose,
}) => {
  const [customAction, setCustomAction] = useState<string>('');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isOffline 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {isOffline ? <WifiOff className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Offline-First Architecture (Hive & SQLite)
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isOffline 
                  ? 'bg-amber-950 text-amber-300 border-amber-500/30' 
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
              }`}>
                {isOffline ? 'Hostel Offline Mode' : 'Cloud Online'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero dependency on stable Wi-Fi. Works seamlessly inside concrete campus dorm basements or low-signal lecture halls.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
        >
          Close
        </button>
      </div>

      {/* Network State Switcher */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">Campus Wi-Fi Connectivity</span>
          <span className="text-[11px] text-slate-400">
            {isOffline ? 'Disconnected (Using local Hive DB cache)' : 'Connected to Eduroam / Hostel Wi-Fi'}
          </span>
        </div>

        <button
          onClick={() => onToggleOffline(!isOffline)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isOffline
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
          }`}
        >
          {isOffline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          {isOffline ? 'Simulate Reconnect' : 'Simulate Wi-Fi Drop'}
        </button>
      </div>

      {/* Local Storage Boxes (Flutter Hive + SQLite) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <HardDrive className="w-3.5 h-3.5 text-teal-400" />
            <span>Hive Box: Profile</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">user_profile_box</div>
          <div className="text-[10px] text-emerald-400">Cached Locally &bull; Encrypted</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hive Box: Workouts</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">routine_cache_box</div>
          <div className="text-[10px] text-emerald-400">Offline Deload Plans Ready</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>SQLite WAL</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">sensor_telemetry.db</div>
          <div className="text-[10px] text-amber-300">Local Accelerometer Buffer</div>
        </div>
      </div>

      {/* Pending Sync Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pending Sync Queue ({pendingSyncQueue.length} Mutations)
            </h4>
          </div>

          {!isOffline && pendingSyncQueue.length > 0 && (
            <button
              onClick={onFlushSyncQueue}
              className="text-xs px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Sync to Supabase Now
            </button>
          )}
        </div>

        {pendingSyncQueue.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            All local Hive boxes are in perfect sync with Supabase cloud database.
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {pendingSyncQueue.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-medium text-slate-300">{item.action}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action simulator */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            placeholder="e.g. Logged dorm workout: 18 min Decompression"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => {
              if (customAction.trim()) {
                onAddOfflineAction(customAction);
                setCustomAction('');
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Queue Offline Action
          </button>
        </div>
      </div>
    </div>
  );
};
