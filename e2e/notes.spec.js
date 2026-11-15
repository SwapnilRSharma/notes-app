// @ts-check
import { test, expect } from '@playwright/test'

test('create, list, edit (rename + conflict), and delete notes', async ({ page }) => {
  // Navigate to app
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Ensure initial list loads
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
  await page.waitForTimeout(1000)

  // Create a note
  await page.getByPlaceholder('Title').fill('alpha')
  await page.waitForTimeout(1000)
  await page.locator('textarea[placeholder="Body"]').fill('first body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('alpha')).toBeVisible()
  await page.waitForTimeout(1000)

  // Attempt duplicate title
  await page.getByPlaceholder('Title').fill('alpha')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText(/duplicate|exists|required/i)).toBeVisible()
  await page.waitForTimeout(1000)

  // Create another distinct note
  await page.getByPlaceholder('Title').fill('beta')
  await page.waitForTimeout(1000)
  await page.locator('textarea[placeholder="Body"]').fill('second body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('beta')).toBeVisible()
  await page.waitForTimeout(1000)

  const alphaRow = page.getByText('alpha').first()

  // Edit alpha -> try rename to beta (conflict)
  await alphaRow.locator('xpath=ancestor::li').getByRole('button', { name: 'Edit' }).click()
  await page.waitForTimeout(1000)
  const editor = page.getByRole('heading', { name: 'Edit Note' })
  await expect(editor).toBeVisible()
  await page.waitForTimeout(1000)
  const titleInput = page.getByPlaceholder('Title').nth(1) // second form's title
  await titleInput.fill('beta')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('New title conflicts with existing note')).toBeVisible()
  await page.waitForTimeout(1000)

  // Rename to gamma (unique)
  await titleInput.fill('gamma')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('gamma')).toBeVisible()
  await page.waitForTimeout(1000)

  // Delete beta with confirm dialog
  page.once('dialog', d => d.accept())
  await page.getByText('beta').first().locator('xpath=ancestor::li').getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('beta')).toHaveCount(0)
  await page.waitForTimeout(1000)
})
