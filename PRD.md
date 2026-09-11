# Product Requirements Document (PRD)

## Project Name: FitPath AI — Zero-Hardware Student Health Intelligence
**Document Version:** 1.0.0 (Release Candidate)  
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
**FitPath AI** is an intelligent, zero-cost, zero-hardware health companion designed specifically for university students. It transforms any standard Android or iOS smartphone into a clinical-grade health monitor using built-in accelerometers, dynamically scales workouts down to restorative decompression routines during high-stress exam periods, and generates complete daily nutrition plans under ₹120 ($1.50–$3.50) cookable strictly using a dorm kettle or microwave.

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

## 3. Product Principles & Authentic Design Philosophy

To distance itself from generic, low-effort "AI-generated" templates, FitPath adheres to strict product craftsmanship guidelines:
1. **Human Typography Hierarchy:** Employs **Plus Jakarta Sans** for body readability and tabular metrics, paired with **Outfit** for athletic headings and display treatments. No generic unstyled system defaults.
2. **Light-First Editorial Aesthetic:** Default themes are high-contrast, clean studio daylight palettes (Performance Sage, Nordic Stone, Athletic Club, Solar Terracotta) passing WCAG AA contrast (≥4.5:1).
3. **Atmospheric Gym Watermarks:** Subtle, low-opacity (3–7%) athletic gym photography watermarks layered behind the canvas with smooth vignette overlays to convey authentic sports brand identity without reducing readability.
4. **Empathetic & Guilt-Free Periodization:** Explains the biological necessity of scaling down during exam periods rather than displaying punitive red streak breaks.

---

## 4. Functional Specifications & Feature Requirements

### 4.1 Zero-Hardware Phone Telemetry Hub
- **FR-1.1 (Accelerometer Cadence):** Access HTML5 `DeviceMotion` / `Accelerometer` API to calculate steps and revolutions-per-minute (RPM) walking cadence.
- **FR-1.2 (Screen-Off Sleep Estimation):** Estimate nocturnal sleep opportunity using the continuous window between nocturnal device lock and morning alarm unlock.
- **FR-1.3 (Campus Stair Load):** Measure vertical load heuristics between lecture halls and library floors based on step cadence shifts.
- **FR-1.4 (Sensor Sync & Offline Cache):** Store sensor events in `localStorage` and sync with the Express backend whenever network is available.

### 4.2 Exam Cortisol Auto-Scaler & Explainable AI
- **FR-2.1 (Dynamic Dual Mode Engine):** Automatically switch between:
  - *Mode 1 (Standard Baseline):* 35-minute progressive strength & conditioning.
  - *Mode 2 (Exam Deload):* 18-minute restorative posture decompression (deep cervical flexor activation, thoracic extension, hamstring flossing).
- **FR-2.2 (Stress Triggers):** Automatically triggers Mode 2 when:
  - Days to exam $\le 7$ AND Stress score $\ge 6/10$, OR
  - Sleep duration $< 6.0$ hours.
- **FR-2.3 (Gemini Biological Explanations):** Generates transparent clinical rationales explaining cortisol surges, immune preservation, and glucose allocation for memory consolidation.
- **FR-2.4 (Manual Override):** Allows students to manually toggle between Deload and Baseline routines at any time.

### 4.3 Physical Measures & Biometric Suite
- **FR-3.1 (Interactive BMI Calculator):** Dynamic metric/imperial sliders calculating BMI with clinical risk categories (Underweight, Normal, Overweight, Obese).
- **FR-3.2 (BMR & TDEE Estimator):** Mifflin-St Jeor metabolic expenditure calculations adjusted for student study schedules.
- **FR-3.3 (Target Calorie Breakdown):** Custom targets for Cognitive Maintenance, Gentle Fat Loss, or Lean Tone.
- **FR-3.4 (Macro Gram Targets):** Calculates grams and percentage ratios for Protein, Carbohydrates, and Healthy Fats.
- **FR-3.5 (Hydration Metric):** Computes water targets in milliliters and standard glasses.

### 4.4 Food Nutrition Analyzer (AI-Powered)
- **FR-4.1 (Natural Language Input):** Parses freeform food text (e.g., *"2 boiled eggs with 1 slice whole wheat toast and peanut butter"*).
- **FR-4.2 (Macro & Micro Extraction):** Returns Calories, Protein, Carbohydrates, Fat, Dietary Fiber, Saturated Fat, Sodium, and Sugar.
- **FR-4.3 (Cognitive Impact Score):** Analyzes brain-fuel nutrients (choline for acetylcholine synthesis, low-glycemic complex carbs for alertness).
- **FR-4.4 (Student Budget & Complexity Tagging):** Tags food as *Budget Master*, *Moderate*, or *Treat*, and categorizes preparation equipment needed.

### 4.5 Sub-₹120 Dorm Nutrition Planner & AI Meal Swap
- **FR-5.1 (Appliance-Specific Filtering):** Filters meal recipes by available equipment: *Kettle-Only*, *Microwave-Only*, *No-Cook*, or *Shared Kitchen*.
- **FR-5.2 (High-Bioavailability Staples):** Recipes formulated around affordable pantry items: lentils, chickpeas, whole eggs, rolled oats, and peanut butter.
- **FR-5.3 (Interactive AI Meal Swap):** Generates instant dietary substitutes matching caloric and budget targets via Gemini API.

### 4.6 Ambient Lock Screen Glance Simulator
- **FR-6.1 (Lock Screen Widget):** Simulates mobile ambient glance screen showing days until exams, recovery status pill, and phone step count.
- **FR-6.2 (Quick Action Launcher):** Allows launching the restorative routine directly with a single tap.

### 4.7 Multi-Theme & Watermark System
- **FR-7.1 (Curated Light Themes):** 4 light color schemes (Performance Sage, Nordic Stone, Athletic Club, Solar Terracotta).
- **FR-7.2 (Gym Photo Watermarks):** Real gym photography watermarks with 4 selectable intensity levels (*Subtle*, *Balanced*, *Prominent*, *Off*).

---

## 5. Technical Architecture & AI Resilience

```
                                  ┌──────────────────────────┐
                                  │   React 18 + Vite PWA    │
                                  │   (Tailwind + Motion)    │
                                  └─────────────┬────────────┘
                                                │ REST API / JSON
                                                ▼
                                  ┌──────────────────────────┐
                                  │   Express Backend (3000) │
                                  │   (server.ts)            │
                                  └──────┬────────────┬──────┘
                                         │            │
             Primary (High Throughput)   │            │ Fallback (Complex)
                                         ▼            ▼
                     ┌───────────────────────┐   ┌───────────────────────┐
                     │ gemini-3.1-flash-lite │   │ gemini-3.8-flash      │
                     └───────────────────────┘   └───────────────────────┘
                                         │            │
                                         ▼            ▼
                     ┌───────────────────────────────────────────────────┐
                     │ Offline Clinical Safety Database (Deterministic)  │
                     └───────────────────────────────────────────────────┘
```

### 5.1 AI Pipeline Resilience Specs
1. **Primary Model:** `gemini-3.1-flash-lite` for sub-second responses and high concurrency.
2. **Secondary Model:** `gemini-3.8-flash` for automatic failover.
3. **Exponential Backoff:** Catches transient 503 (High Demand) and 429 (Rate Limit) errors with jittered backoff.
4. **Markdown Stripping:** Sanitizes raw model output via `parseJsonSafely` to remove code fences (` ```json `) before parsing.
5. **Deterministic Clinical Safety Net:** If the Gemini API is unreachable, verified sports science algorithms immediately return clinical routines and meal plans.

---

## 6. Non-Functional Requirements (NFRs)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | Initial page load on 4G networks | $< 1.8$ seconds |
| **AI Latency** | Food nutrition query & workout generation | $< 1.2$ seconds |
| **Availability** | System uptime during high-demand spikes | $99.9\%$ uptime via dual-model fallback |
| **Accessibility** | Color contrast on all text and UI elements | WCAG AA compliant ($\ge 4.5:1$ contrast) |
| **Storage & Edge** | Offline capability without active Wi-Fi | Full PWA offline caching via Service Worker |
| **Privacy** | Student biometric data security | 100% on-device telemetry; zero GPS tracking |

---

## 7. SIH Evaluation Matrix & Competitive Differentiation

| Evaluation Criteria | Commercial Fitness Apps (Whoop, MyFitnessPal) | FitPath AI (SIH Prototype) |
| :--- | :--- | :--- |
| **Hardware Required** | ₹15,000 – ₹45,000 external sensor band | **₹0 (Standard Smartphone Sensors)** |
| **Monthly Subscription** | ₹999 – ₹2,499 / month | **100% Free Open Source** |
| **Exam Period Support** | Punitive streak reset; rigid heavy workouts | **Dynamic Cortisol Deload (-45% CNS fatigue)** |
| **Hostel Cooking Feasibility** | Stovetop, oven, and blender required | **Kettle, Microwave, or No-Cook only** |
| **Daily Food Cost** | ₹350 – ₹700 / day | **Sub-₹120 / day ($1.50 - $3.50)** |
| **Design Craftsmanship** | Generic dark SaaS gradients or generic templates | **Light-first editorial aesthetic with gym watermarks** |

---

## 8. Release Roadmap

- **Phase 1 (Current Release - SIH Prototype):**
  - Zero-hardware phone sensor telemetry integration.
  - Exam cortisol periodization engine with Gemini biological explainability.
  - Sub-₹120 hostel nutrition planner and natural language food analyzer.
  - Ambient lock-screen widget simulator.
  - Curated light theme suite with gym photo watermark backgrounds.
  - Interactive In-App Presentation & Pitch Guide.

- **Phase 2 (Post-Hackathon University Pilot):**
  - University hostel mess menu OCR scraper and nutritional grader.
  - Web Bluetooth integration for optional ₹999 open-hardware pulse oximeters.
  - Batch meal-prep group orders for campus bulk discounts.

- **Phase 3 (Enterprise Campus Deployment):**
  - Campus-wide health anonymized ergonomics dashboard for universities.
  - On-device WebAssembly computer vision for desk posture correction.
