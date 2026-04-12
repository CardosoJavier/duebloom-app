/**
 * Workouts domain types.
 * Stub — expand as the workouts tab is built out.
 */

// ── WorkoutEntry ───────────────────────────────────────────────────────────────

export interface WorkoutEntry {
  readonly id: string;
  readonly user_id: string;
  readonly date: string; // YYYY-MM-DD
  readonly name: string;
  readonly duration_minutes?: number;
  readonly notes?: string;
  readonly created_at: string;
}

// ── WorkoutsTabProps ───────────────────────────────────────────────────────────

export interface WorkoutsTabProps {
  readonly userId: string;
}
