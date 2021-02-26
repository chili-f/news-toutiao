// Eslint  代码规范校验工具的配置文件
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义代码校验规范
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off'//关闭这个规则的验证
  }
}
