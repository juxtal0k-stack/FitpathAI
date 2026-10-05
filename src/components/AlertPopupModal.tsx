import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Droplet, 
  HeartPulse, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  X, 
  Volume2, 
  AlertTriangle 
} from 'lucide-react';
import { playWaterAlarmBuzzer, playDoctorAlertBuzzer } from '../utils/soundEffects';

export interface AlertPopupData {
  type: 'water' | 'doctor';
  title: string;
  message: string;
  time?: string;
  date?: string;
  doctorName?: string;
  clinicName?: string;
  specialty?: string;
  notes?: string;
}

interface AlertPopupModalProps {
  alert: AlertPopupData | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onAction?: () => void;
}

/**
 * AlertPopupModal
 * According to instructions:
 * "all alerts are the background process don't let them appear in the app
 * when the time complete the pop-up window appear."
 * 
 * Runs silently in the background, only pops up into view when scheduled time completes.
 */
export const AlertPopupModal: React.FC<AlertPopupModalProps> = ({
  alert,
  onDismiss,
  onSnooze,
  onAction,
}) => {
  useEffect(() => {
    if (alert) {
      if (alert.type === 'doctor') {
        playDoctorAlertBuzzer();
      } else {
        playWaterAlarmBuzzer();
      }
    }
  }, [alert]);

  if (!alert) return null;

  const isDoctor = alert.type === 'doctor';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full max-w-md bg-white dark:bg-slate-900 border rounded-2xl shadow-2xl overflow-hidden ${
            isDoctor 
              ? 'border-indigo-400 dark:border-indigo-600 ring-4 ring-indigo-500/20' 
              : 'border-cyan-400 dark:border-cyan-600 ring-4 ring-cyan-500/20'
          }`}
        >
          {/* Header Banner */}
          <div className={`p-5 text-white ${
            isDoctor 
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700' 
              : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
                  {isDoctor ? (
                    <HeartPulse className="w-6 h-6 text-white animate-pulse" />
                  ) : (
                    <Droplet className="w-6 h-6 text-white animate-bounce" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold bg-white/25 px-2 py-0.5 rounded-full">
                      {isDoctor ? 'Doctor Visit Alert' : 'Hydration Reminder'}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mt-0.5">
                    {alert.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="w-8 h-8 rounded-lg bg-black/10 hover:bg-black/25 flex items-center justify-center text-white/80 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4 text-slate-800 dark:text-slate-100">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {alert.message}
            </p>

            {isDoctor && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2 text-xs">
                {alert.doctorName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Physician:</span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">{alert.doctorName}</span>
                  </div>
                )}
                {alert.specialty && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Specialty:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.specialty}</span>
                  </div>
                )}
                {alert.clinicName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Clinic:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.clinicName}</span>
                  </div>
                )}
                {(alert.date || alert.time) && (
                  <div className="flex items-center justify-between pt-1 border-t border-indigo-200 dark:border-indigo-800/40">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Scheduled Time:</span>
                    <span className="font-extrabold text-indigo-900 dark:text-indigo-200">
                      {alert.date ? `${alert.date} at ` : ''}{alert.time || 'Upcoming'}
                    </span>
                  </div>
                )}
                {alert.notes && (
                  <p className="pt-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Note: "{alert.notes}"
                  </p>
                )}
              </div>
            )}

            {!isDoctor && (
              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-cyan-800 dark:text-cyan-300">
                  <span>Target: 250ml (1 Glass)</span>
                  <span>Electrolytes Balanced</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Staying hydrated maintains peak cognitive function, prevents study fatigue, and aids muscular recovery.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onAction) onAction();
                  onDismiss();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-md transition flex items-center justify-center gap-1.5 ${
                  isDoctor
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-cyan-600 hover:bg-cyan-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isDoctor ? 'Acknowledge Visit' : 'Drink & Log 250ml'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSnooze(10)}
                className="py-2.5 px-3 rounded-xl font-semibold text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Snooze (10m)</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="py-2.5 px-3 rounded-xl font-medium text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
