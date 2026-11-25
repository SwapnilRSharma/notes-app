// @ts-check
import { test, expect } from '@playwright/test'

test('create, list, edit (rename + conflict), and delete notes', async ({ page }) => {
  // Navigate to app
  await page.goto('/')

  // Ensure initial list loads
  await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()

  // Create a note
  await page.getByPlaceholder('Title').fill('alpha')
  await page.locator('textarea[placeholder="Body"]').fill('first body')
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByText('alpha')).toBeVisible()

  // Attempt duplicate title
  await page.getByPlaceholder('Title').fill('alpha')
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.locator('form').first().getByText(/duplicate|exists|required/i)).toBeVisible()

  // Create another distinct note
  await page.getByPlaceholder('Title').fill('beta')
  await page.locator('textarea[placeholder="Body"]').fill('second body')
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByText('beta')).toBeVisible()

  const alphaRow = page.getByText('alpha').first()

  // Edit alpha -> try rename to beta (conflict)
  await alphaRow.locator('xpath=ancestor::li').getByRole('button', { name: 'Edit' }).click()
  const editor = page.getByRole('heading', { name: 'Edit Note' })
  await expect(editor).toBeVisible()
  const titleInput = page.getByPlaceholder('Title').nth(1) // second form's title
  await titleInput.fill('beta')
  await page.getByRole('button', { name: 'Save' }).click()
  const editForm = page.getByRole('heading', { name: 'Edit Note' }).locator('xpath=ancestor::form')
  await expect(editForm.getByText('New title conflicts with existing note')).toBeVisible()

  // Rename to gamma (unique)
  await titleInput.fill('gamma')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('gamma')).toBeVisible()

  // Delete beta via in-app confirmation dialog
  await page.getByText('beta').first().locator('xpath=ancestor::li').getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('heading', { name: 'Delete Note' })).toBeVisible()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('beta')).toHaveCount(0)
})

test('additional behaviors: toggle body, validation, and cancel delete', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(500)

  // Create a distinct note
  await page.getByPlaceholder('Title').fill('delta')
  await page.waitForTimeout(300)
  await page.locator('textarea[placeholder="Body"]').fill('delta body content')
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(800)
  await expect(page.getByText('delta', { exact: true })).toBeVisible()

  // Toggle body visibility
  const deltaRow = page.getByText('delta', { exact: true }).first().locator('xpath=ancestor::li')
  await deltaRow.getByRole('button', { name: 'Toggle body' }).click()
  await page.waitForTimeout(500)
  await expect(deltaRow.getByText('delta body content')).toBeVisible()

  // Try to submit empty title
  await page.getByPlaceholder('Title').fill('')
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(400)
  await expect(page.locator('form').first().getByText(/Title is required/i)).toBeVisible()

  // Cancel delete via dialog Cancel
  await deltaRow.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Cancel' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('delta', { exact: true })).toBeVisible()

  // Cleanup: actually delete via Confirm
  await deltaRow.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Confirm' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('delta', { exact: true })).toHaveCount(0)
})
