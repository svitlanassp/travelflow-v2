import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // 1. Ігнори (тепер просто об'єкт на самому початку)
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'src/tests/**',
      '**/__mocks__/**'
    ],
  },
  
  // 2. Основні налаштування
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      // Додаємо правила хуків вручну, щоб не було помилок імпорту
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Твоє правило для ігнору невикористаних змінних
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]|motion', 
        argsIgnorePattern: '^_' 
      }],
    },
  },
];