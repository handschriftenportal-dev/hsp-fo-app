const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    clean: true,
    filename: 'hsp-fo-app.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          onlyCompileBundledFiles: true,
        },
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ejs$/i,
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        'node_modules/hsp-fo-home/dist',
        'node_modules/hsp-fo-search/dist',
        'node_modules/hsp-fo-workspace/dist',
        'node_modules/hsp-fo-cms/dist',
        'node_modules/hsp-fo-projects/dist',
        'img/favicon.ico',
        {
          from: path.resolve(__dirname, 'img/**/*.jpg'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'img/**/*.svg'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      // TODO: evtl hardcoded metatags hier einpflegen
      template: './index.ejs',
      filename: 'index.ejs',
    }),
  ],
  devtool: 'source-map',
}
