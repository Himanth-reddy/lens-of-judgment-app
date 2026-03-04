## 2025-06-12 - Backend API Call Optimization
**Learning:** `getMovieDetails` in `server/services/tmdb.ts` was hitting the TMDB API synchronously for every requested movie ID, creating an I/O bottleneck.
**Action:** Implementing a simple `Map`-based LRU cache significantly speeds up repeated fetches for the same movie without requiring Redis or extra architectural overhead.

## 2025-03-04 - MongoDB Indexing Optimization
**Learning:** Missing compound indexes for queries that filter and then sort by `createdAt` can cause expensive in-memory sorts and hit the 32MB sort limit.
**Action:** Always add compound indexes like `{ field: 1, createdAt: -1 }` to support frequent queries that require sorting.
