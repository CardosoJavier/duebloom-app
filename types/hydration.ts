/**
 * Hydration domain types.
 * Future: HydrationLog, HydrationGoal, HydrationWidget props.
 */

// ── HydrationLog ───────────────────────────────────────────────────────────────

export interface HydrationLog {
  readonly id: string;
  readonly user_id: string;
  readonly date: string; // YYYY-MM-DD
  readonly amount_ml: number;
  readonly created_at: string;
}

// ── HydrationGoal ──────────────────────────────────────────────────────────────

export interface HydrationGoal {
  readonly user_id: string;
  readonly goal_ml: number;
}

// ── HydrationWidgetProps ───────────────────────────────────────────────────────

export interface HydrationWidgetProps {
  readonly userId: string;
  readonly dateKey: string; // YYYY-MM-DD
}
