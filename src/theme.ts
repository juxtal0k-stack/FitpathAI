export type FitnessTheme = 'emerald' | 'nordic' | 'athletic' | 'amber';

export interface ThemeConfig {
  id: FitnessTheme;
  name: string;
  brandInspiration: string;
  tagline: string;
  bgClass: string;
  surfaceClass: string;
  surfaceHoverClass: string;
  borderClass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentClass: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  isDark: boolean;
}

export const FITNESS_THEMES: Record<FitnessTheme, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Performance Sage',
    brandInspiration: 'Apple Fitness+ / Clinical Daylight',
    tagline: 'Clean studio white with botanical sage and deep athletic emerald',
    bgClass: 'bg-[#f8fafc]',
    surfaceClass: 'bg-white shadow-xs',
    surfaceHoverClass: 'hover:bg-slate-50',
    borderClass: 'border-slate-300',
    textPrimary: 'text-slate-950 font-bold',
    textSecondary: 'text-slate-800 font-medium',
    textMuted: 'text-slate-700',
    accentClass: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-300',
    accentText: 'text-emerald-900 font-semibold',
    badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    badgeText: 'text-emerald-950 font-bold',
    glowColor: 'rgba(5, 150, 105, 0.12)',
    isDark: false,
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Stone',
    brandInspiration: 'Oura Pure / Studio Minimalist',
    tagline: 'Warm organic stone canvas with deep espresso charcoal typography',
    bgClass: 'bg-[#faf9f5]',
    surfaceClass: 'bg-white shadow-xs',
    surfaceHoverClass: 'hover:bg-[#f5f4ef]',
    borderClass: 'border-[#d6d3d1]',
    textPrimary: 'text-[#0c0a09] font-bold',
    textSecondary: 'text-[#292524] font-medium',
    textMuted: 'text-[#44403c]',
    accentClass: 'bg-[#1c1917] hover:bg-[#0c0a09] text-white shadow-xs',
    accentBg: 'bg-[#f5f3ee]',
    accentBorder: 'border-[#a8a29e]',
    accentText: 'text-[#1c1917] font-semibold',
    badgeBg: 'bg-[#e7e5e4] text-[#1c1917] border border-[#a8a29e]',
    badgeText: 'text-[#1c1917] font-bold',
    glowColor: 'rgba(41, 37, 36, 0.10)',
    isDark: false,
  },
  athletic: {
    id: 'athletic',
    name: 'Athletic Club',
    brandInspiration: 'Nike Training / Collegiate Track',
    tagline: 'High-contrast studio daylight with deep varsity cobalt and navy',
    bgClass: 'bg-[#f8fafc]',
    surfaceClass: 'bg-white shadow-xs',
    surfaceHoverClass: 'hover:bg-blue-50/40',
    borderClass: 'border-slate-300',
    textPrimary: 'text-slate-950 font-bold',
    textSecondary: 'text-slate-800 font-medium',
    textMuted: 'text-slate-700',
    accentClass: 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-300',
    accentText: 'text-blue-950 font-semibold',
    badgeBg: 'bg-blue-100 text-blue-950 border border-blue-300',
    badgeText: 'text-blue-950 font-bold',
    glowColor: 'rgba(37, 99, 235, 0.12)',
    isDark: false,
  },
  amber: {
    id: 'amber',
    name: 'Solar Terracotta',
    brandInspiration: 'Strava Daylight / Track Endurance',
    tagline: 'Clean warm ivory canvas with energized burnt terracotta accents',
    bgClass: 'bg-[#fafaf9]',
    surfaceClass: 'bg-white shadow-xs',
    surfaceHoverClass: 'hover:bg-amber-50/40',
    borderClass: 'border-stone-300',
    textPrimary: 'text-stone-950 font-bold',
    textSecondary: 'text-stone-800 font-medium',
    textMuted: 'text-stone-700',
    accentClass: 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-300',
    accentText: 'text-amber-950 font-semibold',
    badgeBg: 'bg-amber-100 text-amber-950 border border-amber-300',
    badgeText: 'text-amber-950 font-bold',
    glowColor: 'rgba(217, 119, 6, 0.12)',
    isDark: false,
  },
};
