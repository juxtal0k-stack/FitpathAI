# Product Requirements Document (PRD)

## Project Name: FitPath AI — Zero-Hardware Student Health Intelligence
**Document Version:** 2.0.0 (Production Release)  
**Target Platform:** Web (Progressive Web App / Mobile & Desktop Responsive)  
**Hackathon Focus:** Smart India Hackathon (SIH) — Student Wellness & Ergonomics Track  
**Author:** FitPath Engineering & Product Team  
**Last Updated:** September 2026  

---

## 1. Executive Summary & Product Vision

### 1.1 The Student Wellness Crisis
Over 82% of university students and competitive exam candidates abandon physical fitness and balanced nutrition during exam weeks. Commercial fitness technology suffers from an inherent **privilege bias**:
- **Hardware Barrier:** Assumes students can afford a ₹15,000 to ₹45,000 smartwatch (Apple Watch, Whoop, Garmin).
- **Punitive Logic:** Fitness apps penalize students for broken streaks when exams force them to study for 12 hours a day.
- **Unrealistic Nutrition:** Meal plans mandate fully equipped kitchens with ovens, gas stoves, blenders, and expensive specialty groceries (avocados, whey isolate, salmon).
- **Physical Toll:** 8+ hours of desk study causes text-neck cervical strain, thoracic kyphosis, and heightened cortisol levels, which impairs hippocampal memory consolidation.

### 1.2 The FitPath Solution
**FitPath AI** is an intelligent, zero-cost, zero-hardware health companion designed specifically for university students. It transforms any standard Android or iOS smartphone into a clinical-grade health monitor using built-in accelerometers, dynamically scales workouts down to restorative decompression routines during high-stress exam periods, generates complete daily nutrition plans under ₹120 ($1.50–$3.50) cookable strictly using a dorm kettle or microwave, stores all data in a structured relational SQLite database, and runs hydration reminders in the background without on-screen distraction.

---

## 2. Target User Personas & Clinical Scenarios

| Persona Attribute | Persona A: Rohan Sharma | Persona B: Priya Nair | Persona C: Arjun Patel |
| :--- | :--- | :--- | :--- |
| **Academic Context** | Computer Science Finalist (Exams in 4 Days) | Medical Intern (Exams in 12 Days) | 2nd Year Mechanical (Exams in 20 Days) |
| **Stress & Sleep** | High Stress (8/10), 5.5 Hours Sleep | High Stress (7/10), 6.0 Hours Sleep | Normal Stress (3/10), 7.5 Hours Sleep |
| **Physical Symptoms** | Desk Neck Strain, Forward Head Posture | Lumbar Strain, Lower Back Tenderness | Healthy, Seeking Muscle Tone & Stamina |
| **Kitchen Setup** | Microwave & Electric Kettle Only | Kettle Only (Hostel Room) | Shared Hostel Mess + Mini Fridge |
| **Daily Food Budget**| ₹120 / day | ₹100 / day | ₹150 / day |
| **FitPath Action** | **Auto-Deload to 18m Restorative** | **Joint-Sparing Posture Rehab** | **Full Baseline Progressive Overload** |

---

## 3. Product Principles & Craftsmanship Philosophy

1. **Human Typography Hierarchy:** Employs **Plus Jakarta Sans** for body readability and tabular metrics, paired with **Outfit** and **Roboto** for athletic headings and display treatments.
2. **Clean, Uncluttered Interface:** No visual watermarks or intrusive water lines cutting across the interface. Clean contrast (≥4.5:1) passing WCAG AA standards.
3. **Invisible Background Hydration Alarm:** Hydration schedules run completely unseen in the background, emitting an audible multi-frequency alarm buzzer when it is time to drink.
4. **Relational Data Integrity:** ACID-compliant SQLite storage with structured tables and a separate live HTML schema management tool.
5. **Empathetic & Guilt-Free Periodization:** Explains the biological necessity of scaling down during exam periods rather than displaying punitive red streak breaks.

---

## 4. Functional Specifications & Feature Requirements

### 4.1 Relational SQLite Database & Live Schema Manager
- **FR-1.1 (ACID Storage):** All user profiles, workouts, meals, telemetry, daily activity logs, and settings stored in persistent SQLite (`data/fitpath.db`).
- **FR-1.2 (Standalone Schema Manager):** Dedicated `public/database-manager.html` interface accessible at `/database-manager.html` or `/db-admin`.
- **FR-1.3 (Live Structure Modification):**
  - Add Column (`ALTER TABLE ... ADD COLUMN`)
  - Drop Column (`ALTER TABLE ... DROP COLUMN`)
  - Rename Column (`ALTER TABLE ... RENAME COLUMN`)
  - Create Table (`CREATE TABLE ...`)
  - Drop Table (`DROP TABLE ...`)
- **FR-1.4 (Data Record Browser):** Search, filter, insert, update, and delete rows in any table.
- **FR-1.5 (SQL Query Console):** Interactive raw SQL executor with millisecond execution timer and tabular result set visualization.
- **FR-1.6 (Full Export):** One-click download of the complete database in JSON format.

### 4.2 Background Water Alarm Process
- **FR-2.1 (Invisible Background Execution):** Renders zero on-screen elements; runs in background without visual clutter.
- **FR-2.2 (Audible Buzzer Sound):** Uses Web Audio API synthesizer (`playWaterAlarmBuzzer`) to produce an electronic multi-pulse alarm buzz.
- **FR-2.3 (Background Notification):** Dispatches system notifications when granted.
- **FR-2.4 (Customizable Intervals):** Supports intervals from 30 to 90 minutes.

### 4.3 Zero-Hardware Phone Telemetry Hub
- **FR-3.1 (Accelerometer Cadence):** Access HTML5 `DeviceMotion` / `Accelerometer` API to calculate steps and revolutions-per-minute (RPM) walking cadence.
- **FR-3.2 (Screen-Off Sleep Estimation):** Estimate nocturnal sleep opportunity using the continuous window between nocturnal device lock and morning alarm unlock.
- **FR-3.3 (Campus Stair Load):** Measure vertical load heuristics between lecture halls and library floors based on step cadence shifts.
- **FR-3.4 (Sensor Sync & SQLite Persistence):** Synchronizes sensor telemetry into the SQLite database.

### 4.4 Exam Cortisol Auto-Scaler & Explainable AI
- **FR-4.1 (Dynamic Dual Mode Engine):** Automatically switch between:
  - *Mode 1 (Standard Baseline):* 35-minute progressive strength & conditioning.
  - *Mode 2 (Exam Deload):* 18-minute restorative posture decompression.
- **FR-4.2 (Stress Triggers):** Automatically triggers Mode 2 when Days to exam $\le 7$ AND Stress score $\ge 6/10$, OR Sleep duration $< 6.0$ hours.
- **FR-4.3 (Gemini Biological Explanations):** Generates transparent clinical rationales explaining cortisol surges and immune preservation.
- **FR-4.4 (Manual Override):** Allows students to manually toggle between Deload and Baseline routines at any time.

### 4.5 Physical Measures & Biometric Suite
- **FR-5.1 (Interactive BMI Calculator):** Dynamic metric/imperial sliders calculating BMI with clinical risk categories.
- **FR-5.2 (BMR & TDEE Estimator):** Mifflin-St Jeor metabolic expenditure calculations adjusted for student study schedules.
- **FR-5.3 (Target Calorie Breakdown):** Custom targets for Cognitive Maintenance, Gentle Fat Loss, or Lean Tone.
- **FR-5.4 (Macro Gram Targets):** Calculates grams and percentage ratios for Protein, Carbohydrates, and Healthy Fats.
- **FR-5.5 (Hydration Metric):** Computes water targets in milliliters and standard glasses.

### 4.6 Food Nutrition Analyzer (AI-Powered)
- **FR-6.1 (Natural Language Input):** Parses freeform food text (e.g., *"2 boiled eggs with 1 slice whole wheat toast and peanut butter"*).
- **FR-6.2 (Macro & Micro Extraction):** Returns Calories, Protein, Carbohydrates, Fat, Dietary Fiber, Saturated Fat, Sodium, and Sugar.
- **FR-6.3 (Cognitive Impact Score):** Analyzes brain-fuel nutrients for exam alertness.
- **FR-6.4 (Affordability & Equipment Tagging):** Tags food by cost bracket and appliance complexity.

### 4.7 Sub-₹120 Dorm Nutrition Planner & AI Meal Swap
- **FR-7.1 (Appliance Filtering):** Filters meal recipes by available equipment: *Kettle-Only*, *Microwave-Only*, *No-Cook*, or *Shared Kitchen*.
- **FR-7.2 (Pantry Protein Staples):** Recipes formulated around affordable pantry items: lentils, chickpeas, eggs, oats, and peanut butter.
- **FR-7.3 (AI Meal Swap):** Generates instant dietary substitutes matching caloric and budget targets via Gemini API.

### 4.8 Ambient Lock Screen Glance Simulator
- **FR-8.1 (Lock Screen Widget):** Simulates mobile ambient glance screen showing days until exams, recovery status pill, and phone step count.
- **FR-8.2 (Quick Action Launcher):** Allows launching the restorative routine directly with a single tap.

---

## 5. Technical Architecture & AI Resilience

```
                                  ┌──────────────────────────┐
                                  │   React 19 + Vite PWA    │
                                  │   (Tailwind + Motion)    │
                                  └─────────────┬────────────┘
                                                │ REST API
                                                ▼
                                  ┌──────────────────────────┐
                                  │   Express Server (3000)  │
                                  │   (/api/* Routes)        │
                                  └──────┬─────────────┬─────┘
                                         │             │
                ┌────────────────────────┴─┐         ┌─┴────────────────────────┐
                ▼                          ▼         ▼                          ▼
    ┌──────────────────────┐   ┌──────────────────────┐   ┌─────────────────────────┐
    │  SQLite Database     │   │ Database Manager HTML│   │ Google Gemini API       │
    │  (data/fitpath.db)   │   │ (/database-manager)  │   │ (@google/genai SDK)     │
    └──────────────────────┘   └──────────────────────┘   └─────────────────────────┘
```
