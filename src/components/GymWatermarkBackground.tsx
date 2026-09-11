import React, { useState } from 'react';
import { ThemeConfig } from '../theme';
import gymStrengthFloor from '../assets/images/gym_strength_floor_1789104538954.jpg';
import gymKettlebellTurf from '../assets/images/gym_kettlebell_turf_1789104560081.jpg';
import sihFitnessHero from '../assets/images/sih_fitness_home_hero_1789070116746.jpg';
import { Dumbbell } from 'lucide-react';

interface GymWatermarkBackgroundProps {
  theme: ThemeConfig;
  opacityLevel?: 'subtle' | 'balanced' | 'prominent' | 'off';
  onOpacityChange?: (level: 'subtle' | 'balanced' | 'prominent' | 'off') => void;
  selectedPhoto?: 'strength' | 'turf' | 'mobility';
  onPhotoChange?: (photo: 'strength' | 'turf' | 'mobility') => void;
}

export const GymWatermarkBackground: React.FC<GymWatermarkBackgroundProps> = ({
  theme,
  opacityLevel = 'balanced',
  selectedPhoto = 'strength',
}) => {
  if (opacityLevel === 'off') {
    return null;
  }

  // Opacity mapping tuned for clear visibility and clean text contrast
  const opacityStyles = {
    subtle: 'opacity-15',
    balanced: 'opacity-28',
    prominent: 'opacity-45',
    off: 'opacity-0',
  }[opacityLevel] || 'opacity-28';

  // Selected Gym Photo
  const photoMap = {
    strength: gymStrengthFloor,
    turf: gymKettlebellTurf,
    mobility: sihFitnessHero,
  };

  const activeImage = photoMap[selectedPhoto] || gymStrengthFloor;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Background Watermark Image Layer with smooth animation and gentle float */}
      <div 
        className={`absolute -inset-4 transition-all duration-700 ease-out transform-gpu ${opacityStyles} animate-smooth-float`}
        style={{
          backgroundImage: `url(${activeImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'contrast(102%) brightness(1.02) saturate(85%)',
        }}
      />

      {/* Atmospheric Soft Light-Wash Overlay for perfect readability */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.25) 15%, rgba(255, 255, 255, 0.55) 75%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 0%, rgba(248, 250, 252, 0.65) 100%)
          `,
        }}
      />
    </div>
  );
};

// Interactive Watermark Control Trigger
interface WatermarkControlPillProps {
  currentOpacity: 'subtle' | 'balanced' | 'prominent' | 'off';
  onChangeOpacity: (level: 'subtle' | 'balanced' | 'prominent' | 'off') => void;
  currentPhoto: 'strength' | 'turf' | 'mobility';
  onChangePhoto: (photo: 'strength' | 'turf' | 'mobility') => void;
  theme: ThemeConfig;
}

export const WatermarkControlPill: React.FC<WatermarkControlPillProps> = ({
  currentOpacity,
  onChangeOpacity,
  currentPhoto,
  onChangePhoto,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${theme.borderClass} ${theme.surfaceClass} text-slate-700 hover:text-slate-900 shadow-2xs transition-all cursor-pointer`}
        title="Adjust Gym Watermark"
      >
        <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
        <span>Watermark: {currentOpacity === 'off' ? 'Off' : currentOpacity}</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-1.5 w-60 p-3 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 text-slate-900 animate-fadeIn"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-slate-800">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
              Gym Watermark
            </span>
            <span className="text-[11px] text-slate-500 font-medium capitalize">
              {currentOpacity}
            </span>
          </div>

          {/* Opacity selector */}
          <div className="space-y-1 mb-2.5">
            <span className="text-[11px] font-medium text-slate-500 block">
              Visibility
            </span>
            <div className="grid grid-cols-4 gap-1 text-[11px]">
              {(['subtle', 'balanced', 'prominent', 'off'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onChangeOpacity(level)}
                  className={`py-1 rounded-lg text-center capitalize transition cursor-pointer ${
                    currentOpacity === level
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {level === 'prominent' ? 'High' : level}
                </button>
              ))}
            </div>
          </div>

          {/* Photo selector */}
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">
              Photo Scene
            </span>
            <div className="grid grid-cols-3 gap-1 text-[11px]">
              <button
                onClick={() => onChangePhoto('strength')}
                className={`p-1.5 rounded-lg text-center transition cursor-pointer ${
                  currentPhoto === 'strength'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Weights
              </button>
              <button
                onClick={() => onChangePhoto('turf')}
                className={`p-1.5 rounded-lg text-center transition cursor-pointer ${
                  currentPhoto === 'turf'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Turf
              </button>
              <button
                onClick={() => onChangePhoto('mobility')}
                className={`p-1.5 rounded-lg text-center transition cursor-pointer ${
                  currentPhoto === 'mobility'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
