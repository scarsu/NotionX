// import Vue from 'vue'
// import App from './App.vue'
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   render: (h) => h(App)
// })

const path = require('path')
const fs = require('fs')

let mdContent = fs.readFileSync(path.resolve('./README.md'), 'utf-8')
let mdContentCn = fs.readFileSync(path.resolve('./README.zh-CN.md'), 'utf-8')
const md = require('markdown-it')()
mdContent = mdContent.replace('English | [简体中文](./README.zh-CN.md)', '')
mdContentCn = mdContentCn.replace('简体中文 | [English](./README.md)', '')
let _html = md.render(mdContent)
let _htmlCn = md.render(mdContentCn)
const template = fs.readFileSync(path.resolve('./public/index.template.html'), 'utf8')
_html = template.replace('<!--readme-md-outlet-->', _html)
_htmlCn = template.replace('<!--readme-md-outlet-->', _htmlCn)
fs.writeFileSync(path.resolve('./dist/index.html'), _html, {
  encoding: 'utf8',
  mode: 0o666,
  flags: 'w',
})
fs.writeFileSync(path.resolve('./dist/index_cn.html'), _htmlCn, {
  encoding: 'utf8',
  mode: 0o666,
  flags: 'w',
})
console.log(require('chalk').bgGreen(' Done ') + ' index.html generated from README.md successfully.')
