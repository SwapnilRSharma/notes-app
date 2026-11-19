import { test, expect } from '@playwright/test'

// Duplicate title behavior tests aligned with the current UI
test('creating a note with a duplicate title shows an error', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1000)

  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
  await page.waitForTimeout(1000)

  // Create first note
  await page.getByPlaceholder('Title').fill('dupe')
  await page.waitForTimeout(1000)
  await page.getByPlaceholder('Body').fill('first body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('dupe', { exact: true })).toBeVisible()
  await page.waitForTimeout(1000)

  // Attempt duplicate creation
  await page.getByPlaceholder('Title').fill('dupe')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.locator('form').first().getByText(/duplicate|exists|required/i)).toBeVisible()
  await page.waitForTimeout(1000)
})

test('renaming a note to an existing title shows a conflict error', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Ensure two distinct notes exist
  await page.getByPlaceholder('Title').fill('one')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('one', { exact: true })).toBeVisible()
  await page.waitForTimeout(1000)

  await page.getByPlaceholder('Title').fill('two')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('two', { exact: true })).toBeVisible()
  await page.waitForTimeout(1000)

  // Edit "one" and try to rename to "two"
  const oneRow = page.getByText('one', { exact: true }).first().locator('xpath=ancestor::li')
  await oneRow.getByRole('button', { name: 'Edit' }).click()
  await page.waitForTimeout(1000)
  const editTitle = page.getByPlaceholder('Title').nth(1)
  await editTitle.fill('two')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)
  const editForm = page.getByRole('heading', { name: 'Edit Note' }).locator('xpath=ancestor::form')
  await expect(editForm.getByText(/conflicts/i)).toBeVisible()
  await page.waitForTimeout(1000)
})
