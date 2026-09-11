import React, { useState } from 'react';
import { 
  Flame, 
  User, 
  HeartPulse, 
  Utensils, 
  Dumbbell, 
  DollarSign, 
  Check, 
  Sparkles, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { IndividualProfile } from '../types';

interface InitialSetupIntakeProps {
  onComplete: (profileData: any) => Promise<void>;
}

export const InitialSetupIntake: React.FC<InitialSetupIntakeProps> = ({ onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(21);
  const [gender, setGender] = useState('Male');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [occupation, setOccupation] = useState('Student (Exams in 1-2 weeks)');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  
  // Medical
  const [jointBackIssues, setJointBackIssues] = useState('none');
  const [chronicConditions, setChronicConditions] = useState('none');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
  const [physicalLimitations, setPhysicalLimitations] = useState('');

  // Fitness & Budget
  const [fitnessGoal, setFitnessGoal] = useState<'stress-relief' | 'muscle-tone' | 'fat-loss' | 'endurance' | 'posture-rehab'>('stress-relief');
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'active'>('beginner');
  const [preferredLocation, setPreferredLocation] = useState<'home-bodyweight' | 'dorm-room' | 'campus-outdoors' | 'gym'>('home-bodyweight');
  const [budgetPerDay, setBudgetPerDay] = useState<number>(4.5);
  const [dormFacilities, setDormFacilities] = useState<'kettle-only' | 'microwave-kettle' | 'full-shared-kitchen' | 'standard-kitchen'>('microwave-kettle');

  // Fill quick demo preset for testing
  const loadPreset = (preset: 'student' | 'back-pain') => {
    if (preset === 'student') {
      setName('Jordan Lee');
      setAge(20);
      setGender('Non-binary');
      setHeightCm(170);
      setWeightKg(65);
      setOccupation('Computer Science Student');
      setJointBackIssues('neck-shoulder');
      setChronicConditions('none');
      setDietaryRestrictions('vegetarian');
      setPhysicalLimitations('Relieve desk slouching from long study sessions');
      setFitnessGoal('stress-relief');
      setFitnessLevel('beginner');
      setPreferredLocation('dorm-room');
      setBudgetPerDay(4.0);
      setDormFacilities('microwave-kettle');
    } else {
      setName('Sam Morgan');
      setAge(26);
      setGender('Male');
      setHeightCm(180);
      setWeightKg(82);
      setOccupation('Remote Desk Worker');
      setJointBackIssues('lower-back');
      setChronicConditions('none');
      setDietaryRestrictions('lactose-free');
      setPhysicalLimitations('Avoid heavy spinal compression or deep unassisted bending');
      setFitnessGoal('posture-rehab');
      setFitnessLevel('intermediate');
      setPreferredLocation('home-bodyweight');
      setBudgetPerDay(6.0);
      setDormFacilities('kettle-only');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }

    const diffDays = Math.max(
      1,
      Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    );

    const payload = {
      name: name.trim(),
      age,
      gender,
      heightCm,
      weightKg,
      occupationOrSchedule: occupation,
      examDate,
      daysUntilExam: isNaN(diffDays) ? 7 : diffDays,
      budgetPerDay,
      dormFacilities,
      fitnessGoal,
      fitnessLevel,
      preferredLocation,
      medical: {
        jointBackIssues,
        chronicConditions,
        dietaryRestrictions,
        physicalLimitations,
        medicalPrecautions: [],
      },
      sensorConnected: {
        googleFit: true,
        appleHealth: false,
      },
      hasSmartwatch: false,
    };

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onComplete(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize profile on server.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Welcome Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Welcome to FitPath
              </h1>
              <p className="text-xs text-slate-500">
                Personalized Fitness & Budget Nutrition • Tailored to Your Body & Medical Baseline
              </p>
            </div>
          </div>

          {/* Quick preset buttons for instant test */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Quick fill:</span>
            <button
              type="button"
              onClick={() => loadPreset('student')}
              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
            >
              Student (Desk strain)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('back-pain')}
              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium transition cursor-pointer"
            >
              Lower Back Safe
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Individual Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-100 text-slate-700">
                <User className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Personal Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Role / Daily Routine
                </label>
                <input
                  type="text"
                  placeholder="e.g. University Student, Office Worker"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value) || 65)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target Exam / High-Stress Deadline Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                The auto-scaler dynamically reduces workout strain during the 7-10 days leading up to this date.
              </span>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Medical & Physical Health Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-100 text-amber-800">
                <HeartPulse className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Medical & Physical Considerations
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Your workouts will be medically filtered to ensure safe joint tracking and avoid aggravating pain points.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Joint / Spine / Posture Sensitivity
                </label>
                <select
                  value={jointBackIssues}
                  onChange={(e) => setJointBackIssues(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="none">No joint or back issues (Full clearance)</option>
                  <option value="lower-back">Lower Back Sensitivity (No heavy spinal axial loading)</option>
                  <option value="knee">Knee Sensitivity (Low-impact tracking only)</option>
                  <option value="neck-shoulder">Desk Neck & Shoulder Strain (Add thoracic extensions)</option>
                  <option value="wrist">Wrist Discomfort (Avoid flat floor push-ups)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Chronic Conditions
                </label>
                <select
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="none">None</option>
                  <option value="asthma">Asthma / Mild Respiratory (Controlled rest intervals)</option>
                  <option value="hypertension">High Blood Pressure (Avoid Valsalva breath-holding)</option>
                  <option value="migraine">Stress Migraines (Avoid extreme cervical straining)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dietary Restrictions & Allergies
                </label>
                <select
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="none">No Restrictions (Omnivore)</option>
                  <option value="vegetarian">Vegetarian (Eggs & Dairy OK)</option>
                  <option value="vegan">Vegan (100% Plant-based)</option>
                  <option value="lactose-free">Lactose Intolerant (No Dairy)</option>
                  <option value="gluten-free">Gluten Sensitive / Celiac</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Specific Physical Notes or Limitations (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Previous ankle sprain, prefer low noise in room"
                  value={physicalLimitations}
                  onChange={(e) => setPhysicalLimitations(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Goals & Constraints */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-100 text-emerald-800">
                <Dumbbell className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Fitness Goals & Budget
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Fitness Goal</label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="stress-relief">Stress Relief & Mobility</option>
                  <option value="muscle-tone">Muscle Tone & Hypertrophy</option>
                  <option value="posture-rehab">Posture Rehabilitation</option>
                  <option value="fat-loss">Fat Loss & Conditioning</option>
                  <option value="endurance">Cardio & Daily Energy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Experience Level</label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="beginner">Beginner (Gentle progression)</option>
                  <option value="intermediate">Intermediate (Regular activity)</option>
                  <option value="active">Active (High work capacity)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Workout Location</label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="home-bodyweight">Home / Living Space (Bodyweight)</option>
                  <option value="dorm-room">Dorm Room (Chair / Backpack)</option>
                  <option value="campus-outdoors">Campus Outdoors / Stairs</option>
                  <option value="gym">Gym with Free Weights</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Daily Food Budget ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="30"
                    value={budgetPerDay}
                    onChange={(e) => setBudgetPerDay(parseFloat(e.target.value) || 4.5)}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Available Cooking Appliances
                </label>
                <select
                  value={dormFacilities}
                  onChange={(e) => setDormFacilities(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="kettle-only">Electric Kettle Only</option>
                  <option value="microwave-kettle">Microwave + Kettle</option>
                  <option value="full-shared-kitchen">Full Kitchen (Stove & Fridge)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Saved locally to your server. Can be reset or updated anytime.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Configuring Personalized Plan...</span>
                </>
              ) : (
                <>
                  <span>Generate Personalized Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
