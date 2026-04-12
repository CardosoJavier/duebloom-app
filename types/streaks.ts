/** One row per user per day they logged at least one meal (nutrition_logs table). */
export interface NutritionLog {
  id: string;
  user_id: string;
  log_date: string;
  created_at: string;
}

/** Streak state row — one row per user (nutrition_streaks table). */
export interface NutritionStreakState {
  id: string;
  user_id: string;
  current_streak_count: number;
  all_time_streak_count: number;
  last_streak_day: string | null;
  last_updated_date: string;
  /** Last date the user answered the daily check-in modal (Yes or No). Null for new users. */
  last_check_in_date: string | null;
}

export type StreakSubject = "self" | "partner";

export interface MonthlyStreakData {
  completedDates: string[];
  completedDays: number;
  elapsedDays: number;
  completionPercent: number;
}

export interface CurrentStreakData {
  days: number;
  allTimeDays: number;
}

// ── Calendar grid types ────────────────────────────────────────────────────────

export type CalendarCellStatus = "completed" | "missed" | "future" | "today";

export interface CalendarCell {
  dateKey: string;
  status: CalendarCellStatus;
  dayNumber: number;
}

/** Internal grid layout cell used by CalendarGrid component. */
export interface CalendarGridCell {
  /** Unique react key for this cell. */
  key: string;
  /** Day-of-month number, or null for padding cells. */
  day: number | null;
}

export interface CalendarGridProps {
  readonly selectedDate: Date;
  readonly completedSet: Set<string>;
}
