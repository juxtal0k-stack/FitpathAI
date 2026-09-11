# FitPath AI — Zero-Hardware Student Health Intelligence

> **Smart India Hackathon (SIH) Prototype**  
> Problem Statement: High-stress student lifestyle, zero-hardware health monitoring, exam-period workout scaling, and affordable dorm nutrition.

---

## 🌟 Executive Overview

**FitPath AI** is an intelligent, zero-cost health and fitness platform engineered specifically for university students and exam candidates. Traditional fitness solutions assume expensive wearable hardware (Apple Watch, Fitbit), gym memberships, and meal prep kitchens. FitPath eliminates all three barriers:

1. **Zero-Hardware Phone Telemetry**: Uses built-in smartphone sensors (accelerometer, step cadence, screen-off sleep heuristics) instead of external wearables.
2. **Exam-Period Cortisol Auto-Scaler**: Automatically scales workout volume down by 40–50% during high-stress exam crunches to protect cognitive energy and prevent physical burnout.
3. **Clinical & AI Explainability**: Powered by Google Gemini (`gemini-3.1-flash-lite` with fallback to `gemini-3.8-flash`) with biological justification for every routine adaptation.
4. **Sub-₹120 / $4.50 Dorm Nutrition & Smart Analyzer**: Calculates macro-nutrients from natural language food queries and generates meals cookable with only a kettle or microwave.
5. **Lock Screen Glance Simulator**: Ambient lock-screen widget allowing students to monitor exam countdowns and physical recovery without distraction.

---

## 🚀 Key Features

### 1. 📱 Zero-Hardware Phone Telemetry Hub
- **Accelerometer Step Cadence**: Measures walking cadence (RPM) and steps directly using standard mobile browser Sensor APIs.
- **Screen-Off Sleep Estimation**: Estimates sleep duration and sleep debt from nighttime phone inactivity cycles.
- **Campus Elevation & Stairs**: Estimates vertical load from stair climbs between lecture halls and library floors.
- **Offline Resilient Sync**: Caches sensor telemetry locally with instant server synchronization.

### 2. 🧠 Exam Cortisol Auto-Scaler & Explainable AI
- **Dual-Mode Engine**: Transitions between **Standard Baseline Workout** (35 mins) and **Restorative Exam Deload** (18 mins).
- **Biological Reasoning**: Explains cortisol surges, nervous system down-regulation, and postural strain relief (e.g., desk neck strain, rounded shoulders).
- **Transparent AI Rationale**: Clear, guilt-free messaging acknowledging that deloading before exams is strategic periodization.

### 3. ⚖️ Physical Measures & Biomarker Suite
- **Interactive BMI Calculator**: Visual gauge with color-coded clinical health brackets.
- **BMR & TDEE Estimator**: Mifflin-St Jeor metabolic expenditure calculation tailored to student study habits.
- **Target Calorie Calculator**: Customized targets for fat loss, muscle tone, or cognitive maintenance.
- **Precision Macro Distribution**: Grams and percentages for Protein, Carbohydrates, and Healthy Fats.
- **Hydration & Ideal Weight**: Daily water requirement metrics (ml & glasses) and Devine ideal weight formula.

### 4. 🥗 Food Nutrition Measure & Natural Language AI
- **Natural Language Meal Parsing**: Type queries like *"2 boiled eggs with 1 slice whole wheat bread and peanut butter"*.
- **Instant Macro Breakdown**: Accurate calculation of Calories, Protein, Carbs, Fat, Dietary Fiber, Saturated Fat, Sodium, and Sugar.
- **Cognitive Impact Score**: Highlights brain-fuel nutrients (e.g., choline for exam recall, low-glycemic carbs for sustained alertness).
- **Student Affordability & Complexity**: Tags meals as *Budget Master*, *Moderate*, or *Treat*, and identifies equipment needed (*No Cook*, *Kettle/Microwave*, *Full Kitchen*).

### 5. 🍲 Budget-Friendly Student Diet Planner
- **Target Daily Budget**: Under ₹120 ($1.50–$4.50/day) using high-protein pantry staples (chickpeas, lentils, eggs, oats, peanut butter).
- **Dorm Equipment Filtering**: Tailored specifically for kettle-only, microwave-only, or mini-fridge setups.
- **AI Meal Swap**: One-click intelligent meal substitution respecting allergies and budget limits.

### 6. 🔒 Ambient Lock Screen Glance Widget
- Simulates mobile ambient display showing:
  - Days remaining until the next exam / submission deadline.
  - Today's step progress vs. daily minimum target.
  - Active recovery routine prompt with single-tap workout launch.

### 7. 🎨 Dynamic Multi-Theme Experience & Motion
- Multiple sports themes: Emerald Green, Neon Cyber, Solar Amber, Rose Energetic, Ocean Blue, Midnight Dark.
- Smooth spring animations across metric tiles and photo slide showcase.

---

## 🏗️ Architecture & Technology Stack

```
fitpath-ai/
├── server.ts                    # Express backend with resilient Gemini API pipeline
├── src/
│   ├── App.tsx                  # Master application controller & state orchestrator
│   ├── components/
│   │   ├── WorkoutView.tsx          # Interactive routine execution & logging
│   │   ├── StressAutoScaler.tsx     # Exam countdown & cortisol scaler
│   │   ├── PhysicalMeasures.tsx     # BMI, BMR, TDEE, Calorie & Macro calculator
│   │   ├── FoodNutritionAnalyzer.tsx# AI-powered food nutrient measure engine
│   │   ├── StudentDietPlanner.tsx   # Sub-₹120 dorm meal organizer & swap
│   │   ├── SensorSyncHub.tsx        # Phone accelerometer & sensor sync
│   │   ├── LockScreenGlance.tsx     # Smartphone lock screen simulator
│   │   ├── HomePhotoSlider.tsx      # Motion carousel for feature highlights
│   │   ├── SIHPrototypeModal.tsx    # Hackathon evaluation dossier & persona presets
│   │   └── ProfileSettings.tsx      # Medical profile, physical inputs, precautions
│   ├── theme.ts                 # Fitness theme definitions
│   └── types.ts                 # Full TypeScript schemas
```

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express, `tsx`.
- **AI Engine**: Google Gemini API via `@google/genai` SDK (`gemini-3.1-flash-lite` primary with automatic fallback to `gemini-3.8-flash`).
- **Resilience**: Exponential backoff retry handler for transient high-demand spikes and offline clinical database fallback.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file (or copy `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🎯 Pre-Loaded Demo Personas for Quick Evaluation

You can test the system immediately by clicking **"SIH Prototype"** in the top navigation bar:

1. **Rohan Sharma (Final Exam in 4 Days)**
   - High exam stress (8/10), 5.5 hours sleep, desk neck strain.
   - Triggers the **Cortisol Auto-Scaler**: automatically adjusts a 35-min strength routine down to an 18-min posture decompression session.
2. **Priya Nair (Medical Intern)**
   - 12 days to exams, lower lumbar tenderness, kettle-only dorm room.
   - Generates joint-sparing routines and kettle-only high-protein meal plans.
3. **Arjun Patel (Active Semester)**
   - 20 days to exams, normal sleep, gym access.
   - Operates in full baseline progressive overload mode.

---

## 📄 License & Attribution
Developed for the **Smart India Hackathon (SIH)**.  
Engineered for zero-hardware accessible student health.
