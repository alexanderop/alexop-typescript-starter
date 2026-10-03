import { expect, test } from '@playwright/test'

import { starterShell } from '../support/starter-shell.js'

test('starts the built app and supports the keyboard interaction', async ({ page }) => {
  const runtimeErrors: Error[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error))

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'A clean place to start.' })).toBeVisible()

  const { checkButton } = starterShell((role, options) => page.getByRole(role, options))
  await checkButton.focus()
  await expect(checkButton).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page.getByText('The browser interaction is working.')).toBeVisible()
  expect(runtimeErrors).toEqual([])
})
