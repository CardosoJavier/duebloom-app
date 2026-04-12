export interface ConsumedMeal {
  id: string;
  user_id: string;
  name: string;
  kcal: number | null;
  consumption_date: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

// ── Meal tab navigation ────────────────────────────────────────────────────────

export type MealsTab = "meals" | "streak" | "macros";

// ── Daily check-in modal ───────────────────────────────────────────────────────

export interface DailyCheckInModalProps {
  readonly isOpen: boolean;
  readonly userId: string;
  readonly onClose: () => void;
  /** Called when the user makes an explicit choice (Yes or No). NOT called on X-close. */
  readonly onAnswered: () => void;
}

// ── Meal summary widget ────────────────────────────────────────────────────────

export interface MealBarsProps {
  readonly count: number;
  readonly color: string;
}

export interface PersonRowProps {
  readonly name: string;
  readonly initial: string;
  readonly mealCount: number;
  readonly avatarColor: string;
  readonly barColor: string;
}

// ── Add/Edit meal modals ───────────────────────────────────────────────────────

export interface AddMealEntry {
  readonly name: string;
  readonly calories: number;
  readonly uri: string;
}

export interface AddMealModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (entry: AddMealEntry) => void;
}

export interface EditMealModalProps {
  readonly meal: ConsumedMeal;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

// ── Food search ────────────────────────────────────────────────────────────────

export interface AddFoodModalProps {
  readonly isOpen: boolean;
  readonly mealType: import("./food-log").MealType | null;
  readonly onClose: () => void;
  readonly onSelectFood: (
    item: import("./food-log").FoodSearchResult,
    mealType: import("./food-log").MealType,
  ) => void;
}

export interface FoodSearchBarProps {
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly results: import("./food-log").FoodSearchResult[];
  readonly isLoading: boolean;
  readonly onSelectResult: (
    item: import("./food-log").FoodSearchResult,
  ) => void;
}

// ── Streak widget ──────────────────────────────────────────────────────────────

export interface NutritionStreakWidgetProps {
  readonly completedDays: number;
  readonly completedSet: Set<string>;
  readonly selectedDate: Date;
  readonly showEmptyMessage?: boolean;
  readonly style?: import("react-native").ViewStyle;
}

export interface StreakWidgetsProps {
  readonly currentStreakDays: number;
  readonly completionPercent: number;
}
