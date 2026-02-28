import express from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { getJwtSecret } from "../config/auth.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: "30d",
  });
};

router.post("/register", authRateLimiter, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  // Security: Prevent NoSQL injection
  if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid input types" });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    return res.status(400).json({ message: "User already exists with this email or username" });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      tags: user.tags,
      token: generateToken((user._id as any).toString()),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

router.post("/login", authRateLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  // Security: Prevent NoSQL injection
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid input types" });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      tags: user.tags,
      token: generateToken((user._id as any).toString()),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

router.get("/me", protect, async (req: any, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
});

// Update user tags
router.put("/tags", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { tags } = req.body;

  if (!Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array" });
  }

  if (tags.length > 3) {
    return res.status(400).json({ message: "Maximum 3 tags allowed" });
  }

  for (const tag of tags) {
    if (typeof tag !== "string" || tag.length > 30 || tag.length === 0) {
      return res.status(400).json({ message: "Each tag must be a non-empty string up to 30 characters" });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { tags },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
