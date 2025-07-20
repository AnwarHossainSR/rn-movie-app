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
        const currentRoute = segments[segments.length - 1];
        const isPublicRoute =
          currentRoute === "login" || currentRoute === "signup";

        if (isPublicRoute) {
          setIsCheckingAuth(false);
          return;
        }

        console.log("Checking session...");
        const session = await account.getSession("current");
        console.log("Session found:", session?.$id);

        const user = await account.get();
        console.log("User found:", user?.$id);

        if (user) {
          setIsCheckingAuth(false);
        } else {
          console.log("No user found, redirecting to login");
          router.replace("/(auth)/login");
        }
      } catch (error: any) {
        console.error("Authentication check failed:", error);

        // Handle invalid session or missing scope
        if (
          error.code === 401 ||
          error.message?.includes("missing scope (account)")
        ) {
          console.log(
            "Invalid session or missing account scope. Redirecting..."
          );

          // Clear cookieFallback if it exists
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.removeItem(
              `cookieFallback_${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`
            );
          }

          router.replace("/(auth)/login");
        } else {
          console.error("Unexpected error:", error);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [segments, router]);

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
