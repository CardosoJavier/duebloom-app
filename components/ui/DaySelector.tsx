import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { DayOfWeek } from "@/types/macros";
import React from "react";
import { useTranslation } from "react-i18next";

const DAYS: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

export function DaySelector({
  selectedDays,
  onChange,
}: Readonly<DaySelectorProps>) {
  const { t } = useTranslation();

  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <HStack space="xs" className="justify-between">
      {DAYS.map((day) => {
        const isActive = selectedDays.includes(day);
        return (
          <Pressable
            key={day}
            onPress={() => toggleDay(day)}
            className={`flex-1 h-10 rounded-xl items-center justify-center border ${
              isActive
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-slate-200 dark:border-slate-600 bg-background-100 dark:bg-background-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                isActive
                  ? "text-primary-500"
                  : "text-typography-500 dark:text-typography-400"
              }`}
            >
              {t(`macros.day_${day}`)}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
}
