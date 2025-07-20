/* eslint-disable react-hooks/exhaustive-deps */
import { AuthProvider, useAuth } from "@/services/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkRouteAccess = async () => {
      const currentRoute = segments[segments.length - 1];
      const isPublicRoute =
        currentRoute === "login" || currentRoute === "signup";

      if (!loading && !user && !isPublicRoute) {
        console.log("No user found, redirecting to login");
        router.replace("/(auth)/login");
      }
    };

    checkRouteAccess();
  }, [user, loading, segments]);

  if (loading) {
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
};
