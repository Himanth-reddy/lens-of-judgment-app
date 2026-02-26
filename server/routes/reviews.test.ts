import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import reviewRoutes from './reviews.js';

// Mock the Mongoose model
vi.mock('../models/Review.js', () => {
  const saveMock = vi.fn().mockResolvedValue({ _id: '123', text: 'some text' });
  const ReviewMock = vi.fn(() => ({
    save: saveMock,
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ReviewMock as any).find = vi.fn().mockReturnValue({
    sort: vi.fn().mockResolvedValue([]),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ReviewMock as any).findOne = vi.fn().mockResolvedValue(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ReviewMock as any).findById = vi.fn().mockResolvedValue(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ReviewMock as any).findByIdAndDelete = vi.fn().mockResolvedValue(null);
  return { Review: ReviewMock };
});

const app = express();
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

let server: Server;
let baseUrl: string;

describe('Review Routes Security', () => {
  beforeEach(async () => {
    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const port = (server.address() as AddressInfo).port;
        baseUrl = `http://localhost:${port}/api/reviews`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should reject reviews with text longer than 1000 characters', async () => {
    const longText = 'a'.repeat(1001);
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: '123',
        user: 'testuser',
        rating: 'Go for it',
        text: longText,
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Review text exceeds 1000 characters');
  });

  it('should reject user names longer than 50 characters', async () => {
    const longUser = 'u'.repeat(51);
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: '123',
        user: longUser,
        rating: 'Go for it',
        text: 'Valid text',
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('User name exceeds 50 characters');
  });

  it('should allow movie IDs up to 50 characters', async () => {
    const longId = 'a'.repeat(50);
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: longId,
        user: 'validuser',
        rating: 'Go for it',
        text: 'Valid text',
      }),
    });

    expect(response.status).toBe(201);
  });

  it('should reject movie IDs longer than 50 characters', async () => {
    const longId = 'a'.repeat(51);
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: longId,
        user: 'validuser',
        rating: 'Go for it',
        text: 'Valid text',
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Movie ID exceeds 50 characters');
  });

  it('should reject non-string inputs', async () => {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: '123',
        user: 'validuser',
        rating: 'Go for it',
        text: 12345, // Invalid type
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Invalid input types');
  });

  it('should allow valid reviews', async () => {
     const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: '123',
        user: 'validuser',
        rating: 'Go for it',
        text: 'Valid text',
      }),
    });

    expect(response.status).toBe(201);
  });

  it('should reject duplicate reviews from the same user for the same movie', async () => {
    const { Review } = await import('../models/Review.js');
    // Mock findOne to return an existing review
    (Review as any).findOne.mockResolvedValueOnce({ _id: 'existing', movieId: '123', user: 'testuser' });

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: '123',
        user: 'testuser',
        rating: 'Go for it',
        text: 'Duplicate review',
      }),
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.message).toBe('You have already reviewed this movie');
  });

  it('should return 404 when deleting a non-existent review', async () => {
    const response = await fetch(`${baseUrl}/nonexistent123`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'testuser' }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.message).toBe('Review not found');
  });

  it('should reject delete without user', async () => {
    const response = await fetch(`${baseUrl}/review123`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('User is required');
  });

  it('should reject delete by non-owner', async () => {
    const { Review } = await import('../models/Review.js');
    (Review as any).findById.mockResolvedValueOnce({ _id: 'review123', user: 'originaluser', movieId: '123' });

    const response = await fetch(`${baseUrl}/review123`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'differentuser' }),
    });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.message).toBe('Not authorized to delete this review');
  });
});
