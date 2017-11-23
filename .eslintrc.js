module.exports = {
  root: true,
  plugins: [
    'ember'
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended' // or 'plugin:ember/base'
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/no-old-shims': 'error'
  }
};
