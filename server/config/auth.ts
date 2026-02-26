import crypto from "crypto";

let generatedSecret: string | null = null;

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return secret;
  }

  if (generatedSecret) {
    return generatedSecret;
  }

  if (process.env.NODE_ENV === "production") {
    console.warn("WARNING: JWT_SECRET environment variable is not set in production.");
    console.warn("Generating a temporary secret. All sessions will be invalidated on server restart.");
    generatedSecret = crypto.randomBytes(64).toString("hex");
    return generatedSecret;
  }

  console.warn("WARNING: JWT_SECRET not set. Using insecure fallback for development.");
  return "dev-secret-do-not-use-in-prod";
};

// Export for testing only
export const _resetCache = () => {
  generatedSecret = null;
};
