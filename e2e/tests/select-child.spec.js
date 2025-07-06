// tests/select-child.spec.js
const { test, expect } = require('@playwright/test');

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'rasin@gmail.com');
  await page.fill('input[name="password"]', 'rasinmeow');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/select-child/);
}

test.describe('SelectChild E2E (Real Login)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display a list of children', async ({ page }) => {
    // Expect known children to show up for logged-in user
    await expect(page.getByText('simba')).toBeVisible();
    await expect(page.getByText('nemo')).toBeVisible(); // Only if this child exists
  });

  test('should select a child and navigate to dashboard', async ({ page }) => {
    await page.click('text=Simba');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome to Your Dashboard')).toBeVisible();
  });

  test('should open and submit Add Kid dialog', async ({ page }) => {
  await page.goto('/select-child');
  // Click the "Add Kid" button to open dialog
  await page.click('button:has-text("Add Kid")');
  // Fill in the form fields
  const uniquename=`kid${Date.now()}`
  await page.getByLabel('Name').fill(uniquename);
  await page.getByLabel('Age').fill('5');
  // Open the gender dropdown (MUI-style)
  await page.getByLabel('Gender').click();
  // Select "Female" from dropdown
  await page.getByRole('option', { name: 'Female' }).click();
  // Fill avatar URL
  await page.getByLabel('Avatar URL').fill('kid.img');
  // Click the "Add" button
  await page.getByRole('button', { name: /^Add$/ }).click(); // Matches exact button text
  // Ensure the dialog is closed
  await expect(page.getByText('Add New Kid')).not.toBeVisible();
});
test('should logout and redirect to login with message', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('You have been logged out')).toBeVisible();
  });

});
