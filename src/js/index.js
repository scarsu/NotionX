/* eslint-disable no-undef */
// import _ from 'lodash'
import $ from 'jquery'
import template from './template'
import { waitNotionPageReady, notionxLocalStore } from './util'
import { NOTION_PAGE_READY_SELECTOR, DEFAULT_OPTS, NOTION_WRAPPER_SELECTOR } from './constant'

waitNotionPageReady(NOTION_PAGE_READY_SELECTOR).then(() => {
  window.notionx = new NotionX()
})

function NotionX () {
  // 配置处理：默认配置 + 从localStorage获取本地配置
  this.defaultOptions = DEFAULT_OPTS
  this.localOptions = notionxLocalStore.get()
  this.init()
  return this
}

NotionX.prototype.init = function () {
  // 合并默认配置 +本地配置
  this.mergeOptions()

  // 初始化sidebar视图 + 事件
  this.initSidebar()

  // 根据配置渲染暗黑模式按钮
  this.renderDark()

  // 创建notion app观察者，动态更新toc
  this.notionOb()
}

// 配置处理：默认配置 + 从localStorage获取本地配置
NotionX.prototype.mergeOptions = function () {
  const keys = Object.keys(this.defaultOptions)
  keys.forEach(key => {
    this.localOptions[key] = this.localOptions[key] || this.defaultOptions[key]
  })
  notionxLocalStore.setAll(this.localOptions)
}

// 初始化sidebar视图 + 事件
// sidebar按钮: hover/click事件，显示隐藏sidebar，动效
// header: 点击显示setting模块(隐藏暗黑模式按钮)
// footer: 作者,论坛,开源仓库,关于
NotionX.prototype.initSidebar = function () {
  console.log(template)
  // debugger
  const $el = $(NOTION_WRAPPER_SELECTOR)
  const $sidebar = $(template.sidebar)
  // 样式设置
  $el.append($sidebar)
}

// 根据配置渲染暗黑模式按钮
NotionX.prototype.renderDark = function () {
  const _tplt = template.darkBtn
  const $container = $('.notion-topbar>div>div:last')
  var $btnDark = $(_tplt)
  $btnDark.find('label').click(function (e) {
    e.stopPropagation()
    var oldChecked = $(e.currentTarget).parent().find('input')[0].checked
    if (!oldChecked) {
      $('html').addClass('dark')
    } else {
      $('html').removeClass('dark')
    }
  })
  $btnDark.prependTo($container)
}

// 创建notion app观察者，动态更新toc
NotionX.prototype.notionOb = function () {
  // DomObserver(NOTION_APP_SELECTOR, renderToc)
}
// 性能控制，防抖
// const renderToc = _.throttle(function (MutationRecords, observer) {
//   patchToc()
// }, 500)
// function patchToc () {
//   let $notionx = $('#notionx')
//   if ($('#notionx').length <= 0) {
//     $notionx = initNotionX()
//   }
//   const $ul = $notionx.find('.notionx-view-toc')
//   var hs = $(
//     '.notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block'
//   ).map(function (i, e) {
//     var dataBlockId = e.attributes['data-block-id'].value
//     dataBlockId = dataBlockId.replace(/-/g, '')
//     var href = location.pathname + '#' + dataBlockId
//     return {
//       desc: e.innerText,
//       href: href,
//       level: e.classList.contains('notion-header-block')
//         ? 1
//         : e.classList.contains('notion-sub_header-block')
//           ? 2
//           : 3
//     }
//   })
//   $notionx.show()
//   var $li = $(`
//   <li class="level-1">
//     <a class="toTopBtn" href="#">TOP</a>
//   </li>
//   `)
//   $li.click(scrollToTop)
//   var liStr = ''
//   for (var i = 0, l = hs.length; i < l; i++) {
//     if (!hs[i].desc || !hs[i].level) continue
//     liStr +=
//       '<li class="level-' +
//       hs[i].level +
//       '" title="' +
//       hs[i].desc +
//       '">' +
//       '<a href="' +
//       hs[i].href +
//       '">' +
//       hs[i].desc +
//       '</a>' +
//       '</li>'
//   }
//   console.log($ul, liStr)
//   $ul.html(liStr)
//   $ul.append($li)
// }
