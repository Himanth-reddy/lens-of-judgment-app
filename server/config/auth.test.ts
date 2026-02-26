import { describe, it, expect, vi, afterEach } from 'vitest';
import { getJwtSecret } from './auth.js';

describe('getJwtSecret', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
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

  it('should throw error if not set in production', () => {
    process.env = { ...originalEnv, JWT_SECRET: undefined, NODE_ENV: 'production' };

    expect(() => getJwtSecret()).toThrow('CRITICAL: JWT_SECRET environment variable is not set in production.');
  });
});
