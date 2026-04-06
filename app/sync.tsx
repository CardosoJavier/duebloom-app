import { AuthContainer } from "@/components/auth/AuthContainer";
import { SyncFound } from "@/components/auth/sync/SyncFound";
import { SyncInput } from "@/components/auth/sync/SyncInput";
import { SyncWaiting } from "@/components/auth/sync/SyncWaiting";
import { VStack } from "@/components/ui/vstack";
import { usePartnerSync } from "@/hooks/usePartnerSync";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function SyncScreen() {
  const router = useRouter();
  const { partner } = useAuthStore();
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
