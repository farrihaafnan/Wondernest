const { test, expect } = require('@playwright/test');

test.describe('Register E2E', () => {
  test('should register successfully with valid credentials', async ({ page }) => {
    await page.goto('/register');
    const uniqueEmail = `user${Date.now()}@example.com`;
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');
    // If your form has a confirm password field, fill it as well:
    const confirmPassword = await page.$('input[name="confirmPassword"]');
    if (confirmPassword) {
      await page.fill('input[name="confirmPassword"]', 'password123');
    }
    await page.click('button[type="submit"]');
    // Expect to be redirected to dashboard or see a dashboard element
    await expect(page).toHaveURL(/login/);
  });

  test('should show error with already registered email', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="email"]', 'simba@gmail.com');
    await page.fill('input[name="password"]', 'password123');
    const confirmPassword = await page.$('input[name="confirmPassword"]');
    if (confirmPassword) {
      await page.fill('input[name="confirmPassword"]', 'password123');
    }
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration failed. Please try again.')).toBeVisible();
  });

  test('should show error with invalid email', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    const confirmPassword = await page.$('input[name="confirmPassword"]');
    if (confirmPassword) {
      await page.fill('input[name="confirmPassword"]', 'password123');
    }
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration failed. Please try again.')).toBeVisible();
  });

  test('should show error with short password', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="email"]', `shortpass${Date.now()}@example.com`);
    await page.fill('input[name="password"]', '123');
    const confirmPassword = await page.$('input[name="confirmPassword"]');
    if (confirmPassword) {
      await page.fill('input[name="confirmPassword"]', '123');
    }
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration failed. Please try again.')).toBeVisible();
  });
}); 