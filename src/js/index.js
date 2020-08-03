/* eslint-disable no-undef */
import _ from 'lodash'
import $ from 'jquery'
import notionXObserver from './observer'
import { template } from './template'
import { scrollToTop } from './util'
// const jQuery = $

/* 检查notion内容加载 */
const waitNotionPageReady = (selector) =>
  new Promise((resolve) => {
    const delay = 500
    const f = () => {
      const element = document.querySelector(selector)
      if (element != null) {
        resolve(element)
      } else {
        setTimeout(f, delay)
      }
    }
    f()
  })
waitNotionPageReady('.notion-topbar').then((el) => {
  initNotionX(el)
  initDarkBtn(el)
  // notion内容观察者
  notionXObserver('#notion-app', renderToc, [el])
})

function initNotionX () {
  const _tplt = template.sideBar
  const $notionx = $(_tplt)
  var $btn = $notionx.find('.notionx-switcher')
  $btn.click(function () {
    $notionx.toggleClass('open')
    $btn.toggleClass('open')
    $btn.text('TOC')
  })
  $btn.mouseover(function () {
    $notionx.addClass('open')
    $btn.addClass('open')
    $btn.text('>>')
  })
  // $btn.hide()
  $('body').append($notionx)
  return $notionx
}

function initDarkBtn () {
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

/* toc更新 */
// 防抖
const renderToc = _.throttle(function (MutationRecords, observer) {
  patchToc()
}, 500)
function patchToc () {
  let $notionx = $('#notionx')
  if ($('#notionx').length <= 0) {
    $notionx = initNotionX()
  }
  const $ul = $notionx.find('.notionx-view-toc')
  var hs = $(
    '.notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block'
  ).map(function (i, e) {
    var dataBlockId = e.attributes['data-block-id'].value
    dataBlockId = dataBlockId.replace(/-/g, '')
    var href = location.pathname + '#' + dataBlockId
    return {
      desc: e.innerText,
      href: href,
      level: e.classList.contains('notion-header-block')
        ? 1
        : e.classList.contains('notion-sub_header-block')
          ? 2
          : 3
    }
  })
  $notionx.show()
  var $li = $(`
  <li class="level-1">
    <a class="toTopBtn" href="#">TOP</a>
  </li>
  `)
  $li.click(scrollToTop)
  var liStr = ''
  for (var i = 0, l = hs.length; i < l; i++) {
    if (!hs[i].desc || !hs[i].level) continue
    liStr +=
      '<li class="level-' +
      hs[i].level +
      '" title="' +
      hs[i].desc +
      '">' +
      '<a href="' +
      hs[i].href +
      '">' +
      hs[i].desc +
      '</a>' +
      '</li>'
  }
  console.log($ul, liStr)
  $ul.html(liStr)
  $ul.append($li)
}
