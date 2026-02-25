import os
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    port = os.environ.get("PORT", "8080")
    base_url = f"http://localhost:{port}"

    # Mock API response
    page.route("**/api/movies/popular", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[{"id": 1, "title": "Mock Movie 1", "poster_path": "/mock.jpg"}, {"id": 2, "title": "Mock Movie 2", "poster_path": "/mock2.jpg"}]'
    ))

    # Mock image loading to avoid errors
    page.route("**/*.jpg", lambda route: route.fulfill(
        status=200,
        content_type="image/jpeg",
        body=b""
    ))

    try:
        page.goto(base_url)
        page.wait_for_selector("text=Mock Movie 1", timeout=10000)
        page.screenshot(path="verification/index.png")
        print("Verification successful")
    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
