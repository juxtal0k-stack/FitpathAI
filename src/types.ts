export type BudgetTier = 'ultra-budget' | 'standard' | 'flexible';
export type DormFacilities = 'none' | 'kettle-only' | 'microwave-kettle' | 'full-shared-kitchen' | 'standard-kitchen';
export type FitnessLevel = 'beginner' | 'intermediate' | 'active';

export interface MedicalData {
  jointBackIssues: string; // e.g. "none" | "lower-back" | "knee" | "neck-shoulder" | custom
  chronicConditions: string; // e.g. "none" | "asthma" | "hypertension" | custom
  dietaryRestrictions: string; // e.g. "none" | "vegetarian" | "vegan" | "lactose-free" | "gluten-free"
  physicalLimitations: string; // e.g. "Avoid heavy spinal loading", "Low impact only"
  medicalPrecautions: string[]; // Server-generated precautions
}

export interface IndividualProfile {
  id?: string;
  name: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  occupationOrSchedule?: string;
  major?: string; // backward compatibility
  examDate: string; // YYYY-MM-DD
  daysUntilExam: number;
  budgetPerDay: number; // e.g. $5.00
  dormFacilities: DormFacilities;
  fitnessGoal: 'fat-loss' | 'muscle-tone' | 'stress-relief' | 'endurance' | 'posture-rehab';
  fitnessLevel?: FitnessLevel;
  preferredLocation: 'home-bodyweight' | 'dorm-room' | 'campus-outdoors' | 'gym' | 'student-rec-gym';
  medical?: MedicalData;
  sensorConnected: {
    googleFit: boolean;
    appleHealth: boolean;
  };
  hasSmartwatch: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type StudentProfile = IndividualProfile;

export interface SensorTelemetry {
  stepsToday: number;
  targetSteps: number;
  sleepHours: number;
  screenOffEstimatedSleep: number;
  activeMinutes: number;
  walkingCadenceRpm: number;
  campusStairsClimbed: number;
  lastSyncedAt: string;
  source: 'Google Fit API' | 'Apple HealthKit' | 'Phone Built-in Accelerometer';
}

export type ExerciseLevelFilter = 'all' | 'easy' | 'moderate' | 'intense';
export type BodyPartTarget = 'all' | 'chest' | 'biceps' | 'triceps' | 'back' | 'shoulders' | 'legs' | 'core';

export interface ExerciseItem {
  name: string;
  sets: number;
  repsOrDuration: string;
  dormEquipmentNeeded: string;
  targetBenefit: string;
  postureFocus: string;
  medicalSafetyNote?: string;
  injuryPreventionTip?: string;
  correctPostureChecklist?: string[];
  contraindications?: string[];
  level?: 'easy' | 'moderate' | 'intense';
  bodyPart?: 'chest' | 'biceps' | 'triceps' | 'back' | 'shoulders' | 'legs' | 'core';
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  durationMinutes: number;
  intensityLevel: 'Low (Restorative)' | 'Moderate' | 'High (Progressive Overload)';
  intensityPercent: number; // 0-100
  exercises: ExerciseItem[];
  examFriendlyNotes: string;
  medicalClearanceNotes?: string;
}

export interface BudgetMealItem {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Study Snack';
  cost: number;
  prepTimeMinutes: number;
  calories: number;
  proteinGrams: number;
  appliances: string;
  ingredients: string[];
  studentHack: string;
  medicalDietNote?: string;
}

export interface ServerUserDataResponse {
  exists: boolean;
  profile: IndividualProfile | null;
  activeRoutine: WorkoutRoutine | null;
  baselineRoutine: WorkoutRoutine | null;
  scaledRoutine: WorkoutRoutine | null;
  meals: BudgetMealItem[];
  telemetry: SensorTelemetry | null;
  isAutoScaled: boolean;
}

export interface OfflineSyncStatus {
  isOffline: boolean;
  pendingSyncCount: number;
  lastSyncTimestamp: string;
  storageEngine: string;
}

export interface MacroSplit {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface FoodNutritionResult {
  id?: string;
  foodName: string;
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
  fiberGrams?: number;
  saturatedFatGrams?: number;
  sodiumMg?: number;
  sugarGrams?: number;
  estimatedCost?: string;
  macroRatio?: MacroSplit;
  healthScore?: number; // 1-100
  studentAffordability?: 'Budget Master' | 'Moderate' | 'Treat';
  prepComplexity?: 'No Cook' | 'Kettle/Microwave' | 'Full Kitchen';
  cognitiveImpact?: string;
  allergens?: string[];
  smartSwaps?: string[];
  timestamp?: string;
}

export interface LoggedFoodItem {
  id: string;
  foodName: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  proteinGrams: number;
  fatGrams: number;
  carbsGrams: number;
  timestamp: string;
}

export interface WorkoutHistoryItem {
  id: string;
  routineTitle: string;
  completedCount: number;
  totalExercises: number;
  durationMinutes: number;
  burnedCalories: number;
  exercisesCompleted: string[];
  date: string;
  time: string;
  notes?: string;
}

export interface DailyDetails {
  energyLevel: number; // 1-5
  sleepHours: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
  notes: string;
}

export interface DailyLogState {
  date: string;
  targetCalories: number;
  activeBurnCalories: number;
  items: LoggedFoodItem[];
  waterGlasses: number; // 250ml each
  waterTargetGlasses: number;
  workouts: WorkoutHistoryItem[];
  dailySteps: number;
  targetSteps: number;
  dailyDetails: DailyDetails;
}

export interface ExerciseStepGuide {
  id: string;
  name: string;
  category: 'Upper Body' | 'Lower Body' | 'Core' | 'Full Body / Cardio' | 'Mobility';
  equipmentNeeded: string;
  targetMuscles: {
    primary: string;
    secondary: string;
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  startingPosition: string;
  stepByStepExecution: string[];
  breathingCues: {
    inhale: string;
    exhale: string;
  };
  commonMistakes: {
    mistake: string;
    correction: string;
  }[];
  homeModifications: {
    easier: string;
    harder: string;
  };
  postureChecks: string[];
  recommendedRepsOrTime: string;
  medicalSafetyRule?: string;
  injuryPrevention?: {
    primaryRisk: string;
    preventionTechnique: string;
    anatomicalCue: string;
  };
  correctPostureChecklist?: {
    headAndNeck: string;
    torsoAndSpine: string;
    pelvisAndHips: string;
    limbsAndJoints: string;
  };
  contraindications?: string[];
}

export interface DailyCalorieLog {
  date: string;
  targetCalories: number;
  activeBurnCalories: number;
  items: LoggedFoodItem[];
  waterGlasses: number; // 250ml each
  waterTargetGlasses: number;
}

export interface PhysicalMetrics {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bmiClassificationColor: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  bmrCalories: number;
  tdeeCalories: number;
  targetCalories: number;
  activeBurnFromSteps: number;
  macroTargets: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    fiberGrams: number;
  };
  idealBodyWeightKg: number;
  hydrationTargetLiters: number;
  examStressMultiplier: number;
  clinicalExplanation: string;
}
