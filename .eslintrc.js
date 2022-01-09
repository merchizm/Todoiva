module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    browser: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
