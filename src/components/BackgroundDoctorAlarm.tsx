import React, { useEffect, useRef } from 'react';
import { playDoctorAlertBuzzer } from '../utils/soundEffects';
import { DoctorAlertConfig } from '../types';
import { AlertPopupData } from './AlertPopupModal';

interface BackgroundDoctorAlarmProps {
  doctorAlert?: DoctorAlertConfig;
  onTriggerAlert: (data: AlertPopupData) => void;
}

/**
 * BackgroundDoctorAlarm
 * Pure background process: runs completely invisible (renders null).
 * Evaluates the doctor visit alert configuration against real-time clock.
 * When the scheduled appointment time arrives, sounds the medical buzzer
 * and signals the app to open the AlertPopupModal window!
 */
export const BackgroundDoctorAlarm: React.FC<BackgroundDoctorAlarmProps> = ({
  doctorAlert,
  onTriggerAlert,
}) => {
  const hasTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!doctorAlert || !doctorAlert.enabled) return;

    // Reset trigger if appointment date/time changes
    hasTriggeredRef.current = false;

    const checkDoctorSchedule = () => {
      if (hasTriggeredRef.current) return;

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMins = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      // Check if alert date and time match or are due
      if (doctorAlert.appointmentDate === todayStr) {
        if (doctorAlert.appointmentTime <= currentTimeStr) {
          hasTriggeredRef.current = true;

          // Sound buzzer if sound enabled
          if (doctorAlert.soundEnabled !== false) {
            playDoctorAlertBuzzer();
          }

          // Pop up the alert window
          onTriggerAlert({
            type: 'doctor',
            title: `Doctor Appointment: ${doctorAlert.doctorName}`,
            message: `Scheduled visit with ${doctorAlert.doctorName} at ${doctorAlert.clinicName || 'Clinic'} is due now (${doctorAlert.appointmentTime}).`,
            doctorName: doctorAlert.doctorName,
            clinicName: doctorAlert.clinicName,
            specialty: doctorAlert.specialty,
            time: doctorAlert.appointmentTime,
            date: doctorAlert.appointmentDate,
            notes: doctorAlert.notes,
          });

          // Inform server of trigger
          fetch('/api/doctor/alert/trigger', { method: 'POST' }).catch(() => {});
        }
      }
    };

    // Check once immediately
    checkDoctorSchedule();

    // Check every second in background
    const interval = setInterval(checkDoctorSchedule, 1000);
    return () => clearInterval(interval);
  }, [doctorAlert, onTriggerAlert]);

  // Completely invisible background process
  return null;
};
