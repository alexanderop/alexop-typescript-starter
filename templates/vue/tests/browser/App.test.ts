import { afterEach, expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { cleanup, render } from 'vitest-browser-vue'

import App from '../../src/App.vue'
import '../../src/styles.css'
import { starterShell } from '../support/starter-shell.js'

afterEach(cleanup)

test('reports the browser check through the accessible control', async () => {
  await render(App)

  const { checkButton } = starterShell((role, options) => page.getByRole(role, options))
  await expect.element(checkButton).toHaveAttribute('aria-pressed', 'false')

  await checkButton.click()

  await expect.element(page.getByText('The browser interaction is working.')).toBeVisible()
  await expect
    .element(page.getByRole('button', { name: 'Reset browser check' }))
    .toHaveAttribute('aria-pressed', 'true')
})
