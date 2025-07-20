import { account } from "@/services/appwrite";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface UserProfile {
  $id: string;
  name: string;
  email: string;
}

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await account.get();
        setUser({
          $id: userData.$id,
          name: userData.name,
          email: userData.email,
        });
      } catch (err: any) {
        setError(
          err.message.includes("missing scope (account)")
            ? "Please log in to view your profile."
            : "Failed to fetch user profile"
        );
        if (err.message.includes("missing scope (account)")) {
          router.replace("/(auth)/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      Alert.alert("Success", "Logged out successfully!");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to log out");
    }
  };

  return (
    <LinearGradient colors={["#1A2525", "#2E3D3D"]} className="flex-1">
      <View className="flex-1 justify-center px-5">
        {/* Header */}
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="items-center mb-8"
        >
          <Text className="text-white font-bold text-3xl">My Profile</Text>
          <Text className="text-light-200 text-base mt-2">
            Manage your account details
          </Text>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="bg-dark-100 rounded-2xl p-6 mb-6 shadow-lg"
        >
          {loading && (
            <Text className="text-white text-center text-lg">Loading...</Text>
          )}

          {error && (
            <Text className="text-red-500 text-center text-lg mb-4">
              Error: {error}
            </Text>
          )}

          {user && !loading && !error && (
            <View className="items-center">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-accent justify-center items-center mb-4">
                <Text className="text-white text-4xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* User Info */}
              <Text className="text-white font-semibold text-xl mb-2">
                {user.name}
              </Text>
              <Text className="text-light-200 text-base mb-4">
                {user.email}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <TouchableOpacity
            className="bg-accent rounded-lg py-4 flex-row items-center justify-center"
            onPress={handleLogout}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    scale: loading ? 0.95 : 1,
                  },
                ],
              }}
            >
              {loading ? (
                <Text className="text-white font-semibold text-lg">
                  Logging out...
                </Text>
              ) : (
                <View className="flex-row items-center">
                  <MaterialIcons name="logout" size={24} color="#fff" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Log Out
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

export default Profile;
