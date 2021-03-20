const path = require('path')

const resolve = (dir) => path.join(__dirname, '.', dir)

module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup',
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
        background: {
          entry: 'src/background.js',
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
    config.resolve.alias.set('@public', resolve('public'))
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
