import { test, expect } from '@playwright/test'
import fs from 'fs'

test.beforeEach(async () => {
  // Reset notes state deterministically
  fs.writeFileSync('notes.json', '[]')
})

test('list, create, edit, delete notes', async ({ page }) => {
  await page.goto('/')

  // Initial empty state
  await expect(page.getByTestId('empty')).toHaveText('No notes yet')

  // Create a note
  await page.getByPlaceholder('Title').fill('First')
  await page.getByPlaceholder('Body').fill('Body 1')
  await page.getByRole('button', { name: 'Add' }).click()

  // Appears in list
  await expect(page.getByText('First')).toBeVisible()
  await expect(page.getByText('Body 1')).toBeVisible()

  // Edit the note
  await page.getByRole('button', { name: 'edit-First' }).click()
  const editTitle = page.locator('form').last().getByPlaceholder('Title')
  const editBody = page.locator('form').last().getByPlaceholder('Body')
  await editTitle.fill('First Edited')
  await editBody.fill('Body 1 edited')
  await page.locator('form').last().getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText('First Edited')).toBeVisible()
  await expect(page.getByText('Body 1 edited')).toBeVisible()

  // Delete the note
  await page.getByRole('button', { name: 'delete-First Edited' }).click()
  await expect(page.getByTestId('empty')).toHaveText('No notes yet')
})
