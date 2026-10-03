import { expect, test } from '@playwright/test'
test('renders the real API health response in the built web app', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status')).toHaveText('API status: ok')
})

test('recovers from a browser API failure by retrying the real API', async ({ page }) => {
  await page.route('**/api/health', (route) => route.abort())
  await page.goto('/')
  await expect(page.getByRole('status')).toHaveText('API unavailable')

  await page.unroute('**/api/health')
  await page.getByRole('button', { name: 'Retry API' }).click()

  await expect(page.getByRole('status')).toHaveText('API status: ok')
})
