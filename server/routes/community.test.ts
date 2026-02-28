import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from "express";
import { Server } from "http";
import { AddressInfo } from "net";
import communityRoutes from "./community.js";

vi.mock("../models/Review.js", () => ({
  Review: {
    aggregate: vi.fn(),
    find: vi.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/community", communityRoutes);

let server: Server;
let baseUrl: string;

describe("Community Routes", () => {
  beforeEach(async () => {
    const { Review } = await import("../models/Review.js");
    (Review as any).aggregate.mockReset();
    (Review as any).find.mockReset();

    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const port = (server.address() as AddressInfo).port;
        baseUrl = `http://localhost:${port}/api/community`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it("should return community overview data", async () => {
    const { Review } = await import("../models/Review.js");
    const topReviewers = [{ _id: "critic1", reviewsCount: 5, likesReceived: 20, score: 45 }];
    const latestReviews = [{ _id: "r1", user: "critic1", text: "Great movie" }];

    (Review as any).aggregate.mockResolvedValueOnce(topReviewers);
    (Review as any).find.mockReturnValueOnce({
      sort: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue(latestReviews),
      }),
    });

    const response = await fetch(`${baseUrl}/overview`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.topReviewers).toEqual(topReviewers);
    expect(data.latestReviews).toEqual(latestReviews);
  });

  it("should return 500 when fetching overview fails", async () => {
    const { Review } = await import("../models/Review.js");
    (Review as any).aggregate.mockRejectedValueOnce(new Error("db error"));

    const response = await fetch(`${baseUrl}/overview`);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.message).toBe("Server Error");
  });
});
