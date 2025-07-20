// (tabs)/save.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import MovieDisplayCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies } from "@/services/appwrite";

const Save = () => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved movies
  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        setLoading(true);
        const movies = await getSavedMovies();
        setSavedMovies(movies);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch saved movies"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMovies();
  }, []);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={savedMovies}
        keyExtractor={(item) => item.movie_id}
        renderItem={({ item }) => (
          <MovieDisplayCard
            id={parseInt(item.movie_id)}
            title={item.title}
            poster_path={item.poster_url}
            vote_average={item.vote_average}
            release_date={item.release_date}
            adult={false}
            backdrop_path={""}
            genre_ids={[]}
            original_language={""}
            original_title={""}
            overview={""}
            popularity={0}
            video={false}
            vote_count={0}
          />
        )}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <Text className="text-xl text-white font-bold px-5">
                Saved Movies
              </Text>
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">Error: {error}</Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                No saved movies yet
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Save;
