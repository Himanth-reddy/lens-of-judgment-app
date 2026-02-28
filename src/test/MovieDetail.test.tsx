import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, type Mock } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import MovieDetail from "../pages/MovieDetail";
import api from "../lib/api";

// Mock dependencies
vi.mock("../lib/api");
vi.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("../components/RatingMeter", () => ({
  default: () => <div data-testid="rating-meter">RatingMeter</div>,
}));
vi.mock("../components/ReviewForm", () => ({
  default: () => <div data-testid="review-form">ReviewForm</div>,
}));

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { username: "TestUser" },
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    signOut: vi.fn(),
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("MovieDetail", () => {
  const mockMovie = {
    title: "Test Movie",
    poster_path: "/test.jpg",
    genres: [{ name: "Action" }],
    release_date: "2023-01-01",
  };

  const mockReviews = [
    { user: "User1", rating: "Perfection", text: "Great movie", likes: 10 },
  ];

  it("renders loading state initially", async () => {
    // Mock API to return a promise that never resolves for this test
    (api.get as Mock).mockImplementation(() => new Promise(() => {}));

    render(
      <TooltipProvider>
        <MemoryRouter initialEntries={["/movies/1"]}>
          <Routes>
            <Route path="/movies/:id" element={<MovieDetail />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    );

    // Initial state check: "Loading..." should NOT be present anymore
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();

    // Header should be present
    expect(screen.getByTestId("header")).toBeInTheDocument();

    // Movie title should not be present yet
    expect(screen.queryByText("Test Movie")).not.toBeInTheDocument();
  });

  it("renders accessible elements after loading", async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock successful API responses
    (api.get as Mock).mockImplementation((url: string) => {
      if (url.includes("/movies/")) {
        return Promise.resolve({ data: mockMovie });
      }
      if (url.includes("/reviews/")) {
        return Promise.resolve({ data: mockReviews });
      }
      return Promise.reject(new Error("Not found"));
    });

    render(
      <TooltipProvider>
        <MemoryRouter initialEntries={["/movies/1"]}>
          <Routes>
            <Route path="/movies/:id" element={<MovieDetail />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    );

    // Wait for content to load
    await waitFor(() => expect(screen.getByText("Test Movie")).toBeInTheDocument());

    // Verify accessible elements
    // Share button
    const shareButton = screen.getByRole("button", { name: /share this movie/i });
    expect(shareButton).toBeInTheDocument();

    // Sort dropdown
    const sortDropdown = screen.getByRole("combobox", { name: /sort reviews by/i });
    expect(sortDropdown).toBeInTheDocument();

    // Back link
    const backLink = screen.getByRole("link", { name: /go back/i });
    expect(backLink).toBeInTheDocument();
  });

  it("requires confirmation before deleting a review", async () => {
    // Reset mocks
    vi.clearAllMocks();

    const mockReviewsWithId = [
      { _id: "review1", user: "TestUser", rating: "Perfection", text: "Great movie", likes: 10 },
    ];

    // Mock successful API responses
    (api.get as Mock).mockImplementation((url: string) => {
      if (url.includes("/movies/")) {
        return Promise.resolve({ data: mockMovie });
      }
      if (url.includes("/reviews/")) {
        return Promise.resolve({ data: mockReviewsWithId });
      }
      return Promise.reject(new Error("Not found"));
    });

    // Mock delete API
    (api.delete as Mock).mockResolvedValue({ data: {} });

    render(
      <TooltipProvider>
        <MemoryRouter initialEntries={["/movie/1"]}>
          <Routes>
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </MemoryRouter>
      </TooltipProvider>
    );

    // Wait for content to load
    await waitFor(() => expect(screen.getByText("Great movie")).toBeInTheDocument());

    // Find and click the delete button (trash icon)
    const deleteButton = screen.getByRole("button", { name: /delete review/i });
    await userEvent.click(deleteButton);

    // Verify confirmation dialog appears
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument();

    // Click cancel first
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Verify dialog closed and API was NOT called
    await waitFor(() => expect(screen.queryByText("Are you absolutely sure?")).not.toBeInTheDocument());
    expect(api.delete).not.toHaveBeenCalled();

    // Click delete again
    await userEvent.click(deleteButton);

    // Click confirm delete
    const confirmButton = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(confirmButton);

    // Verify API was called
    expect(api.delete).toHaveBeenCalledWith("/reviews/review1", { data: { user: "TestUser" } });
  });
});
