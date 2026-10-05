# FitPath AI — Zero-Hardware Student Health Intelligence

> **Smart India Hackathon (SIH) Prototype**  
> Problem Statement: High-stress student lifestyle, zero-hardware health monitoring, exam-period workout scaling, affordable dorm nutrition, and persistent relational SQLite data management.

---

## 🌟 Executive Overview

**FitPath AI** is an intelligent, zero-cost health and fitness platform engineered specifically for university students and exam candidates. Traditional fitness solutions assume expensive wearable hardware (Apple Watch, Fitbit), gym memberships, and meal prep kitchens. FitPath eliminates all three barriers:

1. **Zero-Hardware Phone Telemetry**: Uses built-in smartphone sensors (accelerometer, step cadence, screen-off sleep heuristics) instead of external wearables.
2. **Exam-Period Cortisol Auto-Scaler**: Automatically scales workout volume down by 40–50% during high-stress exam crunches to protect cognitive energy and prevent physical burnout.
3. **Clinical & AI Explainability**: Powered by Google Gemini (`gemini-3.1-flash-lite` with fallback to `gemini-3.8-flash`) with biological justification for every routine adaptation.
4. **Sub-₹120 / $4.50 Dorm Nutrition & Smart Analyzer**: Calculates macro-nutrients from natural language food queries and generates meals cookable with only a kettle or microwave.
5. **Persistent Relational SQLite Database**: Backed by a full ACID-compliant SQLite engine (`data/fitpath.db`) with structured tables for profiles, routines, workouts, meals, telemetry, and daily activity logs.
6. **Dedicated Database Structure & Schema Manager (`database-manager.html`)**: Standalone live HTML manager directly connected to SQLite for adding columns, dropping columns, renaming columns, creating custom tables, and executing raw SQL queries.
7. **Invisible Background Water Alarm Process**: Background hydration schedule that runs unseen with zero on-screen clutter, sounding an audible multi-frequency buzzer alarm when it's time to drink.
8. **Lock Screen Glance Simulator**: Ambient lock-screen widget allowing students to monitor exam countdowns and physical recovery without distraction.

---

## 🚀 Key Features

### 1. 🗄️ Relational SQLite Database & Structure Manager (`/database-manager.html`)
- **Direct Live Connection**: Connected to `data/fitpath.db` via RESTful schema APIs (`/api/db/*`).
- **Interactive Structure Editor**:
  - Add new columns (`ALTER TABLE ... ADD COLUMN`) with custom types (`TEXT`, `INTEGER`, `REAL`, `BLOB`, `NUMERIC`) and constraints (`NOT NULL`, `DEFAULT`).
  - Rename columns (`ALTER TABLE ... RENAME COLUMN`) with immediate database schema updates.
  - Drop columns (`ALTER TABLE ... DROP COLUMN`) directly from the UI.
  - Create new custom tables with typed column definitions or drop existing tables.
- **Data Browser**: Search, filter, insert, edit, and delete rows in any table.
- **Interactive SQL Console**: Execute arbitrary queries (`SELECT`, `INSERT`, `UPDATE`, `ALTER`, `PRAGMA`) with real-time execution duration metrics.
- **Full Database Export**: Download database backups as JSON with one click.

### 2. 💧 Invisible Background Water Alarm Process
- **Completely Unseen on Main Screen**: Runs silently as a background service with zero visual water lines or banners cluttering the interface.
- **Multi-Tone Synthesizer Alarm Buzz**: Uses the Web Audio API (`playWaterAlarmBuzzer()`) to emit a multi-pulse electronic buzzer when the hydration interval elapses.
- **Background Notifications**: Triggers system notifications if permission is granted.
- **On-Demand Buzz Test**: Test button available in Profile Settings.

### 3. 📱 Zero-Hardware Phone Telemetry Hub
- **Accelerometer Step Cadence**: Measures walking cadence (RPM) and steps directly using standard mobile browser Sensor APIs.
- **Screen-Off Sleep Estimation**: Estimates sleep duration and sleep debt from nighttime phone inactivity cycles.
- **Campus Elevation & Stairs**: Estimates vertical load from stair climbs between lecture halls and library floors.
- **Offline Resilient Sync**: Caches sensor telemetry locally with instant SQLite database synchronization.

### 4. 🧠 Exam Cortisol Auto-Scaler & Explainable AI
- **Dual-Mode Engine**: Transitions between **Standard Baseline Workout** (35 mins) and **Restorative Exam Deload** (18 mins).
- **Biological Reasoning**: Explains cortisol surges, nervous system down-regulation, and postural strain relief (e.g., desk neck strain, rounded shoulders).
- **Transparent AI Rationale**: Clear, guilt-free messaging acknowledging that deloading before exams is strategic periodization.

### 5. ⚖️ Physical Measures & Biomarker Suite
- **Interactive BMI Calculator**: Visual gauge with color-coded clinical health brackets.
- **BMR & TDEE Estimator**: Mifflin-St Jeor metabolic expenditure calculation tailored to student study habits.
- **Target Calorie Calculator**: Customized targets for fat loss, muscle tone, or cognitive maintenance.
- **Precision Macro Distribution**: Grams and percentages for Protein, Carbohydrates, and Healthy Fats.
- **Hydration & Ideal Weight**: Daily water requirement metrics (ml & glasses) and Devine ideal weight formula.

### 6. 🥗 Food Nutrition Measure & Natural Language AI
- **Natural Language Meal Parsing**: Type queries like *"2 boiled eggs with 1 slice whole wheat bread and peanut butter"*.
- **Instant Macro Breakdown**: Accurate calculation of Calories, Protein, Carbs, Fat, Dietary Fiber, Saturated Fat, Sodium, and Sugar.
- **Cognitive Impact Score**: Highlights brain-fuel nutrients (e.g., choline for exam recall, low-glycemic carbs for sustained alertness).
- **Student Affordability & Complexity**: Tags meals as *Budget Master*, *Moderate*, or *Treat*, and identifies equipment needed (*No Cook*, *Kettle/Microwave*, *Full Kitchen*).

### 7. 🍲 Budget-Friendly Student Diet Planner
- **Target Daily Budget**: Under ₹120 ($1.50–$4.50/day) using high-protein pantry staples (chickpeas, lentils, eggs, oats, peanut butter).
- **Dorm Equipment Filtering**: Tailored specifically for kettle-only, microwave-only, or mini-fridge setups.
- **AI Meal Swap**: One-click intelligent meal substitution respecting allergies and budget limits.

### 8. 🔒 Ambient Lock Screen Glance Widget
- Simulates mobile ambient display showing:
  - Days remaining until the next exam / submission deadline.
  - Today's step progress vs. daily minimum target.
  - Active recovery routine prompt with single-tap workout launch.

---

## 🏗️ Architecture & Technology Stack

```
fitpath-ai/
├── db.ts                        # SQLite relational database engine, schema bootstrap & API helpers
├── server.ts                    # Express server with SQLite endpoints & Gemini AI pipeline
├── public/
│   ├── database-manager.html    # Standalone live SQLite database structure & data manager
├── src/
│   ├── App.tsx                  # Master application controller & state orchestrator
│   ├── components/
│   │   ├── Header.tsx               # Unified, aligned navigation tab bar with DB manager link
│   │   ├── BackgroundWaterAlarm.tsx # Invisible background hydration buzzer alarm
│   │   ├── WorkoutView.tsx          # Interactive routine execution & logging
│   │   ├── StressAutoScaler.tsx     # Exam countdown & cortisol scaler
│   │   ├── PhysicalMeasures.tsx     # BMI, BMR, TDEE, Calorie & Macro calculator
│   │   ├── FoodNutritionAnalyzer.tsx# AI-powered food nutrient measure engine
│   │   ├── StudentDietPlanner.tsx   # Sub-₹120 dorm meal organizer & swap
│   │   ├── SensorSyncHub.tsx        # Phone accelerometer & sensor sync
│   │   ├── LockScreenGlance.tsx     # Smartphone lock screen simulator
│   │   ├── HomePhotoSlider.tsx      # Motion carousel for feature highlights
│   │   ├── SIHPrototypeModal.tsx    # Hackathon evaluation dossier & persona presets
│   │   └── ProfileSettings.tsx      # Medical profile, physical inputs, DB & alarm controls
│   ├── theme.ts                 # Fitness theme definitions
│   ├── types.ts                 # TypeScript schemas
│   └── utils/
│       └── soundEffects.ts      # Web Audio API alarm buzzer & chime synthesizer
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Database**: SQLite 3 (`data/fitpath.db`) via Node.js native `node:sqlite`.
- **Database Manager**: Standalone responsive HTML/JS interface (`/database-manager.html` or `/db-admin`).
- **Backend**: Node.js, Express, `tsx`.
- **AI Engine**: Google Gemini API via `@google/genai` SDK (`gemini-3.1-flash-lite` primary with automatic fallback to `gemini-3.8-flash`).

---

## ⚡ Accessing the Database Manager

You can access the Database Structure Manager in two ways:
1. **Via the FitPath Web App**: Click the **"DB Manager"** tab in the top navigation bar or the "Open Database Manager HTML" button in Profile Settings.
2. **Direct URL**: Navigate to [`/database-manager.html`](http://localhost:3000/database-manager.html) or [`/db-admin`](http://localhost:3000/db-admin).
