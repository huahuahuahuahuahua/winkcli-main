// babel.config.js
module.exports = {
    plugins: [
        [
            'import',
            {
                libraryName: 'vant',
                libraryDirectory: 'es',
                style: true,
            },
            'vant',
        ],
    ]
};