// import Vue from 'vue'
// import App from './App.vue'
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   render: (h) => h(App)
// })

const path = require('path')
const fs = require('fs')

const mdContent = fs.readFileSync(path.resolve('./README.md'), 'utf-8')
const md = require('markdown-it')()
let _html = md.render(mdContent)
const template = fs.readFileSync(path.resolve('./public/index.template.html'), 'utf8')
_html = template.replace('<!--readme-md-outlet-->', _html)
fs.writeFileSync(path.resolve('./dist/index.html'), _html, {
  encoding: 'utf8',
  mode: 0o666,
  flags: 'w',
})
console.log(require('chalk').bgGreen(' Done ') + ' index.html generated from README.md successfully.')
