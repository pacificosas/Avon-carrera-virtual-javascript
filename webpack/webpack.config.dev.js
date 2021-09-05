const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const path = require('path')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  watch: true,
  output: {
    path: path.resolve(__dirname, '../dev'),
    filename: 'index.js'
  }

})
