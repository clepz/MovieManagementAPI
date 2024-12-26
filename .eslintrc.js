module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "prettier/prettier": ["error", { "endOfLine": "auto" }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    indent: ["error", 4, { "ignoredNodes": ["PropertyDefinition"] }],
    quotes: ["error", "single"],
    "no-var": "error",
    "no-console": ["warn"],
    "prefer-arrow-callback": "error",

    "no-void": ["error", {
      allowAsStatement: true,
    }],

    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/comma-dangle": "off",

    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],

    "@typescript-eslint/no-var-requires": ["error"],

    "@typescript-eslint/array-type": ["error", {
      default: "array-simple",
    }],

    "@typescript-eslint/no-unsafe-assignment": ["warn"],
    "@typescript-eslint/no-unsafe-call": ["warn"],
    "@typescript-eslint/no-unsafe-member-access": ["off"],
    "@typescript-eslint/no-unsafe-return": ["warn"],
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-namespace": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/prefer-function-type": ["warn"],
    "@typescript-eslint/unified-signatures": "warn",
  },
};
