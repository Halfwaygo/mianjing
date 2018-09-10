var path = require("path"),
	webpack = require("webpack"),
	proxy = require("./proxy");


var SRC_PATH = path.join(__dirname, 'src'),
	DIST_PATH = path.join(__dirname, '../static');

var HtmlWebpackPlugin = require('html-webpack-plugin');


var config = {
	entry: {
		apps: path.join(SRC_PATH, 'root.js'),
		vendors: [
			'vue',
			'vuex',
			'vue-router',
			'vuex-router-sync',
            'whatwg-fetch',
			'es6-promise',
			'querystring'
		]
	},

	resolve: {
		alias: {
			"@":path.join(__dirname,"src"),
			"echarts2": path.join(__dirname, "node_modules","echarts2/build/echarts-all")
		},
		extensions: ["", ".less", ".css", ".js", ".vue", ".json"]
	},

	output: {
		path: DIST_PATH,
		publicPath: '',
		filename: "js/[name].js"
	},

	clearBeforeBuild: false,

	plugins: [
		new webpack.optimize.CommonsChunkPlugin(
			'vendors',
			'js/vendors.js', // vendor date
			Infinity
		),

		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
			'__DEV__': true
		}),

		new HtmlWebpackPlugin({
			inject: false,
			filename: './index.html',
			template: path.join(SRC_PATH, 'index.html'),
			env:"development"
		})

	],

	module: {
		noParse: [],
		rules: [
			{
				enforce: 'pre',
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				include: [
					path.resolve(SRC_PATH),
					path.resolve(__dirname, 'node_modules/vue-echarts'),
					path.resolve(__dirname, 'node_modules/resize-detector')
				],
				options: {
          formatter: require('eslint-friendly-formatter')
        }
		  }
		],
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue'
			}, {
				test: /\.js$/,
				loader: "babel",
				include: SRC_PATH
			},

			{
				test: /\.css$/,
				loader: "style!css!autoprefixer"
			},

			{
				test: /\.less$/,
				loader: "style!css!autoprefixer!less"
			},

			{
				test: /mark\.dot\.png$/,
				loader: "file",
				query: {
					limit: 8192,
					name: 'images/[name].[ext]'
				}
			},

			{
				test: /\.(png|jpg|gif)$/,
				loader: "url",
				query: {
					limit: 8192,
					name: 'images/[name].[ext]'
				}
			},

			{
				test: /\.(eot|woff|woff2|ttf|svg)/,
				loader: "url",
				query: {
					limit: 100,
					name: 'fonts/[name].[ext]'
				}
			}
		],
	},

    vue:{

        loaders:{
            less: "vue-style!css!autoprefixer!less",
        }
    },


	devServer: {
		proxy: proxy,
		disableHostCheck: true
	}
};

console.log("initializing webpack developent build....");

module.exports = config;
