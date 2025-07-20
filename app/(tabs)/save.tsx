import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/usefetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Save = () => {
  const fetchSavedMovies = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/saved`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data.map((movie: any) => ({
      id: movie.movieId,
      title: movie.title,
      poster_path: movie.posterUrl,
      vote_average: 0, // Placeholder, as TMDb data not fetched
      release_date: "",
    }));
  };

  const {
    data: savedMovies,
    loading,
    error,
  } = useFetch(fetchSavedMovies, true);

  return (
    <View className="flex-1 bg-primary px-5 pt-20">
      <Animated.View entering={FadeInDown.duration(500)} className="mb-5">
        <Text className="text-lg text-white font-bold">Saved Movies</Text>
      </Animated.View>

      {loading ? (
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="mt-10 self-center"
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </Animated.View>
      ) : error ? (
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="mt-10"
        >
          <Text className="text-red-500 text-center">
            Error: {error.message}
          </Text>
        </Animated.View>
      ) : (
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="flex-1 mt-5"
        >
          <FlatList
            data={savedMovies}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.duration(500).delay(400 + index * 100)}
                className="flex-1"
              >
                <MovieCard {...item} />
              </Animated.View>
            )}
            keyExtractor={(item, index) =>
              item.id.toString() + index.toString()
            }
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 10,
            }}
            contentContainerStyle={{ paddingHorizontal: 5 }}
            className="mt-2 pb-32"
            scrollEnabled={true}
            initialNumToRender={6}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default Save;
