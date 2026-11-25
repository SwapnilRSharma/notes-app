// @ts-check
import { test, expect } from '@playwright/test'

test('live counter updates while typing and shows in view/edit', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Initial counter for empty body
  const createCounter = page.getByTestId('body-counter')
  await expect(createCounter).toHaveText('0 words · 0 characters')
  await page.waitForTimeout(1000)

  // Type body and see live updates
  await page.locator('textarea[placeholder="Body"]').fill('hi there')
  await page.waitForTimeout(1000)
  await expect(createCounter).toHaveText('2 words · 8 characters')
  await page.waitForTimeout(1000)

  // Complete creation
  await page.getByPlaceholder('Title').fill('countable')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)

  // View mode counter when expanded
  const row = page.getByText('countable', { exact: true }).first().locator('xpath=ancestor::li')
  await row.getByRole('button', { name: 'Toggle body' }).click()
  await page.waitForTimeout(1000)
  await expect(row.getByTestId('view-body-counter')).toHaveText('2 words · 8 characters')
  await page.waitForTimeout(1000)

  // Edit note and see edit counter live
  await row.getByRole('button', { name: 'Edit' }).click()
  await page.waitForTimeout(1000)
  const editCounter = page.getByTestId('edit-body-counter')
  await expect(editCounter).toBeVisible()
  await page.waitForTimeout(1000)

  const editBody = page.locator('form:has-text("Edit Note") textarea[placeholder="Body"]')
  await editBody.fill('single')
  await page.waitForTimeout(1000)
  await expect(editCounter).toHaveText('1 words · 6 characters')
  await page.waitForTimeout(1000)
})
