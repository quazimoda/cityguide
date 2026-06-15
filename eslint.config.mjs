export default [
  { ignores: ['.next/**', 'node_modules/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } },
    rules: {}
  }
];
