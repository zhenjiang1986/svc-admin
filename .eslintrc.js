/*
 * @Description: 配置EsLint
 * @Author: tongzh
 * @Date: 2019-08-09 17:17:51
 * @LastEditTime: 2019-08-09 17:18:43
 * @LastEditors: Please set LastEditors
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-mixed-spaces-and-tabs": [0],
    "no-unused-vars": 'off' 
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
