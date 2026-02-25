import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getClient = () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.warn("TMDB_API_KEY is not set. TMDB calls will fail.");
  }
  return axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: apiKey,
    },
  });
};

export const getPopularMovies = async () => {
  try {
    const response = await getClient().get("/movie/popular");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
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
    return [];
  }
};

export const getMovieDetails = async (id: string) => {
  try {
    const response = await getClient().get(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
