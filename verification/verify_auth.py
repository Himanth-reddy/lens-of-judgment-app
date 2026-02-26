from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to Auth Page
            print("Navigating to http://localhost:8080/auth")
            page.goto("http://localhost:8080/auth")

            # Wait for password input
            print("Waiting for password input")
            page.wait_for_selector('input[type="password"]')

            # Find the password toggle button by aria-label
            print("Finding toggle button")
            toggle_btn = page.get_by_role("button", name="Show password")
            expect(toggle_btn).to_be_visible()

            # Hover to see tooltip
            print("Hovering to see tooltip")
            toggle_btn.hover()
            page.wait_for_timeout(1000) # wait for tooltip animation

            # Check tooltip content (optional, but good)
            # tooltip = page.locator('[role="tooltip"]')
            # if tooltip.is_visible():
            #     print("Tooltip visible")

            # Take screenshot of hover state
            os.makedirs("verification", exist_ok=True)
            page.screenshot(path="verification/auth_password_tooltip.png")
            print("Screenshot saved to verification/auth_password_tooltip.png")

            # Click to show password
            print("Clicking toggle button")
            toggle_btn.click()

            # Verify aria-label changes
            print("Verifying aria-label change")
            toggle_btn_hidden = page.get_by_role("button", name="Hide password")
            expect(toggle_btn_hidden).to_be_visible()

            # Verify input type changes
            print("Verifying input type change")
            password_input = page.locator('input#password')
            expect(password_input).to_have_attribute("type", "text")

            print("Verification successful!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
