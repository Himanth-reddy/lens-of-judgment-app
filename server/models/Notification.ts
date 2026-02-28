import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,
  },
  actor: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["review_like"],
    required: true,
  },
  reviewId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, actor: 1, type: 1, reviewId: 1 }, { unique: true });

export const Notification = mongoose.model("Notification", notificationSchema);
