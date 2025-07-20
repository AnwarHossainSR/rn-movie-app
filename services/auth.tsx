import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserProfile {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      const { user, token } = response.data;
      await AsyncStorage.setItem("token", token);
      setUser(user);
      console.log("Login successful:", user.id);
      router.replace("/(tabs)");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to log in";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/signup`,
        {
          email,
          password,
          name,
        },
        { withCredentials: true }
      );
      const { user, token } = response.data;
      await AsyncStorage.setItem("token", token);
      setUser(user);
      console.log("Signup successful:", user.id);
      router.replace("/(tabs)");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to sign up";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      await AsyncStorage.removeItem("token");
      setUser(null);
      console.log("Logout successful");
      router.replace("/(auth)/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to log out";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    if (isAuthChecked) {
      console.log("Auth already checked, skipping");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token in AsyncStorage, attempting cookie-based auth");
        throw new Error("No token found");
      }
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setUser(response.data.user);
      console.log("Session found:", response.data.user.id);
    } catch (err: any) {
      console.error("Auth check failed:", err.message);
      setUser(null);
      await AsyncStorage.removeItem("token");
      if (err.message !== "No token found") {
        setError(err.message || "Failed to check authentication");
      }
    } finally {
      setIsAuthChecked(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Running checkAuth on mount");
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
