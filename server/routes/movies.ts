import express from "express";
import { getPopularMovies, searchMovies, getMovieDetails } from "../services/tmdb.ts";

const router = express.Router();

router.get("/popular", async (req, res) => {
  try {
    const movies = await getPopularMovies();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
