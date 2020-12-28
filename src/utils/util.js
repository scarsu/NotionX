import $ from 'jquery'
import {
  NOTION_SCROLLER_SELECTOR
} from './constant'

/**
 * localStorage工具函数
 */

/**
 * DOM Observer
 * @param {string} selector The selector of the observed DOM
 * @param {function} cb Callback function executed when the DOM changes
 * @param {array} args arguments for callback
 */
export function DomObserver (selector, cb, name) {
  const observer = new MutationObserver((arg) => {
    // console.log(name, 'observer executed')
    cb(arg)
  })
  const el = document.querySelector(selector)
  const config = {
    childList: true,
    subtree: true
  }
  observer.observe(el, config)
  return observer
}

/**
 * notion page滚动到顶部
 */
export function scrollToTop () {
  $(NOTION_SCROLLER_SELECTOR).animate(
    {
      scrollTop: 0
    },
    200,
    null
  )
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
