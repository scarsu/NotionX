module.exports = {
  // presets: [
  //   '@vue/cli-plugin-babel/preset',
  // ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'not ie <= 8'
          ]
        }
      }
    ]
  ],
  plugins: [
    'transform-vue-jsx',
    'babel-plugin-syntax-jsx',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    ['@babel/plugin-proposal-optional-chaining'], // 解析 可选链式语法
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-object-rest-spread'
  ]
}
