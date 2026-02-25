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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Review = mongoose.model("Review", reviewSchema);
