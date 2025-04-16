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
        "@typescript-eslint/prefer-destructuring": "off",
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/init-declarations": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-type-assertion": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/class-methods-use-this": "off",
      },
    },
  ];
})();
