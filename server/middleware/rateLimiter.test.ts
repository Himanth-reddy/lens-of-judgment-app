import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import express from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { rateLimit } from 'express-rate-limit';

// Build a minimal app with a tight limiter (max: 2) so we can trigger 429 in tests
const buildApp = () => {
  const app = express();
  const limiter = rateLimit({
    windowMs: 60_000,
    max: 2,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later' },
  });
  app.post('/test', limiter, (_req, res) => {
    res.status(200).json({ ok: true });
  });
  return app;
};

let server: Server;
let baseUrl: string;

describe('Rate Limiter Middleware', () => {
  beforeEach(async () => {
    return new Promise<void>((resolve) => {
      server = buildApp().listen(0, () => {
        const port = (server.address() as AddressInfo).port;
        baseUrl = `http://localhost:${port}/test`;
        resolve();
      });
    });
  });

  afterEach(async () => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should allow requests within the limit', async () => {
    const res1 = await fetch(baseUrl, { method: 'POST' });
    expect(res1.status).toBe(200);

    const res2 = await fetch(baseUrl, { method: 'POST' });
    expect(res2.status).toBe(200);
  });

  it('should return 429 when the rate limit is exceeded', async () => {
    // Exhaust the limit (max: 2)
    await fetch(baseUrl, { method: 'POST' });
    await fetch(baseUrl, { method: 'POST' });

    // Third request should be rate-limited
    const res = await fetch(baseUrl, { method: 'POST' });
    expect(res.status).toBe(429);

    const data = await res.json();
    expect(data.message).toBe('Too many requests, please try again later');
  });
});
