import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View className="flex-1 bg-primary justify-center items-center">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
