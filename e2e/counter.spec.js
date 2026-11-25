// @ts-check
import { test, expect } from '@playwright/test'

test('word/character counter appears and updates live', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1000)

  // Initially, create form body is empty -> 0 words · 0 characters
  await expect(page.getByText('0 words · 0 characters').first()).toBeVisible()
  await page.waitForTimeout(1000)

  // Type into create form body and verify live update
  const createBody = page.locator('textarea[placeholder="Body"]').first()
  await createBody.fill('hello')
  await page.waitForTimeout(1000)
  await expect(page.getByText('1 words · 5 characters').first()).toBeVisible()
  await page.waitForTimeout(1000)

  await createBody.fill('hello world')
  await page.waitForTimeout(1000)
  await expect(page.getByText('2 words · 11 characters').first()).toBeVisible()
  await page.waitForTimeout(1000)

  // Create the note so we can view and edit it
  await page.getByPlaceholder('Title').fill('counter-check')
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: 'Add' }).click()
  await page.waitForTimeout(1000)
  await expect(page.getByText('counter-check')).toBeVisible()
  await page.waitForTimeout(1000)

  // View mode: expand body and verify counter shown
  const row = page.getByText('counter-check').first().locator('xpath=ancestor::li')
  await row.getByRole('button', { name: 'Toggle body' }).click()
  await page.waitForTimeout(1000)
  await expect(row.getByText('2 words · 11 characters')).toBeVisible()
  await page.waitForTimeout(1000)

  // Edit mode: open editor and verify counter updates as we type
  await row.getByRole('button', { name: 'Edit' }).click()
  await page.waitForTimeout(1000)
  const editor = page.getByRole('heading', { name: 'Edit Note' })
  await expect(editor).toBeVisible()
  await page.waitForTimeout(1000)

  const editBody = page.locator('form:has(h3:has-text("Edit Note")) textarea[placeholder="Body"]')
  await expect(editBody).toBeVisible()
  await page.waitForTimeout(1000)

  // Should reflect current value
  await expect(page.getByText('2 words · 11 characters').nth(0)).toBeVisible()
  await page.waitForTimeout(1000)

  // Type more and see it update
  await editBody.fill('hello world again')
  await page.waitForTimeout(1000)
  await expect(page.getByText('3 words · 17 characters').first()).toBeVisible()
  await page.waitForTimeout(1000)
})
