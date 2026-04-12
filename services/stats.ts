/**
 * Formatting utilities for stat display values (weight, body fat, trends).
 * All functions are pure with no side effects.
 */

import { ProgressStat, StatMetric } from "@/types/progress";
import { UnitSystem } from "@/types/user";

export function formatStatValue(
  stat: ProgressStat,
  metric: StatMetric,
  unitSystem: UnitSystem,
): string {
  if (metric === "fat") {
    return stat.bodyFat === null ? "—" : `${stat.bodyFat.toFixed(1)}%`;
  }
  if (unitSystem === "LB") {
    return stat.weightLb === null ? "—" : `${stat.weightLb.toFixed(1)} lb`;
  }
  return stat.weightKg === null ? "—" : `${stat.weightKg.toFixed(1)} kg`;
}

export function formatDelta(
  delta: number | null,
  metric: StatMetric,
  unitSystem: UnitSystem,
): string {
  if (delta === null) return "";
  const sign = delta >= 0 ? "+" : "";
  if (metric === "fat") return `${sign}${delta.toFixed(1)}%`;
  const unit = unitSystem === "LB" ? "lb" : "kg";
  return `${sign}${delta.toFixed(1)} ${unit}`;
}

export function formatCurrentValue(
  value: number | null,
  metric: StatMetric,
  unitSystem: UnitSystem,
): string {
  if (value === null) return "—";
  if (metric === "fat") return `${value.toFixed(1)}%`;
  return `${value.toFixed(1)} ${unitSystem === "LB" ? "lb" : "kg"}`;
}

export function formatTrend(trendPercent: number | null): string {
  if (trendPercent === null) return "—";
  const sign = trendPercent >= 0 ? "+" : "";
  return `${sign}${trendPercent.toFixed(1)}%`;
}

export function trendColorClass(trendPercent: number | null): string {
  if (trendPercent === null) return "text-typography-900 dark:text-white";
  return trendPercent <= 0 ? "text-success-400" : "text-error-500";
}
