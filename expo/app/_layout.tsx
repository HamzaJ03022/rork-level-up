import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, ActivityIndicator, View, StyleSheet } from "react-native";
import Colors from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/auth-token-cache";
import { RevenueCatProvider } from "@/store/revenuecat-store";
import { useUserStore } from "@/store/user-store";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const HAS_CLERK = CLERK_PUBLISHABLE_KEY.length > 0;

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

  const content = (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <RevenueCatProvider>
          {HAS_CLERK ? <AuthGate /> : <RootLayoutNav />}
        </RevenueCatProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );

  if (!HAS_CLERK) {
    console.warn('[Auth] Clerk publishable key missing, running without authentication');
    return content;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      {content}
    </ClerkProvider>
  );
}

function AuthGate() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const isOnboarded = useUserStore(state => state.isOnboarded);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === 'sign-in' || segments[0] === 'sign-up';

    if (!isSignedIn && !inAuthGroup) {
      console.log('[Auth] Not signed in, redirecting to sign-in');
      router.replace('/sign-in');
    } else if (isSignedIn && inAuthGroup) {
      if (!isOnboarded) {
        console.log('[Auth] Signed in but not onboarded, going to welcome');
        router.replace('/welcome');
      } else {
        console.log('[Auth] Signed in and onboarded, going to home');
        router.replace('/');
      }
    }
  }, [isSignedIn, isLoaded, segments, isOnboarded, router]);

  if (!isLoaded) {
    return (
      <View style={loadingStyles.container}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return <RootLayoutNav />;
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
});

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
        name="sign-in" 
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen 
        name="sign-up" 
        options={{ 
          headerShown: false,
        }} 
      />
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