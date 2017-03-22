// This is the webpack config used for unit tests.
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const config = require('../config')

const webpackConfig = merge(baseConfig, {
  // use inline sourcemap for karma-sourcemap-loader
  module: {
    rules: utils.styleLoaders()
  },
  devtool: '#inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/test.env'),
      PKG_NAME: `"${config.name}"`,
      PKG_FULLNAME: `"${config.fullname}"`,
      PKG_VERSION: `"${config.version}"`
    })
  ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig