import path from 'node:path'
function staticString(node) {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0)
    return node.quasis[0]?.value.cooked
  return undefined
}
function resolvedPath(filename, value) {
  if (!value.startsWith('.')) return value
  return path.resolve(path.dirname(filename), value).split(path.sep).join('/')
}
export const workspaceImports = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      api: 'The web app cannot import the API application.',
      contract: 'Contracts cannot import runtime or framework packages.',
      dynamic: 'Use a static import path so workspace boundaries can be checked.',
    },
  },
  create(context) {
    const filename = context.filename.split(path.sep).join('/')
    function check(node, requireStatic = false) {
      const value = staticString(node)
      if (value === undefined) {
        if (requireStatic) context.report({ node, messageId: 'dynamic' })
        return
      }
      const resolved = resolvedPath(filename, value)
      if (
        filename.includes('/apps/web/') &&
        (resolved === '@workspace/api' ||
          resolved.startsWith('@workspace/api/') ||
          resolved.includes('/apps/api'))
      )
        context.report({ node, messageId: 'api' })
      if (
        filename.includes('/packages/contracts/') &&
        ((!value.startsWith('.') && !value.startsWith('/')) ||
          resolved.includes('/apps/') ||
          !resolved.includes('/packages/contracts/'))
      )
        context.report({ node, messageId: 'contract' })
    }
    return {
      ImportDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => check(node.source),
      ExportAllDeclaration: (node) => check(node.source),
      ImportExpression: (node) => check(node.source, true),
    }
  },
}
