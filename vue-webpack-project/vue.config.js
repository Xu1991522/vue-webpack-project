// https://github.com/vuejs/vue-cli/tree/dev/docs/config

const production = process.env.NODE_ENV === 'production'

module.exports = {
  // where to output built files
  outputDir: '../src/site',

  // Project deployment base
  // baseUrl: './' can't work after upgrade vue-cli-service to @3.0.0-beta.15
  // https://github.com/vuejs/vue-cli/pull/1405
  baseUrl: production ? './' : '/',

  // generate sourceMap for production build?
  productionSourceMap: false,

  // tweak internal webpack configuration
  // docs https://github.com/mozilla-neutrino/webpack-chain
  chainWebpack: config => {
    // set externals
    config.externals({
      echarts: 'echarts'
    })

    // see issue https://github.com/vuejs/vue-cli/issues/979
    // disable preload and prefetch
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },

  // proxy
  devServer: {
    open: false,
    host: 'localhost',
    port: 3000,
    https: false,
    hotOnly: false,
    proxy: {},
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    // string | Object
    // proxy: {
    //   '/portal-usr/': {
    //     // target: 'http://172.16.2.231:8080/',
    //     target: 'http://172.16.2.230:8092/',
    //     pathRewrite: {
    //       '^/portal-usr': ''
    //     }
    //   },
    //   '/portal-srv/': {
    //     // target: 'http://172.16.2.231:8081/',
    //     target: 'http://172.16.2.230:8095/',
    //     pathRewrite: {
    //       '^/portal-srv': ''
    //     }
    //   }
    // },
    //
    before: app => {}
  }
}
