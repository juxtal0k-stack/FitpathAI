export type FitnessTheme = 'midnight';

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
  midnight: {
    id: 'midnight',
    name: 'Obsidian Cyber Dark',
    brandInspiration: 'Oura Stealth / Titanium Night Mode',
    tagline: 'True dark mode with deep slate obsidian and neon emerald indicators',
    bgClass: 'bg-slate-950',
    surfaceClass: 'bg-slate-900 border-slate-800 shadow-md',
    surfaceHoverClass: 'hover:bg-slate-800/80',
    borderClass: 'border-slate-800',
    textPrimary: 'text-white font-extrabold',
    textSecondary: 'text-slate-300 font-medium',
    textMuted: 'text-slate-400',
    accentClass: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-sm',
    accentBg: 'bg-emerald-950/60',
    accentBorder: 'border-emerald-700/60',
    accentText: 'text-emerald-400 font-semibold',
    badgeBg: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    badgeText: 'text-emerald-300 font-bold',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    isDark: true,
  },
};
