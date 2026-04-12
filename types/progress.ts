// ── Stats types ───────────────────────────────────────────────────────────────

/** A progress_stats DB row as returned from the API. */
export interface ProgressStat {
  id: string;
  userId: string;
  weightKg: number | null;
  weightLb: number | null;
  bodyFat: number | null;
  recordedDate: string; // 'YYYY-MM-DD'
  createdAt: string;
  updatedAt: string;
}

/** Caller-provided input for a manual stat entry. */
export interface ProgressStatInput {
  weightKg?: number;
  weightLb?: number;
  bodyFat?: number;
  recordedDate: string; // 'YYYY-MM-DD'
}

/** A single point on the stats line chart. */
export interface StatChartPoint {
  date: string; // 'YYYY-MM-DD'
  value: number;
}

/** Pre-computed summary for the chart header (current value + trend). */
export interface StatsSummary {
  currentValue: number | null;
  trendPercent: number | null; // ((current - 30dAgo) / 30dAgo) * 100
  chartPoints: StatChartPoint[];
}

/** One page of the paginated history list. */
export interface StatsHistoryPage {
  items: Array<ProgressStat & { delta: number | null }>;
  hasMore: boolean;
}

// ── Photo types ───────────────────────────────────────────────────────────────

/** Caller-provided input for a single progress photo upload session. */
export interface ProgressPhotoInput {
  frontUri: string; // local file URI
  sideUri: string;
  backUri: string;
  capturedDate: string; // ISO date 'YYYY-MM-DD'
  weightKg?: number;
  weightLb?: number;
  bodyFat?: number;
}

/** A progress_photos DB row as returned from the API. */
export interface ProgressPhoto {
  id: string;
  userId: string;
  frontPhotoUrl: string;
  sidePhotoUrl: string;
  backPhotoUrl: string;
  capturedDate: string;
  weightKg: number | null;
  weightLb: number | null;
  bodyFat: number | null;
  createdAt: string;
  updatedAt: string;
}

// ── UI-specific progress types ─────────────────────────────────────────────────

export type ComparisonTarget = "mine" | "partner";

export type StatMetric = "weight" | "fat";

export type PhotoView = "front" | "side" | "back";

export type DatePickerSlot = "before" | "after";

// ── Component Props ────────────────────────────────────────────────────────────

export interface AddProgressModalProps {
  readonly isOpen: boolean;
  readonly capturedDate: string;
  readonly isSaving: boolean;
  readonly unitSystem: import("./user").UnitSystem;
  readonly onClose: () => void;
  readonly onSave: (input: ProgressPhotoInput) => Promise<void>;
}

export interface AddStatsModalProps {
  readonly isOpen: boolean;
  readonly isSaving: boolean;
  readonly defaultDate?: string;
  readonly unitSystem: import("./user").UnitSystem;
  readonly onClose: () => void;
  readonly onSave: (input: ProgressStatInput) => Promise<void>;
}

export interface ComparisonCardProps {
  readonly beforePhoto: ProgressPhoto | null;
  readonly afterPhoto: ProgressPhoto | null;
}

export interface ComparisonViewProps {
  readonly myId: string;
  readonly myFirstName: string;
  readonly partnerId?: string;
  readonly partnerFirstName?: string;
  readonly partnerPrivacyOn: boolean;
  readonly colorScheme: "light" | "dark";
}

export interface PhotoUpdateSectionProps {
  readonly photos: ProgressPhoto | null;
  readonly unitSystem: import("./user").UnitSystem;
  readonly isPrivate?: boolean;
}

export interface StatsTabViewProps {
  readonly myId: string;
  readonly myFirstName: string;
  readonly partnerId?: string;
  readonly partnerFirstName?: string;
  readonly partnerPrivacyOn: boolean;
  readonly unitSystem: import("./user").UnitSystem;
}

export interface TargetSelectorProps {
  readonly target: ComparisonTarget;
  readonly partnerFirstName?: string;
  readonly onToggle: () => void;
  readonly t: (key: string, opts?: Record<string, string>) => string;
}
