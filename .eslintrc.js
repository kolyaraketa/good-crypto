module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'plugin:vue/recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'comma-dangle': ['error', 'never'],
    quotes: [2, 'single', { avoidEscape: true }],
    // 'prettier/prettier': ['error', { singleQuote: true, parser: 'flow' }],
    'linebreak-style': 'off',
    'no-return-await': 'off',
    'max-len': ['error', 110, 2],
    'object-property-newline': [2, { allowAllPropertiesOnSameLine: true }],
    'object-curly-newline': [0],
    'import/no-unresolved': 'off',
    'operator-linebreak': [0],
    'arrow-parens': [0],
    'no-param-reassign': [0],
    'arrow-body-style': [0],
    'vue/singleline-html-element-content-newline': [0],
    'vue/multiline-html-element-content-newline': [0],
    'vue/html-self-closing': [0]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
