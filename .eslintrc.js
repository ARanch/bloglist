module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
        'node': true,
        'jest': true // allows globals
    },
    'extends': 'eslint:recommended', // predermined rules
    'parserOptions': {
        'ecmaVersion': 12
    },
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'globals': {
        'process': true // stops error when checking if env variable exists
    },
    'root': true,
    'rules': {
        'eqeqeq': 'error', // warning of checking eq with anything but ===
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [ // require space after and before curly
            'error', 'always'
        ],
        'arrow-spacing': [ // require space before and after arrow in func
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0, // overwrites console log error from pre-determined ruls
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
