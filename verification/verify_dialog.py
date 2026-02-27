
import asyncio
from playwright.async_api import async_playwright

async def verify_dialog():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Mock API responses
        await page.route("**/api/movies/*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"title": "Test Movie", "poster_path": "/path.jpg", "genres": [{"name": "Action"}], "release_date": "2023-01-01"}'
        ))

        await page.route("**/api/reviews/*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            # Ensure the review user matches the mocked logged-in user
            body='[{"_id": "r1", "user": "testuser", "rating": "Perfection", "text": "Great movie", "likes": 0, "createdAt": "2023-01-01"}]'
        ))

        # Mock auth check - this is critical for the delete button to show up
        await page.route("**/api/auth/me", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"username": "testuser", "id": "u1"}'
        ))

        try:
            # We need to set the token in localStorage to trigger the auth state in the app
            await page.goto("http://localhost:8080")
            await page.evaluate("localStorage.setItem('token', 'fake-token')")

            # Now navigate to the movie page
            await page.goto("http://localhost:8080/movie/123")

            # Wait for the delete button to appear (it's the trash icon)
            # The button has aria-label="Delete review"
            delete_btn = page.locator('button[aria-label="Delete review"]')

            # Wait for it to be visible - increase timeout just in case
            await delete_btn.wait_for(timeout=10000)

            # Click the delete button
            await delete_btn.click()

            # Wait for the dialog to appear
            # Radix UI alert dialog usually has role="alertdialog"
            dialog = page.locator('div[role="alertdialog"]')
            await dialog.wait_for()

            # Take a screenshot
            await page.screenshot(path="verification/dialog_screenshot.png")
            print("Screenshot taken: verification/dialog_screenshot.png")

        except Exception as e:
            print(f"Error: {e}")
            await page.screenshot(path="verification/error_screenshot.png")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_dialog())
