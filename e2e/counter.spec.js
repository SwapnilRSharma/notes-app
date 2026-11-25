// @ts-check
import { test, expect } from '@playwright/test'

test('live counter updates while typing and shows in view/edit', async ({ page }) => {
  await page.goto('/')

  // Initial counter for empty body
  const createCounter = page.getByTestId('body-counter')
  await expect(createCounter).toHaveText('0 words · 0 characters')

  // Type body and see live updates
  await page.locator('textarea[placeholder="Body"]').fill('hi there')
  await expect(createCounter).toHaveText('2 words · 8 characters')

  // Complete creation
  await page.getByPlaceholder('Title').fill('countable')
  await page.getByRole('button', { name: 'Add' }).click()

  // View mode counter when expanded
  const row = page.getByText('countable', { exact: true }).first().locator('xpath=ancestor::li')
  await row.getByRole('button', { name: 'Toggle body' }).click()
  await expect(row.getByTestId('view-body-counter')).toHaveText('2 words · 8 characters')

  // Edit note and see edit counter live
  await row.getByRole('button', { name: 'Edit' }).click()
  const editCounter = page.getByTestId('edit-body-counter')
  await expect(editCounter).toBeVisible()

  const editBody = page.locator('form:has-text("Edit Note") textarea[placeholder="Body"]')
  await editBody.fill('single')
  await expect(editCounter).toHaveText('1 words · 6 characters')
})
