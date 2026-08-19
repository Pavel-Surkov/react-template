import prettierRecommended from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'node_modules', 'src/api/generated'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react$'], ['^[a-z]'], ['^@']],
        },
      ],
    },
  },
  {
    files: ['*.{js,ts}', 'plopfile.js', 'vite.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  reactHooks.configs.flat.recommended,
  {
    // react-hooks v7 ships the React Compiler rule set. The popup components predate it and
    // deliberately drive animation state from effects — report, but don't fail the build.
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  prettierRecommended,
]
