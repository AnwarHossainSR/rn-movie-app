import { account } from "@/services/appwrite";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await account.createEmailPasswordSession(email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary justify-center px-5">
      <Text className="text-white font-bold text-2xl mb-5">Login</Text>

      <View className="mb-4">
        <Text className="text-light-200 mb-2">Email</Text>
        <TextInput
          className="bg-dark-100 text-white p-3 rounded-lg"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-4">
        <Text className="text-light-200 mb-2">Password</Text>
        <TextInput
          className="bg-dark-100 text-white p-3 rounded-lg"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="bg-accent rounded-lg py-3 flex-row items-center justify-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <Text className="text-white font-semibold">Loading...</Text>
        ) : (
          <>
            <MaterialIcons name="login" size={20} color="#fff" />
            <Text className="text-white font-semibold text-base ml-2">
              Log In
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text className="text-light-200 text-center">
          Don&apos;t have an account?{" "}
          <Text className="text-accent">Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
