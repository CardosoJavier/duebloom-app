export type MacroMode = "cut" | "bulk" | "recomp";

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export interface MacroCalculatorInput {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  mode: MacroMode;
  /** Cut only — calorie deficit percentage (0–50), default 20 */
  deficitPercent?: number;
  /** Bulk only — calorie surplus percentage (0–50), default 10 */
  surplusPercent?: number;
}

export interface MacroCalculatorResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
  /** Positive = surplus, negative = deficit, 0 for recomp */
  calorieDelta: number;
}

// ── Recomp-specific types ──────────────────────────────────────────────────────

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface RecompDayProfile {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export interface RecompInput {
  weightLbs: number;
  trainingCalories: number;
  restCalories: number;
}

export interface RecompCalculatorResult {
  training: RecompDayProfile;
  rest: RecompDayProfile;
}

// ── Body Recomp Plan (DB entity) ───────────────────────────────────────────────

export interface BodyRecompPlan {
  id: string;
  userId: string;
  trainingCalories: number;
  trainingProteinGrams: number;
  trainingCarbsGrams: number;
  trainingFatGrams: number;
  restCalories: number;
  restProteinGrams: number;
  restCarbsGrams: number;
  restFatGrams: number;
  trainingDays: DayOfWeek[];
  createdAt: string;
  updatedAt: string;
}

export interface BodyRecompPlanInput {
  userId: string;
  trainingCalories: number;
  trainingProteinGrams: number;
  trainingCarbsGrams: number;
  trainingFatGrams: number;
  restCalories: number;
  restProteinGrams: number;
  restCarbsGrams: number;
  restFatGrams: number;
  trainingDays: DayOfWeek[];
}

// ── UI-specific types for MacroCalculatorView ──────────────────────────────────

/**
 * Input unit system for the macro calculator form.
 * Distinct from UnitSystem in user.ts ("KG" | "LB") which is the
 * user's preferred display system stored in the DB.
 */
export type WeightInputUnit = "metric" | "imperial";

export type MacroKey = "protein" | "carbs" | "fat";
