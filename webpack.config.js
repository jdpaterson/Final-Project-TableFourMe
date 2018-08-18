const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = {
	app: path.resolve(__dirname, 'client/js/'),
	styles: path.resolve(__dirname, 'client/scss/'),
	build: path.resolve(__dirname, 'build/'),
	template: path.resolve(__dirname, 'client/index.html')
};

const env = process.env.NODE_ENV || 'development';

module.exports = {
	mode: env,
	// named single entry point
	entry: {
		app: path.join(paths.app, '/index.js')
	},
	output: {
		// [name] refers to the key name of entry, which is app. Therefore, filename = 'js/app-generated.js'
		filename: 'js/[name]-generated.js',
		path: paths.build,
		// root directory of the app
		publicPath: '/'
	},
	module: {
		rules: [
			{
				// use babel-loader for all jsx files
				test: /\.jsx?/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						// 'env' lets you specify an environment and only transpiles features that are missing in that environment.
						//  'stage-0' converts ES6 syntax to ES5 to be compatible for all (or most) browsers.
						// without 'react', this app doesn't understand what JSX is
						presets: ['env', 'stage-0', 'react']
					}
				}
			},
			{
				// use the following loaders for all scss and sass files
				test: /\.scss|.sass$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader',
						'sass-loader'
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/mystyles.css'),
		// compile client side images to build
		new CopyWebpackPlugin([
			{ from: 'client/images', to: path.join(__dirname, 'build/images') }
		]),
		// immediately apply updates to compiled results
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: paths.template,
			inject: true
		}),
		// create a separate css compiled file instead of injecting it to index.html like style-loader
		new MiniCssExtractPlugin({
			filename: 'css/[name]-generated.css'
		})
	],
	devtool: env === 'production' ? 'cheap-source-map' : 'eval-source-map',
	devServer: {
		// set up host and port of the dev server
		// allow any external connection
		host: '0.0.0.0',
		port: 3002,
		// the dev server is on port 3000 while express server is on port 3002
		// express routes are specifically for api calls
		// set up a proxy so that you have access to express server (port: 3002) from dev server
		proxy: {
			"/api": "http://localhost:3001"
		},
		// set historyApiFallback to true so that the app is served for any URL not just for /
		historyApiFallback: true,
		contentBase: paths.build,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000,
			ignored: /node_modules/
		}
	}
};
