import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Utensils, 
  Check, 
  RotateCcw,
  ShieldCheck,
  HeartPulse,
  Trash2
} from 'lucide-react';
import { IndividualProfile, DormFacilities } from '../types';

interface ProfileSettingsProps {
  profile: IndividualProfile;
  onUpdateProfile: (updated: IndividualProfile) => Promise<void>;
  onResetToNewIndividual: () => Promise<void>;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onUpdateProfile,
  onResetToNewIndividual,
}) => {
  const [formData, setFormData] = useState<IndividualProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Profile & Medical Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Update your medical considerations, food budget, and schedule. The server updates your custom plan automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Occupation / Schedule
              </label>
              <input
                type="text"
                value={formData.occupationOrSchedule}
                onChange={(e) => setFormData({ ...formData, occupationOrSchedule: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
              <input
                type="text"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 170 })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseInt(e.target.value) || 65 })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Upcoming Exam / Target Deadline
              </label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  const diffDays = Math.max(
                    1,
                    Math.ceil((new Date(newDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  );
                  setFormData({
                    ...formData,
                    examDate: newDate,
                    daysUntilExam: isNaN(diffDays) ? 7 : diffDays,
                  });
                }}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                {formData.daysUntilExam} days until deadline
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Primary Goal
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="stress-relief">Stress Relief & Mobility</option>
                <option value="muscle-tone">Muscle Tone & Hypertrophy</option>
                <option value="posture-rehab">Posture Rehabilitation</option>
                <option value="fat-loss">Fat Loss & Conditioning</option>
                <option value="endurance">General Energy & Stamina</option>
              </select>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Medical & Physical Health Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Medical & Physical Considerations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Joint / Spine Sensitivity
              </label>
              <select
                value={formData.medical?.jointBackIssues || 'none'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medical: { ...formData.medical, jointBackIssues: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="none">None (Full clearance)</option>
                <option value="lower-back">Lower Back Sensitivity</option>
                <option value="knee">Knee Sensitivity</option>
                <option value="neck-shoulder">Desk Neck & Shoulder Strain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Dietary Restrictions
              </label>
              <select
                value={formData.medical?.dietaryRestrictions || 'none'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medical: { ...formData.medical, dietaryRestrictions: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="none">No Restrictions</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="lactose-free">Lactose-Free</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Physical Limitations or Notes
            </label>
            <input
              type="text"
              value={formData.medical?.physicalLimitations || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  medical: { ...formData.medical, physicalLimitations: e.target.value },
                })
              }
              placeholder="e.g. Low impact only, avoid heavy floor lifting"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Budget & Equipment */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Budget & Appliances
          </h3>

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
                  value={formData.budgetPerDay}
                  onChange={(e) => setFormData({ ...formData, budgetPerDay: parseFloat(e.target.value) || 4 })}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Available Appliances
              </label>
              <select
                value={formData.dormFacilities}
                onChange={(e) => setFormData({ ...formData, dormFacilities: e.target.value as DormFacilities })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900"
              >
                <option value="kettle-only">Electric Kettle Only</option>
                <option value="microwave-kettle">Microwave + Kettle</option>
                <option value="full-shared-kitchen">Full Kitchen (Stove & Fridge)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-red-600 hover:text-red-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Start Fresh with New Individual (Wipe Data)
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-700 font-medium">Are you sure?</span>
                <button
                  type="button"
                  onClick={onResetToNewIndividual}
                  className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
                >
                  Yes, Wipe & Restart
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Updated & Saved on Server
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSaving ? 'Regenerating...' : 'Save & Update Plan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
