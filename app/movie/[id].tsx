import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import {
  getSavedMovies,
  removeSavedMovie,
  saveMovie,
} from "@/services/appwrite";
import useFetch from "@/services/usefetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const savedMovies = await getSavedMovies();
        const isMovieSaved = savedMovies.some(
          (savedMovie) => savedMovie.movie_id.toString() === id
        );
        setIsSaved(isMovieSaved);
      } catch (error) {
        console.error("Error checking saved movie:", error);
        setError("Failed to check saved status");
      }
    };
    checkIfSaved();
  }, [id]);

  const handleSaveToggle = async () => {
    try {
      setIsSaving(true);
      setError(null);
      console.log("Toggling save for movie:", id, "isSaved:", isSaved);
      if (isSaved) {
        await removeSavedMovie(id as string);
        setIsSaved(false);
      } else if (movie) {
        // console.log("Saving movie:", movie);
        await saveMovie(movie);
        setIsSaved(true);
      }
    } catch (error: any) {
      setError(error.message || "Failed to toggle save");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
            className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
            onPress={handleSaveToggle}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Image
                source={isSaved ? icons.bookmarkFilled : icons.save}
                className="w-6 h-6"
                tintColor={isSaved ? "#FFD700" : "#000"}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          {error && <Text className="text-red-500 mt-3">{error}</Text>}

          <View className="flex-row flex-wrap mt-5">
            {movie?.genres?.map((genre) => (
              <Text
                key={genre.id}
                className="bg-dark-100 text-white px-3 py-1 rounded-full mr-2 mb-2"
              >
                {genre.name}
              </Text>
            ))}
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
