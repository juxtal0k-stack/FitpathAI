import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "fitpath.db");
const LEGACY_JSON_FILE = path.join(DATA_DIR, "individual_data.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    ensureDirectoryExists();
    dbInstance = new DatabaseSync(DB_FILE);
    initializeSchema(dbInstance);
  }
  return dbInstance;
}

export function getDatabasePath(): string {
  return DB_FILE;
}

function initializeSchema(db: DatabaseSync) {
  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  // 1. Profiles Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER DEFAULT 20,
      gender TEXT DEFAULT 'Not specified',
      height_cm REAL DEFAULT 172,
      weight_kg REAL DEFAULT 68,
      occupation_schedule TEXT DEFAULT 'Student',
      exam_date TEXT,
      days_until_exam INTEGER DEFAULT 7,
      budget_per_day REAL DEFAULT 4.5,
      dorm_facilities TEXT DEFAULT 'microwave-kettle',
      fitness_goal TEXT DEFAULT 'stress-relief',
      fitness_level TEXT DEFAULT 'beginner',
      preferred_location TEXT DEFAULT 'home-bodyweight',
      medical_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 2. Routines Table (Baseline & Scaled)
  db.exec(`
    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      profile_id TEXT,
      routine_type TEXT DEFAULT 'baseline',
      title TEXT NOT NULL,
      duration_minutes INTEGER DEFAULT 35,
      intensity_level TEXT DEFAULT 'Moderate',
      intensity_percent INTEGER DEFAULT 75,
      exam_friendly_notes TEXT,
      medical_clearance_notes TEXT,
      exercises_json TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 3. Workouts Log Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY,
      routine_title TEXT NOT NULL,
      completed_count INTEGER DEFAULT 1,
      duration_minutes INTEGER DEFAULT 20,
      burned_calories INTEGER DEFAULT 0,
      exercises_completed_json TEXT,
      date TEXT DEFAULT (date('now')),
      time TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 4. Meals Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      meal_type TEXT DEFAULT 'Breakfast',
      cost REAL DEFAULT 1.5,
      prep_time_minutes INTEGER DEFAULT 5,
      calories INTEGER DEFAULT 400,
      protein_grams REAL DEFAULT 20,
      appliances TEXT DEFAULT 'Microwave',
      ingredients_json TEXT,
      student_hack TEXT,
      medical_diet_note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 5. Daily Logs Table (Water, steps, mood, stress)
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_logs (
      date TEXT PRIMARY KEY,
      target_calories INTEGER DEFAULT 2200,
      active_burn_calories INTEGER DEFAULT 0,
      water_glasses INTEGER DEFAULT 0,
      water_target_glasses INTEGER DEFAULT 8,
      daily_steps INTEGER DEFAULT 0,
      target_steps INTEGER DEFAULT 8000,
      energy_level INTEGER DEFAULT 3,
      sleep_hours REAL DEFAULT 7.0,
      stress_level TEXT DEFAULT 'Low',
      notes TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 6. Calorie Counter Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS calorie_log_items (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      food_name TEXT NOT NULL,
      meal_type TEXT DEFAULT 'Snack',
      calories INTEGER DEFAULT 0,
      protein_grams REAL DEFAULT 0,
      fat_grams REAL DEFAULT 0,
      carbs_grams REAL DEFAULT 0,
      timestamp TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 7. Telemetry & Sensor Tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id TEXT PRIMARY KEY,
      steps_today INTEGER DEFAULT 0,
      target_steps INTEGER DEFAULT 8000,
      sleep_hours REAL DEFAULT 0,
      screen_off_sleep REAL DEFAULT 0,
      active_minutes INTEGER DEFAULT 0,
      walking_cadence_rpm REAL DEFAULT 0,
      campus_stairs_climbed INTEGER DEFAULT 0,
      source TEXT DEFAULT 'Phone Built-in Accelerometer',
      last_synced_at TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 8. Water Alarm Settings (Background process configuration)
  db.exec(`
    CREATE TABLE IF NOT EXISTS water_alarm_settings (
      id TEXT PRIMARY KEY,
      enabled INTEGER DEFAULT 1,
      interval_minutes INTEGER DEFAULT 45,
      sound_buzz INTEGER DEFAULT 1,
      last_buzz_timestamp TEXT,
      daily_goal_glasses INTEGER DEFAULT 8,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Insert default water alarm setting if empty
  const alarmRow = db.prepare("SELECT id FROM water_alarm_settings WHERE id = 'default'").get();
  if (!alarmRow) {
    db.prepare(`
      INSERT INTO water_alarm_settings (id, enabled, interval_minutes, sound_buzz, daily_goal_glasses, updated_at)
      VALUES ('default', 1, 45, 1, 8, datetime('now'))
    `).run();
  }

  // 9. App Key-Value Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 10. Device Visits Table (for Google Maps device visit tracking & distance)
  db.exec(`
    CREATE TABLE IF NOT EXISTS device_visits (
      id TEXT PRIMARY KEY,
      profile_id TEXT,
      place_name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      distance_km REAL DEFAULT 0,
      category TEXT DEFAULT 'Other',
      notes TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 11. Doctor Alerts Table (for background doctor visit alert processes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS doctor_alerts (
      id TEXT PRIMARY KEY,
      profile_id TEXT,
      doctor_name TEXT NOT NULL,
      clinic_name TEXT,
      specialty TEXT,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      notes TEXT,
      enabled INTEGER DEFAULT 1,
      triggered INTEGER DEFAULT 0,
      sound_enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Migrate / alter columns for profiles table dynamically
  try {
    const profileCols = (db.prepare("PRAGMA table_info(profiles)").all() as any[]).map((c: any) => c.name);
    const addCol = (colName: string, colDef: string) => {
      if (!profileCols.includes(colName)) {
        try {
          db.exec(`ALTER TABLE profiles ADD COLUMN ${colName} ${colDef};`);
        } catch {}
      }
    };
    addCol("father_name", "TEXT");
    addCol("dob", "TEXT");
    addCol("phone_country_code", "TEXT DEFAULT '+91'");
    addCol("phone_number", "TEXT");
    addCol("email", "TEXT");
    addCol("password", "TEXT");
    addCol("address_country", "TEXT DEFAULT 'India'");
    addCol("address_state", "TEXT");
    addCol("address_city", "TEXT");
    addCol("address_line", "TEXT");
    addCol("postal_code", "TEXT");
    addCol("height_unit", "TEXT DEFAULT 'cm'");
    addCol("blood_group", "TEXT DEFAULT 'O+'");
    addCol("doctor_visit_date", "TEXT");
    addCol("doctor_visit_time", "TEXT");
    addCol("doctor_name", "TEXT");
    addCol("doctor_notes", "TEXT");
    addCol("doctor_alert_enabled", "INTEGER DEFAULT 1");
    addCol("doctor_specialty", "TEXT");
    addCol("doctor_clinic", "TEXT");
    addCol("last_latitude", "REAL DEFAULT 18.9220");
    addCol("last_longitude", "REAL DEFAULT 72.8347");
    addCol("total_distance_km", "REAL DEFAULT 0");
  } catch {}

  // Seed sample device visits if table is empty
  try {
    const visitCount = db.prepare("SELECT COUNT(*) as count FROM device_visits").get() as any;
    if (!visitCount || visitCount.count === 0) {
      const sampleVisits = [
        { id: 'visit-1', name: 'Start Location / Home Residence', lat: 18.9220, lng: 72.8347, dist: 0.0, cat: 'Home', notes: 'Base tracking start location from registered address' },
        { id: 'visit-2', name: 'Dr. Sharma Family Clinic', lat: 18.9275, lng: 72.8310, dist: 0.85, cat: 'Clinic/Doctor', notes: 'Scheduled checkup & blood pressure monitoring' },
        { id: 'visit-3', name: 'Campus Athletic Complex & Track', lat: 18.9320, lng: 72.8280, dist: 1.62, cat: 'Gym', notes: 'Cardio, stretching, and resistance routine' },
        { id: 'visit-4', name: 'Central University Library', lat: 18.9380, lng: 72.8325, dist: 2.45, cat: 'Library', notes: 'Quiet study hall & posture break' },
        { id: 'visit-5', name: 'Organic Nutrition Cafe & Juice Bar', lat: 18.9420, lng: 72.8360, dist: 3.10, cat: 'Market', notes: 'Post-workout hydration & high-protein snack' },
      ];
      for (const v of sampleVisits) {
        db.prepare(`
          INSERT INTO device_visits (id, place_name, latitude, longitude, distance_km, category, notes, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-${Math.floor(Math.random() * 24)} hours'))
        `).run(v.id, v.name, v.lat, v.lng, v.dist, v.cat, v.notes);
      }
    }
  } catch {}

  // Migrate legacy json if db is completely empty
  migrateLegacyDataIfNeeded(db);
}

function migrateLegacyDataIfNeeded(db: DatabaseSync) {
  try {
    const existingProfile = db.prepare("SELECT id FROM profiles LIMIT 1").get();
    if (!existingProfile && fs.existsSync(LEGACY_JSON_FILE)) {
      const raw = fs.readFileSync(LEGACY_JSON_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.exists && parsed.profile) {
        const p = parsed.profile;
        const profileId = p.id || `profile-${Date.now()}`;
        db.prepare(`
          INSERT INTO profiles (
            id, name, age, gender, height_cm, weight_kg,
            occupation_schedule, exam_date, days_until_exam,
            budget_per_day, dorm_facilities, fitness_goal,
            fitness_level, preferred_location, medical_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          profileId,
          p.name,
          p.age || 20,
          p.gender || "Not specified",
          p.heightCm || 172,
          p.weightKg || 68,
          p.occupationOrSchedule || "Student",
          p.examDate || "",
          p.daysUntilExam ?? 7,
          p.budgetPerDay || 4.5,
          p.dormFacilities || "microwave-kettle",
          p.fitnessGoal || "stress-relief",
          p.fitnessLevel || "beginner",
          p.preferredLocation || "home-bodyweight",
          JSON.stringify(p.medical || {})
        );

        // Routines
        if (parsed.baselineRoutine) {
          db.prepare(`
            INSERT INTO routines (id, profile_id, routine_type, title, duration_minutes, intensity_level, intensity_percent, exam_friendly_notes, medical_clearance_notes, exercises_json)
            VALUES (?, ?, 'baseline', ?, ?, ?, ?, ?, ?, ?)
          `).run(
            parsed.baselineRoutine.id || `routine-base-${Date.now()}`,
            profileId,
            parsed.baselineRoutine.title || "Baseline Routine",
            parsed.baselineRoutine.durationMinutes || 35,
            parsed.baselineRoutine.intensityLevel || "Moderate",
            parsed.baselineRoutine.intensityPercent || 75,
            parsed.baselineRoutine.examFriendlyNotes || "",
            parsed.baselineRoutine.medicalClearanceNotes || "",
            JSON.stringify(parsed.baselineRoutine.exercises || [])
          );
        }

        if (parsed.scaledRoutine) {
          db.prepare(`
            INSERT INTO routines (id, profile_id, routine_type, title, duration_minutes, intensity_level, intensity_percent, exam_friendly_notes, medical_clearance_notes, exercises_json)
            VALUES (?, ?, 'scaled', ?, ?, ?, ?, ?, ?, ?)
          `).run(
            parsed.scaledRoutine.id || `routine-scaled-${Date.now()}`,
            profileId,
            parsed.scaledRoutine.title || "Scaled Routine",
            parsed.scaledRoutine.durationMinutes || 18,
            parsed.scaledRoutine.intensityLevel || "Low",
            parsed.scaledRoutine.intensityPercent || 40,
            parsed.scaledRoutine.examFriendlyNotes || "",
            parsed.scaledRoutine.medicalClearanceNotes || "",
            JSON.stringify(parsed.scaledRoutine.exercises || [])
          );
        }

        // Active routine setting
        db.prepare(`
          INSERT OR REPLACE INTO app_settings (key, value, updated_at)
          VALUES ('active_scaled_status', ?, datetime('now'))
        `).run(parsed.isAutoScaled ? "true" : "false");

        // Meals
        if (Array.isArray(parsed.meals)) {
          for (const m of parsed.meals) {
            db.prepare(`
              INSERT OR REPLACE INTO meals (id, name, meal_type, cost, prep_time_minutes, calories, protein_grams, appliances, ingredients_json, student_hack, medical_diet_note)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
              m.id || `meal-${Date.now()}-${Math.random()}`,
              m.name,
              m.mealType || "Breakfast",
              m.cost || 1.5,
              m.prepTimeMinutes || 5,
              m.calories || 400,
              m.proteinGrams || 20,
              m.appliances || "Microwave",
              JSON.stringify(m.ingredients || []),
              m.studentHack || "",
              m.medicalDietNote || ""
            );
          }
        }

        // Daily Calorie Log
        if (parsed.dailyCalorieLog) {
          const dl = parsed.dailyCalorieLog;
          const today = dl.date || new Date().toISOString().split("T")[0];
          db.prepare(`
            INSERT OR REPLACE INTO daily_logs (date, target_calories, active_burn_calories, water_glasses, water_target_glasses, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
          `).run(
            today,
            dl.targetCalories || 2200,
            dl.activeBurnCalories || 0,
            dl.waterGlasses || 0,
            dl.waterTargetGlasses || 8
          );

          if (Array.isArray(dl.items)) {
            for (const item of dl.items) {
              db.prepare(`
                INSERT OR REPLACE INTO calorie_log_items (id, date, food_name, meal_type, calories, protein_grams, fat_grams, carbs_grams, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).run(
                item.id || `item-${Date.now()}-${Math.random()}`,
                today,
                item.foodName,
                item.mealType || "Snack",
                item.calories || 0,
                item.proteinGrams || 0,
                item.fatGrams || 0,
                item.carbsGrams || 0,
                item.timestamp || ""
              );
            }
          }
        }

        // Telemetry
        if (parsed.telemetry) {
          const t = parsed.telemetry;
          db.prepare(`
            INSERT OR REPLACE INTO telemetry (id, steps_today, target_steps, sleep_hours, screen_off_sleep, active_minutes, walking_cadence_rpm, campus_stairs_climbed, source, last_synced_at)
            VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            t.stepsToday || 0,
            t.targetSteps || 8000,
            t.sleepHours || 0,
            t.screenOffEstimatedSleep || 0,
            t.activeMinutes || 0,
            t.walkingCadenceRpm || 0,
            t.campusStairsClimbed || 0,
            t.source || "Phone Built-in Accelerometer",
            t.lastSyncedAt || ""
          );
        }
      }
    }
  } catch (err) {
    console.warn("Legacy data migration warning:", err);
  }
}

// ---------------------------------------------------------------------------
// High-Level Data Access Functions for FitPath App
// ---------------------------------------------------------------------------

export function getFullAppData() {
  const db = getDatabase();

  const profileRow = db.prepare("SELECT * FROM profiles ORDER BY updated_at DESC LIMIT 1").get() as any;
  if (!profileRow) {
    return {
      exists: false,
      profile: null,
      activeRoutine: null,
      baselineRoutine: null,
      scaledRoutine: null,
      meals: [],
      telemetry: null,
      isAutoScaled: false,
      workoutHistory: [],
      dailyCalorieLog: {
        date: new Date().toISOString().split("T")[0],
        targetCalories: 2200,
        activeBurnCalories: 0,
        items: [],
        waterGlasses: 0,
        waterTargetGlasses: 8,
      },
      dailyLog: null,
    };
  }

  let medical = {};
  try {
    medical = profileRow.medical_json ? JSON.parse(profileRow.medical_json) : {};
  } catch {}

  const profile = {
    id: profileRow.id,
    name: profileRow.name,
    fatherName: profileRow.father_name || '',
    dob: profileRow.dob || '',
    age: profileRow.age,
    gender: profileRow.gender || 'Not specified',
    phoneCountryCode: profileRow.phone_country_code || '+91',
    phoneNumber: profileRow.phone_number || '',
    email: profileRow.email || '',
    password: profileRow.password || '',
    addressCountry: profileRow.address_country || 'India',
    addressState: profileRow.address_state || 'Maharashtra',
    addressCity: profileRow.address_city || 'Mumbai',
    addressLine: profileRow.address_line || '12 Marine Drive, Nariman Point',
    postalCode: profileRow.postal_code || '400021',
    heightCm: profileRow.height_cm,
    heightUnit: profileRow.height_unit || 'cm',
    weightKg: profileRow.weight_kg,
    bloodGroup: profileRow.blood_group || 'O+',
    occupationOrSchedule: profileRow.occupation_schedule,
    examDate: profileRow.exam_date,
    daysUntilExam: profileRow.days_until_exam,
    budgetPerDay: profileRow.budget_per_day,
    dormFacilities: profileRow.dorm_facilities,
    fitnessGoal: profileRow.fitness_goal,
    fitnessLevel: profileRow.fitness_level,
    preferredLocation: profileRow.preferred_location,
    medical,
    doctorAlert: {
      doctorName: profileRow.doctor_name || 'Dr. Sharma',
      clinicName: profileRow.doctor_clinic || 'Apollo Family Health',
      specialty: profileRow.doctor_specialty || 'General Physician & Sports Medicine',
      appointmentDate: profileRow.doctor_visit_date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointmentTime: profileRow.doctor_visit_time || '10:30',
      notes: profileRow.doctor_notes || 'Annual fitness clearance & vitals screening',
      enabled: profileRow.doctor_alert_enabled !== 0,
      soundEnabled: true,
    },
    deviceLocation: {
      latitude: profileRow.last_latitude || 18.9220,
      longitude: profileRow.last_longitude || 72.8347,
      address: profileRow.address_line || '12 Marine Drive, Nariman Point',
      city: profileRow.address_city || 'Mumbai',
      state: profileRow.address_state || 'Maharashtra',
      country: profileRow.address_country || 'India',
      postalCode: profileRow.postal_code || '400021',
      totalDistanceKm: profileRow.total_distance_km || 4.2,
      lastUpdated: profileRow.updated_at || new Date().toISOString(),
    },
    updatedAt: profileRow.updated_at,
  };

  // Fetch Routines
  const routineRows = db.prepare("SELECT * FROM routines WHERE profile_id = ?").all(profileRow.id) as any[];
  let baselineRoutine: any = null;
  let scaledRoutine: any = null;

  for (const r of routineRows) {
    let exercises = [];
    try {
      exercises = r.exercises_json ? JSON.parse(r.exercises_json) : [];
    } catch {}

    const formatted = {
      id: r.id,
      title: r.title,
      durationMinutes: r.duration_minutes,
      intensityLevel: r.intensity_level,
      intensityPercent: r.intensity_percent,
      examFriendlyNotes: r.exam_friendly_notes,
      medicalClearanceNotes: r.medical_clearance_notes,
      exercises,
    };

    if (r.routine_type === "baseline") {
      baselineRoutine = formatted;
    } else if (r.routine_type === "scaled") {
      scaledRoutine = formatted;
    }
  }

  // Active status
  const scaledSetting = db.prepare("SELECT value FROM app_settings WHERE key = 'active_scaled_status'").get() as any;
  const isAutoScaled = scaledSetting ? scaledSetting.value === "true" : profile.daysUntilExam <= 8;
  const activeRoutine = isAutoScaled ? scaledRoutine || baselineRoutine : baselineRoutine || scaledRoutine;

  // Meals
  const mealRows = db.prepare("SELECT * FROM meals ORDER BY created_at DESC").all() as any[];
  const meals = mealRows.map((m) => {
    let ingredients = [];
    try {
      ingredients = m.ingredients_json ? JSON.parse(m.ingredients_json) : [];
    } catch {}
    return {
      id: m.id,
      name: m.name,
      mealType: m.meal_type,
      cost: m.cost,
      prepTimeMinutes: m.prep_time_minutes,
      calories: m.calories,
      proteinGrams: m.protein_grams,
      appliances: m.appliances,
      ingredients,
      studentHack: m.student_hack,
      medicalDietNote: m.medical_diet_note,
    };
  });

  // Telemetry
  const telemetryRow = db.prepare("SELECT * FROM telemetry WHERE id = 'default'").get() as any;
  const telemetry = telemetryRow
    ? {
        stepsToday: telemetryRow.steps_today,
        targetSteps: telemetryRow.target_steps,
        sleepHours: telemetryRow.sleep_hours,
        screenOffEstimatedSleep: telemetryRow.screen_off_sleep,
        activeMinutes: telemetryRow.active_minutes,
        walkingCadenceRpm: telemetryRow.walking_cadence_rpm,
        campusStairsClimbed: telemetryRow.campus_stairs_climbed,
        source: telemetryRow.source,
        lastSyncedAt: telemetryRow.last_synced_at,
      }
    : null;

  // Workouts
  const workoutRows = db.prepare("SELECT * FROM workouts ORDER BY created_at DESC LIMIT 30").all() as any[];
  const workoutHistory = workoutRows.map((w) => {
    let exercisesCompleted = [];
    try {
      exercisesCompleted = w.exercises_completed_json ? JSON.parse(w.exercises_completed_json) : [];
    } catch {}
    return {
      id: w.id,
      routineTitle: w.routine_title,
      completedCount: w.completed_count,
      durationMinutes: w.duration_minutes,
      burnedCalories: w.burned_calories,
      exercisesCompleted,
      date: w.date,
      time: w.time,
      notes: w.notes,
    };
  });

  // Daily log & Calorie Counter
  const today = new Date().toISOString().split("T")[0];
  const dailyLogRow = db.prepare("SELECT * FROM daily_logs WHERE date = ?").get(today) as any;
  const calorieItemRows = db.prepare("SELECT * FROM calorie_log_items WHERE date = ? ORDER BY created_at DESC").all(today) as any[];

  const dailyCalorieLog = {
    date: today,
    targetCalories: dailyLogRow ? dailyLogRow.target_calories : 2200,
    activeBurnCalories: dailyLogRow ? dailyLogRow.active_burn_calories : 0,
    waterGlasses: dailyLogRow ? dailyLogRow.water_glasses : 0,
    waterTargetGlasses: dailyLogRow ? dailyLogRow.water_target_glasses : 8,
    items: calorieItemRows.map((it) => ({
      id: it.id,
      foodName: it.food_name,
      mealType: it.meal_type,
      calories: it.calories,
      proteinGrams: it.protein_grams,
      fatGrams: it.fat_grams,
      carbsGrams: it.carbs_grams,
      timestamp: it.timestamp,
    })),
  };

  const dailyLogSetting = db.prepare("SELECT value FROM app_settings WHERE key = 'full_daily_log'").get() as any;
  let dailyLog = null;
  if (dailyLogSetting && dailyLogSetting.value) {
    try {
      dailyLog = JSON.parse(dailyLogSetting.value);
    } catch {}
  }

  // Extract any dynamic columns added to profiles
  const standardProfileKeys = new Set([
    'id', 'name', 'age', 'gender', 'height_cm', 'weight_kg',
    'occupation_schedule', 'exam_date', 'days_until_exam',
    'budget_per_day', 'dorm_facilities', 'fitness_goal',
    'fitness_level', 'preferred_location', 'medical_json',
    'created_at', 'updated_at'
  ]);

  const customFields: Record<string, any> = {};
  for (const [k, v] of Object.entries(profileRow)) {
    if (!standardProfileKeys.has(k)) {
      customFields[k] = v;
    }
  }

  const schemaInfo = getSchemaVersion();

  // Fetch device visits for Google Maps tracking
  let deviceVisits: any[] = [];
  try {
    const visitRows = db.prepare("SELECT * FROM device_visits ORDER BY timestamp DESC LIMIT 50").all() as any[];
    deviceVisits = visitRows.map((v) => ({
      id: v.id,
      placeName: v.place_name,
      latitude: v.latitude,
      longitude: v.longitude,
      distanceKm: v.distance_km,
      category: v.category,
      notes: v.notes,
      timestamp: v.timestamp,
    }));
  } catch {}

  return {
    exists: true,
    profile: {
      ...profile,
      customFields,
    },
    baselineRoutine,
    scaledRoutine,
    activeRoutine,
    isAutoScaled,
    meals,
    telemetry,
    workoutHistory,
    dailyCalorieLog,
    dailyLog,
    deviceVisits,
    schemaInfo,
  };
}

export function saveProfileData(profileData: any, baselineRoutine: any, scaledRoutine: any, meals: any[]) {
  const db = getDatabase();
  const profileId = profileData.id || `profile-${Date.now()}`;

  const docAlert = profileData.doctorAlert || {};
  const devLoc = profileData.deviceLocation || {};

  // Upsert profile with all demographic, address, medical, alert and location fields
  db.prepare(`
    INSERT OR REPLACE INTO profiles (
      id, name, father_name, dob, age, gender, phone_country_code, phone_number,
      email, password, address_country, address_state, address_city, address_line,
      postal_code, height_cm, height_unit, weight_kg, blood_group,
      doctor_visit_date, doctor_visit_time, doctor_name, doctor_notes, doctor_alert_enabled,
      doctor_specialty, doctor_clinic, last_latitude, last_longitude, total_distance_km,
      occupation_schedule, exam_date, days_until_exam,
      budget_per_day, dorm_facilities, fitness_goal,
      fitness_level, preferred_location, medical_json, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, datetime('now')
    )
  `).run(
    profileId,
    profileData.name,
    profileData.fatherName || '',
    profileData.dob || '',
    profileData.age || 20,
    profileData.gender || 'Not specified',
    profileData.phoneCountryCode || '+91',
    profileData.phoneNumber || '',
    profileData.email || '',
    profileData.password || '',
    profileData.addressCountry || 'India',
    profileData.addressState || 'Maharashtra',
    profileData.addressCity || 'Mumbai',
    profileData.addressLine || '12 Marine Drive, Nariman Point',
    profileData.postalCode || '400021',
    profileData.heightCm || 172,
    profileData.heightUnit || 'cm',
    profileData.weightKg || 68,
    profileData.bloodGroup || 'O+',
    docAlert.appointmentDate || profileData.doctorVisitDate || '',
    docAlert.appointmentTime || profileData.doctorVisitTime || '',
    docAlert.doctorName || profileData.doctorName || 'Dr. Sharma',
    docAlert.notes || profileData.doctorNotes || '',
    docAlert.enabled !== false ? 1 : 0,
    docAlert.specialty || 'General Physician',
    docAlert.clinicName || 'Apollo Health',
    devLoc.latitude || profileData.lastLatitude || 18.9220,
    devLoc.longitude || profileData.lastLongitude || 72.8347,
    devLoc.totalDistanceKm || profileData.totalDistanceKm || 0,
    profileData.occupationOrSchedule || 'Student',
    profileData.examDate || '',
    profileData.daysUntilExam ?? 7,
    profileData.budgetPerDay || 4.5,
    profileData.dormFacilities || 'microwave-kettle',
    profileData.fitnessGoal || 'stress-relief',
    profileData.fitnessLevel || 'beginner',
    profileData.preferredLocation || 'home-bodyweight',
    JSON.stringify(profileData.medical || {})
  );

  // Sync to doctor_alerts table as well
  if (docAlert.doctorName) {
    db.prepare(`
      INSERT OR REPLACE INTO doctor_alerts (
        id, profile_id, doctor_name, clinic_name, specialty,
        appointment_date, appointment_time, notes, enabled, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      'default-alert',
      profileId,
      docAlert.doctorName,
      docAlert.clinicName || 'Apollo Health',
      docAlert.specialty || 'General Medicine',
      docAlert.appointmentDate || '',
      docAlert.appointmentTime || '',
      docAlert.notes || '',
      docAlert.enabled !== false ? 1 : 0
    );
  }

  // Clear previous routines for this profile and insert new
  db.prepare("DELETE FROM routines WHERE profile_id = ?").run(profileId);

  if (baselineRoutine) {
    db.prepare(`
      INSERT INTO routines (id, profile_id, routine_type, title, duration_minutes, intensity_level, intensity_percent, exam_friendly_notes, medical_clearance_notes, exercises_json)
      VALUES (?, ?, 'baseline', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      baselineRoutine.id || `routine-base-${Date.now()}`,
      profileId,
      baselineRoutine.title || "Baseline Routine",
      baselineRoutine.durationMinutes || 35,
      baselineRoutine.intensityLevel || "Moderate",
      baselineRoutine.intensityPercent || 75,
      baselineRoutine.examFriendlyNotes || "",
      baselineRoutine.medicalClearanceNotes || "",
      JSON.stringify(baselineRoutine.exercises || [])
    );
  }

  if (scaledRoutine) {
    db.prepare(`
      INSERT INTO routines (id, profile_id, routine_type, title, duration_minutes, intensity_level, intensity_percent, exam_friendly_notes, medical_clearance_notes, exercises_json)
      VALUES (?, ?, 'scaled', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      scaledRoutine.id || `routine-scaled-${Date.now()}`,
      profileId,
      scaledRoutine.title || "Scaled Routine",
      scaledRoutine.durationMinutes || 18,
      scaledRoutine.intensityLevel || "Low",
      scaledRoutine.intensityPercent || 40,
      scaledRoutine.examFriendlyNotes || "",
      scaledRoutine.medicalClearanceNotes || "",
      JSON.stringify(scaledRoutine.exercises || [])
    );
  }

  // Clear meals and re-insert
  if (Array.isArray(meals) && meals.length > 0) {
    db.prepare("DELETE FROM meals").run();
    for (const m of meals) {
      db.prepare(`
        INSERT INTO meals (id, name, meal_type, cost, prep_time_minutes, calories, protein_grams, appliances, ingredients_json, student_hack, medical_diet_note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        m.id || `meal-${Date.now()}-${Math.random()}`,
        m.name,
        m.mealType || "Breakfast",
        m.cost || 1.5,
        m.prepTimeMinutes || 5,
        m.calories || 400,
        m.proteinGrams || 20,
        m.appliances || "Microwave",
        JSON.stringify(m.ingredients || []),
        m.studentHack || "",
        m.medicalDietNote || ""
      );
    }
  }

  // Initialize telemetry if not present
  const existingTelemetry = db.prepare("SELECT id FROM telemetry WHERE id = 'default'").get();
  if (!existingTelemetry) {
    db.prepare(`
      INSERT INTO telemetry (id, steps_today, target_steps, sleep_hours, screen_off_sleep, active_minutes, walking_cadence_rpm, campus_stairs_climbed, source, last_synced_at)
      VALUES ('default', 0, 8000, 0, 0, 0, 0, 0, 'Phone Built-in Accelerometer', 'Initialized from phone sensors (0 steps)')
    `).run();
  }
}

export function resetAllDatabaseData() {
  const db = getDatabase();
  db.exec("DELETE FROM profiles;");
  db.exec("DELETE FROM routines;");
  db.exec("DELETE FROM workouts;");
  db.exec("DELETE FROM meals;");
  db.exec("DELETE FROM daily_logs;");
  db.exec("DELETE FROM calorie_log_items;");
  db.exec("DELETE FROM telemetry;");
  db.exec("DELETE FROM app_settings;");

  // Re-seed default water alarm setting
  db.prepare(`
    INSERT OR REPLACE INTO water_alarm_settings (id, enabled, interval_minutes, sound_buzz, daily_goal_glasses, updated_at)
    VALUES ('default', 1, 45, 1, 8, datetime('now'))
  `).run();

  if (fs.existsSync(LEGACY_JSON_FILE)) {
    try {
      fs.unlinkSync(LEGACY_JSON_FILE);
    } catch {}
  }
}

export function logWorkout(routineTitle: string, completedCount: number, durationMinutes: number, burnedCalories: number, exercises: string[] = []) {
  const db = getDatabase();
  const id = `workout-${Date.now()}`;
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  db.prepare(`
    INSERT INTO workouts (id, routine_title, completed_count, duration_minutes, burned_calories, exercises_completed_json, date, time, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Completed FitPath Session', datetime('now'))
  `).run(
    id,
    routineTitle,
    completedCount,
    durationMinutes,
    burnedCalories,
    JSON.stringify(exercises),
    dateStr,
    timeStr
  );

  // Update daily active burn
  db.prepare(`
    INSERT INTO daily_logs (date, active_burn_calories, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(date) DO UPDATE SET
      active_burn_calories = active_burn_calories + excluded.active_burn_calories,
      updated_at = datetime('now')
  `).run(dateStr, burnedCalories);
}

export function syncTelemetry(telemetryData: any) {
  const db = getDatabase();
  const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  db.prepare(`
    INSERT INTO telemetry (id, steps_today, target_steps, sleep_hours, screen_off_sleep, active_minutes, walking_cadence_rpm, campus_stairs_climbed, source, last_synced_at, updated_at)
    VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      steps_today = excluded.steps_today,
      target_steps = excluded.target_steps,
      sleep_hours = excluded.sleep_hours,
      screen_off_sleep = excluded.screen_off_sleep,
      active_minutes = excluded.active_minutes,
      walking_cadence_rpm = excluded.walking_cadence_rpm,
      campus_stairs_climbed = excluded.campus_stairs_climbed,
      source = excluded.source,
      last_synced_at = excluded.last_synced_at,
      updated_at = datetime('now')
  `).run(
    telemetryData.stepsToday || 0,
    telemetryData.targetSteps || 8000,
    telemetryData.sleepHours || 0,
    telemetryData.screenOffEstimatedSleep || 0,
    telemetryData.activeMinutes || 0,
    telemetryData.walkingCadenceRpm || 0,
    telemetryData.campusStairsClimbed || 0,
    telemetryData.source || "Phone Built-in Accelerometer",
    nowStr
  );
}

export function setPlanScaled(useScaled: boolean) {
  const db = getDatabase();
  db.prepare(`
    INSERT OR REPLACE INTO app_settings (key, value, updated_at)
    VALUES ('active_scaled_status', ?, datetime('now'))
  `).run(useScaled ? "true" : "false");
}

export function addCalorieLogItem(item: { foodName: string; mealType?: string; calories: number; proteinGrams?: number; fatGrams?: number; carbsGrams?: number }) {
  const db = getDatabase();
  const today = new Date().toISOString().split("T")[0];
  const id = `cal-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  db.prepare(`
    INSERT INTO calorie_log_items (id, date, food_name, meal_type, calories, protein_grams, fat_grams, carbs_grams, timestamp, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    id,
    today,
    item.foodName,
    item.mealType || "Snack",
    item.calories || 0,
    item.proteinGrams || 0,
    item.fatGrams || 0,
    item.carbsGrams || 0,
    timestamp
  );

  return { id, timestamp, ...item, date: today };
}

export function deleteCalorieLogItem(id: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM calorie_log_items WHERE id = ?").run(id);
}

export function updateWaterIntake(deltaGlasses: number) {
  const db = getDatabase();
  const today = new Date().toISOString().split("T")[0];

  db.prepare(`
    INSERT INTO daily_logs (date, water_glasses, water_target_glasses, updated_at)
    VALUES (?, max(0, ?), 8, datetime('now'))
    ON CONFLICT(date) DO UPDATE SET
      water_glasses = max(0, daily_logs.water_glasses + ?),
      updated_at = datetime('now')
  `).run(today, deltaGlasses, deltaGlasses);

  const row = db.prepare("SELECT water_glasses FROM daily_logs WHERE date = ?").get(today) as any;
  return row ? row.water_glasses : 0;
}

export function saveFullDailyLog(dailyLog: any) {
  const db = getDatabase();
  db.prepare(`
    INSERT OR REPLACE INTO app_settings (key, value, updated_at)
    VALUES ('full_daily_log', ?, datetime('now'))
  `).run(JSON.stringify(dailyLog));
}

export function getWaterAlarmSettings() {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM water_alarm_settings WHERE id = 'default'").get() as any;
  if (!row) {
    return {
      enabled: true,
      intervalMinutes: 45,
      soundBuzz: true,
      dailyGoalGlasses: 8,
      lastBuzzTimestamp: null,
    };
  }
  return {
    enabled: Boolean(row.enabled),
    intervalMinutes: row.interval_minutes,
    soundBuzz: Boolean(row.sound_buzz),
    dailyGoalGlasses: row.daily_goal_glasses,
    lastBuzzTimestamp: row.last_buzz_timestamp,
  };
}

export function updateWaterAlarmSettings(settings: { enabled?: boolean; intervalMinutes?: number; soundBuzz?: boolean; lastBuzzTimestamp?: string }) {
  const db = getDatabase();
  const current = getWaterAlarmSettings();
  const enabled = settings.enabled !== undefined ? (settings.enabled ? 1 : 0) : (current.enabled ? 1 : 0);
  const intervalMinutes = settings.intervalMinutes !== undefined ? settings.intervalMinutes : current.intervalMinutes;
  const soundBuzz = settings.soundBuzz !== undefined ? (settings.soundBuzz ? 1 : 0) : (current.soundBuzz ? 1 : 0);
  const lastBuzz = settings.lastBuzzTimestamp !== undefined ? settings.lastBuzzTimestamp : current.lastBuzzTimestamp;

  db.prepare(`
    INSERT INTO water_alarm_settings (id, enabled, interval_minutes, sound_buzz, last_buzz_timestamp, updated_at)
    VALUES ('default', ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      enabled = excluded.enabled,
      interval_minutes = excluded.interval_minutes,
      sound_buzz = excluded.sound_buzz,
      last_buzz_timestamp = excluded.last_buzz_timestamp,
      updated_at = datetime('now')
  `).run(enabled, intervalMinutes, soundBuzz, lastBuzz);

  return getWaterAlarmSettings();
}

// ---------------------------------------------------------------------------
// Google Maps Device Visits & Location Tracking APIs
// ---------------------------------------------------------------------------

export function getDeviceVisits() {
  const db = getDatabase();
  const rows = db.prepare("SELECT * FROM device_visits ORDER BY timestamp DESC LIMIT 100").all() as any[];
  return rows.map((v) => ({
    id: v.id,
    profileId: v.profile_id,
    placeName: v.place_name,
    latitude: v.latitude,
    longitude: v.longitude,
    distanceKm: v.distance_km,
    category: v.category,
    notes: v.notes,
    timestamp: v.timestamp,
  }));
}

export function addDeviceVisit(visit: {
  placeName: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  category?: string;
  notes?: string;
}) {
  const db = getDatabase();
  const id = `visit-${Date.now()}`;
  db.prepare(`
    INSERT INTO device_visits (id, place_name, latitude, longitude, distance_km, category, notes, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    id,
    visit.placeName,
    visit.latitude,
    visit.longitude,
    visit.distanceKm || 0,
    visit.category || 'Other',
    visit.notes || ''
  );

  // Update profile last location and distance
  db.prepare(`
    UPDATE profiles SET
      last_latitude = ?,
      last_longitude = ?,
      total_distance_km = total_distance_km + ?,
      updated_at = datetime('now')
  `).run(visit.latitude, visit.longitude, visit.distanceKm || 0);

  return { id, ...visit, timestamp: new Date().toISOString() };
}

export function deleteDeviceVisit(id: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM device_visits WHERE id = ?").run(id);
  return { success: true, id };
}

// ---------------------------------------------------------------------------
// Background Doctor Visit Alert APIs
// ---------------------------------------------------------------------------

export function getDoctorAlert() {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM doctor_alerts WHERE id = 'default-alert'").get() as any;
  if (!row) {
    return {
      id: 'default-alert',
      doctorName: 'Dr. Sharma',
      clinicName: 'Apollo Family Health',
      specialty: 'Sports Medicine & General Physician',
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      appointmentTime: '10:30',
      notes: 'Routine postural & cardiac fitness assessment',
      enabled: true,
      soundEnabled: true,
      triggered: false,
    };
  }
  return {
    id: row.id,
    doctorName: row.doctor_name,
    clinicName: row.clinic_name,
    specialty: row.specialty,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    notes: row.notes,
    enabled: Boolean(row.enabled),
    soundEnabled: Boolean(row.sound_enabled),
    triggered: Boolean(row.triggered),
  };
}

export function saveDoctorAlert(alert: {
  doctorName?: string;
  clinicName?: string;
  specialty?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
  enabled?: boolean;
  soundEnabled?: boolean;
}) {
  const db = getDatabase();
  const cur = getDoctorAlert();
  const doctorName = alert.doctorName || cur.doctorName;
  const clinicName = alert.clinicName !== undefined ? alert.clinicName : cur.clinicName;
  const specialty = alert.specialty !== undefined ? alert.specialty : cur.specialty;
  const apptDate = alert.appointmentDate || cur.appointmentDate;
  const apptTime = alert.appointmentTime || cur.appointmentTime;
  const notes = alert.notes !== undefined ? alert.notes : cur.notes;
  const enabled = alert.enabled !== undefined ? (alert.enabled ? 1 : 0) : (cur.enabled ? 1 : 0);
  const soundEnabled = alert.soundEnabled !== undefined ? (alert.soundEnabled ? 1 : 0) : (cur.soundEnabled ? 1 : 0);

  db.prepare(`
    INSERT INTO doctor_alerts (id, profile_id, doctor_name, clinic_name, specialty, appointment_date, appointment_time, notes, enabled, sound_enabled, updated_at)
    VALUES ('default-alert', 'default', ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      doctor_name = excluded.doctor_name,
      clinic_name = excluded.clinic_name,
      specialty = excluded.specialty,
      appointment_date = excluded.appointment_date,
      appointment_time = excluded.appointment_time,
      notes = excluded.notes,
      enabled = excluded.enabled,
      sound_enabled = excluded.sound_enabled,
      updated_at = datetime('now')
  `).run(doctorName, clinicName, specialty, apptDate, apptTime, notes, enabled, soundEnabled);

  // Sync to profile table as well
  db.prepare(`
    UPDATE profiles SET
      doctor_name = ?,
      doctor_clinic = ?,
      doctor_specialty = ?,
      doctor_visit_date = ?,
      doctor_visit_time = ?,
      doctor_notes = ?,
      doctor_alert_enabled = ?,
      updated_at = datetime('now')
  `).run(doctorName, clinicName, specialty, apptDate, apptTime, notes, enabled);

  return getDoctorAlert();
}

export function triggerDoctorAlert() {
  const db = getDatabase();
  db.prepare("UPDATE doctor_alerts SET triggered = 1, updated_at = datetime('now') WHERE id = 'default-alert'").run();
  return { success: true, triggered: true };
}

export function dismissDoctorAlert() {
  const db = getDatabase();
  db.prepare("UPDATE doctor_alerts SET triggered = 0, updated_at = datetime('now') WHERE id = 'default-alert'").run();
  return { success: true, dismissed: true };
}

// ---------------------------------------------------------------------------
// High-Frequency 1-Second Auto Sync Engine
// (Syncs every single second to keep client, sensors, map, and SQLite aligned)
// ---------------------------------------------------------------------------

export function liveTickSync(tickData: {
  stepsToday?: number;
  walkingCadenceRpm?: number;
  activeMinutes?: number;
  latitude?: number;
  longitude?: number;
  distanceIncrementKm?: number;
  totalDistanceKm?: number;
  waterGlasses?: number;
}) {
  const db = getDatabase();
  const today = new Date().toISOString().split('T')[0];

  // 1. Update Telemetry
  if (tickData.stepsToday !== undefined || tickData.walkingCadenceRpm !== undefined) {
    db.prepare(`
      INSERT INTO telemetry (id, steps_today, active_minutes, walking_cadence_rpm, updated_at)
      VALUES ('default', ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        steps_today = coalesce(excluded.steps_today, telemetry.steps_today),
        active_minutes = coalesce(excluded.active_minutes, telemetry.active_minutes),
        walking_cadence_rpm = coalesce(excluded.walking_cadence_rpm, telemetry.walking_cadence_rpm),
        updated_at = datetime('now')
    `).run(
      tickData.stepsToday ?? 0,
      tickData.activeMinutes ?? 0,
      tickData.walkingCadenceRpm ?? 0
    );
  }

  // 2. Update Location & Distance in Profile
  if (tickData.latitude !== undefined && tickData.longitude !== undefined) {
    db.prepare(`
      UPDATE profiles SET
        last_latitude = ?,
        last_longitude = ?,
        total_distance_km = coalesce(?, total_distance_km),
        updated_at = datetime('now')
    `).run(
      tickData.latitude,
      tickData.longitude,
      tickData.totalDistanceKm
    );
  }

  // 3. Update Daily Log steps if provided
  if (tickData.stepsToday !== undefined) {
    db.prepare(`
      INSERT INTO daily_logs (date, daily_steps, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(date) DO UPDATE SET
        daily_steps = max(daily_logs.daily_steps, excluded.daily_steps),
        updated_at = datetime('now')
    `).run(today, tickData.stepsToday);
  }

  // Check alert statuses
  const docAlert = getDoctorAlert();

  return {
    success: true,
    serverTime: new Date().toISOString(),
    doctorAlert: {
      enabled: docAlert.enabled,
      appointmentDate: docAlert.appointmentDate,
      appointmentTime: docAlert.appointmentTime,
      doctorName: docAlert.doctorName,
      soundEnabled: docAlert.soundEnabled,
    },
    syncedEverySecond: true,
  };
}

// ---------------------------------------------------------------------------
// Database Manager & Schema Inspection APIs
// ---------------------------------------------------------------------------

export function getAllTablesInfo() {
  const db = getDatabase();
  const tables = db.prepare(`
    SELECT name, sql FROM sqlite_master 
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name ASC
  `).all() as any[];

  return tables.map((t) => {
    let rowCount = 0;
    try {
      const countRes = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get() as any;
      rowCount = countRes ? countRes.count : 0;
    } catch {}

    const colInfo = db.prepare(`PRAGMA table_info("${t.name}")`).all() as any[];

    return {
      name: t.name,
      sql: t.sql,
      rowCount,
      columnsCount: colInfo.length,
      columns: colInfo.map((c) => ({
        cid: c.cid,
        name: c.name,
        type: c.type,
        notnull: Boolean(c.notnull),
        defaultValue: c.dflt_value,
        isPrimaryKey: Boolean(c.pk),
      })),
    };
  });
}

export function getTableDetails(tableName: string, options: { limit?: number; offset?: number; search?: string } = {}) {
  const db = getDatabase();
  const limit = options.limit || 50;
  const offset = options.offset || 0;

  // Validate table exists
  const tableCheck = db.prepare(`
    SELECT name, sql FROM sqlite_master WHERE type='table' AND name = ?
  `).get(tableName) as any;

  if (!tableCheck) {
    throw new Error(`Table "${tableName}" does not exist in SQLite database.`);
  }

  const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as any[];
  const formattedColumns = columns.map((c) => ({
    cid: c.cid,
    name: c.name,
    type: c.type || "TEXT",
    notnull: Boolean(c.notnull),
    defaultValue: c.dflt_value,
    isPrimaryKey: Boolean(c.pk),
  }));

  const countRow = db.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`).get() as any;
  const totalRows = countRow ? countRow.count : 0;

  let query = `SELECT * FROM "${tableName}"`;
  let params: any[] = [];

  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    const searchClauses = formattedColumns.map((col) => `CAST("${col.name}" AS TEXT) LIKE ?`);
    query += ` WHERE ${searchClauses.join(" OR ")}`;
    params = formattedColumns.map(() => term);
  }

  query += ` LIMIT ${limit} OFFSET ${offset}`;
  const rows = db.prepare(query).all(...params);

  return {
    tableName,
    createSql: tableCheck.sql,
    columns: formattedColumns,
    totalRows,
    rows,
    limit,
    offset,
  };
}

export function executeRawQuery(sqlQuery: string) {
  const db = getDatabase();
  const startTime = Date.now();
  const trimmed = sqlQuery.trim();

  if (!trimmed) {
    throw new Error("SQL query cannot be empty");
  }

  const isSelect = /^(SELECT|PRAGMA|EXPLAIN)\b/i.test(trimmed);

  if (isSelect) {
    const rows = db.prepare(trimmed).all();
    const durationMs = Date.now() - startTime;
    return {
      type: "SELECT",
      durationMs,
      rowsCount: rows.length,
      rows,
    };
  } else {
    // Check if multiple statements
    if (trimmed.includes(";")) {
      db.exec(trimmed);
      const durationMs = Date.now() - startTime;
      return {
        type: "EXEC",
        durationMs,
        message: "SQL script executed successfully.",
      };
    } else {
      const result = db.prepare(trimmed).run();
      const durationMs = Date.now() - startTime;
      return {
        type: "MUTATION",
        durationMs,
        changes: Number(result.changes),
        lastInsertRowid: Number(result.lastInsertRowid),
      };
    }
  }
}

export function addColumnToTable(tableName: string, columnDef: { name: string; type: string; notNull?: boolean; defaultValue?: string }) {
  const db = getDatabase();
  const colName = columnDef.name.trim();
  const colType = (columnDef.type || "TEXT").toUpperCase();
  if (!colName) throw new Error("Column name is required");

  let sql = `ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`;
  if (columnDef.notNull && columnDef.defaultValue !== undefined && columnDef.defaultValue !== "") {
    sql += ` NOT NULL DEFAULT '${columnDef.defaultValue}'`;
  } else if (columnDef.defaultValue !== undefined && columnDef.defaultValue !== "") {
    sql += ` DEFAULT '${columnDef.defaultValue}'`;
  }

  db.exec(sql);
  return { success: true, message: `Column "${colName}" added to table "${tableName}".` };
}

export function dropColumnFromTable(tableName: string, columnName: string) {
  const db = getDatabase();
  db.exec(`ALTER TABLE "${tableName}" DROP COLUMN "${columnName}"`);
  return { success: true, message: `Column "${columnName}" dropped from table "${tableName}".` };
}

export function renameColumnInTable(tableName: string, oldName: string, newName: string) {
  const db = getDatabase();
  db.exec(`ALTER TABLE "${tableName}" RENAME COLUMN "${oldName}" TO "${newName}"`);
  return { success: true, message: `Column "${oldName}" renamed to "${newName}" in table "${tableName}".` };
}

export function createNewTable(tableName: string, columns: Array<{ name: string; type: string; isPrimaryKey?: boolean; notNull?: boolean; defaultValue?: string }>) {
  const db = getDatabase();
  const cleanName = tableName.trim();
  if (!cleanName) throw new Error("Table name is required");
  if (!columns || columns.length === 0) throw new Error("At least one column is required");

  const colDefs = columns.map((col) => {
    let def = `"${col.name.trim()}" ${(col.type || "TEXT").toUpperCase()}`;
    if (col.isPrimaryKey) def += " PRIMARY KEY";
    if (col.notNull) def += " NOT NULL";
    if (col.defaultValue !== undefined && col.defaultValue !== "") def += ` DEFAULT '${col.defaultValue}'`;
    return def;
  });

  const sql = `CREATE TABLE "${cleanName}" (${colDefs.join(", ")});`;
  db.exec(sql);
  return { success: true, message: `Table "${cleanName}" created successfully.` };
}

export function dropTable(tableName: string) {
  const db = getDatabase();
  db.exec(`DROP TABLE IF EXISTS "${tableName}"`);
  return { success: true, message: `Table "${tableName}" dropped.` };
}

export function insertRowIntoTable(tableName: string, rowData: Record<string, any>) {
  const db = getDatabase();
  const keys = Object.keys(rowData);
  if (keys.length === 0) throw new Error("No data provided to insert");

  const colNames = keys.map((k) => `"${k}"`).join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  const values = keys.map((k) => rowData[k]);

  const stmt = db.prepare(`INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders})`);
  const result = stmt.run(...values);

  return { success: true, lastInsertRowid: Number(result.lastInsertRowid), changes: Number(result.changes) };
}

export function updateRowInTable(tableName: string, primaryKeyCol: string, primaryKeyValue: any, rowData: Record<string, any>) {
  const db = getDatabase();
  const keys = Object.keys(rowData).filter((k) => k !== primaryKeyCol);
  if (keys.length === 0) throw new Error("No data provided to update");

  const setClauses = keys.map((k) => `"${k}" = ?`).join(", ");
  const values = [...keys.map((k) => rowData[k]), primaryKeyValue];

  const stmt = db.prepare(`UPDATE "${tableName}" SET ${setClauses} WHERE "${primaryKeyCol}" = ?`);
  const result = stmt.run(...values);

  return { success: true, changes: Number(result.changes) };
}

export function deleteRowFromTable(tableName: string, primaryKeyCol: string, primaryKeyValue: any) {
  const db = getDatabase();
  const stmt = db.prepare(`DELETE FROM "${tableName}" WHERE "${primaryKeyCol}" = ?`);
  const result = stmt.run(primaryKeyValue);
  return { success: true, changes: Number(result.changes) };
}

export function exportEntireDatabase() {
  const tables = getAllTablesInfo();
  const db = getDatabase();
  const dump: Record<string, any> = {};

  for (const t of tables) {
    const rows = db.prepare(`SELECT * FROM "${t.name}"`).all();
    dump[t.name] = {
      sql: t.sql,
      columns: t.columns,
      rows,
    };
  }

  return {
    exportedAt: new Date().toISOString(),
    database: "FitPath SQLite DB",
    schemaVersion: "1.0",
    tablesCount: tables.length,
    data: dump,
  };
}

export function getSchemaVersion(): { version: string; lastSyncedTable: string; updatedAt: string } {
  const db = getDatabase();
  const vRow = db.prepare("SELECT value, updated_at FROM app_settings WHERE key = 'schema_version'").get() as any;
  const tRow = db.prepare("SELECT value FROM app_settings WHERE key = 'schema_last_synced_table'").get() as any;
  return {
    version: vRow ? vRow.value : "1.0.0",
    lastSyncedTable: tRow ? tRow.value : "profiles",
    updatedAt: vRow ? vRow.updated_at : new Date().toISOString(),
  };
}

export function syncTableSchema(
  tableName: string,
  columns: Array<{ name: string; type: string; isPrimaryKey?: boolean; notNull?: boolean; defaultValue?: string }>,
  options: { allowDropUnmatched?: boolean; renameMap?: Record<string, string> } = {}
) {
  const db = getDatabase();
  const cleanName = tableName.trim();
  if (!cleanName) throw new Error("Table name is required");
  if (!columns || columns.length === 0) throw new Error("Columns array must not be empty");

  const startTime = Date.now();
  const changesReport: string[] = [];

  // Check if table exists
  const existing = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name = ?").get(cleanName) as any;

  if (!existing) {
    // Create new table
    createNewTable(cleanName, columns);
    changesReport.push(`Created table "${cleanName}" with ${columns.length} columns.`);
  } else {
    // Table exists, inspect existing columns
    const existingCols = db.prepare(`PRAGMA table_info("${cleanName}")`).all() as any[];
    const existingColMap = new Map(existingCols.map((c) => [c.name.toLowerCase(), c]));

    // Handle column renaming first if provided
    if (options.renameMap) {
      for (const [oldName, newName] of Object.entries(options.renameMap)) {
        if (existingColMap.has(oldName.toLowerCase()) && !existingColMap.has(newName.toLowerCase())) {
          renameColumnInTable(cleanName, oldName, newName);
          changesReport.push(`Renamed column "${oldName}" to "${newName}".`);
          existingColMap.delete(oldName.toLowerCase());
          existingColMap.set(newName.toLowerCase(), { name: newName });
        }
      }
    }

    // Add missing columns
    for (const col of columns) {
      const colLower = col.name.trim().toLowerCase();
      if (!existingColMap.has(colLower)) {
        addColumnToTable(cleanName, {
          name: col.name.trim(),
          type: col.type || "TEXT",
          notNull: Boolean(col.notNull),
          defaultValue: col.defaultValue,
        });
        changesReport.push(`Added column "${col.name}" (${(col.type || "TEXT").toUpperCase()}).`);
      }
    }

    // Drop unmatched columns if requested
    if (options.allowDropUnmatched) {
      const requestedColMap = new Set(columns.map((c) => c.name.trim().toLowerCase()));
      for (const ex of existingCols) {
        if (!requestedColMap.has(ex.name.toLowerCase()) && !ex.pk) {
          dropColumnFromTable(cleanName, ex.name);
          changesReport.push(`Dropped unmatched column "${ex.name}".`);
        }
      }
    }
  }

  // Update schema version and timestamp
  const version = Date.now().toString();
  db.prepare(`
    INSERT OR REPLACE INTO app_settings (key, value, updated_at)
    VALUES ('schema_version', ?, datetime('now'))
  `).run(version);

  db.prepare(`
    INSERT OR REPLACE INTO app_settings (key, value, updated_at)
    VALUES ('schema_last_synced_table', ?, datetime('now'))
  `).run(cleanName);

  const updatedTableDetails = getTableDetails(cleanName);

  return {
    success: true,
    tableName: cleanName,
    schemaVersion: version,
    durationMs: Date.now() - startTime,
    changesCount: changesReport.length,
    changes: changesReport,
    currentColumns: updatedTableDetails.columns,
    totalRows: updatedTableDetails.totalRows,
  };
}

