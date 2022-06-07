module.exports = {
    plugins: {
        // autoprefixer: {
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },
        'postcss-pxtorem': {
            // rootValue: 37.5, // Vant 官方根字体大小是 37.5
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            propList: ['*'],
            selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
        }
    },
}