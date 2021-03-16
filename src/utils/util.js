import $ from 'jquery'
import {
  NOTION_SCROLLER_SELECTOR,
  NOTIONX_STORE_KEY,
  // COLORS
} from './constant'

/**
 * DOM Observer
 * @param {string} selector The selector of the observed DOM
 * @param {function} cb Callback function executed when the DOM changes
 * @param {array} args arguments for callback
 */
export function domObserver (selector, cb, config) {
  const observer = new MutationObserver((arg) => {
    cb(arg)
  })
  const el = document.querySelector(selector)
  config = config || {
    childList: true,
    subtree: true
  }
  observer.observe(el, config)
  return observer
}

// notion page滚动到顶部
export function scrollToTop () {
  $(NOTION_SCROLLER_SELECTOR).animate(
    {
      scrollTop: 0
    },
    200,
    null
  )
}

// notion sidebar 滚动到顶部
export function sideBarScrollToTop () {
  const e = document.querySelector('#notionx .notionx-views')
  if (e && e.nodeType) {
    e.style.scrollBehavior = 'smooth'
    e.scrollTop = 0
  }
}

/**
 * @param {string} selector :for judging the loading status of notion app
 */
export const waitNotionPageReady = (selector = '.notion-topbar') => new Promise((resolve) => {
  const max = 100
  let i = 0
  const delay = 500
  const f = () => {
    i++
    const element = document.querySelector(selector)
    if (i > max || (element != null && element.children.length > 0)) {
      resolve(element)
    } else {
      setTimeout(f, delay)
    }
  }
  f()
})

// 设置cookie
function setCookie (cName, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cName + '=' + JSON.stringify(cvalue) + '; ' + expires + ';path=/'
}

// 获取cookie
function getCookie (cName) {
  var name = cName + '='
  var cookieOBJ = document.cookie.split(';')
  for (var i = 0; i < cookieOBJ.length; i++) {
    var item = cookieOBJ[i]
    while (item.charAt(0) === ' ') item = item.substring(1)
    if (item.indexOf(name) !== -1) return JSON.parse(item.substring(name.length, item.length))
  }
  return ''
}

// 删除cookie
function clearCookie (name) {
  setCookie(name, '', '-1')
}

export const cookie = {
  set: setCookie,
  get: getCookie,
  clear: clearCookie
}

// 模拟按键
export function mutateKeys (ctrlKey = false, shiftKey = false, key) {
  key = key?.toUpperCase()
  const keyCode = key.charCodeAt()
  var e = new KeyboardEvent(
    'keydown',
    {
      bubbles: true,
      cancelable: true,
      key: key,
      char: key,
      keyCode: keyCode,
      ctrlKey: ctrlKey,
      shiftKey: shiftKey
    })
  return document.body.dispatchEvent(e)
}

// 更新notionx本地存储
export function setLocalNotionXState (data) {
  localStorage.setItem(
    NOTIONX_STORE_KEY,
    JSON.stringify(data)
  )
}
export function getLocalNotionXState () {
  return JSON.parse(localStorage.getItem(NOTIONX_STORE_KEY) || '{}')
}

// adapt to various page situations and find our button's container
// 找到notion页面header节点
export function adapterNotionHeader () {
  const siblings = [
    '.notion-topbar-share-menu',
    '.notion-topbar-more-button',
  ]
  for (let i = 0; i < siblings.length; i++) {
    const selector = siblings[i]
    const node = document.querySelector(selector)
    const p = node?.parentElement || node?.parentNode
    if (p && p.nodeType) {
      return p
    }
  }
  const node = document.querySelector('.notionLogo')
  const p = node?.parentElement?.parentElement || node?.parentNode?.parentNode
  if (p && p.nodeType) {
    return p
  }
  return '.notion-topbar>div'
}

// 根据blockId获取DOM
export function getBlockNode (id) {
  return document.querySelector(`[data-block-id="${id}"]`)
}

// 滚动至block
export function scrollToBlock (id) {
  const node = getBlockNode(id)
  document.body.click()
  node && setTimeout(() => {
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, 0)
}

// 全屏遮罩
export function mask () {
  let $mask = $('.notionx-mask')
  if ($mask.length === 0) {
    $mask = $(`
      <div class="notionx-mask" style="display:none;">
        <svg aria-hidden="true">
          <use xlink:href="#icon-loading"></use>
        </svg>
      </div>
    `)
    document.body.appendChild($mask[0])
  }
  return {
    show () {
      $mask.show()
    },
    hide () {
      $mask.hide()
    }
  }
}
