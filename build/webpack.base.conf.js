const path = require('path');
const utils = require('./utils');
const config = require('../config');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const manifest = require('./vendors-manifest.json');
const vuxLoader = require('vux-loader');

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}

const styleExtract = new ExtractTextPlugin({
	filename: 'src/static/css/style-[contenthash].css',
	allChunks: true
});

const webpackConfig = {
	context: path.resolve(__dirname, '../'),
	entry: {
		app: './src/main.js'
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			// 'vue$': 'vue/dist/vue.runtime.esm.js',
			'@': resolve('src')
		}
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					less: styleExtract.extract({
						use: ['css-loader', 'less-loader'],
						fallback: 'vue-style-loader'
					}),
					css: styleExtract.extract({
						use: ['css-loader'],
						fallback: 'vue-style-loader'
					})
				}
			}
		},
		{
			test: /\.less$/,
			use: styleExtract.extract({
				fallback: 'vue-style-loader',
				use: ['css-loader', 'less-loader']
			})
		},
		{
			test: /\.js$/,
			loader: 'babel-loader',
			include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
		},
		{
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: utils.assetsPath('images/[name].[hash:7].[ext]')
			}
		},
		{
			test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: utils.assetsPath('media/[name].[hash:7].[ext]')
			}
		},
		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
				name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
			}
		}
		]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			options: {
				postcss: [autoprefixer()]
			}
		}),
		styleExtract,
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest
		}),
		new OptimizeCssAssetsPlugin()
	]
};

module.exports = vuxLoader.merge(webpackConfig, {
	plugins: [
		'vux-ui',
		'progress-bar',
		{
			name: 'less-theme',
			path: 'src/style/variables.less' // 相对项目根目录路径
		},
		{
			name: 'duplicate-style',
			options: {
				cssProcessorOptions: {
					safe: true,
					zindex: false,
					autoprefixer: {
						add: true,
						browsers: [
							'iOS >= 7',
							'Android >= 4.1'
						]
					}
				}
			}
		}
	]
});
