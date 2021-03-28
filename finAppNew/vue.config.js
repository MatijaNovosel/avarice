module.exports = {
  productionSourceMap: false,
  filenameHashing: true,
  transpileDependencies: ['vuetify'],
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
