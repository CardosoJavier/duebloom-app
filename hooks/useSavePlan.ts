import { recompApi } from "@/api/recomp-api";
import { QueryKeys } from "@/constants/query-keys";
import { BodyRecompPlan, BodyRecompPlanInput } from "@/types/macros";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Mutation hook for saving a body recomp plan.
 * Invalidates the userSettings query on success so plan data stays fresh.
 */
export function useSavePlan(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<BodyRecompPlan, Error, BodyRecompPlanInput>({
    mutationFn: async (input: BodyRecompPlanInput) => {
      const result = await recompApi.saveBodyRecompPlan(input);
      if (!result.success) {
        throw new Error(result.error?.message ?? "Failed to save plan");
      }
      return result.data;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.userSettings(userId),
        });
      }
    },
  });
}
