const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  context: path.resolve(__dirname, '../src'),

  target: ['web', 'es5'],

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js'
  },

  resolve: {
    alias: {
    }
  }
}
