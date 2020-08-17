module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier/@typescript-eslint',

    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    // https://github.com/prettier/eslint-config-prettier
    'prettier',
    'prettier/standard',
    'prettier/vue',
    'plugin:prettier-vue/recommended',
    // https://github.com/jest-community/eslint-plugin-jest
    'plugin:jest/recommended',
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    'plugin:unicorn/recommended',
  ],
  plugins: ['unicorn'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unreachable': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Needed for Vue 3
    'vue/no-template-key': 'off',
    'vue/require-v-for-key': 'off',

    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: [
          'component',
          'template',
          'transition',
          'transition-group',
          'keep-alive',
          'slot',
          'i18n',
        ],
      },
    ],

    'unicorn/catch-error-name': [
      'error',
      {
        name: 'error',
        ignore: [/^(_|originalError|err)$/],
      },
    ],

    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
        },
      },
    ],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-for-loop': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-null': 'off',

    '@typescript-eslint/ban-ts-ignore': 'off',
  },
  overrides: [
    {
      files: ['**/*.unit.ts'],
      env: {
        jest: true,
      },
      globals: {
        mount: false,
        shallowMount: false,
      },
    },
  ],
}
