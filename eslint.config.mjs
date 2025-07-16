// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  [
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        quotes: [
          'error',
          'single',
          {
            avoidEscape: true,
            allowTemplateLiterals: true
          }
        ],
        semi: [
          'error',
          'always',
          {
            omitLastInOneLineBlock: true
          }
        ],
        'comma-dangle': [
          'error',
          {
            arrays: 'never',
            objects: 'never',
            imports: 'never',
            exports: 'never',
            functions: 'never'
          }
        ]
      }
    }
  ]
);
