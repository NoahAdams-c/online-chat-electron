/**
 * @Description: eslint配置
 * @Author: chenchen
 * @Date: 2019-11-18 17:35:34
 * @LastEditors: chenchen
 * @LastEditTime: 2019-11-18 17:45:21
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    es6: true
  },
  plugins: ["vue"],
  extends: [
    // "standard", //使用standard做代码规范
    "plugin:prettier/recommended"
  ],
  rules: {
    "prettier/prettier": "error",
    "generator-star-spacing": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
}
