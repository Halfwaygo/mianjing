var path = require('path')
var webpack = require('webpack')
var proxy = require('./proxy')

var SRC_PATH = path.join(__dirname, 'src')
var DIST_PATH = path.join(__dirname, '../static')

var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var config = {
    entry: {
        apps: path.join(SRC_PATH, 'root.js'),
        vendors: ['vue', 'vuex', 'vue-router', 'vuex-router-sync']
    },

    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '~': SRC_PATH
        },

        extensions: ['.less', '.css', '.js', '.vue', '.json']
    },

    output: {
        path: DIST_PATH,
        publicPath: '',
        filename: 'js/[name].js'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendors', 'manifest']
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __DEV__: true
        }),

        new HtmlWebpackPlugin({
            inject: false,
            filename: './index.html',
            template: path.join(SRC_PATH, 'index.html')
        }),

        new CopyWebpackPlugin([
            {from:'src/layouts/images/favicon.ico',to:'images/favicon.ico'}
        ]),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(SRC_PATH),
                    path.resolve(__dirname, 'node_modules/vue-echarts'),
                    path.resolve(__dirname, 'node_modules/resize-detector')
                ]
            },

            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                exclude: /(node_modules)/
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'resolve-url-loader']
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            },

            {
                test: /\.(png|jpg|gif|webp)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'images/[name].[ext]'
                }
            },

            {
                test: /\.(eot|woff|woff2|ttf|svg)/,
                loader: 'url-loader',
                options: {
                    limit: 100,
                    name: 'fonts/[name].[ext]'
                }
            },

            {
                test: /\.wav/,
                loader: 'file-loader',
                options: {
                    name: 'audios/[name].[ext]'
                }
            }
        ]
    },

    devServer: {
        proxy: proxy,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
}

console.log('initializing webpack developent build....')

module.exports = config
