// @ts-check
import { test, expect } from '@playwright/test'

test('theme toggle switches and persists', async ({ page }) => {
  // Set a deterministic starting theme before any app code runs
  await page.addInitScript(() => {
    try { localStorage.setItem('theme', 'dark') } catch (_) {}
  })

  await page.goto('/')

  // Assert initial theme is dark
  const themeAttr = await page.locator('html').getAttribute('data-theme')
  expect(themeAttr).toBe('dark')

  // Record a representative computed style that should change across themes
  const card = page.locator('.card').first()
  await expect(card).toBeVisible()
  const darkBg = await card.evaluate((el) => getComputedStyle(el).backgroundColor)

  // Toggle to light
  const toggle = page.locator('button[aria-label="Toggle theme"]').first()
  await toggle.click()
  await page.waitForTimeout(1000)

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  const lightBg = await card.evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(lightBg).not.toBe(darkBg)

  // Reload should persist light theme
  await page.reload()
  await page.waitForTimeout(1000)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const lightBgAfterReload = await card.evaluate((el) => getComputedStyle(el).backgroundColor)
  expect(lightBgAfterReload).toBe(lightBg)
})
