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

const searchCache = new Map<string, { data: unknown; timestamp: number }>();
const SEARCH_CACHE_MAX_SIZE = 500;

export const searchMovies = async (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  const now = Date.now();
  const cached = searchCache.get(normalizedQuery);

  if (cached) {
    if (now - cached.timestamp < CACHE_DURATION) {
      // Move to back of Map to maintain LRU order without changing expiry timestamp
      searchCache.delete(normalizedQuery);
      searchCache.set(normalizedQuery, cached);
      return cached.data;
    }
    // Expired
    searchCache.delete(normalizedQuery);
  }

  try {
    const response = await getClient().get("/search/movie", {
      params: { query },
    });
    const data = response.data.results;

    // Prevent memory leaks by capping cache size
    if (searchCache.size >= SEARCH_CACHE_MAX_SIZE) {
      const oldestKey = searchCache.keys().next().value;
      if (oldestKey !== undefined) {
        searchCache.delete(oldestKey);
      }
    }

    searchCache.set(normalizedQuery, { data, timestamp: now });
    return data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

const movieDetailsCache = new Map<string, { data: unknown; timestamp: number }>();
const MOVIE_DETAILS_CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const MOVIE_DETAILS_MAX_CACHE_SIZE = 1000;

export const getMovieDetails = async (id: string) => {
  const now = Date.now();
  const cached = movieDetailsCache.get(id);

  if (cached) {
    if (now - cached.timestamp < MOVIE_DETAILS_CACHE_DURATION) {
      // Move to back of Map to maintain LRU order, preserving original fetch timestamp
      movieDetailsCache.delete(id);
      movieDetailsCache.set(id, cached);
      return cached.data;
    }
    // Expired
    movieDetailsCache.delete(id);
  }

  try {
    const response = await getClient().get(`/movie/${id}`);
    const data = response.data;

    // Prevent memory leaks by capping cache size
    if (movieDetailsCache.size >= MOVIE_DETAILS_MAX_CACHE_SIZE) {
      // Evict the oldest entry (first item in Map)
      const oldestKey = movieDetailsCache.keys().next().value;
      if (oldestKey !== undefined) {
        movieDetailsCache.delete(oldestKey);
      }
    }

    movieDetailsCache.set(id, { data, timestamp: now });
    return data;
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

const discoverCache = new Map<string, { data: unknown; timestamp: number }>();
const DISCOVER_CACHE_MAX_SIZE = 100;

export const discoverMoviesByGenre = async (genreId: string) => {
  const now = Date.now();
  const cached = discoverCache.get(genreId);

  if (cached) {
    if (now - cached.timestamp < CACHE_DURATION) {
      // Move to back of Map to maintain LRU order, preserving original fetch timestamp for expiry
      discoverCache.delete(genreId);
      discoverCache.set(genreId, cached);
      return cached.data;
    }
    // Expired
    discoverCache.delete(genreId);
  }

  try {
    const response = await getClient().get("/discover/movie", {
      params: { with_genres: genreId, sort_by: "popularity.desc" },
    });
    const data = response.data.results;

    if (discoverCache.size >= DISCOVER_CACHE_MAX_SIZE) {
      const oldestKey = discoverCache.keys().next().value;
      if (oldestKey !== undefined) {
        discoverCache.delete(oldestKey);
      }
    }

    discoverCache.set(genreId, { data, timestamp: now });
    return data;
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
