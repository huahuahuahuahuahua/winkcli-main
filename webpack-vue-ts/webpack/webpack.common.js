// webpack/webpack.common.js

const path = require('path');
const glob = require('glob')
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 压缩css
// 清理dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// css 压缩
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将css从js中分离为单独的css文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// 清除无用的代码
const TerserWebpackPlugin = require('terser-webpack-plugin');
// vue loader
const { VueLoaderPlugin } = require('vue-loader/dist/index');
const tsImportPluginFactory = require('ts-import-plugin');
// eslint 检测代码
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'); // 在终端显示ts错误提示


// 打包友好提示
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
// 分析打包文件大小
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const icon = path.join(__dirname, 'public/icon.jpg');
const paths = require('./paths');
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
module.exports = (webpackEnv) => {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const cssLocalIdentName = isEnvDevelopment ? '[path][name]-[local]-[hash:base64:5]' : '[hash:base64:8]';
    const getStyleLoader = (cssOptions, loader) => {
        const loaders = [
            isEnvProduction ?
                MiniCssExtractPlugin.loader : // 将css从js中分离拆分为单独的css文件
                'style-loader', // 生成style标签，将css样式添加到style标签中并插入到dom中（此时，css是在js个文件中的）
            "cache-loader",
            {
                loader: 'css-loader', // css-loader 会对 @import 和 url() 进行处理，就像 js 解析 import/require() 一样
                options: cssOptions
            },
            {
                // css兼容性处理
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            [
                                'postcss-preset-env',
                                {
                                    autoprefixer: {
                                        flexbox: 'no-2009',
                                    },
                                    stage: 3,
                                },
                            ],
                            isEnvProduction &&
                            [
                                '@fullhuman/postcss-purgecss', // 删除未使用的css
                                {
                                    content: [paths.appHtml, ...glob.sync(path.join(paths.appSrc, '/**/*.{tsx,ts,js,jsx}'), { nodir: true })],
                                }
                            ],
                            [
                                'postcss-normalize', // 重置浏览器的默认样式，比如：谷歌浏览器默认padding:8px等
                                {
                                    forceImport: 'sanitize.css'
                                }
                            ],
                            [
                                'postcss-px-to-viewport', // 屏幕适配，将px转换为vh|vw
                                {
                                    viewportWidth: 375, // (Number) The width of the viewport.
                                    viewportHeight: 667, // (Number) The height of the viewport.
                                    unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
                                    viewportUnit: "vw", // (String) Expected units.
                                    selectorBlackList: [], // (Array) The selectors to ignore and leave as px.
                                    minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
                                    mediaQuery: false // (Boolean) Allow px to be converted in media queries.
                                }
                            ],
                        ].filter(Boolean),
                    },
                }
            },
        ].filter(Boolean);
        if (loader) {
            loaders.push(loader);
        }
        return loaders;
    }
    return {
        // 模式配置：
        // 1.production 生产模式 会自动启动js压缩，tree shaking等优化
        // 2.development 开发模式
        mode: webpackEnv,
        // 打包入口配置
        entry: paths.appIndexJs,
        // 打包输出配置
        output: {
            path: paths.appBuildPath, // 打包文件输出路径
            filename:
                isEnvDevelopment ?
                    '[name].js' :
                    '[name].[contenthash:8].js', // 打包文件输出名称
            chunkFilename:
                isEnvDevelopment ?
                    '[name].js' :
                    '[name].[contenthash:8].js',
            assetModuleFilename:
                isEnvDevelopment ?
                    'asset/[name][ext][query]' :
                    'asset/[name].[contenthash:8][ext][query]', // 资源输出名称
            clean: true, // 构建前清空输出目录
            pathinfo: false, // 禁止在bundle中生成文件路径信息，减小内存开销
        },
        // 资源映射: 会生成sourcemap文件，将打包后的文件与源码进行映射 方便调式开发
        devtool: isEnvProduction ? false : 'cheap-module-source-map',

        optimization: {
            runtimeChunk: 'single', //将runtime的代码拆分为一个单独的chunk
            removeEmptyChunks: true, // 删除空chunk文件
            // 将可重复使用的代码拆分为独立的chunk
            splitChunks: {
                chunks: 'all',
            },
            // mode为production时minimizer中的插件才会生效
            minimizer: [
                new CssMinimizerPlugin(),
                '...' // 使用 '...' 添加默认插件
            ],
        },
        cache: {
            type: "filesystem", // 使用文件缓存
        },
        // 解析配置
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
            alias: {},
            symlinks: false,
        },
        // 排除不需要打包的模块
        externals: {},
        // loader
        module: {
            rules: [
                // 处理js文件
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env"],

                        }
                    },
                    // 缩小打包范围
                    exclude: /node_modules/,
                    include: path.resolve(__dirname, 'src')
                },
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                getCustomTransformers: () => ({
                                    before: [
                                        tsImportPluginFactory({
                                            libraryName: 'vant',
                                            libraryDirectory: 'es',
                                            style: (name) => `${name}/style/less`,
                                        }),
                                    ],
                                }),
                                compilerOptions: {
                                    module: 'es2015',
                                },
                            }
                        },
                    ],
                    exclude: /node_modules/
                },
                // 处理css文件
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    include: paths.appSrc,
                    use: getStyleLoader(),
                },
                {
                    test: /\.vue$/,
                    use: [
                        'vue-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        // MiniCssExtractPlugin.loader,
                        'style-loader',
                        'css-loader',
                        'less-loader'
                    ]
                },
                // 处理sass文件
                {
                    test: sassRegex,
                    exclude: sassModuleRegex,
                    include: paths.appSrc,
                    use: getStyleLoader({}, 'sass-loader'),
                },
                // 处理css模块
                {
                    test: cssModuleRegex,
                    include: paths.appSrc,
                    use: getStyleLoader({
                        modules: {
                            localIdentName: cssLocalIdentName,
                        }
                    }),
                },
                // 处理sass模块
                {
                    test: sassModuleRegex,
                    include: paths.appSrc,
                    use: getStyleLoader(
                        {
                            modules: {
                                localIdentName: cssLocalIdentName,
                            }
                        },
                        'sass-loader'
                    ),
                },
                // 处理图片资源
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/,
                    // test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    // exclude: /\.(js|mjs|ejs|jsx|ts|tsx|css|scss|sass)$/i,
                    type: 'asset', // 在resource和inline中自动选择，默认小于8kb使用inline，否则使用resource
                    generator: {
                        filename: 'image/[name].[contenthash:8][ext][query]'
                    }
                },
                // 处理字体文件等其它资源

            ]
        },
        plugins: [
            // isEnvProduction &&
            // new webpack.DllReferencePlugin({
            //     manifest: paths.dllJsonPath
            // }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                title: 'webpack模板',
                minify: {
                    collapseWhitespace: true, // 去掉空格
                    removeComments: true // 去掉注释
                }
            }),
            new CleanWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css'
            }),
            paths.isUseTs &&
            new ESLintPlugin({
                extensions: ['.tsx', '.ts', '.js', '.jsx'],
                fix: true,
            }),
            paths.isUseTs &&
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    configFile: paths.appTsConfig
                },
            }),
            new VueLoaderPlugin(),
            new FriendlyErrorsWebpackPlugin({
                onErrors: (severity, errors) => {
                    notifier.notify({
                        title: 'webpack 编译失败了~',
                        message: `${severity} ${errors[0].name}`,
                        subtitle: errors[0].file || '',
                        icon,
                    });
                },
            }),
            // npm run analyzer 系统自动启动打包报告的HTTP服务器；
            // 若不想每次都启动，则可以生成 stats.json 文件
            isEnvProduction && new BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true
            }),
            isEnvProduction && new TerserWebpackPlugin()
        ].filter(Boolean),
    };
};