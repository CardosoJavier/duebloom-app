import { useAppStore } from "@/store/appStore";

/**
 * Returns the resolved color scheme ("light" | "dark") from appStore.
 * Use this in UI components instead of importing useAppStore directly.
 */
export function useAppColorScheme(): "light" | "dark" {
  return useAppStore((s) => s.colorScheme);
}
