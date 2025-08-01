import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

// === Configuration ===
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const SEARCH_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);
// Set correct platform for Web vs Mobile
if (typeof window !== "undefined") {
  client.setPlatform("web");
} else {
  client.setPlatform("react-native");
}

// Initialize Appwrite services
export const account = new Account(client);
const database = new Databases(client);
export { ID };

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SEARCH_COLLECTION_ID,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        SEARCH_COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        SEARCH_COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      SEARCH_COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async (movie: Movie) => {
  try {
    const user = await account.get();
    const userId = user.$id;

    const existingMovies = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("user_id", userId), Query.equal("movie_id", movie.id)]
    );

    if (existingMovies.documents.length === 0) {
      await database.createDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        ID.unique(),
        {
          user_id: userId,
          movie_id: movie.id,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          vote_average: parseInt(movie.vote_average.toFixed(1)) || 0,
          release_date: movie.release_date || "",
          genre_ids: movie.genre_ids || [],
          saved_at: new Date().toISOString(),
        }
      );
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const removeSavedMovie = async (movieId: string) => {
  try {
    const user = await account.get();
    const userId = user.$id;

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal("user_id", userId),
        Query.equal("movie_id", parseInt(movieId)),
      ]
    );

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_MOVIES_COLLECTION_ID,
        result.documents[0].$id
      );
    }
  } catch (error) {
    console.error("Error removing saved movie:", error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[]> => {
  try {
    const user = await account.get();
    const userId = user.$id;

    const result = await database.listDocuments(
      DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [Query.equal("user_id", userId), Query.orderDesc("saved_at")]
    );

    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    throw error;
  }
};
