import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import Colors from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";



import { RevenueCatProvider } from "@/store/revenuecat-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 0,
      networkMode: 'offlineFirst',
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    
      <QueryClientProvider client={queryClient}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <RevenueCatProvider>
            <RootLayoutNav />
          </RevenueCatProvider>
        </trpc.Provider>
      </QueryClientProvider>
    
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="welcome" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal'
        }} 
      />
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal'
        }} 
      />
      <Stack.Screen 
        name="category/[id]" 
        options={{ 
          title: "Category",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="tip/[id]" 
        options={{ 
          title: "Tip Details",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="ai-advice" 
        options={{ 
          title: "AI Advice",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="photo-detail" 
        options={{ 
          title: "Photo Detail",
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: "Settings",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: "Profile",
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }} 
      />
      <Stack.Screen 
        name="paywall" 
        options={{ 
          title: "Subscription",
          presentation: 'modal',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="customer-center" 
        options={{ 
          title: "Subscription",
          presentation: 'modal',
          headerShown: false,
        }} 
      />
    </Stack>
  );
}