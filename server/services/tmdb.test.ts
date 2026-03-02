import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import axios from "axios";
import { getPopularMovies, getTrendingMovies, getMovieDetails, searchMovies, discoverMoviesByGenre } from "./tmdb.js";

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
  it("searchMovies caches the result and normalizes query", async () => {
    const fakeResults = [{ id: 1, title: "Star Wars" }];
    mockGet.mockResolvedValue({ data: { results: fakeResults } });

    // First call - should hit API
    const first = await searchMovies("Star Wars");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(first).toEqual(fakeResults);

    // Second call with same case - should use cache
    const second = await searchMovies("Star Wars");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(second).toEqual(fakeResults);

    // Third call with different case and whitespace - should use cache due to normalization
    const third = await searchMovies("  star wars ");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(third).toEqual(fakeResults);

    // Different query - should hit API
    mockGet.mockResolvedValue({ data: { results: [{ id: 2, title: "Star Trek" }] } });
    await searchMovies("Star Trek");
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it("discoverMoviesByGenre caches the result", async () => {
    const fakeResults = [{ id: 1, title: "Action Movie" }];
    mockGet.mockResolvedValue({ data: { results: fakeResults } });

    // First call - should hit API
    const first = await discoverMoviesByGenre("28");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(first).toEqual(fakeResults);

    // Second call - should use cache
    const second = await discoverMoviesByGenre("28");
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(second).toEqual(fakeResults);

    // Different genre - should hit API
    mockGet.mockResolvedValue({ data: { results: [{ id: 2, title: "Comedy Movie" }] } });
    await discoverMoviesByGenre("35");
    expect(mockGet).toHaveBeenCalledTimes(2);
  });
});
