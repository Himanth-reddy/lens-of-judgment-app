## 2025-02-19 - Tooltip on Absolute Elements
**Learning:** When adding tooltips to absolutely positioned elements (like input icons), always use `asChild` on the `TooltipTrigger`. This prevents the trigger from creating a new wrapper element that would break the CSS positioning context.
**Action:** Use `<TooltipTrigger asChild>` for all icon-only buttons that are part of a composite UI element.
