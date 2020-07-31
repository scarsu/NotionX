/* eslint-disable no-undef */
// var _ = require('lodash')
// 检查notion页面加载
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

waitNotionPageReady('#notion-app').then(([el]) => {
  initSideBar()
  addDarkBtn()
  // 创建视图观察者
  NotionXObserver('#notion-app', renderToc)
})

const renderToc = _.throttle(function (MutationRecords, observer) {
  patchToc()
}, 500)

// utils
const scrollToTop = function scrollToTop () {
  $('.notion-scroller').animate(
    {
      scrollTop: 0
    },
    200,
    null
  )
}

function initSideBar () {
  // sidebar按钮
  var $btn = $("<div id='toc-btn-chrome-plugin'>TOC</div>")
  $btn.click(function () {
    if ($('#toc-ul-chrome-plugin').length > 0) {
      $('#toc-ul-chrome-plugin').toggleClass('open')
      $('#toc-btn-chrome-plugin').toggleClass('open')
      $('#toc-btn-chrome-plugin').text('TOC')
    }
  })
  $btn.mouseover(function () {
    if ($('#toc-ul-chrome-plugin').length > 0) {
      $('#toc-ul-chrome-plugin').addClass('open')
      $('#toc-btn-chrome-plugin').addClass('open')
      $('#toc-btn-chrome-plugin').text('>>')
    }
  })
  $('#toc-btn-chrome-plugin').hide()
  $('body').append($btn)
}

function addDarkBtn () {
  var $btnShare = $('.notion-topbar-share-menu')
  if ($btnShare.length > 0) {
    var $btnDark = $(`
      <div id="dark-btn-chrome-plugin" title="暗黑模式">
        <input type="checkbox" id="dark-mode-inp"/>
        <label for="dark-mode-inp"></label>
      </div>
    `)
    $btnDark.find('label').click(function (e) {
      e.stopPropagation()
      var oldChecked = $(e.currentTarget).parent().find('input')[0].checked
      if (!oldChecked) {
        $('html').addClass('dark')
      } else {
        $('html').removeClass('dark')
      }
    })
    $btnDark.insertBefore($btnShare)
    darkBtnFlag = true
  }
}

// list
function patchToc () {
  var $ul = null
  if ($('#toc-ul-chrome-plugin').length <= 0) {
    $ul = $("<ul id='toc-ul-chrome-plugin'></ul>")
    $('body').append($ul)
  } else {
    $ul = $('#toc-ul-chrome-plugin')
  }
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
  if (hs.length < 0) {
    $('#toc-btn-chrome-plugin').hide()
    return
  }
  $('#toc-btn-chrome-plugin').show()
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
  $ul.html(liStr)
  $ul.append($li)
}
