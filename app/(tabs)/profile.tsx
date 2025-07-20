import { account } from "@/services/appwrite";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

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
    <View className="flex-1 bg-primary justify-center px-5">
      <Text className="text-white font-bold text-2xl mb-5">Profile</Text>

      {loading && <Text className="text-white text-center">Loading...</Text>}

      {error && (
        <Text className="text-red-500 text-center mb-4">Error: {error}</Text>
      )}

      {user && !loading && !error && (
        <View className="mb-4">
          <Text className="text-light-200 mb-2">Name: {user.name}</Text>
          <Text className="text-light-200 mb-2">Email: {user.email}</Text>
        </View>
      )}

      <TouchableOpacity
        className="bg-accent rounded-lg py-3 flex-row items-center justify-center"
        onPress={handleLogout}
        disabled={loading}
      >
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text className="text-white font-semibold text-base ml-2">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
