## 2025-02-18 - Skeletons vs Text Loaders
**Learning:** Replacing jarring "Loading..." text with `Skeleton` loaders significantly improves perceived performance and reduces visual jumpiness (layout shift) during data fetching.
**Action:** Prefer `Skeleton` components for main content areas over text loaders.

## 2025-02-18 - Icon-Only Accessibility
**Learning:** Icon-only buttons (like Share) are a common accessibility gap. They require explicit `aria-label` and preferably a `Tooltip` for clarity.
**Action:** Audit all icon-only buttons and ensure they have accessible names and tooltips.
