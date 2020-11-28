const path = require('path')

const resolve = (dir) => path.join(__dirname, '.', dir)

module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },
    // options: {
    //   template: 'public/browser-extension.html',
    //   entry: './src/options/main.js',
    //   title: 'Options',
    // },
    standalone: {
      template: 'public/index.html',
      entry: './src/standalone/main.js',
      title: 'NotionX',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'standalone']
    },
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js',
            ],
          },
        },
      },
    },
  },
  configureWebpack: config => {
    config.output.publicPath = './'
  },
  filenameHashing: false,
  css: {
    extract: true,
  },
  chainWebpack: (config) => {
    // svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/svg'))
      .end()
    config.module
      .rule('icon')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
  },
}
