const { test, expect } = require('@playwright/test');

test.describe('Dashboard E2E', () => {
  const userEmail = 'simba@gmail.com';         // valid user
  const userPassword = 'simbameow';            // valid password
  const expectedChildName = 'simba';           // should already exist

  test.beforeEach(async ({ page }) => {
    // Step 1: Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(userEmail);
    await page.getByLabel('Password').fill(userPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/select-child/);

    // Step 2: Select child
    await page.getByText(expectedChildName, { exact: true }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should render all dashboard menu items', async ({ page }) => {
    const menuItems = [
      'Word Flashcards',
      'Sentence Learning',
      'Story Generation',
      'Word Matching',
      'Sentence Correction',
      'Puzzle'
    ];
    for (const item of menuItems) {
      await expect(page.getByText(item)).toBeVisible();
    }
  });

  test('should navigate to Word Flashcards', async ({ page }) => {
    await page.getByText('Word Flashcards').click();
    await expect(page).toHaveURL(/wordflashcard/);
  });

  test('should navigate to Sentence Learning', async ({ page }) => {
    await page.goto('/dashboard'); // reset route
    await page.getByText('Sentence Learning').click();
    await expect(page).toHaveURL(/sentence-learning/);
  });

  test('should navigate to Story Generation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByText('Story Generation').click();
    await expect(page).toHaveURL(/story-generation/);
  });

  test('should navigate to Word Matching', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByText('Word Matching').click();
    await expect(page).toHaveURL(/word-matching/);
  });

  test('should navigate to Sentence Correction', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByText('Sentence Correction').click();
    await expect(page).toHaveURL(/sentence-evaluation/);
  });

  test('should navigate to Puzzle', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByText('Puzzle').click();
    await expect(page).toHaveURL(/puzzle/);
  });

  test('should logout and redirect to login with message', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('You have been logged out')).toBeVisible();
  });
});
