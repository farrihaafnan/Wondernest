// const { test, expect } = require('@playwright/test');

// test('Word Flashcard E2E - A-E range', async ({ page }) => {
//   // Step 1: Login
//   await page.goto('/login');
//   await page.getByLabel('Email').fill('simba@gmail.com');
//   await page.getByLabel('Password').fill('simbameow');
//   await page.click('button[type="submit"]');
//   await expect(page).toHaveURL(/select-child/);

//   // Step 2: Select child
//   await page.getByText('simba').click();
//   await expect(page).toHaveURL(/dashboard/);

//   // Step 3: Navigate to Word Flashcard
//   await page.getByRole('button', { name: 'Word Flashcards' }).click();
//   await expect(page).toHaveURL(/wordflashcard/);

//   const selectTrigger = page.locator('.MuiSelect-select'); // or use .getByText('A-E') if visible
//   await selectTrigger.click();
//   await page.getByRole('option', { name: 'A-E' }).click();

//   // Step 5: Click "Start"
//   await page.getByRole('button', { name: 'Start' }).click();

//   const letters = ['A', 'B', 'C'];

//   for (let i = 0; i < letters.length; i++) {
//     const letter = letters[i];

//     // Wait for card to load
//     await expect(page.locator('img')).toBeVisible({ timeout: 40000 });

//     // Check word text is shown and starts with correct letter
//     const wordText = await page.locator('h6').textContent();
//     expect(wordText?.[0].toUpperCase()).toBe(letter);

//     if (i < letters.length - 1) {
//       await page.getByRole('button', { name: 'Next' }).click();
//     }
//   }
// });
