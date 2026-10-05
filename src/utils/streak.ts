/**
 * Utility to calculate consecutive day fitness streak.
 */

export interface WorkoutRecord {
  date?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface StreakResult {
  streak: number;
  hasWorkoutToday: boolean;
  uniqueWorkoutDays: number;
  lastWorkoutDate: string | null;
}

/**
 * Calculates how many consecutive days the user has logged at least one workout.
 * 
 * Rules:
 * - If user logged at least one workout today, the streak counts today + all consecutive preceding days.
 * - If user has NOT logged a workout today yet, but DID log yesterday, the streak is maintained
 *   (counts yesterday + all consecutive preceding days) so the streak isn't lost during the current day.
 * - If neither today nor yesterday had a workout logged, the current streak is 0.
 */
export function calculateFitnessStreak(workouts: WorkoutRecord[]): StreakResult {
  if (!Array.isArray(workouts) || workouts.length === 0) {
    return {
      streak: 0,
      hasWorkoutToday: false,
      uniqueWorkoutDays: 0,
      lastWorkoutDate: null,
    };
  }

  const dateSet = new Set<string>();
  for (const w of workouts) {
    if (!w) continue;
    const rawDate = w.date || w.timestamp;
    if (typeof rawDate === 'string' && rawDate.trim()) {
      const cleaned = rawDate.split('T')[0].trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
        dateSet.add(cleaned);
      }
    }
  }

  if (dateSet.size === 0) {
    return {
      streak: 0,
      hasWorkoutToday: false,
      uniqueWorkoutDays: 0,
      lastWorkoutDate: null,
    };
  }

  const todayStr = formatLocalDate(new Date());
  const hasWorkoutToday = dateSet.has(todayStr);

  const sortedDates = Array.from(dateSet).sort().reverse();
  const lastWorkoutDate = sortedDates[0] || null;

  // Start checking from today if worked out today, or yesterday if not worked out yet today
  const cursor = new Date();
  if (!hasWorkoutToday) {
    cursor.setDate(cursor.getDate() - 1);
    const yesterdayStr = formatLocalDate(cursor);
    if (!dateSet.has(yesterdayStr)) {
      // Neither today nor yesterday had a workout -> streak broken
      return {
        streak: 0,
        hasWorkoutToday: false,
        uniqueWorkoutDays: dateSet.size,
        lastWorkoutDate,
      };
    }
  }

  let streak = 0;
  while (true) {
    const curStr = formatLocalDate(cursor);
    if (dateSet.has(curStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    streak,
    hasWorkoutToday,
    uniqueWorkoutDays: dateSet.size,
    lastWorkoutDate,
  };
}
