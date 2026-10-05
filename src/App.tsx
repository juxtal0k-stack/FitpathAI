import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WorkoutView } from './components/WorkoutView';
import { StressAutoScaler } from './components/StressAutoScaler';
import { SensorSyncHub } from './components/SensorSyncHub';
import { ProfileSettings } from './components/ProfileSettings';
import { InitialSetupIntake } from './components/InitialSetupIntake';
import { HomePhotoSlider } from './components/HomePhotoSlider';
import { LockScreenGlance } from './components/LockScreenGlance';
import { SIHPrototypeModal } from './components/SIHPrototypeModal';
import { PresentationGuideModal } from './components/PresentationGuideModal';
import { PhysicalMeasures } from './components/PhysicalMeasures';
import { FoodNutritionAnalyzer } from './components/FoodNutritionAnalyzer';
import { DailyActivityLog } from './components/DailyActivityLog';
import { BackgroundWaterAlarm } from './components/BackgroundWaterAlarm';
import { BackgroundDoctorAlarm } from './components/BackgroundDoctorAlarm';
import { AlertPopupModal, AlertPopupData } from './components/AlertPopupModal';
import { DeviceMapTracker } from './components/DeviceMapTracker';
import { CalmBreathingModal } from './components/CalmBreathingModal';
import { ActiveNavTab } from './components/Header';

import { 
  IndividualProfile, 
  SensorTelemetry, 
  WorkoutRoutine,
  DailyLogState,
  WorkoutHistoryItem,
  DeviceVisitItem
} from './types';
import { FitnessTheme, FITNESS_THEMES } from './theme';
import { Smartphone, Database, Compass, Flame } from 'lucide-react';

const DEFAULT_DAILY_LOG: DailyLogState = {
  date: new Date().toISOString().split('T')[0],
  targetCalories: 2200,
  activeBurnCalories: 0,
  items: [],
  waterGlasses: 0,
  waterTargetGlasses: 8,
  workouts: [],
  dailySteps: 0,
  targetSteps: 8000,
  dailyDetails: {
    energyLevel: 3,
    sleepHours: 7.0,
    stressLevel: 'Low',
    notes: '',
  },
};

const FALLBACK_TELEMETRY: SensorTelemetry = {
  stepsToday: 0,
  targetSteps: 8000,
  sleepHours: 0,
  screenOffEstimatedSleep: 0,
  activeMinutes: 0,
  walkingCadenceRpm: 105,
  campusStairsClimbed: 0,
  lastSyncedAt: 'Device Sensors Initialized (0 steps)',
  source: 'Phone Built-in Accelerometer',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('routine');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  
  // Theme state strictly locked to Obsidian Cyber Dark ('midnight')
  const [currentTheme, setCurrentTheme] = useState<FitnessTheme>(() => {
    localStorage.setItem('fitpath_theme', 'midnight');
    return 'midnight';
  });

  // SIH Modal & Lock Screen Glance state
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [showLockScreen, setShowLockScreen] = useState<boolean>(false);
  const [showPresentationGuide, setShowPresentationGuide] = useState<boolean>(false);
  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);

  // Ensure dark class is active for Obsidian Cyber Dark
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Stored state from server (backed by SQLite database)
  const [profile, setProfile] = useState<IndividualProfile | null>(null);
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(FALLBACK_TELEMETRY);
  const [isAutoScaled, setIsAutoScaled] = useState<boolean>(false);
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [baselineRoutine, setBaselineRoutine] = useState<WorkoutRoutine | null>(null);
  const [scaledRoutine, setScaledRoutine] = useState<WorkoutRoutine | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [schemaSyncToast, setSchemaSyncToast] = useState<string | null>(null);

  // Device visits for Google Maps tracker
  const [deviceVisits, setDeviceVisits] = useState<DeviceVisitItem[]>([]);

  // Background Alert Pop-up Window state (Water & Doctor visit alerts)
  // Alerts run in background without appearing in the app; when complete, pop-up window appears
  const [activeAlertPopup, setActiveAlertPopup] = useState<AlertPopupData | null>(null);

  // Daily Activity & Diet Log state
  const [dailyLog, setDailyLog] = useState<DailyLogState>(() => {
    try {
      const saved = localStorage.getItem('fitpath_daily_log');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not parse local daily log:', e);
    }
    return DEFAULT_DAILY_LOG;
  });

  const handleUpdateDailyLog = async (updated: DailyLogState) => {
    setDailyLog(updated);
    try {
      localStorage.setItem('fitpath_daily_log', JSON.stringify(updated));
      await fetch('/api/user/daily-log/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Failed to sync daily log to server:', err);
    }
  };

  // PWA Install Prompt for Android and PC
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  const themeConfig = FITNESS_THEMES.midnight;

  const handleSelectTheme = (_newTheme?: FitnessTheme) => {
    setCurrentTheme('midnight');
    localStorage.setItem('fitpath_theme', 'midnight');
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    }
  };

  // Fetch initial profile & data from SQLite
  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/user/profile');
      if (!res.ok) {
        throw new Error('Failed to fetch from SQLite database');
      }
      const data = await res.json();

      if (data.exists && data.profile) {
        setProfile(data.profile);
        setHasProfile(true);
        setActiveRoutine(data.activeRoutine);
        setBaselineRoutine(data.baselineRoutine);
        setScaledRoutine(data.scaledRoutine);
        setIsAutoScaled(data.isAutoScaled);
        if (data.telemetry) {
          setTelemetry(data.telemetry);
        }
        if (Array.isArray(data.deviceVisits)) {
          setDeviceVisits(data.deviceVisits);
        }
        if (data.dailyLog) {
          setDailyLog(data.dailyLog);
        }
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      console.warn('Backend SQLite connection issue, loading local cache:', err);
      setIsOffline(true);
      const cached = localStorage.getItem('fitpath_cached_profile');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setProfile(parsed);
          setHasProfile(true);
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // HIGH-FREQUENCY 1-SECOND AUTO-SYNC ENGINE
  // User requested: "Make SQL Server more advance details auto sync when change in app update every single second. (Everything syncs within every second)"
  useEffect(() => {
    if (!hasProfile || isOffline) return;

    const syncInterval = setInterval(async () => {
      try {
        const payload = {
          stepsToday: dailyLog.dailySteps,
          walkingCadenceRpm: telemetry.walkingCadenceRpm || 105,
          activeMinutes: telemetry.activeMinutes,
          latitude: profile?.deviceLocation?.latitude,
          longitude: profile?.deviceLocation?.longitude,
          totalDistanceKm: profile?.deviceLocation?.totalDistanceKm,
          waterGlasses: dailyLog.waterGlasses,
        };

        const res = await fetch('/api/sync/tick', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          // Check if server reports doctor appointment is due right now
          if (data.doctorAlert?.enabled && !activeAlertPopup) {
            const todayStr = new Date().toISOString().split('T')[0];
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            if (data.doctorAlert.appointmentDate === todayStr && data.doctorAlert.appointmentTime <= timeStr) {
              setActiveAlertPopup({
                type: 'doctor',
                title: `Doctor Appointment: ${data.doctorAlert.doctorName}`,
                message: `Scheduled visit with ${data.doctorAlert.doctorName} is due now (${data.doctorAlert.appointmentTime}).`,
                doctorName: data.doctorAlert.doctorName,
                time: data.doctorAlert.appointmentTime,
                date: data.doctorAlert.appointmentDate,
              });
            }
          }
        }
      } catch (e) {
        // Silently tolerate transient offline intervals
      }
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [hasProfile, isOffline, dailyLog.dailySteps, dailyLog.waterGlasses, telemetry, profile, activeAlertPopup]);

  // Handle Initial Profile Creation
  const handleCreateProfile = async (profileData: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        throw new Error('Failed to generate customized fitness plan');
      }

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setProfile(d.profile);
        setHasProfile(true);
        setActiveRoutine(d.activeRoutine);
        setBaselineRoutine(d.baselineRoutine);
        setScaledRoutine(d.scaledRoutine);
        setIsAutoScaled(d.isAutoScaled);
        if (d.telemetry) setTelemetry(d.telemetry);
        if (Array.isArray(d.deviceVisits)) setDeviceVisits(d.deviceVisits);
        localStorage.setItem('fitpath_cached_profile', JSON.stringify(d.profile));
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setSchemaSyncToast(err.message || 'Error saving profile.');
      setTimeout(() => setSchemaSyncToast(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Profile Update
  const handleUpdateProfile = async (updated: IndividualProfile) => {
    setProfile(updated);
    localStorage.setItem('fitpath_cached_profile', JSON.stringify(updated));
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      await loadUserData();
    } catch (e) {
      console.warn('Profile update failed:', e);
    }
  };

  // Reset to New Individual
  const handleResetToNewIndividual = async () => {
    try {
      await fetch('/api/user/reset', { method: 'POST' });
    } catch {}
    localStorage.removeItem('fitpath_cached_profile');
    localStorage.removeItem('fitpath_daily_log');
    setProfile(null);
    setHasProfile(false);
    setActiveRoutine(null);
    setBaselineRoutine(null);
    setScaledRoutine(null);
    setDailyLog(DEFAULT_DAILY_LOG);
    setDeviceVisits([]);
    setActiveTab('routine');
  };

  // Toggle routine between Baseline and Scaled
  const handleToggleRoutine = async () => {
    const nextScaled = !isAutoScaled;
    setIsAutoScaled(nextScaled);
    setActiveRoutine(nextScaled ? scaledRoutine : baselineRoutine);
    try {
      await fetch('/api/user/scale-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useScaled: nextScaled }),
      });
    } catch (err) {
      console.warn('Failed to persist scale toggle:', err);
    }
  };

  // Apply auto scaler
  const handleApplyScaledRoutine = async (useScaled: boolean) => {
    setIsAutoScaled(useScaled);
    setActiveRoutine(useScaled ? scaledRoutine : baselineRoutine);
    try {
      await fetch('/api/user/scale-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useScaled }),
      });
    } catch (err) {
      console.warn('Failed to apply scaler:', err);
    }
  };

  // Log completed workout
  const handleLogWorkoutCompletion = async (
    dataOrTitle?: string | {
      routineTitle: string;
      completedCount: number;
      durationMinutes: number;
      burnedCalories: number;
      exercises: string[];
    },
    completedCount: number = 1,
    durationMinutes: number = 20,
    exercisesList: string[] = []
  ) => {
    let title = 'Workout Session';
    let count = completedCount;
    let duration = durationMinutes;
    let burned = Math.round(duration * 8);
    let exercises = exercisesList;

    if (typeof dataOrTitle === 'object' && dataOrTitle !== null) {
      title = dataOrTitle.routineTitle || title;
      count = dataOrTitle.completedCount ?? count;
      duration = dataOrTitle.durationMinutes ?? duration;
      burned = dataOrTitle.burnedCalories ?? burned;
      exercises = dataOrTitle.exercises ?? exercises;
    } else if (typeof dataOrTitle === 'string') {
      title = dataOrTitle;
    }

    const newWorkout: WorkoutHistoryItem = {
      id: `workout-${Date.now()}`,
      routineTitle: title,
      completedCount: count,
      totalExercises: exercises.length || 1,
      durationMinutes: duration,
      burnedCalories: burned,
      exercisesCompleted: exercises,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedLog: DailyLogState = {
      ...dailyLog,
      workouts: [newWorkout, ...(dailyLog.workouts || [])],
      activeBurnCalories: (dailyLog.activeBurnCalories || 0) + burned,
    };
    handleUpdateDailyLog(updatedLog);

    try {
      await fetch('/api/workout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          routineTitle: title,
          completedCount: count,
          durationMinutes: duration,
          burnedCalories: burned,
          exercises,
        }),
      });
    } catch (err) {
      console.warn('Failed to log workout completion to server:', err);
    }
  };

  // Water increment handler
  const handleLogWater = async (delta: number) => {
    const nextVal = Math.max(0, (dailyLog.waterGlasses || 0) + delta);
    const updated = {
      ...dailyLog,
      waterGlasses: nextVal,
    };
    handleUpdateDailyLog(updated);

    try {
      await fetch('/api/user/water/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change: delta }),
      });
    } catch (e) {
      console.warn('Water log failed:', e);
    }
  };

  // Telemetry sensor update
  const handleUpdateTelemetry = async (updated: SensorTelemetry) => {
    setTelemetry(updated);
    try {
      await fetch('/api/telemetry/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('Telemetry sync failed:', e);
    }
  };

  // Google Maps Device Visit Handlers
  const handleAddDeviceVisit = async (visitData: Omit<DeviceVisitItem, 'id' | 'timestamp'>) => {
    try {
      const res = await fetch('/api/device/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.visit) {
          setDeviceVisits((prev) => [json.visit, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Add device visit error:', e);
    }
  };

  const handleDeleteDeviceVisit = async (id: string) => {
    try {
      await fetch(`/api/device/visits/${id}`, { method: 'DELETE' });
      setDeviceVisits((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      console.warn('Delete device visit error:', e);
    }
  };

  const handleSyncLocation = (lat: number, lng: number, distanceIncKm: number) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return null;
      const curDist = prev.deviceLocation?.totalDistanceKm || 0;
      return {
        ...prev,
        deviceLocation: {
          latitude: lat,
          longitude: lng,
          address: prev.addressLine || 'Device Location',
          totalDistanceKm: parseFloat((curDist + distanceIncKm).toFixed(3)),
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  };

  // Quick Preset Loader for SIH Demos
  const handleLoadSIHPreset = async (presetId: string) => {
    if (presetId === 'rohan') {
      await handleCreateProfile({
        name: 'Rohan Verma',
        fatherName: 'Anil Verma',
        dob: '2004-03-21',
        age: 21,
        gender: 'Male',
        phoneCountryCode: '+91',
        phoneNumber: '9820011223',
        email: 'rohan.verma@sih.edu.in',
        password: 'RohanPassword#2026',
        addressCountry: 'India',
        addressState: 'Maharashtra',
        addressCity: 'Mumbai',
        addressLine: '12 Marine Drive, Nariman Point',
        postalCode: '400021',
        heightCm: 178,
        heightUnit: 'cm',
        weightKg: 73,
        bloodGroup: 'B+',
        doctorAlert: {
          doctorName: 'Dr. Sharma',
          clinicName: 'Apollo Family Health',
          specialty: 'Sports Medicine & Cardiology',
          appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          appointmentTime: '11:00',
          notes: 'Cardiac stress test & joint posture clearance',
          enabled: true,
          soundEnabled: true,
        },
        occupationOrSchedule: 'B.Tech CS Student (Exams in 4 Days)',
        examDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        daysUntilExam: 4,
        budgetPerDay: 4.0,
        dormFacilities: 'microwave-kettle',
        fitnessGoal: 'stress-relief',
        fitnessLevel: 'beginner',
        preferredLocation: 'home-bodyweight',
        medical: {
          jointBackIssues: 'neck-shoulder',
          chronicConditions: 'none',
          dietaryRestrictions: 'vegetarian',
          physicalLimitations: 'Avoid prolonged neck slouching and heavy axial spinal loads',
          medicalPrecautions: [
            'Thoracic spine extensions recommended during revision breaks',
            'Neutral cervical spine alignment cueing for study sessions'
          ],
        },
      });
      setShowSIHModal(false);
    }
  };

  // Loading Screen
  if (isLoading && !hasProfile) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg animate-pulse">
            <Flame className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Loading FitPath Engine...
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing with SQLite ACID Relational Database & Sensors...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // First-time Onboarding Intake Wizard
  if (!hasProfile || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-4 py-3 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight">FitPath</span>
                <span className="text-[10px] text-emerald-400 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                  SQLite Live Engine
                </span>
              </div>
            </div>

            <button
              onClick={() => handleLoadSIHPreset('rohan')}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
            >
              Demo: Rohan (4d to Exams)
            </button>
          </div>
        </header>

        <main className="flex-1 relative z-10">
          <InitialSetupIntake onComplete={handleCreateProfile} />
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} ${themeConfig.textPrimary} flex flex-col antialiased pb-16 md:pb-0 transition-colors duration-300 relative`}>
      
      {/* BACKGROUND PROCESS: Water alarm runs in background, not seen, pop-up appears when time complete */}
      <BackgroundWaterAlarm 
        intervalMinutes={45} 
        soundEnabled={true} 
        onTriggerAlert={(data) => setActiveAlertPopup(data)}
      />

      {/* BACKGROUND PROCESS: Doctor appointment alarm runs in background, pop-up appears when time complete */}
      <BackgroundDoctorAlarm
        doctorAlert={profile?.doctorAlert}
        onTriggerAlert={(data) => setActiveAlertPopup(data)}
      />

      {/* BACKGROUND ALERTS POP-UP WINDOW (Modal appears on top when alert triggers) */}
      <AlertPopupModal
        alert={activeAlertPopup}
        onDismiss={() => setActiveAlertPopup(null)}
        onSnooze={(mins) => {
          setActiveAlertPopup(null);
          // Gently re-arm alert after snooze
          setTimeout(() => {
            if (activeAlertPopup) {
              setActiveAlertPopup({ ...activeAlertPopup });
            }
          }, mins * 60 * 1000);
        }}
        onAction={() => {
          if (activeAlertPopup?.type === 'water') {
            handleLogWater(1);
          }
        }}
      />

      {/* Aligned App Header with Centered Tabs and DB Manager Connection */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        profile={profile}
        currentTheme={currentTheme}
        themeConfig={themeConfig}
        onSelectTheme={handleSelectTheme}
        onOpenSIHModal={() => setShowSIHModal(true)}
        onOpenLockScreen={() => setShowLockScreen(true)}
        onOpenPresentationGuide={() => setShowPresentationGuide(true)}
        onOpenBreathingModal={() => setShowBreathingModal(true)}
      />

      {/* Real-time Schema Synchronization Alert Banner */}
      {schemaSyncToast && (
        <div className="bg-indigo-950 border-b border-indigo-700 text-indigo-200 px-4 py-2 text-xs flex items-center justify-center gap-2 shadow-sm animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">{schemaSyncToast}</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && !isInstalled && (
        <div className="bg-emerald-900 text-white px-4 py-2 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Install FitPath on your Android device or PC for offline access and quick launch.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTriggerInstall}
              className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold cursor-pointer text-xs"
            >
              Install App
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-emerald-300 hover:text-white text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Offline Status Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold text-center">
          Offline Mode active. Changes are cached locally on your device.
        </div>
      )}

      {/* Main Content Area - Aligned and clean */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* Home Photo Slider on Home/Routine view */}
        {activeTab === 'routine' && (
          <HomePhotoSlider
            theme={themeConfig}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenLockScreen={() => setShowLockScreen(true)}
          />
        )}

        {/* Tab 1: Workout Routine */}
        {activeTab === 'routine' && activeRoutine && (
          <WorkoutView
            profile={profile}
            activeRoutine={activeRoutine}
            isAutoScaled={isAutoScaled}
            telemetry={telemetry}
            onToggleRoutine={handleToggleRoutine}
            onOpenAutoScaler={() => setActiveTab('scaler')}
            onLogWorkoutCompletion={handleLogWorkoutCompletion}
            onLogWater={handleLogWater}
          />
        )}

        {/* Tab 2: Activity & Diet (with Radar and Activity Tracker) */}
        {activeTab === 'daily-log' && (
          <DailyActivityLog
            theme={themeConfig}
            profile={profile}
            dailyLog={dailyLog}
            onUpdateDailyLog={handleUpdateDailyLog}
            onOpenFoodAnalyzer={() => setActiveTab('nutrition')}
            onOpenWorkoutTab={() => setActiveTab('routine')}
          />
        )}

        {/* Tab 3: Food Nutrition (with advance features) */}
        {activeTab === 'nutrition' && (
          <FoodNutritionAnalyzer
            theme={themeConfig}
            profile={profile}
            onNavigateToMeasures={() => setActiveTab('measures')}
            onFoodLogged={() => loadUserData()}
          />
        )}

        {/* Tab 4: Google Maps Location & Distance Travel Tracker with Recent Visits */}
        {activeTab === 'map' && (
          <DeviceMapTracker
            theme={themeConfig}
            profile={profile}
            visits={deviceVisits}
            onAddVisit={handleAddDeviceVisit}
            onDeleteVisit={handleDeleteDeviceVisit}
            onSyncLocation={handleSyncLocation}
          />
        )}

        {/* Tab 5: Exam Adjuster */}
        {activeTab === 'scaler' && baselineRoutine && scaledRoutine && (
          <StressAutoScaler
            daysUntilExam={profile.daysUntilExam}
            sleepHours={telemetry.sleepHours}
            stepsToday={telemetry.stepsToday}
            baselineRoutine={baselineRoutine}
            scaledRoutine={scaledRoutine}
            onApplyScaledRoutine={handleApplyScaledRoutine}
          />
        )}

        {/* Tab 6: Measures */}
        {activeTab === 'measures' && (
          <PhysicalMeasures
            profile={profile}
            telemetry={telemetry}
            theme={themeConfig}
            onNavigateToNutrition={() => setActiveTab('nutrition')}
          />
        )}

        {/* Tab 7: Health Sync */}
        {activeTab === 'sensors' && (
          <SensorSyncHub
            telemetry={telemetry}
            onUpdateTelemetry={handleUpdateTelemetry}
            theme={themeConfig}
          />
        )}

        {/* Tab 8: Profile & Settings */}
        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetToNewIndividual={handleResetToNewIndividual}
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
          />
        )}
      </main>

      {/* Clean Android-style Footer with Database status */}
      <footer className={`hidden sm:block border-t ${themeConfig.borderClass} ${themeConfig.surfaceClass} py-3 px-4 text-center text-xs ${themeConfig.textMuted} relative z-10 shadow-2xs`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            FitPath AI • Zero-Hardware Student Health Intelligence
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <a
              href="/database-manager.html"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:text-emerald-500 font-semibold flex items-center gap-1"
            >
              <Database className="w-3.5 h-3.5" />
              <span>SQLite Database Manager</span>
            </a>
            <span>•</span>
            <span>Google Maps Platform</span>
            <span>•</span>
            <span>1s Auto Sync Active</span>
          </div>
        </div>
      </footer>

      {/* Lock Screen Glance Ambient Simulator */}
      {showLockScreen && (
        <LockScreenGlance
          profile={profile}
          telemetry={telemetry}
          activeRoutine={activeRoutine}
          isAutoScaled={isAutoScaled}
          theme={themeConfig}
          onClose={() => setShowLockScreen(false)}
          onStartWorkout={() => {
            setShowLockScreen(false);
            setActiveTab('routine');
          }}
        />
      )}

      {/* SIH Prototype Evaluator Modal */}
      <SIHPrototypeModal
        isOpen={showSIHModal}
        onClose={() => setShowSIHModal(false)}
        onLoadPreset={handleLoadSIHPreset}
        onResetData={handleResetToNewIndividual}
        theme={themeConfig}
      />

      {/* Presentation & Pitch Tutorial Modal */}
      <PresentationGuideModal
        isOpen={showPresentationGuide}
        onClose={() => setShowPresentationGuide(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onLoadPreset={handleLoadSIHPreset}
        onOpenLockScreen={() => setShowLockScreen(true)}
        theme={themeConfig}
      />

      {/* Guided 4-7-8 Calm Breathing Modal (Instant Stress Relief) */}
      <CalmBreathingModal
        isOpen={showBreathingModal}
        onClose={() => setShowBreathingModal(false)}
        onLogCalmSession={(cycles, mins) => {
          handleLogWorkoutCompletion(
            '4-7-8 Calm Breathing Reset',
            cycles,
            mins,
            ['4s Diaphragmatic Inhale', '7s Soft Oxygen Diffusion Hold', '8s Vagal Nerve Exhale Release']
          );
        }}
      />
    </div>
  );
}
