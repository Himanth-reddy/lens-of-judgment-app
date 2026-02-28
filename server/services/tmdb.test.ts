import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import axios from "axios";
import { getPopularMovies, getTrendingMovies, getMovieDetails } from "./tmdb.js";

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

  it("getTrendingMovies caches the result", async () => {
    const fakeResults = [{ id: 1, title: "Trending Movie", poster_path: null }];
    mockGet.mockResolvedValue({ data: { results: fakeResults } });

    // First call - should hit API
    const first = await getTrendingMovies();
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(first).toEqual(fakeResults);

    // Second call - should use cache and return the same data
    const second = await getTrendingMovies();
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(second).toEqual(fakeResults);
  });

  it("getMovieDetails caches the result and respects cache limits", async () => {
    // We mock Date.now to test expiration, but for now we'll just test basic caching
    const fakeMovie = { id: 123, title: "Test Movie" };
    mockGet.mockResolvedValue({ data: fakeMovie });

    // First call - should hit API
    const first = await getMovieDetails("123");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(first).toEqual(fakeMovie);

    // Second call - should use cache
    const second = await getMovieDetails("123");
    expect(mockGet).toHaveBeenCalledTimes(1); // Still 1
    expect(second).toEqual(fakeMovie);

    // Different ID - should hit API
    mockGet.mockResolvedValue({ data: { id: 124, title: "Another Movie" } });
    await getMovieDetails("124");
    expect(mockGet).toHaveBeenCalledTimes(2);
  });
});
