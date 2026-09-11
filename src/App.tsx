import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkoutView } from './components/WorkoutView';
import { StressAutoScaler } from './components/StressAutoScaler';
import { StudentDietPlanner } from './components/StudentDietPlanner';
import { SensorSyncHub } from './components/SensorSyncHub';
import { ProfileSettings } from './components/ProfileSettings';
import { InitialSetupIntake } from './components/InitialSetupIntake';
import { HomePhotoSlider } from './components/HomePhotoSlider';
import { LockScreenGlance } from './components/LockScreenGlance';
import { SIHPrototypeModal } from './components/SIHPrototypeModal';
import { PresentationGuideModal } from './components/PresentationGuideModal';
import { PhysicalMeasures } from './components/PhysicalMeasures';
import { FoodNutritionAnalyzer } from './components/FoodNutritionAnalyzer';
import { GymWatermarkBackground } from './components/GymWatermarkBackground';
import { ActiveNavTab } from './components/Header';

import { 
  IndividualProfile, 
  SensorTelemetry, 
  WorkoutRoutine,
  BudgetMealItem
} from './types';
import { FitnessTheme, FITNESS_THEMES } from './theme';
import { Smartphone, Award } from 'lucide-react';

const FALLBACK_TELEMETRY: SensorTelemetry = {
  stepsToday: 4200,
  targetSteps: 8000,
  sleepHours: 6.2,
  screenOffEstimatedSleep: 6.0,
  activeMinutes: 20,
  walkingCadenceRpm: 98,
  campusStairsClimbed: 4,
  lastSyncedAt: 'Sensor Hub Ready',
  source: 'Phone Built-in Accelerometer',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('routine');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  
  // Theme state persisted in localStorage
  const [currentTheme, setCurrentTheme] = useState<FitnessTheme>(() => {
    return (localStorage.getItem('fitpath_theme') as FitnessTheme) || 'emerald';
  });

  // SIH Modal & Lock Screen Glance state
  const [showSIHModal, setShowSIHModal] = useState<boolean>(false);
  const [showLockScreen, setShowLockScreen] = useState<boolean>(false);
  const [showPresentationGuide, setShowPresentationGuide] = useState<boolean>(false);

  // Gym Background Watermark state (Light Mode Aesthetic)
  const [watermarkOpacity, setWatermarkOpacity] = useState<'subtle' | 'balanced' | 'prominent' | 'off'>('balanced');
  const [watermarkPhoto, setWatermarkPhoto] = useState<'strength' | 'turf' | 'mobility'>('strength');

  // Stored state from server
  const [profile, setProfile] = useState<IndividualProfile | null>(null);
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(FALLBACK_TELEMETRY);
  const [isAutoScaled, setIsAutoScaled] = useState<boolean>(false);
  const [activeRoutine, setActiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [baselineRoutine, setBaselineRoutine] = useState<WorkoutRoutine | null>(null);
  const [scaledRoutine, setScaledRoutine] = useState<WorkoutRoutine | null>(null);
  const [meals, setMeals] = useState<BudgetMealItem[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // PWA Install Prompt for Android and PC
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  const themeConfig = FITNESS_THEMES[currentTheme] || FITNESS_THEMES.emerald;

  const handleSelectTheme = (newTheme: FitnessTheme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem('fitpath_theme', newTheme);
  };

  useEffect(() => {
    // Check for PWA install event
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

  // Fetch user data from the server on startup
  useEffect(() => {
    async function fetchServerProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data && data.exists && data.profile) {
            setProfile(data.profile);
            setBaselineRoutine(data.baselineRoutine);
            setScaledRoutine(data.scaledRoutine);
            setActiveRoutine(data.activeRoutine || data.baselineRoutine);
            setIsAutoScaled(!!data.isAutoScaled);
            setMeals(data.meals || []);
            if (data.telemetry) {
              setTelemetry(data.telemetry);
            }
            setHasProfile(true);
          } else {
            setHasProfile(false);
          }
        }
      } catch (err) {
        console.warn('Could not reach server profile endpoint:', err);
        setHasProfile(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServerProfile();
  }, []);

  // Handle Initial Intake submission -> Persists to Server
  const handleCreateProfile = async (profilePayload: any) => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profilePayload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to save individual data on server');
    }

    const json = await res.json();
    const data = json.data;
    setProfile(data.profile);
    setBaselineRoutine(data.baselineRoutine);
    setScaledRoutine(data.scaledRoutine);
    setActiveRoutine(data.activeRoutine || data.baselineRoutine);
    setIsAutoScaled(!!data.isAutoScaled);
    setMeals(data.meals || []);
    if (data.telemetry) {
      setTelemetry(data.telemetry);
    }
    setHasProfile(true);
    setActiveTab('routine');
  };

  // Load SIH Presets
  const handleLoadSIHPreset = async (presetKey: 'rohan' | 'priya' | 'arjun') => {
    const today = new Date();
    
    let payload: any = null;
    if (presetKey === 'rohan') {
      const examDate = new Date(today.getTime() + 4 * 86400000).toISOString().split('T')[0];
      payload = {
        name: 'Rohan Sharma',
        age: 21,
        gender: 'Male',
        heightCm: 176,
        weightKg: 68,
        occupationOrSchedule: 'B.Tech CS Undergrad (Final Exams in 4 Days)',
        examDate,
        daysUntilExam: 4,
        budgetPerDay: 3.50,
        dormFacilities: 'microwave-kettle',
        fitnessGoal: 'stress-relief',
        fitnessLevel: 'beginner',
        preferredLocation: 'dorm-room',
        medical: {
          jointBackIssues: 'neck-shoulder',
          chronicConditions: 'none',
          dietaryRestrictions: 'vegetarian',
          physicalLimitations: 'Severe desk neck strain from coding sprints',
        },
      };
    } else if (presetKey === 'priya') {
      const examDate = new Date(today.getTime() + 12 * 86400000).toISOString().split('T')[0];
      payload = {
        name: 'Priya Nair',
        age: 23,
        gender: 'Female',
        heightCm: 164,
        weightKg: 55,
        occupationOrSchedule: 'Medical Intern (14h Clinical Shifts)',
        examDate,
        daysUntilExam: 12,
        budgetPerDay: 4.00,
        dormFacilities: 'kettle-only',
        fitnessGoal: 'posture-rehab',
        fitnessLevel: 'beginner',
        preferredLocation: 'home-bodyweight',
        medical: {
          jointBackIssues: 'lower-back',
          chronicConditions: 'none',
          dietaryRestrictions: 'vegetarian',
          physicalLimitations: 'Lower lumbar tenderness, avoid axial heavy loading',
        },
      };
    } else {
      const examDate = new Date(today.getTime() + 20 * 86400000).toISOString().split('T')[0];
      payload = {
        name: 'Arjun Patel',
        age: 20,
        gender: 'Male',
        heightCm: 180,
        weightKg: 74,
        occupationOrSchedule: 'Mechanical Engineering Student',
        examDate,
        daysUntilExam: 20,
        budgetPerDay: 4.50,
        dormFacilities: 'full-shared-kitchen',
        fitnessGoal: 'muscle-tone',
        fitnessLevel: 'intermediate',
        preferredLocation: 'student-rec-gym',
        medical: {
          jointBackIssues: 'none',
          chronicConditions: 'none',
          dietaryRestrictions: 'none',
          physicalLimitations: 'None',
        },
      };
    }

    try {
      await handleCreateProfile(payload);
    } catch (e) {
      console.warn('Failed to load SIH preset:', e);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (updated: IndividualProfile) => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const json = await res.json();
      const data = json.data;
      setProfile(data.profile);
      setBaselineRoutine(data.baselineRoutine);
      setScaledRoutine(data.scaledRoutine);
      setActiveRoutine(data.activeRoutine || data.baselineRoutine);
      setIsAutoScaled(!!data.isAutoScaled);
      setMeals(data.meals || []);
    }
  };

  // Reset to New Individual (Wipe server data and restart clean)
  const handleResetToNewIndividual = async () => {
    try {
      await fetch('/api/user/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Reset error:', err);
    }
    setProfile(null);
    setActiveRoutine(null);
    setBaselineRoutine(null);
    setScaledRoutine(null);
    setMeals([]);
    setHasProfile(false);
    setActiveTab('routine');
  };

  // Handle routine toggle between Standard & Deload
  const handleToggleRoutine = async () => {
    const nextScaled = !isAutoScaled;
    if (nextScaled && scaledRoutine) {
      setActiveRoutine(scaledRoutine);
      setIsAutoScaled(true);
    } else if (!nextScaled && baselineRoutine) {
      setActiveRoutine(baselineRoutine);
      setIsAutoScaled(false);
    }

    try {
      await fetch('/api/plan/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useScaled: nextScaled }),
      });
    } catch (e) {
      // synced locally
    }
  };

  // Handle applying auto-scaler plan
  const handleApplyScaledRoutine = (routine: WorkoutRoutine, isScaled: boolean) => {
    setActiveRoutine(routine);
    setIsAutoScaled(isScaled);
    setActiveTab('routine');
  };

  // Log completed workout to server
  const handleLogWorkoutCompletion = async (
    routineTitle: string,
    completedCount: number,
    durationMinutes: number
  ) => {
    try {
      await fetch('/api/workout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routineTitle, completedCount, durationMinutes }),
      });
    } catch (e) {
      console.warn('Could not log workout to server:', e);
    }
  };

  // Sync health telemetry to server
  const handleUpdateTelemetry = async (newTelemetry: SensorTelemetry) => {
    setTelemetry(newTelemetry);
    try {
      await fetch('/api/sensors/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTelemetry),
      });
    } catch (e) {
      console.warn('Could not sync telemetry to server:', e);
    }
  };

  // PWA Install trigger
  const handleTriggerInstall = async () => {
    if (!installPrompt) {
      alert('To install on PC: Click the install icon in your browser address bar. To install on Android: Tap the menu (⋮) and choose "Add to Home screen".');
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${themeConfig.bgClass} flex items-center justify-center`}>
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className={`text-xs ${themeConfig.textMuted} font-medium`}>Connecting to FitPath SIH Server...</p>
        </div>
      </div>
    );
  }

  // If no individual profile exists, start with clean intake without any data!
  if (!hasProfile || !profile) {
    return (
      <div className={`min-h-screen ${themeConfig.bgClass} ${themeConfig.textPrimary} flex flex-col antialiased relative`}>
        {/* Gym Background Watermark */}
        <GymWatermarkBackground 
          theme={themeConfig} 
          opacityLevel={watermarkOpacity} 
          selectedPhoto={watermarkPhoto} 
        />

        <header className={`relative z-10 ${themeConfig.surfaceClass} border-b ${themeConfig.borderClass} py-3 px-4 sm:px-6 shadow-2xs`}>
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                FP
              </div>
              <span className={`font-bold text-base ${themeConfig.textPrimary}`}>FitPath</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                SIH Prototype
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLoadSIHPreset('rohan')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
              >
                Demo: Rohan (4d to Exams)
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile & PC Ready</span>
              </div>
            </div>
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
      {/* Gym Background Watermark Layer */}
      <GymWatermarkBackground 
        theme={themeConfig} 
        opacityLevel={watermarkOpacity} 
        selectedPhoto={watermarkPhoto} 
      />

      {/* Real App Header */}
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
        watermarkOpacity={watermarkOpacity}
        onChangeWatermarkOpacity={setWatermarkOpacity}
        watermarkPhoto={watermarkPhoto}
        onChangeWatermarkPhoto={setWatermarkPhoto}
      />

      {/* PWA Install Banner for Android & PC */}
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

      {/* Offline Status Banner if active */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold text-center">
          Offline Mode active. Changes are cached locally on your device.
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Home Photo Slider on Home/Routine view */}
        {activeTab === 'routine' && (
          <HomePhotoSlider
            theme={themeConfig}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenLockScreen={() => setShowLockScreen(true)}
          />
        )}

        {activeTab === 'routine' && activeRoutine && (
          <WorkoutView
            profile={profile}
            activeRoutine={activeRoutine}
            isAutoScaled={isAutoScaled}
            telemetry={telemetry}
            onToggleRoutine={handleToggleRoutine}
            onOpenAutoScaler={() => setActiveTab('scaler')}
            onLogWorkoutCompletion={handleLogWorkoutCompletion}
          />
        )}

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

        {activeTab === 'measures' && (
          <PhysicalMeasures
            profile={profile}
            telemetry={telemetry}
            theme={themeConfig}
            onNavigateToNutrition={() => setActiveTab('nutrition')}
          />
        )}

        {activeTab === 'nutrition' && (
          <FoodNutritionAnalyzer
            theme={themeConfig}
            onNavigateToMeasures={() => setActiveTab('measures')}
          />
        )}

        {activeTab === 'diet' && (
          <StudentDietPlanner
            budgetPerDay={profile.budgetPerDay}
            dormFacilities={profile.dormFacilities}
            fitnessGoal={profile.fitnessGoal}
            initialMeals={meals}
            medicalRestrictions={profile.medical?.dietaryRestrictions}
          />
        )}

        {activeTab === 'sensors' && (
          <SensorSyncHub
            telemetry={telemetry}
            onUpdateTelemetry={handleUpdateTelemetry}
            theme={themeConfig}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetToNewIndividual={handleResetToNewIndividual}
          />
        )}
      </main>

      {/* Clean Android-style Footer */}
      <footer className={`hidden sm:block border-t ${themeConfig.borderClass} ${themeConfig.surfaceClass} py-3 px-4 text-center text-xs ${themeConfig.textMuted} relative z-10 shadow-2xs`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            FitPath AI • Zero-Hardware Student Health Intelligence
          </span>
          <span className="text-xs text-slate-400">
            Android & Web Responsive
          </span>
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
    </div>
  );
}
