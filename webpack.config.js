var ExtractTextPlugin = require("extract-text-webpack-plugin");
var nodeExternals = require('webpack-node-externals');
var path = require('path');
var webpack = require("webpack");
var webpackMerge = require('webpack-merge');

const common = {
  context: __dirname,
  module: {
    rules: [{
      exclude: /(bundles|node_modules)/,
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
      },
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    }],
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ],
  watchOptions: {
    poll: true
  },
};

const client = webpackMerge(common, {
  entry: {
    client: ["babel-polyfill", './client/js/entry'],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/bundles/client',
  },
});

const server = webpackMerge(common, {
  entry: {
    server: './server/entry.js',
  },
  externals: [
    nodeExternals()
  ],
  // Turn off `NodeStuffPlugin` to prevent polyfilling or mocking Node.js globals
  // and modules (like __dirname).
  node: false,
  output: {
     filename: '[name].js',
     path: __dirname + '/bundles/server',
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/react-codemirror-proxy$/, 'node-noop')
  ],
  target: 'node',
});

module.exports = [client, server];
