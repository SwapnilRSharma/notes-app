import { test, expect } from '@playwright/test'

test('create, edit, and delete a note', async ({ page }) => {
  const unique = `E2E-${Date.now()}`
  const edited = `${unique}-edited`

  await page.goto('/')
  await expect(page.getByPlaceholder('Title')).toBeVisible()

  // Create
  await page.getByPlaceholder('Title').fill(unique)
  await page.getByPlaceholder('Body').fill('This is an E2E note body')
  await page.getByRole('button', { name: 'Create Note' }).click()
  await expect(page.getByRole('listitem').filter({ hasText: unique })).toBeVisible()

  // Edit
  const item = page.getByRole('listitem').filter({ hasText: unique })
  await item.getByRole('button', { name: 'Edit' }).click()
  await expect(page.locator('#edit-form')).toBeVisible()
  await expect(page.locator('#edit-title')).toBeVisible()
  const titleInput = page.locator('#edit-title')
  await titleInput.fill(edited)
  const bodyArea = page.locator('#edit-body')
  await bodyArea.fill('Updated body')
  await page.locator('#edit-form').getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('listitem').filter({ hasText: edited })).toBeVisible()

  // Delete
  const editedItem = page.getByRole('listitem').filter({ hasText: edited })
  page.once('dialog', d => d.accept())
  await editedItem.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByRole('listitem').filter({ hasText: edited })).toHaveCount(0)
})
