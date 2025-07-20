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
  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setError(null);
      await account.createEmailPasswordSession(email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage =
        error.code === 401
          ? "Invalid email or password"
          : error.message || "Failed to log in";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary justify-center px-5">
      <Text className="text-white font-bold text-2xl mb-5">Login</Text>

      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}

      <View className="mb-4">
        <Text className="text-light-200 mb-2">Email</Text>
        <TextInput
          className="bg-dark-100 text-white p-3 rounded-lg"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-4">
        <Text className="text-light-200 mb-2">Password</Text>
        <TextInput
          className="bg-dark-100 text-white p-3 rounded-lg"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
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
