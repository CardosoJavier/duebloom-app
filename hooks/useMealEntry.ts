import {
  addConsumedMeal,
  deleteConsumedMeal,
  updateConsumedMeal,
} from "@/api/meals-api";
import { QueryKeys } from "@/constants/query-keys";
import { ConsumedMeal } from "@/types/meals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddMealInput = Omit<
  ConsumedMeal,
  "id" | "created_at" | "updated_at" | "user_id"
> & { user_id: string };

type UpdateMealInput = {
  mealId: string;
  fields: Partial<
    Omit<ConsumedMeal, "id" | "created_at" | "updated_at" | "user_id">
  >;
};

/**
 * Mutation hooks for consumed meal CRUD.
 *
 * @param userId  - The current user's ID, used for cache key invalidation.
 * @param dateKey - The consumption_date key (YYYY-MM-DD) to invalidate after mutations.
 */
export function useMealEntry(userId: string, dateKey: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.mealsToday(userId, dateKey),
    });
  };

  const addMeal = useMutation<ConsumedMeal, Error, AddMealInput>({
    mutationFn: async (input) => {
      const result = await addConsumedMeal(input);
      if (!result.success) {
        throw new Error(result.error?.message ?? "Failed to add meal");
      }
      return result.data;
    },
    onSuccess: invalidate,
  });

  const updateMeal = useMutation<ConsumedMeal, Error, UpdateMealInput>({
    mutationFn: async ({ mealId, fields }) => {
      const result = await updateConsumedMeal(mealId, fields);
      if (!result.success) {
        throw new Error(result.error?.message ?? "Failed to update meal");
      }
      return result.data;
    },
    onSuccess: invalidate,
  });

  const deleteMeal = useMutation<null, Error, string>({
    mutationFn: async (mealId) => {
      const result = await deleteConsumedMeal(mealId);
      if (!result.success) {
        throw new Error(result.error?.message ?? "Failed to delete meal");
      }
      return null;
    },
    onSuccess: invalidate,
  });

  return { addMeal, updateMeal, deleteMeal };
}
