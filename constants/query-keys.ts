/**
 * Centralized TanStack Query key factory.
 *
 * Rules:
 *  - NEVER use inline string arrays as queryKey elsewhere in the codebase.
 *  - All keys start with a stable noun that matches the Supabase table/entity.
 *  - Factory functions ensure type-safe, collision-free keys per entity + args.
 *  - Pass the full key array to invalidateQueries — not a prefix-only slice,
 *    unless you explicitly want to bust all sub-keys for a noun.
 */
export const QueryKeys = {
  // ── Meals ──────────────────────────────────────────────────────────────────
  mealsToday: (userId: string, dateStr: string) =>
    ["meals", "today", userId, dateStr] as const,

  // ── Streaks ────────────────────────────────────────────────────────────────
  streakMonth: (userId: string, fromDate?: string, toDate?: string) =>
    ["streak", "month", userId, fromDate, toDate] as const,

  streakState: (userId: string) => ["streak", "state", userId] as const,

  // ── Stats ──────────────────────────────────────────────────────────────────
  statsSummary: (userId: string, metric: string, unitSystem: string) =>
    ["stats", "summary", userId, metric, unitSystem] as const,

  statsHistory: (userId: string, metric: string, unitSystem: string) =>
    ["stats", "history", userId, metric, unitSystem] as const,

  // ── Progress Photos ────────────────────────────────────────────────────────
  progressPhotos: (userId: string, date?: string) =>
    ["progress", "photos", userId, date] as const,

  progressEarliestDate: (userId: string) =>
    ["progress", "earliest-date", userId] as const,

  // ── User & Partner ─────────────────────────────────────────────────────────
  partner: (userId: string) => ["partner", userId] as const,

  userSettings: (userId: string) => ["user", "settings", userId] as const,

  // ── Media ──────────────────────────────────────────────────────────────────
  signedUrl: (storagePath: string) =>
    ["media", "signed-url", storagePath] as const,

  // ── Hydration ──────────────────────────────────────────────────────────────
  hydrationToday: (userId: string, dateStr: string) =>
    ["hydration", "today", userId, dateStr] as const,
} as const;
