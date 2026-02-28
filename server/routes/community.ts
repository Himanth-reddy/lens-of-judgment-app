import express from "express";
import { Review } from "../models/Review.js";

const router = express.Router();

router.get("/overview", async (_req, res) => {
  try {
    const [topReviewers, latestReviews] = await Promise.all([
      Review.aggregate([
        {
          $group: {
            _id: "$user",
            reviewsCount: { $sum: 1 },
            likesReceived: { $sum: "$likes" },
          },
        },
        {
          $addFields: {
            score: { $add: [{ $multiply: ["$reviewsCount", 5] }, "$likesReceived"] },
          },
        },
        { $sort: { score: -1, reviewsCount: -1 } },
        { $limit: 10 },
      ]),
      Review.find({})
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

    res.json({
      topReviewers,
      latestReviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
