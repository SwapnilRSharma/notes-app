// @ts-check
import { test, expect } from '@playwright/test'

test('theme selection and persistence; notes still work under non-default theme', async ({ page }) => {
  // Navigate to app
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Heading visible
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
  await page.waitForTimeout(1000)

  // Default should be blue
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
  await page.waitForTimeout(1000)

  const themeSelect = page.getByLabel('Theme:')

  // Switch to Light and verify colors + attribute
  await themeSelect.selectOption('light')
  await page.waitForTimeout(1000)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const lightBg = await page.locator('form.card').first().evaluate(el => getComputedStyle(el).backgroundColor)
  expect(lightBg).toBe('rgb(255, 255, 255)')
  await page.waitForTimeout(1000)

  // Reload and verify persistence
  await page.reload()
  await page.waitForTimeout(1000)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.waitForTimeout(1000)

  // Switch to Dark and verify
  await themeSelect.selectOption('dark')
  await page.waitForTimeout(1000)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const darkBg = await page.locator('form.card').first().evaluate(el => getComputedStyle(el).backgroundColor)
  expect(darkBg).toBe('rgb(16, 22, 37)')
  await page.waitForTimeout(1000)

  // Create a note under dark theme
  await page.getByPlaceholder('Title').fill('themenote')
  await page.waitForTimeout(1000)
  await page.locator('textarea[placeholder="Body"]').fill('note under dark theme')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('themenote', { exact: true })).toBeVisible()
  await page.waitForTimeout(1000)

  // Reset to Blue to avoid side-effects for other tests
  await themeSelect.selectOption('blue')
  await page.waitForTimeout(1000)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blue')
  await page.waitForTimeout(1000)
})
