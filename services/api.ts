import axios from "axios";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface FetchMoviesParams {
  query?: string;
}

export const fetchMovies = async ({
  query = "",
}: FetchMoviesParams): Promise<Movie[]> => {
  try {
    const endpoint = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=${
          process.env.EXPO_PUBLIC_TMDB_API_KEY
        }&query=${encodeURIComponent(query)}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`;
    const response = await axios.get(endpoint);
    return response.data.results.map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }));
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies");
  }
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
    );
    return response.data.results.map((movie: any) => ({
      movie_id: movie.id,
      title: movie.title,
      poster_url: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw new Error("Failed to fetch trending movies");
  }
};
