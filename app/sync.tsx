import { userApi } from "@/api/user-api";
import { AuthContainer } from "@/components/auth/AuthContainer";
import { SyncFound } from "@/components/auth/sync/SyncFound";
import { SyncInput } from "@/components/auth/sync/SyncInput";
import { SyncWaiting } from "@/components/auth/sync/SyncWaiting";
import { VStack } from "@/components/ui/vstack";
import { QueryKeys } from "@/constants/query-keys";
import { usePartnerSync } from "@/hooks/usePartnerSync";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function SyncScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: partner } = useQuery({
    queryKey: QueryKeys.partner(user?.id ?? ""),
    queryFn: async () => {
      const result = await userApi.fetchPartner(user!.id);
      return result.success ? (result.data ?? null) : null;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60_000,
  });
  const {
    step,
    isLoading,
    isConfirmed,
    partnerName,
    myCode,
    connect,
    confirm,
  } = usePartnerSync();

  // Guard: already synced — nothing to do here
  useEffect(() => {
    if (partner) {
      router.replace("/(tabs)/profile");
    }
  }, [partner]);

  return (
    <AuthContainer>
      <VStack space="xl" className="items-center w-full">
        {step === "input" && (
          <SyncInput
            myCode={myCode}
            onConnect={connect}
            isLoading={isLoading}
          />
        )}

        {step === "waiting" && <SyncWaiting myCode={myCode} />}

        {step === "found" && (
          <SyncFound
            onConfirm={confirm}
            isLoading={isLoading}
            isConfirmed={isConfirmed}
            partnerName={partnerName}
          />
        )}
      </VStack>
    </AuthContainer>
  );
}
