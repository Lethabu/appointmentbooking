import { test, expect } from '@playwright/test';

const STAGING_URL = process.env.STAGING_URL || 'https://staging.appointmentbooking.co.za/instyle';

test('customer can create booking', async ({ page }) => {
  await page.goto(STAGING_URL);
  await page.click('text=Book Now');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="phone"]', '+27123456789');
  await page.click('button:has-text("Confirm")');
  await expect(page.locator('text=Booking confirmed')).toBeVisible({ timeout: 5000 });
});