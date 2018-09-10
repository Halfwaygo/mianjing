module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/recommended',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    // required to lint *.vue files
    plugins: ['vue'],
    // add your custom rules here
    rules: {
        indent: ['error', 4],
        'space-before-function-paren': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-undef': 'off',
        'no-useless-escape': 'off',
        'no-cond-assign': 'off',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': 'off',
        'vue/html-self-closing': 'off',
        'vue/name-property-casing': 'off',
        'vue/require-default-prop': 'off',
    },
    globals: {}
}
