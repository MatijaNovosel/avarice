const { resolve } = require("path");

module.exports = {
  root: true,
  parserOptions: {
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
    project: resolve(__dirname, "./tsconfig.json"),
    tsconfigRootDir: __dirname,
    ecmaVersion: 8,
    sourceType: "module"
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:vue/vue3-essential",
    "airbnb"
  ],
  plugins: ["@typescript-eslint", "vue"],
  globals: {
    ga: "readonly",
    cordova: "readonly",
    __statics: "readonly",
    __QUASAR_SSR__: "readonly",
    __QUASAR_SSR_SERVER__: "readonly",
    __QUASAR_SSR_CLIENT__: "readonly",
    __QUASAR_SSR_PWA__: "readonly",
    process: "readonly",
    Capacitor: "readonly",
    chrome: "readonly"
  },
  rules: {
    "generator-star-spacing": "off",
    "arrow-parens": "off",
    "one-var": "off",
    "no-void": "off",
    "multiline-ternary": "off",
    "import/first": "off",
    "import/named": "error",
    "import/namespace": "error",
    "import/default": "error",
    "import/newline-after-import": "off",
    "import/export": "error",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "no-empty-function": "off",
    "no-empty": "off",
    "object-curly-newline": "off",
    "comma-dangle": "off",
    quotes: [0, "double", { avoidEscape: true }],
    "import/no-extraneous-dependencies": "off",
    semi: ["off", "always"],
    "prefer-promise-reject-errors": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
