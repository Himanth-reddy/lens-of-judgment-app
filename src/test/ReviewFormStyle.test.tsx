import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewForm from "../components/ReviewForm";
import React from "react";
import { describe, it, expect, vi } from "vitest";

describe("ReviewForm styling", () => {
  it("should have correct focus classes on textarea", async () => {
    const mockSubmit = vi.fn();
    render(<ReviewForm onSubmit={mockSubmit} username="test" />);

    const textarea = screen.getByLabelText("Write your review");

    expect(textarea.className).toContain("focus:outline-none");
    expect(textarea.className).toContain("focus:border-primary");
    expect(textarea.className).toContain("transition-colors");
  });
});
