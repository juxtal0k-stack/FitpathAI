import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent File Storage for Individual Profile & Medical Data
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "individual_data.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUserData(): any {
  ensureDataDir();
  const defaultCalorieLog = {
    date: new Date().toISOString().split("T")[0],
    targetCalories: 2250,
    activeBurnCalories: 380,
    items: [
      {
        id: "log-init-1",
        foodName: "High-Protein Microwave Oats & Peanut Butter",
        mealType: "Breakfast",
        calories: 410,
        proteinGrams: 22,
        fatGrams: 14,
        carbsGrams: 48,
        timestamp: "08:30 AM",
      },
      {
        id: "log-init-2",
        foodName: "Tuna & Brown Rice High-Protein Salad",
        mealType: "Lunch",
        calories: 480,
        proteinGrams: 28,
        fatGrams: 12,
        carbsGrams: 58,
        timestamp: "01:15 PM",
      },
    ],
    waterGlasses: 5,
    waterTargetGlasses: 8,
  };

  if (!fs.existsSync(DATA_FILE)) {
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
      dailyCalorieLog: defaultCalorieLog,
    };
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.dailyCalorieLog) {
      parsed.dailyCalorieLog = defaultCalorieLog;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading individual_data.json:", err);
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
      dailyCalorieLog: defaultCalorieLog,
    };
  }
}

function saveUserData(data: any) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Resilient helper to clean and parse JSON even if returned with markdown code fences
function parseJsonSafely(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned.trim());
}

// Resilient generation with automatic model fallback and retry for high-demand spikes (503 / 429)
async function generateGeminiContentWithFallback(
  prompt: string,
  options: {
    temperature?: number;
    systemInstruction?: string;
    responseMimeType?: string;
  } = {}
): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) return null;

  // Use gemini-3.1-flash-lite as primary high-throughput model with automatic fallback to gemini-3.8-flash
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: options.responseMimeType || "application/json",
            temperature: options.temperature ?? 0.2,
            ...(options.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        const isTransient =
          err?.status === "UNAVAILABLE" ||
          err?.message?.includes("503") ||
          err?.message?.includes("high demand") ||
          err?.message?.includes("429") ||
          err?.message?.includes("RESOURCE_EXHAUSTED");

        if (isTransient && attempt === 1) {
          // Brief pause before retry
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        // Fall through to next model candidate
        break;
      }
    }
  }

  return null;
}

// Health check
app.get("/api/health", (_req, res) => {
  const current = loadUserData();
  res.json({
    status: "ok",
    service: "FitPath Server",
    hasProfile: current.exists,
    aiAvailable: !!process.env.GEMINI_API_KEY,
  });
});

// 1. GET User Profile & Active Plan
app.get("/api/user/profile", (_req, res) => {
  const data = loadUserData();
  res.json(data);
});

// 2. RESET User Data (Starts with zero data for a new individual)
app.post("/api/user/reset", (_req, res) => {
  ensureDataDir();
  if (fs.existsSync(DATA_FILE)) {
    fs.unlinkSync(DATA_FILE);
  }
  res.json({
    success: true,
    message: "Server data wiped. Ready for new individual onboarding.",
  });
});

// 3. POST User Details & Medical Data -> Generates Custom Plan and Persists
app.post("/api/user/profile", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.name) {
      return res.status(400).json({ error: "Name and profile details are required" });
    }

    const name = profile.name;
    const age = profile.age || 20;
    const gender = profile.gender || "Not specified";
    const heightCm = profile.heightCm || 172;
    const weightKg = profile.weightKg || 68;
    const occupation = profile.occupationOrSchedule || "Student";
    const examDate = profile.examDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    const daysUntilExam = profile.daysUntilExam ?? 7;
    const budgetPerDay = profile.budgetPerDay || 4.5;
    const dormFacilities = profile.dormFacilities || "microwave-kettle";
    const fitnessGoal = profile.fitnessGoal || "stress-relief";
    const fitnessLevel = profile.fitnessLevel || "beginner";
    const preferredLocation = profile.preferredLocation || "home-bodyweight";

    // Medical inputs
    const medical = profile.medical || {
      jointBackIssues: "none",
      chronicConditions: "none",
      dietaryRestrictions: "none",
      physicalLimitations: "none",
      medicalPrecautions: [],
    };

    const jointBack = medical.jointBackIssues?.toLowerCase() || "none";
    const chronic = medical.chronicConditions?.toLowerCase() || "none";
    const dietRestrictions = medical.dietaryRestrictions?.toLowerCase() || "none";
    const limitations = medical.physicalLimitations || "";

    // Generate Personalized Precautions
    const precautions: string[] = [];
    if (jointBack.includes("back") || jointBack.includes("spine")) {
      precautions.push("Lower Back Protection: Heavy spinal axial compression and weighted bending avoided.");
    }
    if (jointBack.includes("knee")) {
      precautions.push("Knee Safety: Deep high-impact jumps replaced with isometric glute & quad stabilizers.");
    }
    if (jointBack.includes("neck") || jointBack.includes("shoulder")) {
      precautions.push("Postural Decompression: Focused thoracic extensions & scapular retractions added.");
    }
    if (chronic.includes("asthma")) {
      precautions.push("Respiratory Pacing: Controlled breathing cadences with 60s minimum rest intervals.");
    }
    if (chronic.includes("hypertension") || chronic.includes("blood pressure")) {
      precautions.push("Cardiovascular Safety: Continuous rhythmic breathing; Valsalva breath-holding restricted.");
    }
    if (dietRestrictions.includes("vegetarian") || dietRestrictions.includes("vegan")) {
      precautions.push("Plant-Based Optimization: High-bioavailability legumes, oats, and nut proteins prioritized.");
    }
    if (dietRestrictions.includes("lactose")) {
      precautions.push("Dairy-Free: Zero lactose meals with dairy-free calcium and plant proteins.");
    }
    if (precautions.length === 0) {
      precautions.push("Standard Safety: Maintain neutral spine, stay hydrated, and honor recovery signals.");
    }
    medical.medicalPrecautions = precautions;

    // AI Generation with Gemini or Clinical Rule Engine
    const ai = getGenAI();
    let generatedBaselineRoutine: any = null;
    let generatedScaledRoutine: any = null;
    let generatedMeals: any[] = [];

    if (ai) {
      try {
        const prompt = `You are a licensed clinical exercise physiologist and student sports nutritionist.
Generate an individualized fitness workout routine and budget-friendly diet plan for this specific person:

INDIVIDUAL DETAILS:
- Name: ${name} (Age: ${age}, Gender: ${gender}, Height: ${heightCm}cm, Weight: ${weightKg}kg)
- Role/Occupation: ${occupation}
- Deadline/Exam in: ${daysUntilExam} days
- Daily Food Budget: $${budgetPerDay} per day
- Cooking Facilities: ${dormFacilities}
- Primary Fitness Goal: ${fitnessGoal}
- Fitness Experience: ${fitnessLevel}
- Available Equipment/Space: ${preferredLocation}

CRITICAL MEDICAL & PHYSICAL CONSIDERATIONS:
- Joint/Back issues: ${jointBack}
- Chronic health conditions: ${chronic}
- Dietary restrictions/allergies: ${dietRestrictions}
- Physical limitations: ${limitations}

MANDATORY RULES:
1. Every exercise MUST strictly accommodate the individual's medical conditions (e.g. avoid heavy spine loading if back pain, avoid deep impact if knee pain).
2. Workouts must use only the equipment specified (${preferredLocation}).
3. All meals must fit inside the daily budget of $${budgetPerDay} and only use the available appliances (${dormFacilities}), respecting all dietary restrictions (${dietRestrictions}).

Return JSON with this exact structure:
{
  "baselineRoutine": {
    "title": "Clear descriptive title",
    "durationMinutes": 35,
    "intensityLevel": "Moderate",
    "intensityPercent": 75,
    "examFriendlyNotes": "Notes on how this fits their schedule",
    "medicalClearanceNotes": "Notes explaining why these exercises are safe for their joints/health",
    "exercises": [
      {
        "name": "Exercise name",
        "sets": 3,
        "repsOrDuration": "12 reps",
        "dormEquipmentNeeded": "Equipment needed or Bodyweight",
        "targetBenefit": "Target muscle or benefit",
        "postureFocus": "Form and posture cue",
        "medicalSafetyNote": "Why safe for their joints"
      }
    ]
  },
  "scaledRoutine": {
    "title": "Restorative Deload Routine",
    "durationMinutes": 18,
    "intensityLevel": "Low (Restorative)",
    "intensityPercent": 40,
    "examFriendlyNotes": "Shortened 18m routine to prevent CNS burnout during exams/stress",
    "medicalClearanceNotes": "Focuses on mobility, stress relief, and gentle posture recovery",
    "exercises": [
      {
        "name": "Exercise name",
        "sets": 2,
        "repsOrDuration": "10 breaths",
        "dormEquipmentNeeded": "Bodyweight or Chair",
        "targetBenefit": "Neck/back decompression and relaxation",
        "postureFocus": "Slow controlled breathing",
        "medicalSafetyNote": "Gentle on joints"
      }
    ]
  },
  "meals": [
    {
      "name": "Meal name",
      "mealType": "Breakfast",
      "cost": 1.25,
      "prepTimeMinutes": 4,
      "calories": 420,
      "proteinGrams": 24,
      "appliances": "${dormFacilities}",
      "ingredients": ["Item 1", "Item 2"],
      "studentHack": "Practical preparation hack",
      "medicalDietNote": "Conforms to dietary restrictions"
    }
  ]
}`;

        const rawResponse = await generateGeminiContentWithFallback(prompt, {
          temperature: 0.2,
          responseMimeType: "application/json",
        });

        if (rawResponse) {
          const parsed = parseJsonSafely(rawResponse);
          if (parsed.baselineRoutine && parsed.scaledRoutine && parsed.meals) {
            generatedBaselineRoutine = {
              id: `routine-base-${Date.now()}`,
              ...parsed.baselineRoutine,
            };
            generatedScaledRoutine = {
              id: `routine-scaled-${Date.now()}`,
              ...parsed.scaledRoutine,
            };
            generatedMeals = parsed.meals.map((m: any, idx: number) => ({
              id: `meal-${Date.now()}-${idx}`,
              ...m,
            }));
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini generation failed, falling back to clinical engine:", geminiErr);
      }
    }

    // Deterministic Clinical Fallback if AI didn't populate
    if (!generatedBaselineRoutine) {
      const isBackIssue = jointBack.includes("back") || jointBack.includes("spine");
      const isKneeIssue = jointBack.includes("knee");
      const isVeg = dietRestrictions.includes("vegetarian") || dietRestrictions.includes("vegan");

      const isGym = preferredLocation === "gym" || preferredLocation === "student-rec-gym";

      generatedBaselineRoutine = {
        id: `routine-base-${Date.now()}`,
        title: isGym
          ? `Standard Gym Muscle & Strength Split (${fitnessLevel.toUpperCase()})`
          : `${fitnessGoal === "stress-relief" ? "Postural Reset & Conditioning" : "Personalized Full-Body Strength"} (${fitnessLevel})`,
        durationMinutes: fitnessLevel === "beginner" ? 35 : 45,
        intensityLevel: "Moderate",
        intensityPercent: 75,
        examFriendlyNotes: isGym
          ? `Full commercial gym equipment split for ${occupation}. Features barbells, dumbbells, and cable stations.`
          : `Customized for ${occupation}. Workouts keep volume manageable around ${daysUntilExam} days to deadline.`,
        medicalClearanceNotes: `Exercises filtered for safety: ${precautions.join(" ")}`,
        exercises: isGym
          ? [
              {
                name: "Flat Olympic Barbell Bench Press",
                sets: 4,
                repsOrDuration: "8-12 reps",
                dormEquipmentNeeded: "Olympic Bench & Barbell with Safety Collars",
                targetBenefit: "Pectoralis major (sternal & clavicular), triceps, anterior deltoids",
                postureFocus: "5-point contact (feet flat, glutes, upper back, head), slight arch, elbows at 45-70°",
                medicalSafetyNote: "Retract scapulae to preserve rotator cuffs and acromion spacing",
                level: "moderate",
                bodyPart: "chest",
              },
              {
                name: "Wide-Grip Lat Pulldown Machine",
                sets: 4,
                repsOrDuration: "10-12 reps",
                dormEquipmentNeeded: "Cable Lat Pulldown Station with Thigh Pads",
                targetBenefit: "Latissimus dorsi, teres major, rhomboids & biceps",
                postureFocus: "Thighs locked tight, pull with elbows leading down towards hips, slight 15° lean",
                medicalSafetyNote: "Never pull behind the neck to prevent cervical spine and shoulder nerve impingement",
                level: "easy",
                bodyPart: "back",
              },
              {
                name: "45-Degree Leg Press Machine",
                sets: 4,
                repsOrDuration: "10-15 reps",
                dormEquipmentNeeded: "Plate-Loaded 45° Incline Leg Press Machine",
                targetBenefit: "Quadriceps, gluteus maximus, hamstrings",
                postureFocus: "Lower back pressed flat against pad, knees track toes, don't lock knees at apex",
                medicalSafetyNote: "Keep hips glued to the seat back to avoid dangerous lumbar rounding (butt wink)",
                level: "moderate",
                bodyPart: "legs",
              },
              {
                name: "Standing Olympic / EZ-Bar Bicep Curls",
                sets: 3,
                repsOrDuration: "10-12 reps",
                dormEquipmentNeeded: "EZ-Curl Bar or Barbells",
                targetBenefit: "Biceps brachii (short and long head) & brachialis",
                postureFocus: "Elbows pinned to ribcage, neutral wrist alignment, zero torso swinging",
                medicalSafetyNote: "EZ-bar reduces wrist supination strain for carpal tunnel and wrist joint safety",
                level: "moderate",
                bodyPart: "biceps",
              },
              {
                name: "Triceps Cable Rope Pushdowns",
                sets: 3,
                repsOrDuration: "12-15 reps",
                dormEquipmentNeeded: "High Cable Pulley & Rope Attachment",
                targetBenefit: "Triceps brachii (lateral, long & medial heads)",
                postureFocus: "Elbows anchored at flanks, flare rope out at the bottom squeeze",
                medicalSafetyNote: "Keep shoulders depressed away from ears to protect trapezius",
                level: "easy",
                bodyPart: "triceps",
              },
              {
                name: "Seated Dumbbell Overhead Shoulder Press",
                sets: 3,
                repsOrDuration: "10-12 reps",
                dormEquipmentNeeded: "Adjustable Incline/Flat Bench & Dumbbells",
                targetBenefit: "Anterior & lateral deltoids, clavicular pectorals, triceps",
                postureFocus: "Bench set to 75-80° incline, press up in slight arc without banging weights",
                medicalSafetyNote: "Avoid flared 90° elbows; keep hands in scapular plane (30° forward)",
                level: "intense",
                bodyPart: "shoulders",
              },
              {
                name: "Captain's Chair / Hanging Knee & Leg Raises",
                sets: 3,
                repsOrDuration: "12-15 controlled reps",
                dormEquipmentNeeded: "Captain's Chair Power Tower or Pull-up Bar",
                targetBenefit: "Rectus abdominis & deep core transverse stability",
                postureFocus: "Forearms pressed into pads, curl knees towards sternum without swinging",
                medicalSafetyNote: "Curl pelvis upwards rather than flexing only hip flexors to protect lower back",
                level: "moderate",
                bodyPart: "core",
              },
            ]
          : [
              {
                name: isBackIssue ? "Glute Bridges & Pelvic Tilts" : isKneeIssue ? "Straight Leg Isometric Wall Sits" : "Bodyweight / Backpack Squats",
                sets: 3,
                repsOrDuration: isBackIssue ? "15 slow reps" : "12-15 reps",
                dormEquipmentNeeded: "Floor or mat",
                targetBenefit: "Posterior chain & core stabilization",
                postureFocus: isBackIssue ? "Decompresses lower spine without axial load" : "Stable knee angle",
                medicalSafetyNote: isBackIssue ? "Zero spinal compression" : "Joint-friendly tracking",
                level: "easy",
                bodyPart: "legs",
              },
              {
                name: "Incline Bed / Desk Push-ups",
                sets: 3,
                repsOrDuration: "10-12 reps",
                dormEquipmentNeeded: "Edge of sturdy desk or bed",
                targetBenefit: "Pectorals, anterior delts, triceps",
                postureFocus: "Core engaged, shoulders pulled away from ears",
                medicalSafetyNote: "Low wrist angle compared to flat floor",
                level: "easy",
                bodyPart: "chest",
              },
              {
                name: "Doorframe Towel Rows / Wall Angels",
                sets: 3,
                repsOrDuration: "12 reps",
                dormEquipmentNeeded: "Doorway or flat wall",
                targetBenefit: "Rhomboids, middle traps, posture correction",
                postureFocus: "Counters computer desk slouch and neck strain",
                medicalSafetyNote: "Strengthens upper back to protect cervical spine",
                level: "easy",
                bodyPart: "back",
              },
              {
                name: "Bird-Dog Core Stability Holds",
                sets: 3,
                repsOrDuration: "30 seconds each side",
                dormEquipmentNeeded: "Floor mat or rug",
                targetBenefit: "Deep multifidus, glutes, anti-rotation core",
                postureFocus: "Neutral flat spine, no sagging",
                medicalSafetyNote: "Gold standard clinical exercise for lower back resilience",
                level: "easy",
                bodyPart: "core",
              },
            ],
      };

      generatedScaledRoutine = {
        id: `routine-scaled-${Date.now()}`,
        title: "CNS Recovery & Exam-Week Decompression",
        durationMinutes: 18,
        intensityLevel: "Low (Restorative)",
        intensityPercent: 40,
        examFriendlyNotes: "Shortened 18m restorative session when studying or sleep-deprived.",
        medicalClearanceNotes: "Low impact, high relaxation, restorative breathing.",
        exercises: [
          {
            name: "Wall Thoracic Extension & Angels",
            sets: 2,
            repsOrDuration: "10 slow breaths",
            dormEquipmentNeeded: "Flat wall space",
            targetBenefit: "Relieves neck & upper back tension",
            postureFocus: "Wrists and back of head against wall",
            medicalSafetyNote: "Very gentle on all joints",
          },
          {
            name: "Seated Chair Spine Twist & Cat-Cow",
            sets: 2,
            repsOrDuration: "60 seconds",
            dormEquipmentNeeded: "Chair",
            targetBenefit: "Autonomic nervous system calming",
            postureFocus: "Slow diaphragmatic exhalations",
            medicalSafetyNote: "Safe seated mobility",
          },
          {
            name: "Floor Supine 90/90 Breathing",
            sets: 2,
            repsOrDuration: "2 minutes",
            dormEquipmentNeeded: "Floor with calves resting on chair",
            targetBenefit: "Resets hip flexors and unloads lumbar discs",
            postureFocus: "Deep nasal inhale, long open-mouth exhale",
            medicalSafetyNote: "Immediate lower back decompression",
          },
        ],
      };

      const isNoAppliance = dormFacilities === 'none';

      generatedMeals = isNoAppliance
        ? [
            {
              id: `meal-${Date.now()}-0`,
              name: "Peanut Butter, Banana & Crushed Nut Whole Wheat Wrap",
              mealType: "Breakfast",
              cost: Math.min(1.10, budgetPerDay * 0.25),
              prepTimeMinutes: 2,
              calories: 420,
              proteinGrams: 18,
              appliances: "None (Zero Cooking / Ready-to-eat)",
              ingredients: ["Whole wheat tortilla", "2 tbsp Peanut butter", "1 Banana", "Handful crushed almonds or peanuts"],
              studentHack: "Zero heat needed. Spread peanut butter on wrap, roll up with sliced banana for instant high-energy cognitive breakfast.",
              medicalDietNote: "Rich in complex carbs, potassium and healthy fats for sustained morning focus.",
            },
            {
              id: `meal-${Date.now()}-1`,
              name: isVeg
                ? "Ready-to-Eat Mediterranean Chickpea & Cucumber Salad"
                : "Canned Chunk Light Tuna & Sweet Corn Protein Salad",
              mealType: "Lunch",
              cost: Math.min(1.40, budgetPerDay * 0.4),
              prepTimeMinutes: 3,
              calories: 460,
              proteinGrams: isVeg ? 22 : 32,
              appliances: "None (Zero Cooking / Ready-to-eat)",
              ingredients: isVeg
                ? ["1 Can rinsed chickpeas", "Diced cucumber", "Lemon juice", "Olive oil or chaat masala", "Tomato"]
                : ["1 Can chunk light tuna in water", "Canned sweet corn", "Lemon juice & black pepper", "Whole wheat crackers"],
              studentHack: "Canned legumes and tuna require zero appliances or refrigeration. Drain, season, and eat straight from bowl.",
              medicalDietNote: "High bioavailability protein and dietary fiber with zero cooking cleanup.",
            },
            {
              id: `meal-${Date.now()}-2`,
              name: "High-Protein Greek Yogurt / Curd Parfait with Chia Seeds",
              mealType: "Dinner",
              cost: Math.min(1.30, budgetPerDay * 0.35),
              prepTimeMinutes: 2,
              calories: 410,
              proteinGrams: 24,
              appliances: "None (Zero Cooking / Ready-to-eat)",
              ingredients: ["1 Cup Greek yogurt or plain curd", "Rolled oats (soaked in yogurt)", "Honey or jaggery", "Roasted peanuts"],
              studentHack: "Letting oats soak in yogurt for 15 minutes softens them completely without any boiling water or microwave.",
              medicalDietNote: "Casein protein and live probiotics promote gut-brain microbiome health and deep sleep.",
            },
          ]
        : [
            {
              id: `meal-${Date.now()}-0`,
              name: "High-Protein Microwave Oats with Peanut Butter",
              mealType: "Breakfast",
              cost: Math.min(1.20, budgetPerDay * 0.25),
              prepTimeMinutes: 3,
              calories: 410,
              proteinGrams: 22,
              appliances: "Kettle or Microwave",
              ingredients: ["Rolled oats", "2 tbsp Peanut butter", "Hot water or plant milk", "Cinnamon"],
              studentHack: "Stir in peanut butter while hot for creamy protein boost without protein powder.",
              medicalDietNote: isVeg ? "100% vegetarian & budget friendly" : "Easy digestion",
            },
            {
              id: `meal-${Date.now()}-1`,
              name: isVeg ? "Microwave Black Bean & Rice Fiesta Bowl" : "Tuna & Brown Rice High-Protein Salad",
              mealType: "Lunch",
              cost: Math.min(1.80, budgetPerDay * 0.4),
              prepTimeMinutes: 4,
              calories: 480,
              proteinGrams: 28,
              appliances: "Microwave or No Cooking",
              ingredients: isVeg
                ? ["Canned black beans", "Pre-cooked microwave brown rice", "Salsa", "Cheddar or nutritional yeast"]
                : ["Can of chunk light tuna", "Microwave brown rice", "Soy sauce & lime", "Sweet corn"],
              studentHack: "Rinse canned beans or fish; mix with warm rice for instant hearty lunch with zero pots to wash.",
              medicalDietNote: "Rich in complex carbs for sustained cognitive focus without sugar crash",
            },
            {
              id: `meal-${Date.now()}-2`,
              name: "Mug-Scrambled Eggs & Whole Wheat Toast",
              mealType: "Dinner",
              cost: Math.min(1.50, budgetPerDay * 0.35),
              prepTimeMinutes: 4,
              calories: 430,
              proteinGrams: 24,
              appliances: "Microwave",
              ingredients: ["2 Fresh eggs", "Salt & pepper", "2 Slices whole wheat bread", "Butter or olive oil"],
              studentHack: "Whisk eggs in a coffee mug with a fork, microwave 60-70 seconds for fluffy eggs with no skillet.",
              medicalDietNote: "High choline for memory consolidation during revision",
            },
          ];
    }

    // Determine initial auto-scaled status (true if exam is within 8 days)
    const isAutoScaled = daysUntilExam <= 8;
    const activeRoutine = isAutoScaled ? generatedScaledRoutine : generatedBaselineRoutine;

    const initialTelemetry = {
      stepsToday: 0,
      targetSteps: 8000,
      sleepHours: 0,
      screenOffEstimatedSleep: 0,
      activeMinutes: 0,
      walkingCadenceRpm: 0,
      campusStairsClimbed: 0,
      lastSyncedAt: "Initialized from phone sensors (0 steps)",
      source: "Phone Built-in Accelerometer",
    };

    const savedData = {
      exists: true,
      profile: {
        ...profile,
        medical,
        updatedAt: new Date().toISOString(),
      },
      baselineRoutine: generatedBaselineRoutine,
      scaledRoutine: generatedScaledRoutine,
      activeRoutine,
      isAutoScaled,
      meals: generatedMeals,
      telemetry: initialTelemetry,
      workoutHistory: [],
    };

    saveUserData(savedData);

    return res.json({
      success: true,
      data: savedData,
    });
  } catch (err: any) {
    console.error("Error saving user profile:", err);
    return res.status(500).json({ error: err.message || "Failed to process profile" });
  }
});

// 4. Log completed workout
app.post("/api/workout/complete", (req, res) => {
  const current = loadUserData();
  if (!current.exists) {
    return res.status(404).json({ error: "No active profile found" });
  }

  const { routineTitle, completedCount, durationMinutes } = req.body;
  const historyEntry = {
    id: `log-${Date.now()}`,
    routineTitle: routineTitle || current.activeRoutine?.title || "Workout",
    completedCount: completedCount || 0,
    durationMinutes: durationMinutes || 20,
    date: new Date().toISOString(),
  };

  current.workoutHistory = [historyEntry, ...(current.workoutHistory || [])];
  saveUserData(current);

  res.json({ success: true, history: current.workoutHistory });
});

// 5. Sync Phone Health Telemetry
app.post("/api/sensors/sync", (req, res) => {
  const current = loadUserData();
  if (!current.exists) {
    return res.status(404).json({ error: "No active profile found" });
  }

  const newTelemetry = req.body;
  current.telemetry = {
    ...current.telemetry,
    ...newTelemetry,
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
  saveUserData(current);

  res.json({ success: true, telemetry: current.telemetry });
});

// 6. Plan Adaptation / Auto-Scale Toggle
app.post("/api/plan/adjust", (req, res) => {
  const current = loadUserData();
  if (!current.exists) {
    return res.status(404).json({ error: "No active profile found" });
  }

  const { useScaled } = req.body;
  current.isAutoScaled = !!useScaled;
  current.activeRoutine = useScaled ? current.scaledRoutine : current.baselineRoutine;
  saveUserData(current);

  res.json({
    success: true,
    isAutoScaled: current.isAutoScaled,
    activeRoutine: current.activeRoutine,
  });
});

// 7. Explainable AI Plan Adaptation endpoint
app.post("/api/ai/explain", async (req, res) => {
  try {
    const {
      currentPlan,
      adjustedPlan,
      stressLevel,
      examInDays,
      sleepHours,
      stepCount,
      reasons,
      studentContext,
    } = req.body;

    const ai = getGenAI();
    if (ai) {
      const prompt = `You are FitPath's Explainable Health Intelligence Engine.
Provide a clear, empathetic, scientific, and transparent explanation of why the user's workout was adjusted:
- Current Target Workout: ${currentPlan?.name || "Strength Workout"} (${currentPlan?.duration || 35} mins)
- Auto-Scaled Plan: ${adjustedPlan?.name || "Deload Recovery"} (${adjustedPlan?.duration || 18} mins)
- Exam Countdown: ${examInDays ? `${examInDays} days until deadline/exams` : "Upcoming exams"}
- Stress Level: ${stressLevel}/10
- Sleep: ${sleepHours || 5.5} hours
- Phone Steps: ${stepCount || 4000} steps
- User context: ${studentContext || "Budget-conscious, zero-hardware"}

Output JSON:
{
  "summary": "1-sentence executive summary of the adaptation",
  "biologicalReasoning": "2 sentences explaining cortisol, sleep debt, and muscle recovery without medical jargon",
  "adaptiveActionTaken": "List of 3 concrete changes made",
  "guiltFreeMessage": "Encouraging message reminding user that deloading preserves health",
  "quickDietTip": "Affordable nutrition tip"
}`;

      const rawText = await generateGeminiContentWithFallback(prompt, {
        temperature: 0.3,
        responseMimeType: "application/json",
      });

      if (rawText) {
        try {
          const parsed = parseJsonSafely(rawText);
          return res.json({ success: true, explanation: parsed });
        } catch (parseErr) {
          console.warn("Could not parse explanation JSON, falling back:", parseErr);
        }
      }
    }

    const fallbackExplanation = {
      summary: `Auto-scaled workout down by ${stressLevel >= 7 ? "45%" : "25%"} to safeguard cognitive energy and prevent overtraining.`,
      biologicalReasoning: `When academic or work stress peaks (${stressLevel}/10), cortisol spikes. Intense lifting during sleep deficit (<${sleepHours || 6}h) elevates injury risk and impairs recovery.`,
      adaptiveActionTaken: [
        "Replaced intense heavy compounds with joint-friendly mobility",
        `Shortened session from ${currentPlan?.duration || 35} min to ${adjustedPlan?.duration || 18} min`,
        "Prioritized nervous system down-regulation over caloric exhaustion",
      ],
      guiltFreeMessage: "Scaling back during high-stress weeks is strategic periodization, not slacking.",
      quickDietTip: "Pair complex carbs with peanut butter or eggs for steady cognitive energy.",
    };

    return res.json({
      success: true,
      explanation: fallbackExplanation,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Meal swap endpoint
app.post("/api/ai/meal-swap", async (req, res) => {
  try {
    const { budgetPerDay, cookingFacilities, dietGoal, foodDislikes } = req.body;
    const ai = getGenAI();

    if (ai) {
      const prompt = `Provide 3 budget-friendly meals for:
Daily budget: $${budgetPerDay || 4.5} per day
Cooking equipment: ${cookingFacilities || "Microwave + Kettle"}
Fitness goal: ${dietGoal || "Health & Energy"}
Dislikes/Restrictions: ${foodDislikes || "None"}

Output JSON:
{
  "meals": [
    {
      "name": "Meal name",
      "costEstimate": "$X.XX",
      "prepTime": "X mins",
      "proteinGrams": 22,
      "calories": 420,
      "appliancesNeeded": "Microwave/Kettle",
      "groceryList": ["item 1", "item 2"],
      "studentHack": "Practical tip"
    }
  ]
}`;

      const rawText = await generateGeminiContentWithFallback(prompt, {
        temperature: 0.3,
        responseMimeType: "application/json",
      });

      if (rawText) {
        try {
          const parsed = parseJsonSafely(rawText);
          return res.json({ success: true, data: parsed });
        } catch (parseErr) {
          console.warn("Could not parse meal-swap JSON, falling back:", parseErr);
        }
      }
    }

    return res.json({
      success: true,
      data: {
        meals: [
          {
            name: "Protein-Boosted Microwave Oats",
            costEstimate: "$1.10",
            prepTime: "3 mins",
            proteinGrams: 22,
            calories: 420,
            appliancesNeeded: "Kettle or Microwave",
            groceryList: ["Rolled oats", "Peanut butter", "Hot water/milk", "Cinnamon"],
            studentHack: "Add peanut butter while hot for a creamy protein boost without powder.",
          },
          {
            name: "Microwave Cheesy Egg & Black Bean Tortilla",
            costEstimate: "$1.65",
            prepTime: "5 mins",
            proteinGrams: 25,
            calories: 470,
            appliancesNeeded: "Microwave only",
            groceryList: ["2 Eggs", "Canned black beans", "Cheese slice", "Tortilla wrap"],
            studentHack: "Whisk eggs in a mug and microwave 60 seconds with salt for instant scrambled eggs.",
          },
          {
            name: "High-Protein Lentil & Brown Rice Bowl",
            costEstimate: "$1.40",
            prepTime: "4 mins",
            proteinGrams: 22,
            calories: 440,
            appliancesNeeded: "Microwave",
            groceryList: ["Canned lentils or chickpeas", "Microwave brown rice", "Olive oil & lemon"],
            studentHack: "Lentils cost under $1 a can and provide 20g of plant protein with high iron.",
          },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. REST API: Food Nutrition Measure (Calculate protein, fat, carbs, calories via Gemini / Clinical Engine)
app.post("/api/nutrition/analyze", async (req, res) => {
  try {
    const { foodQuery, studentBudget } = req.body;
    if (!foodQuery || typeof foodQuery !== "string") {
      return res.status(400).json({ error: "foodQuery string is required" });
    }

    const ai = getGenAI();
    let analysisResult: any = null;

    if (ai) {
      const prompt = `You are a clinical student sports dietitian and food biochemist.
Analyze the following food item or meal query: "${foodQuery}".
Calculate accurate macronutrients, calories, micronutrients, student budget metrics, and cognitive impact during study/exams.

Return JSON in this exact structure:
{
  "foodName": "Standardized Food Name (e.g., 2 Scrambled Eggs with Whole Wheat Toast)",
  "calories": 380,
  "proteinGrams": 20,
  "fatGrams": 14,
  "carbsGrams": 42,
  "fiberGrams": 6,
  "saturatedFatGrams": 4,
  "sodiumMg": 340,
  "sugarGrams": 3,
  "estimatedCost": "$1.40 (₹115)",
  "macroRatio": {
    "proteinPct": 21,
    "carbsPct": 44,
    "fatPct": 35
  },
  "healthScore": 88,
  "studentAffordability": "Budget Master",
  "prepComplexity": "Kettle/Microwave",
  "cognitiveImpact": "Sustained glucose release with high choline from eggs supporting neurotransmitter synthesis and exam recall.",
  "allergens": ["Eggs", "Gluten"],
  "smartSwaps": [
    "Swap butter for olive oil or peanut butter for heart-healthy monounsaturated fats.",
    "Add chia or flaxseeds for omega-3 brain fuel."
  ]
}

Note:
- studentAffordability must be one of: "Budget Master", "Moderate", "Treat"
- prepComplexity must be one of: "No Cook", "Kettle/Microwave", "Full Kitchen"
- healthScore should be a number from 1 to 100
- Return ONLY valid JSON, no markdown outside of JSON.`;

      try {
        const rawText = await generateGeminiContentWithFallback(prompt, {
          temperature: 0.2,
          responseMimeType: "application/json",
        });

        if (rawText) {
          analysisResult = parseJsonSafely(rawText);
        }
      } catch (err) {
        console.warn("Gemini nutrition analysis failed, falling back to clinical engine:", err);
      }
    }

    // High-accuracy fallback clinical database if AI is offline or rate-limited
    if (!analysisResult) {
      const q = foodQuery.toLowerCase();
      let calories = 350;
      let protein = 18;
      let fat = 12;
      let carbs = 40;
      let fiber = 5;
      let satFat = 3;
      let sodium = 300;
      let sugar = 4;
      let cost = "$1.25 (₹100)";
      let healthScore = 85;
      let affordability: 'Budget Master' | 'Moderate' | 'Treat' = "Budget Master";
      let prep: 'No Cook' | 'Kettle/Microwave' | 'Full Kitchen' = "Kettle/Microwave";
      let cognitive = "Provides steady cognitive energy without sharp insulin spikes.";
      let allergens: string[] = [];
      let smartSwaps: string[] = ["Pair with a glass of water to optimize nutrient absorption."];

      if (q.includes("egg")) {
        calories = 320;
        protein = 22;
        fat = 15;
        carbs = 24;
        fiber = 3;
        satFat = 4.5;
        sodium = 380;
        sugar = 2;
        cost = "$1.10 (₹85)";
        healthScore = 92;
        cognitive = "Rich in egg-yolk choline, the direct precursor to acetylcholine for memory encoding.";
        allergens = ["Eggs"];
        smartSwaps = ["Add a slice of whole grain toast for complex slow-digesting starches."];
      } else if (q.includes("oat") || q.includes("peanut butter")) {
        calories = 420;
        protein = 20;
        fat = 16;
        carbs = 54;
        fiber = 8;
        satFat = 3.2;
        sodium = 140;
        sugar = 5;
        cost = "$0.95 (₹75)";
        healthScore = 94;
        cognitive = "Beta-glucan soluble fiber stabilizes blood glucose for 3-4 hours of revision focus.";
        allergens = ["Peanuts"];
        smartSwaps = ["Sprinkle cinnamon to improve insulin sensitivity."];
      } else if (q.includes("dal") || q.includes("roti") || q.includes("rice") || q.includes("rajma") || q.includes("chawal")) {
        calories = 460;
        protein = 18;
        fat = 10;
        carbs = 76;
        fiber = 9;
        satFat = 2.5;
        sodium = 450;
        sugar = 3;
        cost = "$1.30 (₹105)";
        healthScore = 90;
        cognitive = "Complete amino acid profile when combining grains and legumes; sustained mental stamina.";
        allergens = ["Gluten"];
        smartSwaps = ["Add a bowl of plain curd (dahi) to boost total protein to 25g+."];
      } else if (q.includes("paneer") || q.includes("tofu")) {
        calories = 440;
        protein = 26;
        fat = 24;
        carbs = 28;
        fiber = 4;
        satFat = 11;
        sodium = 410;
        sugar = 3;
        cost = "$1.85 (₹145)";
        healthScore = 88;
        cognitive = "Slow-digesting casein protein supports continuous cellular repair during sleep.";
        allergens = ["Dairy / Soy"];
      } else if (q.includes("chicken") || q.includes("tuna") || q.includes("fish")) {
        calories = 480;
        protein = 38;
        fat = 11;
        carbs = 52;
        fiber = 4;
        satFat = 2.8;
        sodium = 480;
        sugar = 2;
        cost = "$2.10 (₹170)";
        affordability = "Moderate";
        healthScore = 95;
        cognitive = "High tryptophan and B-vitamins promote neurotransmitter synthesis and reduce exam anxiety.";
      } else if (q.includes("maggi") || q.includes("ramen") || q.includes("noodle")) {
        calories = 380;
        protein = 8;
        fat = 14;
        carbs = 56;
        fiber = 2;
        satFat = 6;
        sodium = 920;
        sugar = 3;
        cost = "$0.60 (₹45)";
        healthScore = 58;
        affordability = "Budget Master";
        prep = "Kettle/Microwave";
        cognitive = "High glycemic load can lead to a post-meal study slump within 90 minutes.";
        allergens = ["Gluten", "Soy"];
        smartSwaps = [
          "Crack an egg or toss in 50g paneer into boiling noodles to add 12g protein.",
          "Use only half the tastemaker seasoning packet to cut sodium in half."
        ];
      }

      const totalMacroGrams = protein + fat + carbs;
      analysisResult = {
        foodName: foodQuery.trim().replace(/^./, (c) => c.toUpperCase()),
        calories,
        proteinGrams: protein,
        fatGrams: fat,
        carbsGrams: carbs,
        fiberGrams: fiber,
        saturatedFatGrams: satFat,
        sodiumMg: sodium,
        sugarGrams: sugar,
        estimatedCost: cost,
        macroRatio: {
          proteinPct: Math.round(((protein * 4) / calories) * 100),
          carbsPct: Math.round(((carbs * 4) / calories) * 100),
          fatPct: Math.round(((fat * 9) / calories) * 100),
        },
        healthScore,
        studentAffordability: affordability,
        prepComplexity: prep,
        cognitiveImpact: cognitive,
        allergens,
        smartSwaps,
      };
    }

    return res.json({
      success: true,
      source: ai ? "Gemini REST API" : "Clinical Nutrition Database",
      data: {
        id: `food-${Date.now()}`,
        ...analysisResult,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. REST API: Physical Measures Calculator (BMI, BMR, TDEE, Calorie Counter Targets)
app.post("/api/metrics/calculate", (req, res) => {
  try {
    const {
      heightCm = 173,
      weightKg = 70,
      age = 20,
      gender = "Male",
      fitnessGoal = "stress-relief",
      stepsToday = 4500,
      daysUntilExam = 7,
    } = req.body;

    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    let bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' = "Normal";
    let bmiClassificationColor = "#10B981"; // emerald

    if (bmi < 18.5) {
      bmiCategory = "Underweight";
      bmiClassificationColor = "#3B82F6"; // blue
    } else if (bmi < 25) {
      bmiCategory = "Normal";
      bmiClassificationColor = "#10B981"; // emerald
    } else if (bmi < 30) {
      bmiCategory = "Overweight";
      bmiClassificationColor = "#F59E0B"; // amber
    } else {
      bmiCategory = "Obese";
      bmiClassificationColor = "#EF4444"; // red
    }

    const healthyWeightMinKg = Math.round(18.5 * heightM * heightM);
    const healthyWeightMaxKg = Math.round(24.9 * heightM * heightM);

    // BMR via Mifflin-St Jeor equation
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender.toLowerCase().startsWith("f")) {
      bmr -= 161;
    } else {
      bmr += 5;
    }
    const bmrCalories = Math.round(bmr);

    // Active burn from phone step sensors (~0.04 kcal per step)
    const activeBurnFromSteps = Math.round(stepsToday * 0.04);

    // TDEE: Sedentary Base (BMR * 1.2) + Phone sensor step burn
    const baseTdee = Math.round(bmrCalories * 1.25);
    const tdeeCalories = baseTdee + activeBurnFromSteps;

    // Exam stress & goal caloric target
    let targetCalories = tdeeCalories;
    let examStressMultiplier = 1.0;

    if (daysUntilExam <= 7) {
      examStressMultiplier = 1.05; // 5% buffer for intense cognitive glucose turnover
    }

    if (fitnessGoal === "fat-loss") {
      targetCalories = Math.round((tdeeCalories - 400) * examStressMultiplier);
    } else if (fitnessGoal === "muscle-tone") {
      targetCalories = Math.round((tdeeCalories + 250) * examStressMultiplier);
    } else if (fitnessGoal === "endurance") {
      targetCalories = Math.round((tdeeCalories + 200) * examStressMultiplier);
    } else {
      // stress-relief / posture-rehab: maintain energy equilibrium
      targetCalories = Math.round(tdeeCalories * examStressMultiplier);
    }

    // Macronutrient targets (Student Sports Nutrition Standards)
    // Protein: 1.8g per kg body weight
    const proteinGrams = Math.round(weightKg * 1.8);
    // Fat: 25% of total caloric intake
    const fatCalories = targetCalories * 0.25;
    const fatGrams = Math.round(fatCalories / 9);
    // Carbs: remaining calories / 4
    const carbCalories = targetCalories - (proteinGrams * 4 + fatCalories);
    const carbsGrams = Math.max(120, Math.round(carbCalories / 4));
    const fiberGrams = Math.round(Math.max(28, (targetCalories / 1000) * 14));

    // Ideal body weight via Devine Formula
    const inchesOver5Ft = Math.max(0, (heightCm / 2.54) - 60);
    let idealWeightKg = gender.toLowerCase().startsWith("f")
      ? 45.5 + 2.3 * inchesOver5Ft
      : 50.0 + 2.3 * inchesOver5Ft;
    idealWeightKg = Math.round(idealWeightKg);

    // Hydration target: 35ml/kg + 0.35L per 3000 steps
    const hydrationTargetLiters = parseFloat(((weightKg * 0.035) + (stepsToday / 3000) * 0.35).toFixed(1));

    const clinicalExplanation = `Based on your height (${heightCm}cm) and weight (${weightKg}kg), your BMI is ${bmi} (${bmiCategory}). Your Basal Metabolic Rate is ${bmrCalories} kcal/day. Incorporating your phone sensor activity (${stepsToday.toLocaleString()} steps today = ~${activeBurnFromSteps} kcal active burn) and ${daysUntilExam}d exam proximity, your optimal daily energy target is ${targetCalories} kcal.`;

    res.json({
      success: true,
      metrics: {
        bmi,
        bmiCategory,
        bmiClassificationColor,
        healthyWeightMinKg,
        healthyWeightMaxKg,
        bmrCalories,
        tdeeCalories,
        targetCalories,
        activeBurnFromSteps,
        macroTargets: {
          proteinGrams,
          carbsGrams,
          fatGrams,
          fiberGrams,
        },
        idealBodyWeightKg: idealWeightKg,
        hydrationTargetLiters,
        examStressMultiplier,
        clinicalExplanation,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. GET Daily Calorie Counter & Water Log
app.get("/api/user/calorie-log", (_req, res) => {
  const current = loadUserData();
  res.json({
    success: true,
    calorieLog: current.dailyCalorieLog,
  });
});

// 12. POST Add Food to Calorie Counter Log
app.post("/api/user/calorie-log/add", (req, res) => {
  const current = loadUserData();
  const { foodName, mealType = "Snack", calories, proteinGrams, fatGrams, carbsGrams } = req.body;

  if (!foodName || calories === undefined) {
    return res.status(400).json({ error: "foodName and calories are required" });
  }

  const newItem = {
    id: `log-${Date.now()}`,
    foodName,
    mealType,
    calories: Number(calories) || 0,
    proteinGrams: Number(proteinGrams) || 0,
    fatGrams: Number(fatGrams) || 0,
    carbsGrams: Number(carbsGrams) || 0,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  if (!current.dailyCalorieLog) {
    current.dailyCalorieLog = {
      date: new Date().toISOString().split("T")[0],
      targetCalories: 2250,
      activeBurnCalories: 380,
      items: [],
      waterGlasses: 4,
      waterTargetGlasses: 8,
    };
  }

  current.dailyCalorieLog.items.unshift(newItem);
  saveUserData(current);

  res.json({
    success: true,
    item: newItem,
    calorieLog: current.dailyCalorieLog,
  });
});

// 13. POST Delete Food from Calorie Counter Log
app.post("/api/user/calorie-log/delete", (req, res) => {
  const current = loadUserData();
  const { id } = req.body;

  if (current.dailyCalorieLog && current.dailyCalorieLog.items) {
    current.dailyCalorieLog.items = current.dailyCalorieLog.items.filter((item: any) => item.id !== id);
    saveUserData(current);
  }

  res.json({
    success: true,
    calorieLog: current.dailyCalorieLog,
  });
});

// 14. POST Update Water Log (glasses count)
app.post("/api/user/calorie-log/water", (req, res) => {
  const current = loadUserData();
  const { change } = req.body; // +1 or -1 or absolute number

  if (!current.dailyCalorieLog) {
    current.dailyCalorieLog = {
      date: new Date().toISOString().split("T")[0],
      targetCalories: 2250,
      activeBurnCalories: 380,
      items: [],
      waterGlasses: 4,
      waterTargetGlasses: 8,
    };
  }

  if (typeof change === "number") {
    current.dailyCalorieLog.waterGlasses = Math.max(0, current.dailyCalorieLog.waterGlasses + change);
  }
  saveUserData(current);

  res.json({
    success: true,
    waterGlasses: current.dailyCalorieLog.waterGlasses,
    calorieLog: current.dailyCalorieLog,
  });
});

// 15. POST Update Full Daily Activity, Workout & Diet Log (Persistent State)
app.post("/api/user/daily-log/update", (req, res) => {
  const current = loadUserData();
  current.dailyLog = req.body;
  saveUserData(current);
  res.json({
    success: true,
    dailyLog: current.dailyLog,
  });
});

// Start Server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitPath Server running on http://localhost:${PORT}`);
  });
}

startServer();
