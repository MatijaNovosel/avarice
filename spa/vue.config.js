/* eslint-disable @typescript-eslint/no-var-requires */
var webpack = require('webpack');
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  productionSourceMap: false,
  filenameHashing: true,
  transpileDependencies: ['vuetify'],
  configureWebpack: () => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            PACKAGE_VERSION: '"' + version + '"'
          }
        })
      ]
    }
  },
  chainWebpack: config => {
    config.merge({
      devtool: 'source-map',
      devServer: {
        host: 'localhost'
      }
    });
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@intlify/vue-i18n-loader');
  }
}
