import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getClient = () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set. TMDB calls will fail.");
  }
  return axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: apiKey,
    },
  });
};

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

let popularMoviesCache: Movie[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export const getPopularMovies = async () => {
  const now = Date.now();
  if (popularMoviesCache && now - lastFetchTime < CACHE_DURATION) {
    return popularMoviesCache;
  }

  try {
    const response = await getClient().get("/movie/popular");
    popularMoviesCache = response.data.results;
    lastFetchTime = now;
    return popularMoviesCache;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await getClient().get("/search/movie", {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (id: string) => {
  try {
    const response = await getClient().get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
