from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API responses
    def handle_login(route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"token": "fake-token", "username": "TestUser", "email": "test@example.com", "_id": "123"}'
        )

    def handle_me(route):
        # Respond with user info if token is present (we assume client sends token)
        # But for mock, we just return user always or check headers if needed.
        # Simple mock:
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"username": "TestUser", "email": "test@example.com", "_id": "123"}'
        )

    page.route("**/api/auth/login", handle_login)
    page.route("**/api/auth/me", handle_me)

    try:
        # Go to auth page
        print("Navigating to auth page...")
        page.goto("http://localhost:8080/auth")

        # Wait for form
        page.wait_for_selector("form")

        # Fill login form
        print("Filling login form...")
        page.fill("input[id='email']", "test@example.com")
        page.fill("input[id='password']", "password123")

        # Take screenshot before submitting
        page.screenshot(path="verification/auth_page_filled.png")

        # Submit
        print("Submitting form...")
        # Find submit button within the form
        page.click("button[type='submit']")

        # Wait for navigation or success toast
        # We expect redirection to /
        print("Waiting for navigation...")
        page.wait_for_url("http://localhost:8080/", timeout=10000)

        # Check if header shows user avatar (link to /profile)
        # In Header.tsx: <Link to={user ? "/profile" : "/auth"} ...>
        # Check if link to /profile exists
        expect(page.locator("a[href='/profile']")).to_be_visible(timeout=5000)

        print("Authenticated successfully!")

        # Take screenshot of home page
        page.screenshot(path="verification/home_authenticated.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
