import React, { useEffect, useRef } from 'react';
import { playWaterAlarmBuzzer } from '../utils/soundEffects';
import { AlertPopupData } from './AlertPopupModal';

interface BackgroundWaterAlarmProps {
  intervalMinutes?: number;
  soundEnabled?: boolean;
  onTriggerAlert?: (data: AlertPopupData) => void;
}

/**
 * BackgroundWaterAlarm
 * Pure background process: runs completely invisible (renders null),
 * periodically evaluates hydration schedule, and when the interval elapses,
 * buzzes the audio alarm and triggers the pop-up modal window.
 */
export const BackgroundWaterAlarm: React.FC<BackgroundWaterAlarmProps> = ({
  intervalMinutes = 45,
  soundEnabled = true,
  onTriggerAlert,
}) => {
  const lastAlarmTimeRef = useRef<number>(Date.now());
  const intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;

  useEffect(() => {
    // Check if there was a saved last-buzz time in localStorage
    const savedLastBuzz = localStorage.getItem('fitpath_last_water_alarm');
    if (savedLastBuzz) {
      const parsed = parseInt(savedLastBuzz, 10);
      if (!isNaN(parsed) && parsed > 0) {
        lastAlarmTimeRef.current = parsed;
      }
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastAlarmTimeRef.current;

      if (elapsed >= intervalMs) {
        // Trigger water alarm buzz
        if (soundEnabled) {
          playWaterAlarmBuzzer();
        }

        // Trigger the pop-up modal window
        if (onTriggerAlert) {
          onTriggerAlert({
            type: 'water',
            title: 'Hydration Alarm',
            message: 'Time to drink water! Keep your hydration level optimal for mental focus and muscle recovery.',
          });
        }

        // Try background system notification if permitted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('💧 Hydration Alarm', {
              body: 'Time to drink water! Stay hydrated for optimal cognitive and physical recovery.',
              silent: false,
            });
          } catch {}
        }

        lastAlarmTimeRef.current = now;
        localStorage.setItem('fitpath_last_water_alarm', now.toString());

        // Notify backend of buzz
        fetch('/api/water-alarm/log-buzz', { method: 'POST' }).catch(() => {});
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalMs, soundEnabled, onTriggerAlert]);

  // Request browser notification permission gently once in background if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission().catch(() => {});
      } catch {}
    }
  }, []);

  // Pure background process - completely invisible, renders zero UI
  return null;
};
