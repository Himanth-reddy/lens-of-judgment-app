import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import notificationRoutes from "./notifications.js";

vi.mock("../models/Notification.js", () => ({
  Notification: {
    find: vi.fn(),
    countDocuments: vi.fn(),
    updateMany: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock("../middleware/authMiddleware.js", () => ({
  protect: (req: any, res: any, next: any) => {
    if (req.headers.authorization === "Bearer valid_token") {
      req.user = { username: "testuser", _id: "user123" };
      next();
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  },
}));

const app = express();
app.use(express.json());
app.use("/api/notifications", notificationRoutes);

let server: Server;
let baseUrl: string;
const authHeader = { Authorization: "Bearer valid_token" };

describe("Notification Routes", () => {
  beforeEach(async () => {
    const { Notification } = await import("../models/Notification.js");
    (Notification as any).find.mockReset();
    (Notification as any).countDocuments.mockReset();
    (Notification as any).updateMany.mockReset();
    (Notification as any).findOneAndUpdate.mockReset();

    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const port = (server.address() as AddressInfo).port;
        baseUrl = `http://localhost:${port}/api/notifications`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it("should reject unauthenticated requests", async () => {
    const response = await fetch(baseUrl);
    expect(response.status).toBe(401);
  });

  it("should return notifications list", async () => {
    const { Notification } = await import("../models/Notification.js");
    const notifications = [{ _id: "n1", recipient: "testuser", read: false }];
    (Notification as any).find.mockReturnValueOnce({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(notifications),
      }),
    });

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: authHeader,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(notifications);
  });

  it("should return unread count", async () => {
    const { Notification } = await import("../models/Notification.js");
    (Notification as any).countDocuments.mockResolvedValueOnce(3);

    const response = await fetch(`${baseUrl}/unread-count`, {
      method: "GET",
      headers: authHeader,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ unreadCount: 3 });
  });

  it("should mark all notifications as read", async () => {
    const { Notification } = await import("../models/Notification.js");
    (Notification as any).updateMany.mockResolvedValueOnce({ modifiedCount: 2 });

    const response = await fetch(`${baseUrl}/read-all`, {
      method: "PUT",
      headers: authHeader,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Notifications marked as read");
  });

  it("should mark one notification as read", async () => {
    const { Notification } = await import("../models/Notification.js");
    const updatedNotification = { _id: "n1", recipient: "testuser", read: true };
    (Notification as any).findOneAndUpdate.mockResolvedValueOnce(updatedNotification);

    const response = await fetch(`${baseUrl}/n1/read`, {
      method: "PUT",
      headers: authHeader,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(updatedNotification);
  });

  it("should return 404 when notification is not found", async () => {
    const { Notification } = await import("../models/Notification.js");
    (Notification as any).findOneAndUpdate.mockResolvedValueOnce(null);

    const response = await fetch(`${baseUrl}/missing/read`, {
      method: "PUT",
      headers: authHeader,
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.message).toBe("Notification not found");
  });
});
