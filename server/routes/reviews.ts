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

// Get reviews by a specific user
router.get("/user/:username", async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.username }).sort({ createdAt: -1 });
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
    // Check for duplicate review
    const existingReview = await Review.findOne({ movieId, user });
    if (existingReview) {
      return res.status(409).json({ message: "You have already reviewed this movie" });
    }

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

// Delete a review
router.delete("/:reviewId", async (req, res) => {
  const { user } = req.body;

  if (!user || typeof user !== "string") {
    return res.status(400).json({ message: "User is required" });
  }

  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user !== user) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
