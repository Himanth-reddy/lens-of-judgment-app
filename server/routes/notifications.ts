import express from "express";
import { Notification } from "../models/Notification.js";
import { protect, AuthRequest } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const notifications = await Notification.find({ recipient: req.user.username })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/unread-count", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const unreadCount = await Notification.countDocuments({ recipient: req.user.username, read: false });
    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/read-all", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    await Notification.updateMany({ recipient: req.user.username, read: false }, { read: true });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/:id/read", protect, async (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.username },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
