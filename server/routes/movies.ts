import express from "express";
import { getPopularMovies, searchMovies, getMovieDetails, getGenres, discoverMoviesByGenre, getTrendingMovies } from "../services/tmdb.js";

const router = express.Router();

router.get("/popular", async (req, res) => {
  try {
    const movies = await getPopularMovies();
    res.json(movies);
  } catch (error) {
    res.status(502).json({ message: "Upstream Error" });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const movies = await getTrendingMovies();
    res.json(movies);
  } catch (error) {
    res.status(502).json({ message: "Upstream Error" });
  }
});

router.get("/genres", async (req, res) => {
  try {
    const genres = await getGenres();
    res.json(genres);
  } catch (error) {
    res.status(502).json({ message: "Upstream Error" });
  }
});

router.get("/discover", async (req, res) => {
  const genreId = req.query.genre as string;
  if (!genreId) {
    return res.status(400).json({ message: "Genre parameter is required" });
  }
  try {
    const movies = await discoverMoviesByGenre(genreId);
    res.json(movies);
  } catch (error) {
    res.status(502).json({ message: "Upstream Error" });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  try {
    const movies = await searchMovies(query);
    res.json(movies);
  } catch (error) {
    res.status(502).json({ message: "Upstream Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await getMovieDetails(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(502).json({ message: "Upstream Error" });
  }
});

export default router;
