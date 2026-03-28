const { builders } = require('../../eslint-base-config');

const mainConfig = {
  root: true,
  ...builders.base(),
  overrides: [],
  ignorePatterns: [...builders.baseIgnorePatterns()],
};

mainConfig.overrides.push({
  files: ['*.json'],
  ...builders.json(),
});

const reactConfig = builders.reactTypescript({
  baseDir: __dirname,
  importExtensionsExplicit: ['svg'], // TODO: check styles
});
const reactTestsConfig = {
  files: ['src/**/__tests__/**'],
  ...builders.reactTests(),
};
reactConfig.overrides = [
  reactTestsConfig,
];

mainConfig.overrides.push({
  files: ['*.ts', '*.tsx'],
  ...reactConfig,
});

module.exports = mainConfig;
