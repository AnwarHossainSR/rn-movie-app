import { useAuth } from "@/services/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Login = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert("Success", "Logged in successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to log in");
    }
  };

  return (
    <View className="flex-1 bg-primary justify-center px-5">
      <Animated.View
        entering={FadeInUp.duration(500)}
        className="items-center mb-8"
      >
        <Text className="text-white font-bold text-3xl">Login</Text>
        <Text className="text-light-200 text-base mt-2">
          Sign in to your account
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#A8B5DB"
          className="bg-dark-200 text-white p-4 rounded-lg mb-4"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#A8B5DB"
          secureTextEntry
          className="bg-dark-200 text-white p-4 rounded-lg mb-4"
        />
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-accent p-4 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>
        {error && (
          <Text className="text-red-500 mt-4 text-center">{error}</Text>
        )}
      </Animated.View>
    </View>
  );
};

export default Login;
