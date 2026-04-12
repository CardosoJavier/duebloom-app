import { syncApi } from "@/api/sync-api";
import { QueryKeys } from "@/constants/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Mutation hook for unlinking the current user from their partner.
 * Invalidates the partner query on success so the UI updates immediately.
 */
export function useUnlinkPartner(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation<null, Error, void>({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      const result = await syncApi.unlinkPartner(userId);
      if (!result.success) {
        throw new Error(result.error?.message ?? "Failed to unlink partner");
      }
      return null;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: QueryKeys.partner(userId) });
      }
    },
  });
}
