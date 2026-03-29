import { ApiResult } from "@/types/api";
import { ErrorCode } from "@/types/error";
import {
  BodyRecompPlan,
  BodyRecompPlanInput,
  DayOfWeek,
} from "@/types/macros";
import { supabase } from "@/util/supabase";

function mapRow(row: Record<string, unknown>): BodyRecompPlan {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    trainingCalories: row.training_calories as number,
    trainingProteinGrams: row.training_protein_grams as number,
    trainingCarbsGrams: row.training_carbs_grams as number,
    trainingFatGrams: row.training_fat_grams as number,
    restCalories: row.rest_calories as number,
    restProteinGrams: row.rest_protein_grams as number,
    restCarbsGrams: row.rest_carbs_grams as number,
    restFatGrams: row.rest_fat_grams as number,
    trainingDays: (row.training_days as DayOfWeek[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const recompApi = {
  async saveBodyRecompPlan(
    input: BodyRecompPlanInput,
  ): Promise<ApiResult<BodyRecompPlan>> {
    const { data, error } = await supabase
      .from("body_recomp_plans")
      .insert({
        user_id: input.userId,
        training_calories: input.trainingCalories,
        training_protein_grams: input.trainingProteinGrams,
        training_carbs_grams: input.trainingCarbsGrams,
        training_fat_grams: input.trainingFatGrams,
        rest_calories: input.restCalories,
        rest_protein_grams: input.restProteinGrams,
        rest_carbs_grams: input.restCarbsGrams,
        rest_fat_grams: input.restFatGrams,
        training_days: input.trainingDays,
      })
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNKNOWN_ERROR,
          message: error.message,
          originalError: error,
        },
      };
    }

    return { success: true, data: mapRow(data as Record<string, unknown>) };
  },

  async getLatestBodyRecompPlan(
    userId: string,
  ): Promise<ApiResult<BodyRecompPlan | null>> {
    const { data, error } = await supabase
      .from("body_recomp_plans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNKNOWN_ERROR,
          message: error.message,
          originalError: error,
        },
      };
    }

    return {
      success: true,
      data: data ? mapRow(data as Record<string, unknown>) : null,
    };
  },
};
