import { hydrationApi } from "@/api/hydration-api";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { WidgetCard } from "@/components/ui/widget-card";
import { QueryKeys } from "@/constants/query-keys";
import { getTodayKey } from "@/services/date";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Droplets, Minus, Plus } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";

const GLASSES_GOAL = 8;

export function HydrationWidget() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const todayKey = getTodayKey();

  const queryKey = user
    ? QueryKeys.hydrationToday(user.id, todayKey)
    : (["hydration", "today", null, todayKey] as const);

  const { data: logs = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!user) return [];
      const result = await hydrationApi.getLogsForDate(user.id, todayKey);
      return result.success ? result.data : [];
    },
    enabled: !!user,
  });

  const glassesConsumed = logs.length;
  const progressPercent = Math.min((glassesConsumed / GLASSES_GOAL) * 100, 100);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addGlass = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await hydrationApi.logGlass(user.id, todayKey);
    },
    onSuccess: invalidate,
  });

  const removeGlass = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await hydrationApi.removeLastGlass(user.id, todayKey);
    },
    onSuccess: invalidate,
  });

  return (
    <WidgetCard
      icon={<Droplets size={14} color="#60a5fa" />}
      title={t("today.hydration")}
      className="flex-1"
      style={{ minHeight: 160 }}
      footer={
        <Box className="mx-6 mb-5 h-1.5 rounded-full bg-blue-100 dark:bg-blue-950">
          <Box
            className="h-1.5 rounded-full bg-blue-400"
            style={{ width: `${progressPercent}%` }}
          />
        </Box>
      }
    >
      <VStack className="gap-2">
        <HStack className="items-baseline gap-0.5">
          <Text className="text-typography-900 dark:text-white font-bold text-4xl leading-none">
            {glassesConsumed}
          </Text>
          <Text className="text-typography-400 font-semibold text-xl leading-none">
            /{GLASSES_GOAL}
          </Text>
        </HStack>
        <Text className="text-typography-600 text-xs dark:text-typography-300">
          {t("today.glasses_today")}
        </Text>
        <HStack className="gap-2 mt-1">
          <Pressable
            onPress={() => removeGlass.mutate()}
            disabled={glassesConsumed === 0 || removeGlass.isPending}
            className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 items-center justify-center"
          >
            <Minus size={14} color="#60a5fa" />
          </Pressable>
          <Pressable
            onPress={() => addGlass.mutate()}
            disabled={addGlass.isPending}
            className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 items-center justify-center"
          >
            <Plus size={14} color="#60a5fa" />
          </Pressable>
        </HStack>
      </VStack>
    </WidgetCard>
  );
}
