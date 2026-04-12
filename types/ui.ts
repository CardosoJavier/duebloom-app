/**
 * Props interfaces for /components/ui primitives.
 * These are GlueStack-based design system components — no store imports.
 */
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

// ── WidgetCard ─────────────────────────────────────────────────────────────────

export interface WidgetCardProps {
  readonly title: string;
  readonly icon?: ReactNode;
  readonly headerRight?: ReactNode;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: StyleProp<ViewStyle>;
}

// ── GraphWidget ────────────────────────────────────────────────────────────────

export interface GraphWidgetStatPanel {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly deltaColor?: string;
}

export interface GraphWidgetProps {
  readonly title: string;
  readonly statPanels: GraphWidgetStatPanel[];
  readonly chartPoints: { value: number; label?: string }[];
  readonly isLoading?: boolean;
  readonly emptyMessage?: string;
  readonly colorScheme?: "light" | "dark";
}

// ── EmptyState ─────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  readonly icon?: ReactNode;
  readonly message: string;
  readonly subMessage?: string;
}

// ── DataTable ─────────────────────────────────────────────────────────────────

export interface DataTableRowProps {
  readonly label: string;
  readonly value: string;
  readonly delta?: string | null;
  readonly deltaColor?: string;
}

// ── SyncBanner ────────────────────────────────────────────────────────────────

export interface SyncBannerProps {
  readonly message: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
  readonly isLoading?: boolean;
}

// ── SelectionGroup ─────────────────────────────────────────────────────────────

export interface SelectionGroupOption {
  readonly label: string;
  readonly value: string;
  readonly icon?: ReactNode;
}

export interface SelectionGroupProps {
  readonly options: SelectionGroupOption[];
  readonly selectedValue: string | string[];
  readonly onSelect: (value: string) => void;
  readonly multiSelect?: boolean;
  readonly horizontal?: boolean;
}

// ── FabButton ─────────────────────────────────────────────────────────────────

export interface FabButtonProps {
  readonly onPress: () => void;
  readonly icon?: ReactNode;
}
