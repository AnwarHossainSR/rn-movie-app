import { useAuth } from "@/services/auth";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const Signup = () => {
  const { signup, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    try {
      await signup(email, password, name);
      Alert.alert("Success", "Signed up successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to sign up");
    }
  };

  return (
    <View className="flex-1 bg-primary justify-center px-5">
      <Animated.View
        entering={FadeInUp.duration(500)}
        className="items-center mb-8"
      >
        <Text className="text-white font-bold text-3xl">Sign Up</Text>
        <Text className="text-light-200 text-base mt-2">
          Create a new account
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#A8B5DB"
          className="bg-dark-200 text-white p-4 rounded-lg mb-4"
        />
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
          onPress={handleSignup}
          disabled={loading}
          className="bg-accent p-4 rounded-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
        {error && (
          <Text className="text-red-500 mt-4 text-center">{error}</Text>
        )}
      </Animated.View>
    </View>
  );
};

export default Signup;
