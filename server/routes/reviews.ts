import express from "express";
import { Review } from "../models/Review.js";

const router = express.Router();

router.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { movieId, user, rating, text } = req.body;

  if (!movieId || !user || !rating || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Security: Input type validation
  if (typeof movieId !== "string" || typeof user !== "string" || typeof rating !== "string" || typeof text !== "string") {
    return res.status(400).json({ message: "Invalid input types" });
  }

  // Security: Input validation to prevent DoS via large payloads
  if (text.length > 1000) {
    return res.status(400).json({ message: "Review text exceeds 1000 characters" });
  }

  if (user.length > 50) {
    return res.status(400).json({ message: "User name exceeds 50 characters" });
  }

  if (movieId.length > 50) {
    return res.status(400).json({ message: "Movie ID exceeds 50 characters" });
  }

  try {
    const newReview = new Review({
      movieId,
      user,
      rating,
      text,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
