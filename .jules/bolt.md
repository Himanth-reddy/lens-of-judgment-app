## 2025-06-12 - Backend API Call Optimization
**Learning:** `getMovieDetails` in `server/services/tmdb.ts` was hitting the TMDB API synchronously for every requested movie ID, creating an I/O bottleneck.
**Action:** Implementing a simple `Map`-based LRU cache significantly speeds up repeated fetches for the same movie without requiring Redis or extra architectural overhead.
