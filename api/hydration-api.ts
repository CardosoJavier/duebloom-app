import { supabase } from "@/services/supabase";
import { ApiResult } from "@/types/api";
import { ErrorCode } from "@/types/error";
import { HydrationLog } from "@/types/hydration";

const GLASS_ML = 250;

export const hydrationApi = {
  /**
   * Fetches all hydration log entries for a user on a given date.
   */
  getLogsForDate: async (
    userId: string,
    dateKey: string,
  ): Promise<ApiResult<HydrationLog[]>> => {
    const { data, error } = await supabase
      .from("hydration_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", dateKey)
      .order("logged_at", { ascending: true });

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

    return { success: true, data: data ?? [] };
  },

  /**
   * Logs one glass (250ml) of water for the user on the given date.
   */
  logGlass: async (
    userId: string,
    dateKey: string,
  ): Promise<ApiResult<HydrationLog>> => {
    const { data, error } = await supabase
      .from("hydration_logs")
      .insert({ user_id: userId, date: dateKey, amount_ml: GLASS_ML })
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

    return { success: true, data };
  },

  /**
   * Removes the most recently logged glass for a user on the given date.
   */
  removeLastGlass: async (
    userId: string,
    dateKey: string,
  ): Promise<ApiResult<null>> => {
    // Find the most recent entry first
    const { data: latest, error: fetchError } = await supabase
      .from("hydration_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("date", dateKey)
      .eq("amount_ml", GLASS_ML)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNKNOWN_ERROR,
          message: fetchError.message,
          originalError: fetchError,
        },
      };
    }

    if (!latest) return { success: true, data: null };

    const { error: deleteError } = await supabase
      .from("hydration_logs")
      .delete()
      .eq("id", latest.id);

    if (deleteError) {
      return {
        success: false,
        error: {
          code: ErrorCode.UNKNOWN_ERROR,
          message: deleteError.message,
          originalError: deleteError,
        },
      };
    }

    return { success: true, data: null };
  },
};
