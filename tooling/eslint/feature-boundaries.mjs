import path from 'node:path'

function layer(filename) {
  const normalized = filename.split(path.sep).join('/')
  const feature = normalized.match(/\/src\/features\/([^/]+)(?:\/|$)/)
  if (feature) return { kind: 'feature', name: feature[1] }
  if (/\/src\/(?:app(?:\/|$)|App\.vue$|main\.ts$)/.test(normalized)) return { kind: 'app' }
  if (/\/src(?:\/|$)/.test(normalized)) return { kind: 'shared' }
  return { kind: 'outside' }
}

function staticString(node) {
  if (node?.type === 'Literal' && typeof node.value === 'string') return node.value
  if (node?.type === 'TemplateLiteral' && node.expressions.length === 0)
    return node.quasis[0]?.value.cooked
  return undefined
}

export const architectureRule = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      sibling:
        'Features cannot import sibling features. Compose them in src/app or extract genuinely shared code.',
      upward: 'Shared code cannot import features or the app, and features cannot import the app.',
      dynamic: 'Use a static import path so architecture boundaries can be checked.',
      broadGlob:
        'Limit this glob to its owning feature or a specific shared directory. Compose broad imports in src/app.',
      privateEntry: 'Import the feature entry point instead of one of its private files.',
    },
  },
  create(context) {
    const filename = context.filename
    const source = layer(filename)
    const srcRoot = path.resolve(context.cwd, 'src')

    function resolve(specifier) {
      if (specifier.startsWith('@/')) return path.resolve(srcRoot, specifier.slice(2))
      if (specifier.startsWith('/src/')) return path.resolve(context.cwd, '.' + specifier)
      if (specifier.startsWith('.')) return path.resolve(path.dirname(filename), specifier)
      return undefined
    }

    function checkPath(node, specifier) {
      const resolved = resolve(specifier)
      if (!resolved) return
      const target = layer(resolved)
      if (source.kind === 'app' && target.kind === 'feature') {
        const featureRoot = path.join(srcRoot, 'features', target.name)
        const relativeTarget = path.relative(featureRoot, resolved)
        if (
          relativeTarget !== '' &&
          relativeTarget !== 'index' &&
          !/^index\.[^/]+$/.test(relativeTarget)
        ) {
          context.report({ node, messageId: 'privateEntry' })
          return
        }
      }
      if (source.kind === 'feature' && target.kind === 'feature' && source.name !== target.name) {
        context.report({ node, messageId: 'sibling' })
        return
      }
      if (
        (source.kind === 'feature' && target.kind === 'app') ||
        (source.kind === 'shared' && ['app', 'feature'].includes(target.kind))
      )
        context.report({ node, messageId: 'upward' })
    }

    function check(node, requireStatic = false) {
      const specifier = staticString(node)
      if (specifier !== undefined) return checkPath(node, specifier)
      if (requireStatic && source.kind !== 'outside') context.report({ node, messageId: 'dynamic' })
    }

    function checkGlob(node) {
      const specifier = staticString(node)
      if (specifier === undefined) {
        if (node) context.report({ node, messageId: 'dynamic' })
        return
      }
      if (specifier.startsWith('!')) return
      const wildcard = specifier.search(/[*?{[]/)
      const prefix =
        wildcard < 0 ? specifier : specifier.slice(0, specifier.lastIndexOf('/', wildcard) + 1)
      const resolved = resolve(prefix)
      if (
        resolved &&
        source.kind !== 'app' &&
        source.kind !== 'outside' &&
        (resolved === srcRoot ||
          srcRoot.startsWith(resolved + path.sep) ||
          resolved === path.join(srcRoot, 'features'))
      ) {
        context.report({ node, messageId: 'broadGlob' })
        return
      }
      checkPath(node, prefix)
    }

    return {
      ImportDeclaration: (node) => check(node.source),
      ExportNamedDeclaration: (node) => check(node.source),
      ExportAllDeclaration: (node) => check(node.source),
      ImportExpression: (node) => check(node.source, true),
      CallExpression(node) {
        const callee = node.callee
        if (
          callee.type !== 'MemberExpression' ||
          callee.object.type !== 'MetaProperty' ||
          callee.object.meta.name !== 'import' ||
          callee.object.property.name !== 'meta'
        )
          return
        const method = callee.computed ? staticString(callee.property) : callee.property.name
        if (!['glob', 'globEager'].includes(method)) return
        const argument = node.arguments[0]
        if (argument?.type === 'ArrayExpression') argument.elements.forEach(checkGlob)
        else checkGlob(argument)
      },
    }
  },
}
