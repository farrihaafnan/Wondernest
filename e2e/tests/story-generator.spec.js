const { test, expect } = require('@playwright/test');

const LOGIN = async (page) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'simba@gmail.com');
  await page.fill('input[name="password"]', 'simbameow');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/select-child/);

  await page.click('text=nemo');
  await expect(page).toHaveURL(/dashboard/);

//   await page.getByRole('link', { name: 'Story Generation' }).click();
//   await expect(page).toHaveURL(/story-generation/);
  await page.getByText('Story Generation').click();
  await expect(page).toHaveURL(/story-generation/);
};

test.describe('Story Generator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await LOGIN(page);
  });


  test('full story generation flow with prompt, image check, download, close, and history verification', async ({ page }) => {
    const uniquePrompt = `Simba and the lost treasure ${Date.now()}`;
    // Fill the prompt and generate
    await page.getByLabel('Enter your story prompt').fill(uniquePrompt);
    await page.getByRole('button', { name: 'Generate' }).click();

    // Wait for story to appear
    const storyContent = page.locator('#story-content');
    await expect(storyContent).toBeVisible({ timeout: 50000 });

    //  Check for 2 images inside the story (you can adjust count based on actual logic)
    const images = storyContent.locator('img');
    await expect(images).toHaveCount(2); // or at least 1 if unsure

    // Download the story as PDF (just click, cannot verify file saved without plugin)
    await page.getByRole('button', { name: 'Download' }).click();

    // Click "Close"
    await page.getByRole('button', { name: 'Close' }).click();

    // Ensure story is hidden
    await expect(storyContent).toBeHidden();

    //  Check that the unique prompt is visible in previous stories list
    const storyListItem = page.getByRole('listitem').filter({ hasText: uniquePrompt });
    await expect(storyListItem).toBeVisible({ timeout: 15000 });
  });

});
