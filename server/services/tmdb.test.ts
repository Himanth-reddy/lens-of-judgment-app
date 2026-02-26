import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import axios from "axios";
import { getPopularMovies } from "./tmdb.js";

vi.mock("axios");

describe("tmdb service", () => {
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (axios.create as unknown as Mock).mockReturnValue({
      get: mockGet,
    });
    process.env.TMDB_API_KEY = "test-key";
  });

  it("getPopularMovies caches the result", async () => {
    mockGet.mockResolvedValue({ data: { results: [] } });

    // First call - should hit API
    await getPopularMovies();
    expect(mockGet).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    await getPopularMovies();
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
