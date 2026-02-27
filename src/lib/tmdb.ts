export type TMDBImageSize = "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original";

/**
 * Constructs a TMDB image URL with the specified size.
 * Uses w342 by default as a balance between quality and performance for grids.
 */
export function getTMDBImage(path: string | null | undefined, size: TMDBImageSize = "w342"): string {
  if (!path) {
    return "https://placehold.co/200x300?text=No+Image";
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
