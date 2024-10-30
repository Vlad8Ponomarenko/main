const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier'); 

module.exports = {
  ignorePatterns: ['dist', 'node_modules'], 
  plugins: {
    prettier, 
  },
  extends: [
    js.configs.recommended,
    'plugin:@typescript-eslint/recommended', 
    'plugin:prettier/recommended', 
  ],
  parser: '@typescript-eslint/parser', 
  parserOptions: {
    ecmaVersion: 2020, 
    sourceType: 'module', 
    project: ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'], 
  },
  settings: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    'prettier/prettier': 'error', 
   
    // 'no-console': 'warn',
    // '@typescript-eslint/no-unused-vars': ['error'],
  },
};
