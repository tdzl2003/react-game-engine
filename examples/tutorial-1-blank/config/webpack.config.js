/**
 * Created by tdzl2003 on 2017/3/14.
 */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env['WEBPACK_ENV'];
const __DEV__ = ENV === 'development';

const path = require('path');

module.exports = {
  entry: {
    index: './src/index',
  },
  output: {
    path: path.resolve(__dirname, `../build/${__DEV__ ? 'debug' : 'release'}/web`), // string
    filename: __DEV__ ? '[name].bundle.js' : '[name].[hash].js', // string
    publicPath: '/', // string
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../../../packages'),
        ],
        loader: 'babel-loader'
      },
    ],
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "../../../packages"),
    ],
    mainFields: ['jsnext:main', 'browser', 'main'],
    extensions: [".web.js", ".js", ".json", ".jsx", ".css"],
    alias: {},
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(__DEV__),
      __CLIENT__: "true",
      __SERVER__: "false",
      __WEBWORKER__: "false",
    }),
    new HtmlWebpackPlugin({
      title: 'React Game Engine',
      template: 'config/index.html.ejs',
    })
  ],
  performance: __DEV__ ? {} : {
    hints: 'warning', // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function(assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: 'source-map', // enum
  context: path.resolve(__dirname, '..'),
  target: 'web',
  stats: {
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },
  devServer: {
    contentBase: path.join(__dirname, `build/${__DEV__ ? 'debug' : 'release'}`),
    compress: true,
    port: 9000,
  },
};
