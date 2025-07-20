import { account } from "@/services/appwrite";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "./global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if the current route is public
        const currentRoute = segments[segments.length - 1];
        const isPublicRoute =
          currentRoute === "login" || currentRoute === "signup";

        if (isPublicRoute) {
          setIsCheckingAuth(false);
          return;
        }

        // Attempt to get the current session
        const session = await account.get();
        if (session) {
          // Session exists, no redirect needed
          setIsCheckingAuth(false);
        } else {
          // No session, redirect to login
          router.replace("/(auth)/login");
        }
      } catch (error: any) {
        console.error("Authentication check failed:", error);
        router.replace("/(auth)/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [segments, router]);

  // Show a loading UI while checking authentication
  if (isCheckingAuth) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <StatusBar hidden={true} />
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
