## 2025-02-18 - MongoDB ObjectId Length Regression
**Vulnerability:** A security fix for input validation accidentally restricted `movieId` length to 20 chars, which is shorter than standard MongoDB ObjectIds (24 chars), causing a regression.
**Learning:** When validating ID fields, always consider the longest possible valid format (e.g., MongoDB ObjectId is 24, UUID is 36).
**Prevention:** Use a safe upper bound (e.g., 50 chars) for ID fields unless the format is strictly controlled and known.

## 2025-05-22 - Centralized Security Config Pattern
**Vulnerability:** Multiple hardcoded fallbacks for `JWT_SECRET` (`|| "fallback_secret"`) allowed potential token forgery if env var was missing.
**Learning:** Checking env vars at usage site (inside routes/middleware) hides configuration errors until runtime and leads to code duplication.
**Prevention:** Use a centralized config module (e.g., `server/config/auth.ts`) that validates critical secrets at startup.

## 2025-05-22 - Secure Default vs Deployment Stability
**Vulnerability:** A strict "fail-fast" check for missing `JWT_SECRET` caused deployment failures because the environment wasn't configured.
**Learning:** Security controls that block deployment without a fallback can be disruptive.
**Prevention:** Instead of crashing, generate a secure random secret at runtime. This maintains security (no hardcoded secret) but allows the app to start, with the trade-off that sessions are not persisted across restarts.
