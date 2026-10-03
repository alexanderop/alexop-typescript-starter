type RoleQuery<Locator> = (role: 'button', options: { readonly name: string }) => Locator

export function starterShell<Locator>(getByRole: RoleQuery<Locator>) {
  return {
    checkButton: getByRole('button', { name: 'Check browser setup' }),
  }
}
