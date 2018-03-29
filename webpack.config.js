var webpack = require('webpack')
var path = require('path')
var libraryName = 'library'
var outputFile = libraryName + '.js'

module.exports = {
  devtool: 'source-map',
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: [
          { loader: 'babel-loader' }
        ],
        exclude: /(node_modules|bower_components)/
      },
      // {
      //   test: /(\.jsx|\.js)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/
      // }
    ]
  },
}
