// @ts-check
import { test, expect } from '@playwright/test'

test('mobile navigation Sheet and core flows at narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 })
  await page.goto('/')

  // Header and mobile menu button visible
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()

  // Open the Sheet navigation
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByText('Navigation')).toBeVisible()

  // Close the Sheet with Escape
  await page.keyboard.press('Escape')

  // Core flow: create and delete quickly
  await page.getByPlaceholder('Title').fill('mobile-one')
  await page.locator('textarea[placeholder="Body"]').fill('on phone')
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByText('mobile-one', { exact: true })).toBeVisible()

  const row = page.getByText('mobile-one', { exact: true }).first().locator('xpath=ancestor::li')
  await row.getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('mobile-one', { exact: true })).toHaveCount(0)
})
