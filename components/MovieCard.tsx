import { icons } from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Link } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Movie {
  id: number;
  poster_path: string;
  title: string;
  vote_average: number;
  release_date: string;
}

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      if (isSaved) {
        await axios.delete(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/saved/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setIsSaved(false);
      } else {
        await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/saved`,
          { movieId: id, title, posterUrl: poster_path },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  return (
    <Link href={{ pathname: "/movie/[id]", params: { id } }} asChild>
      <TouchableOpacity className="flex-1">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {Math.round(vote_average / 2)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {release_date?.split("-")[0]}
          </Text>
          <TouchableOpacity onPress={toggleSave}>
            <Text className="text-xs font-medium text-light-300 uppercase">
              {isSaved ? "Unsave" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
