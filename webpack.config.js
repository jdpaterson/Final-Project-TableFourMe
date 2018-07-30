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
  entry: {
    app: path.join(paths.app, '/index.js')
  },
  output: {
    filename: 'js/[name]-generated.js',
    path: paths.build,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react']
          }
        }
      },
      {
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
    new ExtractTextPlugin('css/[name]-generated.css'),
    new CopyWebpackPlugin([
      { from: 'client/images', to: path.join(__dirname, 'build/images') }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: paths.template,
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]-generated.css'
    })
  ],
  devtool: env === 'production' ? 'cheap-source-map' : 'eval-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3002,
    proxy: {
      "/api": "http://localhost:3001"
    },
    historyApiFallback: true,
    contentBase: paths.build,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
};
