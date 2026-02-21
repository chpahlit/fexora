/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
