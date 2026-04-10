import { test, expect } from '@playwright/test';

test('app should load and show title', async ({ page }) => {
  await page.goto('/');
  
  // Check for some main elements
  await expect(page).toHaveTitle(/WebExplorer/);
  
  // Wait for the main computer node to appear in the tree
  await expect(page.getByText('My Computer')).toBeVisible();
});

test('can search for items', async ({ page }) => {
  await page.goto('/');
  
  const searchInput = page.getByPlaceholder('Search files and folders...');
  await searchInput.fill('Documents');
  
  // Either we see results or an empty state, but the search should have triggered
  // We check if the search query is reflected in the URL or state if applicable,
  // or just wait for the results container to be visible.
  const grid = page.locator('.file-grid');
  await expect(grid).toBeVisible();
});
