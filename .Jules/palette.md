## 2026-03-12 - Review Form Loading State
**Learning:** Forms that submit data asynchronously without a loading state or a mechanism to clear their contents upon success often lead to user confusion and duplicate submissions, especially if the API response takes a noticeable amount of time.
**Action:** When implementing asynchronous forms, ensure buttons have a clear disabled/loading state during submission, and design the form to explicitly reset its data when the parent component signals a successful submission.
