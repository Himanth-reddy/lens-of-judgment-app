import { rateLimit } from "express-rate-limit";

/**
 * Strict rate limiter for authentication routes (login / register).
 * Allows a maximum of 20 requests per 15-minute window per IP to mitigate
 * brute-force and credential-stuffing attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

/**
 * Standard rate limiter for review write operations (create, edit, delete, like).
 * Allows a maximum of 60 requests per 15-minute window per IP.
 */
export const reviewWriteRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});
