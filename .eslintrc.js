module.exports = {
  root: true,
  parserOptions: {
    parser: require.resolve("@typescript-eslint/parser"),
    extraFileExtensions: [".vue"]
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true
  },
  extends: ["plugin:vue/vue3-essential", "standard"],
  plugins: ["vue"],
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
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/unbound-method": "off",
    "arrow-parens": "off",
    "@typescript-eslint/camelcase": "off",
    camelcase: "off",
    "func-call-spacing": "off",
    "one-var": "off",
    "no-void": "off",
    "multiline-ternary": "off",
    "import/first": "off",
    "import/namespace": "error",
    "import/default": "error",
    "import/export": "error",
    "import/extensions": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "lines-between-class-members": "off",
    "import/no-extraneous-dependencies": "off",
    "prefer-promise-reject-errors": "off",
    "vue/multi-word-component-names": "off",
    quotes: ["warn", "double", { avoidEscape: true }],
    semi: "off",
    "space-before-function-paren": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
