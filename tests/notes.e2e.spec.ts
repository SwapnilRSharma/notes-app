import { test, expect } from '@playwright/test'

test('create, edit, and delete a note', async ({ page }) => {
  const unique = `E2E-${Date.now()}`
  const edited = `${unique}-edited`

  await page.goto('/')
  await page.waitForTimeout(1000)

  // Create
  await page.getByPlaceholder('Title').fill(unique)
  await page.waitForTimeout(1000)
  await page.getByPlaceholder('Body').fill('This is an E2E note body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Create Note' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText(unique)).toBeVisible()
  await page.waitForTimeout(1000)

  // Edit
  const item = page.getByRole('listitem').filter({ hasText: unique })
  await item.getByRole('button', { name: 'Edit' }).click()
  await page.waitForTimeout(1000)
  await expect(page.locator('#edit-title')).toBeVisible()
  await page.waitForTimeout(1000)
  const titleInput = page.locator('#edit-title')
  await titleInput.fill(edited)
  await page.waitForTimeout(1000)
  const bodyArea = page.locator('#edit-body')
  await bodyArea.fill('Updated body')
  await page.waitForTimeout(1000)
  await page.locator('#edit-form').getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText(edited)).toBeVisible()
  await page.waitForTimeout(1000)

  // Delete
  const editedItem = page.getByRole('listitem').filter({ hasText: edited })
  page.once('dialog', d => d.accept())
  await editedItem.getByRole('button', { name: 'Delete' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText(edited)).toHaveCount(0)
  await page.waitForTimeout(1000)
})
