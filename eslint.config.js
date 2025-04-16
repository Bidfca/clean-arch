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
        "@typescript-eslint/init-declarations": "off",
        "@typescript-eslint/class-literal-property-style": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
      },
    },
  ];
})();
