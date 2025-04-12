module.exports = (async function config() {
  const { default: love } = await import("eslint-config-love");

  return [
    {
      ...love,
      files: ["**/*.ts"],
      rules: {
        ...love.rules,
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/prefer-destructuring": "off",
        "@typescript-eslint/no-magic-numbers": "off",
      },
    },
  ];
})();
