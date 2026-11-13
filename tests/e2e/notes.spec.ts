import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const NOTES_PATH = path.resolve(process.cwd(), 'notes.json')

test.beforeEach(async () => {
  // Reset notes.json to a known empty state before each test
  fs.writeFileSync(NOTES_PATH, '[]', 'utf8')
})

test('list is empty, create, edit, and delete a note', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Initially empty
  await expect(page.getByText('No notes yet.')).toBeVisible()

  // Create
  await page.getByRole('button', { name: 'Add Note' }).click()
  await page.waitForTimeout(1000)
  await page.getByLabel('Title').fill('Test Note')
  await page.waitForTimeout(1000)
  await page.getByLabel('Body').fill('This is the body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)

  await expect(page.getByText('Test Note')).toBeVisible()
  await expect(page.getByText('This is the body')).toBeVisible()

  // Edit
  await page.getByRole('button', { name: 'Edit' }).first().click()
  await page.waitForTimeout(1000)
  await page.getByLabel('Title').fill('Updated Title')
  await page.waitForTimeout(1000)
  await page.getByLabel('Body').fill('Updated Body')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForTimeout(1000)

  await expect(page.getByText('Updated Title')).toBeVisible()
  await expect(page.getByText('Updated Body')).toBeVisible()

  // Delete
  await page.getByRole('button', { name: 'Delete' }).first().click()
  await page.waitForTimeout(1000)

  await expect(page.getByText('No notes yet.')).toBeVisible()
})
