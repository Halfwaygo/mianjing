var path = require("path"),
	webpack = require("webpack"),
	proxy = require("./proxy");

var SRC_PATH = path.join(__dirname, 'src'),
	DIST_PATH = path.join(__dirname, '../../static/solution'),
	WEB_INF_PATH = path.join(__dirname, '../WEB-INF'),
	CONTENT_HASH_TAG = '_[contenthash:5]',
	CHUNK_FILE_HASH_TAG = '_[chunkhash:5]';

var HtmlWebpackPlugin = require('html-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	WebpackMd5Hash = require('webpack-md5-hash');


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
		extensions: ["", ".less", ".css", ".js", ".vue", ".json"]
	},

	output: {
		path: DIST_PATH,
		publicPath: 'solution',
		filename: `js/[name]${CHUNK_FILE_HASH_TAG}.js`,
		chunkFilename: `js/[id].[name]${CHUNK_FILE_HASH_TAG}.js`
	},

	clearBeforeBuild: true,

	plugins: [

		new CleanWebpackPlugin("solution", {
			root: path.join(__dirname, "../../static"),
			verbose: false
		}),

		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'__DEV__': false
		}),

		new WebpackMd5Hash(),

		new webpack.optimize.CommonsChunkPlugin(
			'vendors',
			`js/vendors${CHUNK_FILE_HASH_TAG}.js`,
			Infinity
		),

		new ExtractTextPlugin(`css/commons${CONTENT_HASH_TAG}.css`, { allChunks: true }),

		new webpack.optimize.UglifyJsPlugin({
			comments: false,
			warnings: false
		}),

		new HtmlWebpackPlugin({
			inject: false,
			filename: '../../static/solution/index.html',
			template: path.join(SRC_PATH, 'index_prod.html')
		}),
	],

	module: {
		noParse: [],

		loaders: [{
			test: /\.js$/,
			loader: "babel",
			exclude: /node_modules/
		},
			{
				test: /\.vue$/,
				loader: 'vue'
			},

			{
				test: /\.(png|jpg|gif)$/,
				loader: "url",
				query: {
					limit: 8192,
					name: `images/[name].[ext]`,
					publicPath: './static/'
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
		]
	},

	vue: {

		loaders: {

			less: ExtractTextPlugin.extract("vue-style", "css!less", {
				publicPath: "../"
			}),


			css: ExtractTextPlugin.extract("vue-style", "css", {
				publicPath: "../"
			})
		}
	}
};


console.log("initializing webpack production build....");

module.exports = config;
