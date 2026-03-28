const path = require('path');

const builders = {};

builders.baseIgnorePatterns = () => ([
  'src/setupTests.tsx',
  'src/serviceWorker.ts',
  'src/registerServiceWorker.js',
  'src/vendor/**',
  'build',
  'theme-build',
  'public/environment.js',
  'public/local-environment.js',
  'public/registry-environment.js',
  'public/application_theme.js',
  'public/business-process-modeler-element-templates.js',
  'node_modules',
  '**/__tests__/**/*.*',
]);

builders.base = () => ({
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
  ],
  plugins: ['import'],
  rules: {
    'arrow-body-style': 'off',
    'linebreak-style': 'off',
    'lines-between-class-members': 'off',
    'max-len': ['error', { code: 120 }],
    quotes: ['error', 'single', { avoidEscape: true }],
  },
});

builders.json = () => ({
  plugins: ['json'],
  rules: {
    'json/*': ['error', { allowComments: true }],
  },
});

builders.reactTests = () => ({
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    'react/display-name': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
});

builders.storybook = () => ({
  rules: {
    'react/display-name': 0,
  },
});

builders.reactTypescript = (options) => {
  const importExtensionsHidden = options?.importExtensionsHidden ?? ['js', 'mjs', 'jsx', 'ts', 'tsx'];
  const importExtensionsExplicit = options?.importExtensionsExplicit ?? ['svg', 'png', 'woff2'];
  const baseDir = options?.baseDir ?? '.';
  const tsConfigFilename = options?.tsConfigFilename ?? 'tsconfig.json';

  const reactConfig = {
    env: {
      es6: true,
      browser: true,
      jasmine: true,
      jest: true,
      node: false,
    },
    extends: [
      'eslint:recommended',
      'airbnb',
      'airbnb-typescript',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    plugins: [
      'import',
      'react',
      '@typescript-eslint',
      'react-hooks',
    ],
    settings: {
      'import/extensions': importExtensionsHidden.map((ext) => `.${ext}`),
      'import/resolver': {
        node: {
          extensions: importExtensionsHidden.map((ext) => `.${ext}`),
        },
      },
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: path.join(baseDir, tsConfigFilename),
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'arrow-body-style': 'off',
      'import/extensions': [
        'warn',
        Object.fromEntries([
          ...importExtensionsHidden.map((ext) => [ext, 'never']),
          ...importExtensionsExplicit.map((ext) => [ext, 'always']),
        ]),
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'import/prefer-default-export': 'off',
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '#shared/**',
              group: 'internal',
            },
            {
              pattern: '#web-components/**',
              group: 'internal',
            },
          ],
          groups: [
            [
              'builtin',
              'external',
              'internal',
            ],
          ],
          warnOnUnassignedImports: false,
        },
      ],
      'linebreak-style': 'off',
      'lines-between-class-members': 'off',
      'max-len': ['error', { code: 120 }],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react/destructuring-assignment': [1, 'always', { ignoreClassFields: true }],
      'react/jsx-filename-extension': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/prefer-stateless-function': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/state-in-constructor': [0],
      'react/static-property-placement': 'off',
      quotes: ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  };

  reactConfig.rules['class-methods-use-this'] = 'off'; // TODO: resolve or off
  reactConfig.rules['no-console'] = 'warn'; // TODO: resolve or off
  reactConfig.rules['no-restricted-exports'] = 'off'; // TODO: resolve or off
  reactConfig.rules['react/function-component-definition'] = 'off'; // TODO: resolve or off

  return reactConfig;
};

module.exports = {
  builders,
};
