import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { LoadingSplash } from "@/components/ui/LoadingSplash";
import "@/global.css";
import "@/i18n";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

function InitialLayout() {
  const { isAuthenticated, isInitializing, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isInitializing, segments]);

  if (isInitializing) {
    return <LoadingSplash />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: "push",
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sync" />
    </Stack>
  );
}

export default function RootLayout() {
  const { theme, colorScheme, isThemeHydrated, hydrate } = useAppStore();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30 s — avoids redundant refetches within the same session
            gcTime: 5 * 60_000, // 5 min garbage-collect
            refetchOnWindowFocus: true, // works once focusManager is wired below
            retry: 1,
          },
        },
      }),
  );

  // Wire TanStack focusManager to React Native's AppState so
  // refetchOnWindowFocus fires when the app comes back to the foreground.
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => {
        focusManager.setFocused(status === "active");
      },
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    hydrate();
  }, []);

  if (!isThemeHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode={theme}>
        <InitialLayout />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
