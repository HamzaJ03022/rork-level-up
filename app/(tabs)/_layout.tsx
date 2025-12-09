import React, { useEffect, memo } from "react";
import { Tabs, useRouter, Href } from "expo-router";
import Colors from "@/constants/colors";
import { Home, ListChecks, Camera, User } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";

const TabLayout = memo(function TabLayout() {
  const router = useRouter();
  const isOnboarded = useUserStore(state => state.isOnboarded);
  
  useEffect(() => {
    if (!isOnboarded) {
      router.replace('/onboarding' as Href);
    }
  }, [isOnboarded, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.inactive,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
          borderTopColor: Colors.dark.border,
        },
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "Routines",
          tabBarIcon: ({ color }) => <ListChecks size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
});

export default TabLayout;