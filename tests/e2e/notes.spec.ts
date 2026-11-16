import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const NOTES_PATH = path.resolve(__dirname, '../../notes.json')

test.beforeEach(async () => {
  // Reset persistence
  fs.writeFileSync(NOTES_PATH, '[]', 'utf-8')
})

test('list, create, edit, duplicate error, delete, and persistence', async ({ page }) => {
  // Auto-accept confirm dialogs
  page.on('dialog', d => d.accept())

  await page.goto('/')

  // Empty state
  await expect(page.getByText('No notes yet')).toBeVisible()

  // Create
  await page.getByPlaceholder('Title').fill('First')
  await page.getByPlaceholder('Body').fill('Hello')
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByRole('button', { name: 'Edit First' })).toBeVisible()

  // Persistence across reloads
  await page.reload()
  await expect(page.getByRole('button', { name: 'Edit First' })).toBeVisible()

  // Duplicate error on create
  await page.getByPlaceholder('Title').fill('First')
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByText('already exists')).toBeVisible()

  // Edit (change title and body)
  await page.getByRole('button', { name: 'Edit First' }).click()
  await page.getByTestId('editor-title').fill('Renamed')
  await page.getByTestId('editor-body').fill('Updated')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: 'Edit Renamed' })).toBeVisible()

  // Delete
  const deleteButton = page.getByRole('button', { name: 'Delete Renamed' })
  await deleteButton.click()
  await expect(page.getByText('No notes yet')).toBeVisible()
})
