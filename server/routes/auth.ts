import express from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { getJwtSecret } from "../config/auth.js";

const router = express.Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: "30d",
  });
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
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
      token: generateToken((user._id as any).toString()),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
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

export default router;
