module.exports = {
  extends: [
    "lddubeau-base",
  ],
  parserOptions: {
    sourceType: "module",
  },
  env: {
    node: true,
  },
  rules: {
    // The localConfig file loaded by Karma's config may be absent, which is
    // not an error.
    "import/no-unresolved": ["error", {
      ignore: [
        "/localConfig$",
      ],
    }],
  }
};
