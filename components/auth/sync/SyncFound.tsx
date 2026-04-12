import { CheckCircle, Heart, User } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { SyncFoundProps } from "@/types/auth";

export const SyncFound = ({
  onConfirm,
  isLoading,
  isConfirmed,
  partnerName,
}: SyncFoundProps) => {
  const { t } = useTranslation();

  return (
    <VStack space="xl" className="items-center w-full py-4">
      <View className="flex-row items-center justify-center h-20 mb-4">
        {/* User Avatar */}
        <View className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 z-10 overflow-hidden items-center justify-center">
          <User size={32} className="text-slate-400 dark:text-slate-500" />
        </View>

        {/* Heart Connector */}
        <View className="w-12 h-12 rounded-full bg-lavender-100 dark:bg-slate-800 items-center justify-center -ml-4 z-20 border-4 border-white dark:border-slate-800 shadow-sm">
          <Heart size={20} color="#9FA0FF" fill="#9FA0FF" />
        </View>

        {/* Partner Avatar */}
        <View className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-800 -ml-4 z-10 overflow-hidden items-center justify-center">
          <User size={32} className="text-slate-400 dark:text-slate-500" />
        </View>
      </View>

      <VStack space="xs" className="items-center mb-4">
        <Heading
          size="xl"
          className="font-bold text-center text-slate-900 dark:text-typography-0"
        >
          {t("auth.partner_found")}
        </Heading>
        <Text className="text-center text-slate-500 dark:text-typography-400">
          {t("auth.you_are_linking_with", {
            name: partnerName || t("common.partner"),
          })}
        </Text>
      </VStack>

      {(() => {
        let buttonContent: React.ReactNode;
        if (isLoading) {
          buttonContent = <ButtonSpinner color="white" />;
        } else if (isConfirmed) {
          buttonContent = (
            <>
              <ButtonText className="font-bold text-white text-lg">
                {t("auth.waiting_for_partner")}
              </ButtonText>
              <ButtonIcon as={CheckCircle} className="ml-2 text-white" />
            </>
          );
        } else {
          buttonContent = (
            <>
              <ButtonText className="font-bold text-white text-lg">
                {t("auth.confirm_sync")}
              </ButtonText>
              <ButtonIcon as={User} className="ml-2 text-white" />
            </>
          );
        }
        return (
          <Button
            size="xl"
            className={`w-full rounded-xl ${
              isConfirmed ? "bg-emerald-500" : "bg-lavender-500"
            }`}
            onPress={onConfirm}
            isDisabled={isLoading || isConfirmed}
          >
            {buttonContent}
          </Button>
        );
      })()}
    </VStack>
  );
};
