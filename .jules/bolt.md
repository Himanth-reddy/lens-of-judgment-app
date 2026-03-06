## 2025-06-12 - Backend API Call Optimization
**Learning:** `getMovieDetails` in `server/services/tmdb.ts` was hitting the TMDB API synchronously for every requested movie ID, creating an I/O bottleneck.
**Action:** Implementing a simple `Map`-based LRU cache significantly speeds up repeated fetches for the same movie without requiring Redis or extra architectural overhead.

## 2025-03-04 - MongoDB Indexing Optimization
**Learning:** Missing compound indexes for queries that filter and then sort by `createdAt` can cause expensive in-memory sorts and hit the 32MB sort limit.
**Action:** Always add compound indexes like `{ field: 1, createdAt: -1 }` to support frequent queries that require sorting.

## 2025-06-12 - Mongoose Read-Only Optimization
**Learning:** Returning full Mongoose Document instances for read-only API endpoints (like fetching reviews for a profile or community overview) adds significant unnecessary CPU and memory overhead.
**Action:** Always append `.lean()` to Mongoose queries when the resulting documents don't need to be updated or saved. Update mock tests for `find().sort().lean()` to properly mock the method chain.
