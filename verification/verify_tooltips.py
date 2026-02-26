import time
from playwright.sync_api import sync_playwright

def verify_tooltips():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # Navigate to the home page
            # Wait for the server to be ready
            time.sleep(5)
            page.goto("http://localhost:8080")

            # Wait for the header to be visible
            page.wait_for_selector("header")

            # Hover over the Search icon to trigger the tooltip
            # The search icon is inside a link with href="/search"
            search_link = page.locator("a[href='/search']")
            search_link.hover()

            # Wait a bit for the tooltip to appear
            time.sleep(1)

            # Take a screenshot
            page.screenshot(path="verification/tooltip_search.png")
            print("Screenshot taken: verification/tooltip_search.png")

            # Verify tooltip content
            # Tooltips usually appear in a portal, often with role="tooltip" or just text content
            tooltip_content = page.get_by_text("Search")
            if tooltip_content.is_visible():
                print("Search tooltip is visible")
            else:
                print("Search tooltip NOT visible")

            # Hover over the Notifications icon
            notifications_link = page.locator("a[href='/notifications']")
            notifications_link.hover()
            time.sleep(1)
            page.screenshot(path="verification/tooltip_notifications.png")
            print("Screenshot taken: verification/tooltip_notifications.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_tooltips()
