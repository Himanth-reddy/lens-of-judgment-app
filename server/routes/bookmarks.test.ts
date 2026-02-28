import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import bookmarkRoutes from "./bookmarks.js";

vi.mock("../models/User.js", () => ({
  User: {
    findById: vi.fn(),
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
app.use("/api/bookmarks", bookmarkRoutes);

let server: Server;
let baseUrl: string;
const authHeader = { Authorization: "Bearer valid_token" };

describe("Bookmark Routes", () => {
  beforeEach(async () => {
    const { User } = await import("../models/User.js");
    (User as any).findById.mockReset();

    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const port = (server.address() as AddressInfo).port;
        baseUrl = `http://localhost:${port}/api/bookmarks`;
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

  it("should return user bookmarks", async () => {
    const { User } = await import("../models/User.js");
    const bookmarks = [{ movieId: "550", status: "watchlist", addedAt: new Date().toISOString() }];
    (User as any).findById.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue({ bookmarks }),
    });

    const response = await fetch(baseUrl, {
      method: "GET",
      headers: authHeader,
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(bookmarks);
  });

  it("should add a movie to bookmarks", async () => {
    const { User } = await import("../models/User.js");
    const userDoc = {
      bookmarks: [] as any[],
      save: vi.fn().mockResolvedValue(undefined),
    };
    (User as any).findById.mockResolvedValueOnce(userDoc);

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        movieId: "550",
        status: "watchlist",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.bookmarks).toHaveLength(1);
    expect(data.bookmarks[0].movieId).toBe("550");
    expect(data.bookmarks[0].status).toBe("watchlist");
    expect(userDoc.save).toHaveBeenCalled();
  });

  it("should reject invalid bookmark status", async () => {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        movieId: "550",
        status: "invalid",
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe("Invalid bookmark status");
  });

  it("should update bookmark status", async () => {
    const { User } = await import("../models/User.js");
    const userDoc = {
      bookmarks: [{ movieId: "550", status: "watchlist" }],
      save: vi.fn().mockResolvedValue(undefined),
    };
    (User as any).findById.mockResolvedValueOnce(userDoc);

    const response = await fetch(`${baseUrl}/550`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        status: "watched",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.bookmarks[0].status).toBe("watched");
    expect(userDoc.save).toHaveBeenCalled();
  });

  it("should remove a bookmark", async () => {
    const { User } = await import("../models/User.js");
    const userDoc = {
      bookmarks: [
        { movieId: "550", status: "watchlist" },
        { movieId: "500", status: "watched" },
      ],
      save: vi.fn().mockResolvedValue(undefined),
    };
    (User as any).findById.mockResolvedValueOnce(userDoc);

    const response = await fetch(`${baseUrl}/550`, {
      method: "DELETE",
      headers: authHeader,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.bookmarks).toHaveLength(1);
    expect(data.bookmarks[0].movieId).toBe("500");
    expect(userDoc.save).toHaveBeenCalled();
  });
});
