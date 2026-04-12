import { getMonthlyMealCompletionDates } from "@/api/streak-api";
import { NutritionStreakWidget } from "@/components/meals/NutritionStreakWidget";
import { QueryKeys } from "@/constants/query-keys";
import { toDateKey } from "@/services/date";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

export function NutritionStreakCard() {
  const { user } = useAuthStore();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fromDate = toDateKey(monthStart);
  const toDate = toDateKey(monthEnd);
  const displayMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { data: completedDates = [] } = useQuery({
    queryKey: QueryKeys.streakMonth(user?.id ?? "", fromDate, toDate),
    queryFn: () =>
      getMonthlyMealCompletionDates(user!.id, fromDate, toDate).then(
        (r) => r.data ?? [],
      ),
    enabled: !!user?.id,
  });

  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);
  return (
    <NutritionStreakWidget
      completedDays={completedDates.length}
      completedSet={completedSet}
      selectedDate={displayMonth}
    />
  );
}
