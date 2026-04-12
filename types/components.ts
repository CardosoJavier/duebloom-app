/**
 * Props interfaces for shared, reusable components that are not domain-specific.
 * Components in /components/*.tsx (root level, not in sub-directories).
 */
import { UnitSystem } from "@/types/user";

// ── DateNavigator ──────────────────────────────────────────────────────────────

export interface DateNavigatorProps {
  readonly date: Date;
  readonly onDateChange: (newDate: Date) => void;
  readonly className?: string;
  readonly mode?: "day" | "month";
  readonly disableNext?: boolean;
  readonly textSize?: "xs" | "sm" | "base" | "xl";
}

// ── SegmentedControl ───────────────────────────────────────────────────────────

export interface SegmentedControlProps {
  readonly options: string[];
  readonly selectedValue: string;
  readonly onValueChange: (value: string) => void;
  /** Accepts a className string or an object with a className key and optional style. */
  readonly containerStyle?:
    | string
    | {
        className?: string;
        style?: import("react-native").ViewStyle;
        [key: string]: unknown;
      };
}

// ── IdentifiedImage ────────────────────────────────────────────────────────────

export interface IdentifiedImageProps {
  /**
   * Storage path (e.g. "meals/userId/uuid.jpg") OR a full http(s) URL.
   * When a storage path is provided the component resolves and caches the
   * signed URL automatically; the path is also used as the expo-image
   * cacheKey so pixel data is reused across URL rotations.
   */
  readonly uri: string;
  readonly avatarUri?: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly isBlurred?: boolean;
}

// ── WeightTrendWidget ──────────────────────────────────────────────────────────
// Placed here because it is a reusable "today" primitive shared by multiple tabs.

export interface WeightTrendWidgetProps {
  readonly userId: string;
  readonly label: string;
  readonly unitSystem?: UnitSystem;
  readonly chartColor?: string;
}
