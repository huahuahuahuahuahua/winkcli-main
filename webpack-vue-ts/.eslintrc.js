module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: [".*", "webpack", "public", "node_modules", "dist", 'prettier.config.js'], // 忽略指定文件夹或文件
  rules: {
    'linebreak-style': ["error", "windows"], // 声明这是windows操作系统即可。
    // 在这里添加需要覆盖的规则
    "react/function-component-definition": 0,
    "quotes": ["error", "single"],
    "jsx-quotes": ["error", "prefer-single"]
  },
};
