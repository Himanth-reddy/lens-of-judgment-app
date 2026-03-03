import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
    enum: ["Skip", "Timepass", "Go for it", "Perfection"],
  },
  text: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate reviews: one review per user per movie
reviewSchema.index({ movieId: 1, user: 1 }, { unique: true });

// Performance optimizations for frequent queries
reviewSchema.index({ movieId: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

export const Review = mongoose.model("Review", reviewSchema);
