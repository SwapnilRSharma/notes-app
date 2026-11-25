// @ts-check
import { test, expect } from '@playwright/test'

test('mobile navigation Sheet and core flows at narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 })
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Header and mobile menu button visible
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
  await page.waitForTimeout(1000)

  // Open the Sheet navigation
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('Navigation')).toBeVisible()
  await page.waitForTimeout(1000)

  // Close the Sheet with Escape
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1000)

  // Core flow: create and delete quickly
  await page.getByPlaceholder('Title').fill('mobile-one')
  await page.waitForTimeout(1000)
  await page.locator('textarea[placeholder="Body"]').fill('on phone')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('mobile-one', { exact: true })).toBeVisible()
  await page.waitForTimeout(1000)

  const row = page.getByText('mobile-one', { exact: true }).first().locator('xpath=ancestor::li')
  await row.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Confirm' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('mobile-one', { exact: true })).toHaveCount(0)
})
