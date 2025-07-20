import "expo-router";

declare module "expo-router" {
  interface Router {
    push: (
      path: "/(auth)/login" | "/(auth)/signup" | "/(tabs)/save" | "/movie/[id]"
    ) => void;
    replace: (
      path: "/(auth)/login" | "/(auth)/signup" | "/(tabs)/save" | "/movie/[id]"
    ) => void;
  }
}
