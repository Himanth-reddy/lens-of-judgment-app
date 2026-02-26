export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL: JWT_SECRET environment variable is not set in production.");
    }
    console.warn("WARNING: JWT_SECRET not set. Using insecure fallback for development.");
    return "dev-secret-do-not-use-in-prod";
  }
  return secret;
};
