/**
 * StreakService — domain logic for nutrition streak calculation.
 * Stateless pure functions. No Supabase I/O — that stays in streak-api.ts.
 */

import { NutritionStreakState } from "@/types/streaks";
import { daysBetween, parseDateKey, toDateKey } from "./date";

/**
 * Given the persisted streak state, returns the effective current streak
 * accounting for whether the streak has been broken (last day is not today
 * or yesterday).
 *
 * Returns 0 if the streak is considered broken.
 */
export function resolveCurrentStreak(
  state: NutritionStreakState | null | undefined,
): number {
  if (!state?.last_streak_day) return 0;
  const today = toDateKey(new Date());
  const yesterday = toDateKey(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  );
  if (state.last_streak_day === today || state.last_streak_day === yesterday) {
    return state.current_streak_count;
  }
  return 0;
}

/**
 * Determines the new streak counts after logging a nutrition day.
 * Returns { newCurrent, newAllTime }.
 *
 * Rules:
 *  - No existing row → current = 1, allTime = 1
 *  - Same day as last_streak_day → no-op (returns existing values)
 *  - Retroactive log (newLogDate < last_streak_day) → caller must trigger DB recalculation
 *  - Consecutive day (diff === 1) → increment current
 *  - Gap (diff > 1) → reset current to 1
 *  - allTime is updated if current > allTime
 */
export function computeNewStreak(
  existing: NutritionStreakState | null,
  newLogDate: string,
): {
  isRetroactive: boolean;
  isSameDay: boolean;
  newCurrent: number;
  newAllTime: number;
} {
  if (!existing) {
    return {
      isRetroactive: false,
      isSameDay: false,
      newCurrent: 1,
      newAllTime: 1,
    };
  }

  if (existing.last_streak_day === newLogDate) {
    return {
      isRetroactive: false,
      isSameDay: true,
      newCurrent: existing.current_streak_count,
      newAllTime: existing.all_time_streak_count,
    };
  }

  if (existing.last_streak_day && newLogDate < existing.last_streak_day) {
    return {
      isRetroactive: true,
      isSameDay: false,
      newCurrent: existing.current_streak_count,
      newAllTime: existing.all_time_streak_count,
    };
  }

  const lastDate = existing.last_streak_day
    ? parseDateKey(existing.last_streak_day)
    : null;
  const newDate = parseDateKey(newLogDate);
  const diff = lastDate ? daysBetween(lastDate, newDate) : null;

  const newCurrent = diff === 1 ? existing.current_streak_count + 1 : 1;
  const newAllTime = Math.max(existing.all_time_streak_count, newCurrent);

  return { isRetroactive: false, isSameDay: false, newCurrent, newAllTime };
}
