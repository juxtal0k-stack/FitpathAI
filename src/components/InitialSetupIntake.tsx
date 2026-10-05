import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Stethoscope,
  Volume2,
  Droplets,
  Scale
} from 'lucide-react';
import { IndividualProfile, DormFacilities } from '../types';
import { COUNTRIES_DATA, BLOOD_GROUPS, CountryInfo, StateInfo, CityInfo } from '../data/locationData';
import { playDoctorAlertBuzzer } from '../utils/soundEffects';

interface InitialSetupIntakeProps {
  onComplete: (profileData: any) => Promise<void>;
}

export const InitialSetupIntake: React.FC<InitialSetupIntakeProps> = ({ onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Name & Father's Name
  const [name, setName] = useState('Aarav Sharma');
  const [fatherName, setFatherName] = useState('Rajesh Sharma');

  // 2. Age & DOB Calendar
  const [dob, setDob] = useState('2003-05-14');
  const [age, setAge] = useState<number>(() => {
    const birthYear = new Date('2003-05-14').getFullYear();
    return new Date().getFullYear() - birthYear;
  });

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (!isNaN(calculatedAge) && calculatedAge > 0 && calculatedAge < 120) {
        setAge(calculatedAge);
      }
    }
  };

  // 3. Phone & Country Code
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const selectedCountry = useMemo(() => {
    return COUNTRIES_DATA.find((c) => c.code === selectedCountryCode) || COUNTRIES_DATA[0];
  }, [selectedCountryCode]);

  const [phoneNumber, setPhoneNumber] = useState('9876543210');

  // 4. Email & Password
  const [email, setEmail] = useState('aarav.sharma@university.edu');
  const [password, setPassword] = useState('FitPathSecure#2026');
  const [showPassword, setShowPassword] = useState(false);

  // 5. Gender
  const [gender, setGender] = useState('Male');

  // 6. Address Cascade (Country -> State -> City -> Nearby Address -> Postal Code)
  const [selectedStateName, setSelectedStateName] = useState<string>(() => selectedCountry.states[0]?.name || '');
  const statesForCountry = selectedCountry.states;

  const selectedState = useMemo(() => {
    return statesForCountry.find((s) => s.name === selectedStateName) || statesForCountry[0];
  }, [statesForCountry, selectedStateName]);

  const citiesForState = selectedState?.cities || [];
  const [selectedCityName, setSelectedCityName] = useState<string>(() => citiesForState[0]?.name || '');

  const selectedCity = useMemo(() => {
    return citiesForState.find((c) => c.name === selectedCityName) || citiesForState[0];
  }, [citiesForState, selectedCityName]);

  const nearbyAddresses = selectedCity?.nearbyAddresses || [];
  const [selectedAddressLine, setSelectedAddressLine] = useState<string>(() => nearbyAddresses[0]?.address || '12 Marine Drive, Nariman Point');
  const [postalCode, setPostalCode] = useState<string>(() => nearbyAddresses[0]?.postalCode || selectedCity?.defaultPostalCode || '400021');

  // When country changes, reset state, city, address
  const handleCountryChange = (newCode: string) => {
    setSelectedCountryCode(newCode);
    const country = COUNTRIES_DATA.find((c) => c.code === newCode);
    if (country && country.states.length > 0) {
      const firstState = country.states[0];
      setSelectedStateName(firstState.name);
      if (firstState.cities.length > 0) {
        const firstCity = firstState.cities[0];
        setSelectedCityName(firstCity.name);
        if (firstCity.nearbyAddresses.length > 0) {
          setSelectedAddressLine(firstCity.nearbyAddresses[0].address);
          setPostalCode(firstCity.nearbyAddresses[0].postalCode);
        } else {
          setSelectedAddressLine(firstCity.name);
          setPostalCode(firstCity.defaultPostalCode);
        }
      }
    }
  };

  const handleStateChange = (newStateName: string) => {
    setSelectedStateName(newStateName);
    const stateObj = statesForCountry.find((s) => s.name === newStateName);
    if (stateObj && stateObj.cities.length > 0) {
      const firstCity = stateObj.cities[0];
      setSelectedCityName(firstCity.name);
      if (firstCity.nearbyAddresses.length > 0) {
        setSelectedAddressLine(firstCity.nearbyAddresses[0].address);
        setPostalCode(firstCity.nearbyAddresses[0].postalCode);
      } else {
        setSelectedAddressLine(firstCity.name);
        setPostalCode(firstCity.defaultPostalCode);
      }
    }
  };

  const handleCityChange = (newCityName: string) => {
    setSelectedCityName(newCityName);
    const cityObj = citiesForState.find((c) => c.name === newCityName);
    if (cityObj) {
      if (cityObj.nearbyAddresses.length > 0) {
        setSelectedAddressLine(cityObj.nearbyAddresses[0].address);
        setPostalCode(cityObj.nearbyAddresses[0].postalCode);
      } else {
        setSelectedAddressLine(cityObj.name);
        setPostalCode(cityObj.defaultPostalCode);
      }
    }
  };

  const handleAddressSelect = (addrStr: string) => {
    setSelectedAddressLine(addrStr);
    const match = nearbyAddresses.find((a) => a.address === addrStr);
    if (match) {
      setPostalCode(match.postalCode);
    }
  };

  // 7. Medical Details (Height cm/m, Weight kg)
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm'>('cm');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);

  // 8. Blood Group
  const [bloodGroup, setBloodGroup] = useState<string>('O+');

  // 9. Doctor Visit Alert
  const [doctorName, setDoctorName] = useState('Dr. Sharma');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Sports Medicine & General Physician');
  const [doctorClinic, setDoctorClinic] = useState('Apollo Family Health');
  const [doctorApptDate, setDoctorApptDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [doctorApptTime, setDoctorApptTime] = useState('10:30');
  const [doctorNotes, setDoctorNotes] = useState('Postural assessment & vitals clearance');
  const [doctorAlertEnabled, setDoctorAlertEnabled] = useState(true);

  // Other fitness details
  const [occupation, setOccupation] = useState('Student (Final Semester)');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [budgetPerDay, setBudgetPerDay] = useState<number>(4.5);
  const [fitnessGoal, setFitnessGoal] = useState<'stress-relief' | 'muscle-tone' | 'fat-loss' | 'endurance' | 'posture-rehab'>('stress-relief');
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'active'>('beginner');
  const [preferredLocation, setPreferredLocation] = useState<'home-bodyweight' | 'dorm-room' | 'campus-outdoors' | 'gym'>('home-bodyweight');

  // Medical conditions
  const [jointBackIssues, setJointBackIssues] = useState('none');
  const [chronicConditions, setChronicConditions] = useState('none');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('none');
  const [physicalLimitations, setPhysicalLimitations] = useState('');

  const testDoctorBuzzer = () => {
    playDoctorAlertBuzzer();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const diffDays = Math.max(
      1,
      Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    );

    const finalHeightCm = heightUnit === 'm' ? Math.round(heightCm * 100) : heightCm;

    const payload: Partial<IndividualProfile> = {
      name: name.trim(),
      fatherName: fatherName.trim(),
      dob,
      age,
      gender,
      phoneCountryCode: selectedCountry.dialCode,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      password,
      addressCountry: selectedCountry.name,
      addressState: selectedStateName,
      addressCity: selectedCityName,
      addressLine: selectedAddressLine,
      postalCode,
      heightCm: finalHeightCm,
      heightUnit,
      weightKg,
      bloodGroup,
      doctorAlert: {
        doctorName: doctorName.trim() || 'Dr. Sharma',
        clinicName: doctorClinic.trim() || 'Apollo Health',
        specialty: doctorSpecialty.trim(),
        appointmentDate: doctorApptDate,
        appointmentTime: doctorApptTime,
        notes: doctorNotes.trim(),
        enabled: doctorAlertEnabled,
        soundEnabled: true,
      },
      deviceLocation: {
        latitude: selectedCity?.lat || 18.9220,
        longitude: selectedCity?.lng || 72.8347,
        address: selectedAddressLine,
        city: selectedCityName,
        state: selectedStateName,
        country: selectedCountry.name,
        postalCode,
        totalDistanceKm: 0,
        lastUpdated: new Date().toISOString(),
      },
      occupationOrSchedule: occupation,
      examDate,
      daysUntilExam: isNaN(diffDays) ? 7 : diffDays,
      budgetPerDay,
      dormFacilities: 'microwave-kettle' as DormFacilities,
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

    try {
      await onComplete(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit profile. Please retry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FitPath AI • Comprehensive Health & Location Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Create Your Health & Fitness Profile
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Provide your personal, geographic, medical, and alert details. All data synchronizes with your SQLite database every second.
          </p>
        </div>

        {/* Main Intake Form */}
        <form onSubmit={handleSubmit} className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-8">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Personal & Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400">
              <User className="w-4 h-4" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider">
                1. Personal & Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  1. Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  2. Father's Name *
                </label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Age + Calendar DOB + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  3. Date of Birth (Calendar) *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={handleDobChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Age (Auto Calculated)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  6. Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                4. Mobile Phone (All Country Codes Supported) *
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-40 px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {COUNTRIES_DATA.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.dialCode} ({c.name})
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Mobile number"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  5. Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  5. Account Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cascade Address & Google Maps Base Origin */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400">
              <MapPin className="w-4 h-4" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider">
                7. Geographic Address & Base Start Origin
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Cascades country ➔ states ➔ cities ➔ nearby addresses with automatic postal code and GPS coordinate lock.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Country</label>
                <select
                  value={selectedCountryCode}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  {COUNTRIES_DATA.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">State / Province</label>
                <select
                  value={selectedStateName}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  {statesForCountry.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                <select
                  value={selectedCityName}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  {citiesForState.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nearby Addresses Selection */}
            {nearbyAddresses.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nearby Landmark / Address Suggestions (Click to auto-enter postal code)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nearbyAddresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddressSelect(addr.address)}
                      className={`p-2.5 text-left rounded-xl border text-xs transition cursor-pointer flex flex-col justify-between ${
                        selectedAddressLine === addr.address
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold">{addr.address}</span>
                      <span className="text-[10px] text-slate-400 mt-1">
                        PIN: {addr.postalCode} • {addr.landmark}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Address Line & Postal Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Street / Detailed Address Line *
                </label>
                <input
                  type="text"
                  required
                  value={selectedAddressLine}
                  onChange={(e) => setSelectedAddressLine(e.target.value)}
                  placeholder="Street address or campus hall"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Postal / ZIP Code (Auto-Filled) *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Medical & Physiological Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400">
              <HeartPulse className="w-4 h-4" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider">
                8. Medical & Physical Metrics (Height, Weight, Blood Group)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Height with unit toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">
                    8. Height ({heightUnit}) *
                  </label>
                  <div className="inline-flex rounded-lg bg-slate-800 p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setHeightUnit('cm')}
                      className={`px-2 py-0.5 rounded-md ${heightUnit === 'cm' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightUnit('m')}
                      className={`px-2 py-0.5 rounded-md ${heightUnit === 'm' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                    >
                      m
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step={heightUnit === 'm' ? '0.01' : '1'}
                  required
                  value={heightUnit === 'm' ? (heightCm / 100).toFixed(2) : heightCm}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (heightUnit === 'm') {
                      setHeightCm(Math.round(v * 100) || 175);
                    } else {
                      setHeightCm(Math.round(v) || 175);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  8. Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              {/* 9. Blood Group */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  9. Blood Group (All Listed) *
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-emerald-400"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Doctor Visit Alert (Background Process) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Stethoscope className="w-4 h-4" />
                <h3 className="text-xs uppercase font-extrabold tracking-wider">
                  10. Doctor Visit Alert (Runs as Background Process)
                </h3>
              </div>
              <button
                type="button"
                onClick={testDoctorBuzzer}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-800/60"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Alert Buzzer</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Alerts run in the background without cluttering the screen. When the scheduled time arrives, the buzzer sounds and the pop-up modal appears.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Doctor / Physician Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sharma"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Clinic / Hospital Name
                </label>
                <input
                  type="text"
                  value={doctorClinic}
                  onChange={(e) => setDoctorClinic(e.target.value)}
                  placeholder="e.g. Apollo Family Health"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={doctorApptDate}
                  onChange={(e) => setDoctorApptDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Appointment Time
                </label>
                <input
                  type="time"
                  value={doctorApptTime}
                  onChange={(e) => setDoctorApptTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="docAlertEn"
                  checked={doctorAlertEnabled}
                  onChange={(e) => setDoctorAlertEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="docAlertEn" className="text-xs font-bold text-slate-300 cursor-pointer">
                  Background Alert Active
                </label>
              </div>
            </div>
          </div>

          {/* Section 5: Fitness & Academic Schedule */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-emerald-400">
              <Dumbbell className="w-4 h-4" />
              <h3 className="text-xs uppercase font-extrabold tracking-wider">
                Fitness Goal & Target Exam
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Primary Fitness Goal
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                >
                  <option value="stress-relief">Stress Relief & Energy (Exam Friendly)</option>
                  <option value="muscle-tone">Muscle Tone & Lean Strength</option>
                  <option value="fat-loss">Fat Loss & Calorie Burn</option>
                  <option value="endurance">Endurance & Cardio Stamina</option>
                  <option value="posture-rehab">Posture Decompression & Back Rehab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Upcoming Exam / Target Deadline Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving to SQLite Database...</span>
              ) : (
                <>
                  <span>Create FitPath Profile & Launch Live Engine</span>
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
