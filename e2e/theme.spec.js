// @ts-check
import { test, expect } from '@playwright/test'

test('theme switcher changes styles and persists across reloads', async ({ page }) => {
  // Load app
  await page.goto('/')
  await page.waitForTimeout(1000)

  // The create form uses .card; verify default (blue) theme panel color
  const card = page.locator('.card').first()
  await expect(card).toBeVisible()
  const bgBefore = await card.evaluate(el => getComputedStyle(el).backgroundColor)
  expect(bgBefore).toMatch(/rgb\(15, 31, 61\)/) // #0f1f3d
  await page.waitForTimeout(1000)

  // Change to green theme
  const themeSelect = page.getByLabel('Theme')
  await themeSelect.selectOption('green')
  await page.waitForTimeout(1000)

  const bgGreen = await card.evaluate(el => getComputedStyle(el).backgroundColor)
  expect(bgGreen).toMatch(/rgb\(15, 47, 34\)/) // #0f2f22
  await page.waitForTimeout(1000)

  // Reload should persist selection
  await page.reload()
  await page.waitForTimeout(1000)
  const bgAfterReload = await page.locator('.card').first().evaluate(el => getComputedStyle(el).backgroundColor)
  expect(bgAfterReload).toMatch(/rgb\(15, 47, 34\)/)
  await page.waitForTimeout(1000)

  // Switch to purple for good measure
  await page.getByLabel('Theme').selectOption('purple')
  await page.waitForTimeout(1000)
  const bgPurple = await page.locator('.card').first().evaluate(el => getComputedStyle(el).backgroundColor)
  expect(bgPurple).toMatch(/rgb\(35, 23, 67\)/) // #231743
  await page.waitForTimeout(1000)
})
