import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

let tmdbClient: ReturnType<typeof axios.create> | null = null;

const getClient = () => {
  if (tmdbClient) return tmdbClient;
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not set. TMDB calls will fail.");
  }
  tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: apiKey,
    },
  });
  return tmdbClient;
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

// Cache for movie details
const movieDetailsCache = new Map<string, { data: any; timestamp: number }>();
const MOVIE_DETAILS_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getMovieDetails = async (id: string) => {
  const now = Date.now();
  const cached = movieDetailsCache.get(id);

  if (cached && now - cached.timestamp < MOVIE_DETAILS_CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await getClient().get(`/movie/${id}`);
    movieDetailsCache.set(id, { data: response.data, timestamp: now });

    // Simple cleanup if cache gets too large (optional but good practice)
    if (movieDetailsCache.size > 1000) {
      const oldestKey = movieDetailsCache.keys().next().value;
      if (oldestKey !== undefined) {
         movieDetailsCache.delete(oldestKey);
      }
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

interface Genre {
  id: number;
  name: string;
}

let genresCache: Genre[] | null = null;
let genresFetchTime = 0;

export const getGenres = async () => {
  const now = Date.now();
  if (genresCache && now - genresFetchTime < CACHE_DURATION) {
    return genresCache;
  }

  try {
    const response = await getClient().get("/genre/movie/list");
    genresCache = response.data.genres;
    genresFetchTime = now;
    return genresCache;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const discoverMoviesByGenre = async (genreId: string) => {
  try {
    const response = await getClient().get("/discover/movie", {
      params: { with_genres: genreId, sort_by: "popularity.desc" },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error discovering movies:", error);
    throw error;
  }
};

let trendingMoviesCache: Movie[] | null = null;
let trendingFetchTime = 0;

export const getTrendingMovies = async () => {
  const now = Date.now();
  if (trendingMoviesCache && now - trendingFetchTime < CACHE_DURATION) {
    return trendingMoviesCache;
  }

  try {
    const response = await getClient().get("/trending/movie/week");
    trendingMoviesCache = response.data.results;
    trendingFetchTime = now;
    return trendingMoviesCache;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};
