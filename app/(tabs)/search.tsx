import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/usefetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Search = () => {
  const [query, setQuery] = useState("");
  const {
    data: movies,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchMovies({ query }), false);

  const handleSearch = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (query && token) {
        await axios.post(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/search`,
          { query },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }
      refetch();
    } catch (err) {
      console.error("Failed to save search:", err);
    }
  };

  return (
    <View className="flex-1 bg-primary px-5 pt-20">
      <Animated.View entering={FadeInDown.duration(500)}>
        <SearchBar
          placeholder="Search for a movie"
          value={query}
          onChangeText={setQuery}
          onPress={handleSearch}
        />
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
            data={movies}
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

export default Search;
