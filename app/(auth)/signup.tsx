import { account, ID } from "@/services/appwrite";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!name || name.length < 2) {
      setError("Name must be at least 2 characters");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      setError(null);
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage =
        error.code === 409
          ? "Email already exists"
          : error.message || "Failed to sign up";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary justify-center px-5">
      <Text className="text-white font-bold text-2xl mb-5">Sign Up</Text>

      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}

      <View className="mb-4">
        <Text className="text-light-200 mb-2">Name</Text>
        <TextInput
          className="bg-dark-100 text-white p-3 rounded-lg"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          placeholder="Enter your name"
          placeholderTextColor="#999"
        />
      </View>

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
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      <View className="mb-4">
        <Text className="text-light-200 mb-2">Confirm Password</Text>
        <TextInput
          className="bg-dark-100 text-white p-3 rounded-lg"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError(null);
          }}
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        className="bg-accent rounded-lg py-3 flex-row items-center justify-center"
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <Text className="text-white font-semibold">Loading...</Text>
        ) : (
          <>
            <MaterialIcons name="person-add" size={20} color="#fff" />
            <Text className="text-white font-semibold text-base ml-2">
              Sign Up
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push("/(auth)/login")}
      >
        <Text className="text-light-200 text-center">
          Already have an account? <Text className="text-accent">Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
