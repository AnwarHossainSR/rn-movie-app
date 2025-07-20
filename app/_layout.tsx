import { account } from "@/services/appwrite";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "./global.css";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get(); // Check if user is logged in
      } catch (error: any) {
        console.error("Authentication check failed:", error);
        // If not authenticated and not on a public route, redirect to login
        const isPublicRoute =
          segments.includes("login") || segments.includes("signup");
        if (!isPublicRoute) {
          router.replace("/(auth)/login");
        }
      }
    };
    checkAuth();
  }, [segments, router]);

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
