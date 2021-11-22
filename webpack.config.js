// webpack config
const path = require('path');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const autoprefixer = require('autoprefixer');

module.exports = (env = {}) => ({
    context: path.resolve(__dirname, 'src'),
    mode: env.production ? 'production' : 'development',
    entry: {
        'js/demo': './ts/demo.ts',
        'css/demo': './scss/demo.scss',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: process.env.BASE_URL,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { babelrc: true }
                    },
                    {
                        loader: 'ts-loader',
                        options: { appendTsSuffixTo: [/\.vue$/] }
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { hmr: !env.production }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                ident: 'postcss0',
                                plugins: [
                                    autoprefixer()
                                ]
                            }
                        }
                    },
                ]
            },
            {
                test: /\.scss?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true,
                            // Modules must be set to `false` otherwise, class names will be changed to random strings
                            modules: false,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                ident: 'postcss0',
                                plugins: [
                                    autoprefixer()
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            webpackImporter: true,
                            sassOptions: {
                                precision: 8,
                                outputStyle: 'expanded'
                            },
                            sourceMap: true
                        }
                    }
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.svg', '.css', '.vue', '.json'],
        alias: {
            'vue': '@vue/runtime-dom',
            '@': path.resolve(__dirname, 'src/ts'),
            '@svg': path.resolve(__dirname, 'src/svg'),
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new WebpackBar(),
        new VueLoaderPlugin(),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    devtool: 'source-map'
});
