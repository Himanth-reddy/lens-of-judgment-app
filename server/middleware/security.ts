import { Request, Response, NextFunction } from "express";

/**
 * Security Headers Middleware
 * Acts as a lightweight replacement for helmet, providing essential HTTP response headers.
 *
 * Configures Content Security Policy (CSP) to allow images from TMDB and Placehold.co,
 * and API connections to TMDB.
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking by disallowing framing
  res.setHeader("X-Frame-Options", "DENY");

  // Enable cross-site scripting (XSS) filter built into most recent web browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for some dev tools/React
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://image.tmdb.org https://placehold.co",
    "connect-src 'self' ws: wss: https://api.themoviedb.org", // ws/wss needed for Vite HMR in dev
  ].join("; ");

  res.setHeader("Content-Security-Policy", csp);

  // Strict Transport Security (HSTS) - enforce HTTPS for 1 year
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  // Hide the X-Powered-By header (Express removes it if app.disable('x-powered-by') is used,
  // but we remove it here explicitly just in case)
  res.removeHeader("X-Powered-By");

  next();
};
