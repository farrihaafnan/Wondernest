const { test, expect } = require('@playwright/test');

test.describe('Login E2E', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'simba@gmail.com');
    await page.fill('input[name="password"]', 'simbameow');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/select-child/);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });
}); 