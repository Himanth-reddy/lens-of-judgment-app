import { describe, it, expect, vi, afterEach } from 'vitest';
import { getJwtSecret, _resetCache } from './auth.js';

describe('getJwtSecret', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    _resetCache();
    vi.restoreAllMocks();
  });

  it('should return JWT_SECRET if set', () => {
    process.env = { ...originalEnv, JWT_SECRET: 'my-secret' };
    expect(getJwtSecret()).toBe('my-secret');
  });

  it('should return default secret and warn if not set in non-production', () => {
    process.env = { ...originalEnv, JWT_SECRET: undefined, NODE_ENV: 'development' };
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(getJwtSecret()).toBe('dev-secret-do-not-use-in-prod');
    expect(consoleSpy).toHaveBeenCalledWith('WARNING: JWT_SECRET not set. Using insecure fallback for development.');
  });

  it('should generate random secret if not set in production', () => {
    process.env = { ...originalEnv, JWT_SECRET: undefined, NODE_ENV: 'production' };
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const secret = getJwtSecret();

    // Check it's a hex string (at least 64 bytes = 128 chars)
    expect(secret).toMatch(/^[0-9a-f]{128,}$/);
    expect(consoleSpy).toHaveBeenCalledWith('WARNING: JWT_SECRET environment variable is not set in production.');
  });

  it('should cache the generated secret in production', () => {
    process.env = { ...originalEnv, JWT_SECRET: undefined, NODE_ENV: 'production' };
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const secret1 = getJwtSecret();
    const secret2 = getJwtSecret();

    expect(secret1).toBe(secret2);
    // Should only warn once (2 calls) for the generation
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });
});
