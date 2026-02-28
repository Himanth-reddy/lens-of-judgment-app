import express from "express";
import { User } from "../models/User.js";
import { protect, AuthRequest } from "../middleware/authMiddleware.js";

const router = express.Router();

const isValidMovieId = (movieId: unknown) => typeof movieId === "string" && movieId.length > 0 && movieId.length <= 50;

const isValidStatus = (status: unknown): status is "watchlist" | "watched" => status === "watchlist" || status === "watched";

router.get("/", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const user = await User.findById(req.user._id).select("bookmarks");
    const bookmarks = user?.bookmarks || [];
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { movieId, status } = req.body;
  const bookmarkStatus = status || "watchlist";

  if (!isValidMovieId(movieId)) {
    return res.status(400).json({ message: "Invalid movieId" });
  }

  if (!isValidStatus(bookmarkStatus)) {
    return res.status(400).json({ message: "Invalid bookmark status" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingBookmark = user.bookmarks.find((bookmark) => bookmark.movieId === movieId);
    if (existingBookmark) {
      existingBookmark.status = bookmarkStatus;
    } else {
      user.bookmarks.push({ movieId, status: bookmarkStatus, addedAt: new Date() });
    }

    await user.save();
    res.status(201).json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:movieId", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { status } = req.body;
  const { movieId } = req.params;

  if (!isValidMovieId(movieId)) {
    return res.status(400).json({ message: "Invalid movieId" });
  }

  if (!isValidStatus(status)) {
    return res.status(400).json({ message: "Invalid bookmark status" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmark = user.bookmarks.find((item) => item.movieId === movieId);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    bookmark.status = status;
    await user.save();

    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:movieId", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { movieId } = req.params;
  if (!isValidMovieId(movieId)) {
    return res.status(400).json({ message: "Invalid movieId" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingCount = user.bookmarks.length;
    user.bookmarks = user.bookmarks.filter((bookmark) => bookmark.movieId !== movieId);
    if (existingCount === user.bookmarks.length) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
