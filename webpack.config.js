var webpack = require('webpack');
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var WebpackAssetsManifest = require('webpack-assets-manifest');
// var CompressionPlugin = require("compression-webpack-plugin");
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var LessPluginCleanCSS = require('less-plugin-clean-css');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var isProduction = (process.env.NODE_ENV == 'production');
var filename = (isProduction ? 'cached-[name]-[chunkhash]' : '[name]');

var minify = new UglifyJsPlugin({
	uglifyOptions: {
		ecma: 6,
		minimize: true,
		compress: { warnings: false },
		output: {
			semicolons: false,
			indent_level: 0
		}
	}
	
});

var lessLoader = {
	loader: 'less-loader',
	options: {
		strictMath: true,
		ieCompat: false,
		plugins: [
			new LessPluginAutoPrefix({ browsers: ["last 2 versions"] })
		]
	}
};

var manifestPlugin = new WebpackAssetsManifest({
	output: './manifest.json'
});

module.exports = [{
	entry: ["./src/client.imba","./less/site.less"],
	output: {
		path: __dirname + '/www/dist',
		filename: filename + '.js'
	},
	plugins: [
		new ExtractTextPlugin({filename: filename.replace('chunkhash','contenthash') + '.css'}),
	    manifestPlugin,
	    minify
	],

	resolve: {
		extensions: [".imba",".js", ".json"]
	},

	module: {
		rules: [
			{
				test: /\.imba$/,
				loader: 'imba/loader'
			},
			{ test: /\.(css)/, use: "raw-loader" },
			{
				test: /\.less/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", lessLoader]
				})
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					publicPath: '/www/dist/'
				}
			}
		]
	}
}]