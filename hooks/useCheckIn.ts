import {
  logNutritionDay,
  updateLastCheckInDate,
  updateStreakState,
} from "@/api/streak-api";
import { QueryKeys } from "@/constants/query-keys";
import { getYesterdayKey } from "@/services/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CheckInVariables {
  userId: string;
  didLog: boolean;
}

/**
 * Mutation hook for the daily nutrition check-in.
 * - didLog=true  → logs yesterday + updates streak + records check-in date
 * - didLog=false → only records check-in date (user says they didn't log)
 *
 * Invalidates streakMonth and streakState queries on success.
 */
export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, didLog }: CheckInVariables) => {
      const yesterday = getYesterdayKey();

      if (didLog) {
        await logNutritionDay(userId, yesterday);
        await updateStreakState(userId, yesterday);
      }

      await updateLastCheckInDate(userId, yesterday);
    },
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.streakMonth(userId),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.streakState(userId),
      });
    },
  });
}
