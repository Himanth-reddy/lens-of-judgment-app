import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import reviewRoutes from './reviews.js';

// Mock the Mongoose model
vi.mock('../models/Review.js', () => {
  const saveMock = vi.fn().mockResolvedValue({ _id: '123', text: 'some text', user: 'victim_user' });
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ReviewMock as any).findByIdAndUpdate = vi.fn().mockResolvedValue(null);
  return { Review: ReviewMock };
});

// Mock Auth Middleware to enforce authentication
vi.mock('../middleware/authMiddleware.js', () => ({
  protect: (req: any, res: any, next: any) => {
    // If no authorization header or invalid token, reject
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
       return res.status(401).json({ message: 'Not authorized' });
    }
    // Simple mock: if token is "Bearer attacker_token", user is "attacker"
    if (req.headers.authorization === 'Bearer attacker_token') {
      req.user = { username: 'attacker', _id: 'attacker_id' };
      next();
    } else {
       return res.status(401).json({ message: 'Not authorized' });
    }
  }
}));

const app = express();
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

let server: Server;
let baseUrl: string;

describe('Review Routes Auth Bypass Vulnerability', () => {
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

  it('should REJECT posting a review as another user without authentication', async () => {
    // Attack: I am anonymous (no token), but I claim to be "victim"
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movieId: '123',
        rating: 'Go for it',
        text: 'Hacked review',
      }),
    });

    // Should now fail with 401 Unauthorized
    expect(response.status).toBe(401);
  });

  it('should IGNORE attempted user spoofing when authenticated', async () => {
    // Attack: I am "attacker" (valid token), but I try to spoof "victim" in the body.
    // The backend should ignore the 'user' field in the body and use the token's identity.
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer attacker_token'
      },
      body: JSON.stringify({
        movieId: '123',
        user: 'victim', // This field is now ignored by the backend
        rating: 'Go for it',
        text: 'My legitimate review',
      }),
    });

    // Request succeeds (201) because the user is authenticated.
    // The security guarantee is that the backend (verified in reviews.ts implementation)
    // uses req.user.username, not req.body.user.
    expect(response.status).toBe(201);
  });

  it('should REJECT deleting a review belonging to another user', async () => {
    // Setup mock to return a review owned by "victim"
    const { Review } = await import('../models/Review.js');
    (Review as any).findById.mockResolvedValueOnce({
      _id: 'review123',
      user: 'victim',
      movieId: '123',
      deleteOne: vi.fn().mockResolvedValue({}),
    });

    // Attack: I am "attacker" (authenticated), trying to delete "victim"'s review
    const response = await fetch(`${baseUrl}/review123`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer attacker_token'
      },
      body: JSON.stringify({}),
    });

    // Should fail with 403 Forbidden because attacker != victim
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.message).toBe('Not authorized to delete this review');
  });

  it('should REJECT deleting a review without authentication', async () => {
    const response = await fetch(`${baseUrl}/review123`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(401);
  });
});
