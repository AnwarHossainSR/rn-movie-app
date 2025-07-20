import { useAuth } from "@/services/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Profile = () => {
  const { user, loading, error, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to log out");
    }
  };

  return (
    <LinearGradient colors={["#1A2525", "#2E3D3D"]} className="flex-1">
      <View className="flex-1 justify-center px-5">
        <Animated.View
          entering={FadeInUp.duration(500)}
          className="items-center mb-8"
        >
          <Text className="text-white font-bold text-3xl">My Profile</Text>
          <Text className="text-light-200 text-base mt-2">
            Manage your account details
          </Text>
        </Animated.View>

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
              <View className="w-24 h-24 rounded-full bg-accent justify-center items-center mb-4">
                <Text className="text-white text-4xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text className="text-white font-semibold text-xl mb-2">
                {user.name}
              </Text>
              <Text className="text-light-200 text-base mb-4">
                {user.email}
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <TouchableOpacity
            className="bg-accent rounded-lg py-4 flex-row items-center justify-center"
            onPress={handleLogout}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Animated.View
              style={{ transform: [{ scale: loading ? 0.95 : 1 }] }}
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
