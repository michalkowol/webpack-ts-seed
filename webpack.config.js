const path = require('path');
const webpack = require('webpack');

const prod = process.env.NODE_ENV === 'production';

module.exports = {
  devtool: prod ? '' : 'source-map',
  entry: prod ? [
    './src/js/index'
  ] : [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src', 'static'],
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  plugins: prod ? [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ] : [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loaders: ['react-hot-loader/webpack', 'ts'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      exclude: /node_modules/,
      loaders: ['file?name=[path][name].[ext]']
    }]
  }
};
