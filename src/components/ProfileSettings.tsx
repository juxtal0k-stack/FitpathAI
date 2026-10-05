import React, { useState, useMemo } from 'react';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Utensils, 
  Check, 
  RotateCcw,
  ShieldCheck,
  HeartPulse,
  Trash2,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Stethoscope,
  Volume2,
  Droplets,
  Scale,
  Database,
  ExternalLink,
  Sparkles,
  Palette
} from 'lucide-react';
import { IndividualProfile, DormFacilities } from '../types';
import { COUNTRIES_DATA, BLOOD_GROUPS } from '../data/locationData';
import { playDoctorAlertBuzzer } from '../utils/soundEffects';
import { FitnessTheme, FITNESS_THEMES } from '../theme';

interface ProfileSettingsProps {
  profile: IndividualProfile;
  onUpdateProfile: (updated: IndividualProfile) => Promise<void>;
  onResetToNewIndividual: () => Promise<void>;
  currentTheme?: FitnessTheme;
  onSelectTheme?: (theme: FitnessTheme) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onUpdateProfile,
  onResetToNewIndividual,
  currentTheme = 'midnight',
  onSelectTheme,
}) => {
  const [formData, setFormData] = useState<IndividualProfile>(profile);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Address cascade helper
  const selectedCountry = useMemo(() => {
    return COUNTRIES_DATA.find((c) => c.name === formData.addressCountry || c.dialCode === formData.phoneCountryCode) || COUNTRIES_DATA[0];
  }, [formData.addressCountry, formData.phoneCountryCode]);

  const statesForCountry = selectedCountry.states;
  const selectedState = useMemo(() => {
    return statesForCountry.find((s) => s.name === formData.addressState) || statesForCountry[0];
  }, [statesForCountry, formData.addressState]);

  const citiesForState = selectedState?.cities || [];
  const selectedCity = useMemo(() => {
    return citiesForState.find((c) => c.name === formData.addressCity) || citiesForState[0];
  }, [citiesForState, formData.addressCity]);

  const nearbyAddresses = selectedCity?.nearbyAddresses || [];

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const birth = new Date(val);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    setFormData({
      ...formData,
      dob: val,
      age: !isNaN(calculatedAge) && calculatedAge > 0 ? calculatedAge : formData.age,
    });
  };

  const handleCountryChange = (newCode: string) => {
    const country = COUNTRIES_DATA.find((c) => c.code === newCode);
    if (country) {
      const firstState = country.states[0]?.name || '';
      const firstCity = country.states[0]?.cities[0]?.name || '';
      const firstAddr = country.states[0]?.cities[0]?.nearbyAddresses[0]?.address || firstCity;
      const firstPostal = country.states[0]?.cities[0]?.nearbyAddresses[0]?.postalCode || country.states[0]?.cities[0]?.defaultPostalCode || '';

      setFormData({
        ...formData,
        addressCountry: country.name,
        phoneCountryCode: country.dialCode,
        addressState: firstState,
        addressCity: firstCity,
        addressLine: firstAddr,
        postalCode: firstPostal,
      });
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Profile, Demographic & Medical Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal credentials, address cascade, doctor appointment alerts, and SQLite sync.
          </p>
        </div>

        <a
          href="/database-manager.html"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Launch SQLite DB Manager</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>

      {/* Obsidian Cyber Dark Theme Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 ring-2 ring-emerald-500/20" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              System Theme: Obsidian Cyber Dark
            </h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            Active Design System
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          FitPath is configured exclusively with the <strong>Obsidian Cyber Dark</strong> theme—engineered with deep slate obsidian backgrounds, high-contrast typography, and neon emerald health indicators.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-8">
        {/* 1. Personal & Contact Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-emerald-600 dark:text-emerald-400">
            <User className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              1. Personal & Contact Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                1. Full Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                2. Father's Name
              </label>
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                placeholder="Father's Name"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Age + DOB + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                3. Date of Birth (Calendar)
              </label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={handleDobChange}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age || 20}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                6. Gender
              </label>
              <select
                value={formData.gender || 'Male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Phone with Country Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              4. Mobile Phone (All Country Codes)
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCountry.code}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-44 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dialCode} ({c.name})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Phone number"
                className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                5. Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                5. Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Geographic Address Cascade */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-emerald-600 dark:text-emerald-400">
            <MapPin className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              7. Geographic Address & Nearby Location
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Country</label>
              <select
                value={selectedCountry.code}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {COUNTRIES_DATA.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State</label>
              <select
                value={formData.addressState || selectedState?.name}
                onChange={(e) => {
                  const sName = e.target.value;
                  const stateObj = statesForCountry.find((s) => s.name === sName);
                  const firstCity = stateObj?.cities[0]?.name || '';
                  setFormData({
                    ...formData,
                    addressState: sName,
                    addressCity: firstCity,
                  });
                }}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {statesForCountry.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
              <select
                value={formData.addressCity || selectedCity?.name}
                onChange={(e) => {
                  const cName = e.target.value;
                  const cObj = citiesForState.find((c) => c.name === cName);
                  setFormData({
                    ...formData,
                    addressCity: cName,
                    addressLine: cObj?.nearbyAddresses[0]?.address || cName,
                    postalCode: cObj?.nearbyAddresses[0]?.postalCode || cObj?.defaultPostalCode || formData.postalCode,
                  });
                }}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {citiesForState.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Street Address Line
              </label>
              <input
                type="text"
                value={formData.addressLine || ''}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Postal Code (Auto-Filled)
              </label>
              <input
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-600 font-bold"
              />
            </div>
          </div>
        </div>

        {/* 3. Medical Details (Height cm/m, Weight kg, Blood Group) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-emerald-600 dark:text-emerald-400">
            <HeartPulse className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              8. Medical & Physical Metrics (Height, Weight, Blood Group)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                8. Height ({formData.heightUnit || 'cm'})
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step={formData.heightUnit === 'm' ? '0.01' : '1'}
                  value={formData.heightUnit === 'm' ? ((formData.heightCm || 172) / 100).toFixed(2) : (formData.heightCm || 172)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setFormData({
                      ...formData,
                      heightCm: formData.heightUnit === 'm' ? Math.round(v * 100) : Math.round(v) || 172,
                    });
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextUnit = formData.heightUnit === 'm' ? 'cm' : 'm';
                    setFormData({ ...formData, heightUnit: nextUnit });
                  }}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                >
                  {formData.heightUnit === 'm' ? 'm' : 'cm'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                8. Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.weightKg || 68}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 68 })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                9. Blood Group
              </label>
              <select
                value={formData.bloodGroup || 'O+'}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-600 font-bold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Doctor Visit Alert (Background Process) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Stethoscope className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                10. Doctor Visit Alert (Background Process)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => playDoctorAlertBuzzer()}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Doctor Buzzer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Doctor Name
              </label>
              <input
                type="text"
                value={formData.doctorAlert?.doctorName || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  doctorAlert: {
                    ...(formData.doctorAlert || { appointmentDate: '', appointmentTime: '', enabled: true, soundEnabled: true }),
                    doctorName: e.target.value,
                  },
                })}
                placeholder="Dr. Sharma"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinic / Hospital Name
              </label>
              <input
                type="text"
                value={formData.doctorAlert?.clinicName || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  doctorAlert: {
                    ...(formData.doctorAlert || { appointmentDate: '', appointmentTime: '', enabled: true, soundEnabled: true, doctorName: '' }),
                    clinicName: e.target.value,
                  },
                })}
                placeholder="Apollo Family Health"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                value={formData.doctorAlert?.appointmentDate || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  doctorAlert: {
                    ...(formData.doctorAlert || { appointmentTime: '', enabled: true, soundEnabled: true, doctorName: '' }),
                    appointmentDate: e.target.value,
                  },
                })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Appointment Time
              </label>
              <input
                type="time"
                value={formData.doctorAlert?.appointmentTime || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  doctorAlert: {
                    ...(formData.doctorAlert || { appointmentDate: '', enabled: true, soundEnabled: true, doctorName: '' }),
                    appointmentTime: e.target.value,
                  },
                })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="docAlertEnabled"
                checked={formData.doctorAlert?.enabled !== false}
                onChange={(e) => setFormData({
                  ...formData,
                  doctorAlert: {
                    ...(formData.doctorAlert || { appointmentDate: '', appointmentTime: '', doctorName: '', soundEnabled: true }),
                    enabled: e.target.checked,
                  },
                })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="docAlertEnabled" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Background Alert Active
              </label>
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
                className="text-xs text-rose-500 hover:text-rose-600 font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Database for New Individual</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 font-bold">Wipe all data?</span>
                <button
                  type="button"
                  onClick={onResetToNewIndividual}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
                >
                  Yes, Wipe
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Saved & Synced!</span>
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Updating SQLite...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
