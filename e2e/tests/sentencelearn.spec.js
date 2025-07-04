// import { test, expect } from '@playwright/test';

// const LOGIN_AND_NAVIGATE = async (page) => {
//   await page.goto('/login');
//   await page.fill('input[name="email"]', 'simba@gmail.com');
//   await page.fill('input[name="password"]', 'simbameow');
//   await page.click('button[type="submit"]');
//   await expect(page).toHaveURL(/select-child/);

//   await page.click('text=nemo');
//   await expect(page).toHaveURL(/dashboard/);

//   await page.getByText('Sentence Learning').click();
//   await expect(page).toHaveURL(/sentence-learning/);
// };

// test.describe('Sentence Learning E2E', () => {
//   test('should give positive feedback for correct sentence', async ({ page }) => {
//   await LOGIN_AND_NAVIGATE(page);

//   await page.getByRole('button', { name: 'Generate New Image' }).click();

//   const chip = page.locator('[class*=MuiChip-label]');
//   await expect(chip).toBeVisible({ timeout: 20000 });

//   const description = await chip.textContent();
//   expect(description).toBeTruthy();

//   // await page.getByPlaceholder('Write a sentence about what you see in the image...')
//   //   .fill(`This is ${description}`);
//   const article = /^[aeiou]/i.test(description.trim()) ? 'an' : 'a';
//   await page.getByPlaceholder('Write a sentence about what you see in the image...')
//     .fill(`This is ${article} ${description}`);
//   await page.getByRole('button', { name: 'Submit Sentence' }).click();

//   await expect(page.locator('text=Corrected Sentence:')).toHaveCount(0);
// });


//   test('should show correction for wrong sentence', async ({ page }) => {
//     await LOGIN_AND_NAVIGATE(page);

//     await page.getByRole('button', { name: 'Generate New Image' }).click();

//     const chip = page.locator('[class*=MuiChip-label]');
//     await expect(chip).toBeVisible({ timeout: 20000 });

//     const description = await chip.textContent();
//     expect(description).toBeTruthy();

//     await page.getByPlaceholder('Write a sentence about what you see in the image...')
//       .fill('This is a wrong text');
//     await page.getByRole('button', { name: 'Submit Sentence' }).click();

//     await expect(page.getByText("Let's Learn Together! 📚")).toBeVisible({ timeout: 15000 });
//     await expect(page.getByText(/Corrected Sentence:/)).toBeVisible();
//   });
// });
