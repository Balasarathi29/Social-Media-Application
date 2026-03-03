const path = require("path");

module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
