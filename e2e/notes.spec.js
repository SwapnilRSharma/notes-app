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

  // Delete beta with confirm: dialog on desktop, sheet on mobile
  const vp1 = page.viewportSize()
  const betaRow = page.getByText('beta').first().locator('xpath=ancestor::li')
  if (vp1 && vp1.width < 768) {
    await betaRow.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Delete' }).click()
  } else {
    page.once('dialog', d => d.accept())
    await betaRow.getByRole('button', { name: 'Delete' }).click()
  }
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

  // Cancel delete: dialog on desktop, sheet on mobile
  const vp2 = page.viewportSize()
  if (vp2 && vp2.width < 768) {
    await deltaRow.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: 'Cancel' }).click()
    await page.waitForTimeout(400)
    await expect(page.getByText('delta', { exact: true })).toBeVisible()
    // Cleanup
    await deltaRow.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(600)
    await expect(page.getByText('delta', { exact: true })).toHaveCount(0)
  } else {
    page.once('dialog', d => d.dismiss())
    await deltaRow.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(400)
    await expect(page.getByText('delta', { exact: true })).toBeVisible()
    // Cleanup: actually delete
    page.once('dialog', d => d.accept())
    await deltaRow.getByRole('button', { name: 'Delete' }).click()
    await page.waitForTimeout(600)
    await expect(page.getByText('delta', { exact: true })).toHaveCount(0)
  }
})

test('mobile: edit in sheet and delete via sheet confirm', async ({ page }) => {
  const vp = page.viewportSize()
  if (!vp || vp.width >= 768) test.skip()

  await page.goto('/');
  await page.waitForTimeout(1000)

  // Create a note to edit/delete
  await page.getByPlaceholder('Title').fill('mobile-one')
  await page.waitForTimeout(1000)
  await page.locator('textarea[placeholder="Body"]').fill('m-body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('mobile-one')).toBeVisible()
  await page.waitForTimeout(1000)

  // Open editor (on mobile this renders in a Sheet)
  const row = page.getByText('mobile-one').first().locator('xpath=ancestor::li')
  await row.getByRole('button', { name: 'Edit' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText(/Edit:\s*mobile-one/)).toBeVisible()
  await page.waitForTimeout(1000)

  // Save without changes
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)

  // Delete using sheet confirm
  await row.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText(/Delete\s+"mobile-one"\?/)).toBeVisible()
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('mobile-one')).toHaveCount(0)
  await page.waitForTimeout(1000)
})
