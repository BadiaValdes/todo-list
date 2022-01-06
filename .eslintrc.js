module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js', 'server'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
      ],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'variable',
            format: ['camelCase'],
          },
          {
            selector: 'variable',
            modifiers: ['const'],
            format: ['UPPER_CASE', 'snake_case', 'camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'memberLike',
            modifiers: ['private'],
            format: ['camelCase'],
          },
          {
            selector: 'interface',
            format: ['PascalCase'],
            prefix: ['I'],
          },
        ],
        '@typescript-eslint/member-ordering': 2,
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-member-access': 1,
        '@typescript-eslint/no-unsafe-return': 1,
        '@typescript-eslint/no-unsafe-call': 1,
        '@typescript-eslint/no-empty-function': 1,
        '@typescript-eslint/lines-between-class-members': [
          2,
          'always',
          {
            exceptAfterSingleLine: true,
          },
        ],
        'max-len': [2, 120],
        '@typescript-eslint/unbound-method': [
          'error',
          {
            ignoreStatic: true,
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
};
