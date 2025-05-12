module.exports = {
   root: true,
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
   ],
   parser: '@typescript-eslint/parser',
   plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
   parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
         jsx: true,
      },
   },
   settings: {
      react: {
         version: 'detect',
      },
   },
   rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': 'error',
   },
   env: {
      browser: true,
      node: true,
      es6: true,
   },
   overrides: [
      {
         // バックエンド特有の設定
         files: ['apps/backend/**/*.ts'],
         env: {
            node: true,
            es2021: true,
            browser: false
         },
         rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
         }
      }
   ]
};
