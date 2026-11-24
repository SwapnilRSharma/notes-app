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
  await expect(page.getByText('Note created')).toBeVisible()
  await page.waitForTimeout(1000)
  await expect(page.getByText('alpha')).toBeVisible()
  await page.waitForTimeout(1000)

  // Attempt duplicate title
  await page.getByPlaceholder('Title').fill('alpha')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.locator('form').first().getByText(/duplicate|exists|required/i)).toBeVisible()
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
  const editForm = page.getByRole('heading', { name: 'Edit Note' }).locator('xpath=ancestor::form')
  await expect(editForm.getByText('New title conflicts with existing note')).toBeVisible()
  await page.waitForTimeout(1000)

  // Rename to gamma (unique)
  await titleInput.fill('gamma')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('gamma')).toBeVisible()
  await page.waitForTimeout(1000)

  // Delete beta via in-app alert dialog
  await page.getByText('beta').first().locator('xpath=ancestor::li').getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  const confirmDlg = page.getByRole('alertdialog')
  await expect(confirmDlg).toBeVisible()
  await confirmDlg.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('beta')).toHaveCount(0)
  await page.waitForTimeout(1000)
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

  // Cancel delete via in-app alert dialog
  await deltaRow.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(400)
  const cancelDlg = page.getByRole('alertdialog')
  await expect(cancelDlg).toBeVisible()
  await cancelDlg.getByRole('button', { name: 'Cancel' }).click()
  await page.waitForTimeout(400)
  await expect(page.getByText('delta', { exact: true })).toBeVisible()

  // Cleanup: actually delete
  await deltaRow.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(400)
  const finalDlg = page.getByRole('alertdialog')
  await finalDlg.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(600)
  await expect(page.getByText('delta', { exact: true })).toHaveCount(0)
})

// Mobile viewport smoke test to ensure UI remains usable
test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })
  test('core flow on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(800)
    await expect(page.getByRole('heading', { name: 'Notes' })).toBeVisible()
    await page.waitForTimeout(800)
    await page.getByPlaceholder('Title').fill('mobile')
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Add' }).click()
    await page.waitForTimeout(800)
    await expect(page.getByText('Note created')).toBeVisible()
    await page.waitForTimeout(800)
    // Delete via dialog
    const row = page.getByText('mobile').first().locator('xpath=ancestor::li')
    await row.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(800)
    const dlg = page.getByRole('alertdialog')
    await dlg.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(800)
    await expect(page.getByText('mobile')).toHaveCount(0)
  })
})
