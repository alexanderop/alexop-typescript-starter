import path from 'node:path'

const componentFilename = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      casing: 'Name Vue component files in PascalCase, for example SearchButtonRun.vue.',
    },
  },
  create(context) {
    return {
      Program(node) {
        const filename = path.basename(context.filename, '.vue')
        if (!/^[A-Z][A-Za-z0-9]*$/.test(filename)) context.report({ node, messageId: 'casing' })
      },
    }
  },
}

const componentImportName = {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { casing: 'Import Vue components using their PascalCase filename.' },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (typeof source !== 'string' || !source.endsWith('.vue')) return
        const expected = path.basename(source, '.vue')
        for (const specifier of node.specifiers) {
          if (specifier.type !== 'ImportDefaultSpecifier') continue
          if (
            !/^[A-Z][A-Za-z0-9]*$/.test(specifier.local.name) ||
            specifier.local.name !== expected
          )
            context.report({ node: specifier, messageId: 'casing' })
        }
      },
    }
  },
}

export const vueStyle = [
  {
    files: ['**/*.{ts,vue}'],
    plugins: {
      'component-style': {
        rules: { filename: componentFilename, 'import-name': componentImportName },
      },
    },
    rules: { 'component-style/import-name': 'error' },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'component-style/filename': 'error',
      'vue/one-component-per-file': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        { registeredComponentsOnly: false },
      ],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'never', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/html-quotes': ['error', 'double'],
      'vue/max-attributes-per-line': ['error', { singleline: 1, multiline: 1 }],
      'vue/v-bind-style': ['error', 'shorthand'],
      'vue/v-on-style': ['error', 'shorthand'],
      'vue/v-slot-style': ['error', 'shorthand'],
    },
  },
]
