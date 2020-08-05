import $ from 'jquery'
import { NOTION_SCROLLER_SELECTOR, NOTIONX_STORE_KEY, DEFAULT_OPTS, NOTION_PAGE_READY_SELECTOR } from './constant'

/**
 * localStorage工具函数
 */

/**
 * DOM Observer
 * @param {string} selector The selector of the observed DOM
 * @param {function} cb Callback function executed when the DOM changes
 * @param {array} args arguments for callback
 */
export function DomObserver (selector, cb, args) {
  this.observer = new MutationObserver(args => cb(args))
  this.el = document.querySelector(selector)
  const config = {
    childList: true,
    subtree: true
  }
  this.observer.observe(this.el, config)
  return this
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
 * 检查notion app加载
 * @param {string} selector 用于判断的函数
 */
export const waitNotionPageReady = (selector = NOTION_PAGE_READY_SELECTOR) =>
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
export const notionxLocalStore = {
  get: function (key) {
    let store = JSON.parse(localStorage.getItem(NOTIONX_STORE_KEY))
    if (store === null) {
      store = DEFAULT_OPTS
      this.setAll(store)
    }
    if (key === undefined) {
      return store
    } else {
      return store[key]
    }
  },
  setAll: function (val) {
    localStorage.setItem(NOTIONX_STORE_KEY, JSON.stringify(val))
  },
  set: function (key, val) {
    if (key === undefined) return
    const store = this.get()
    store[key] = val
    this.setAll(store)
  }
}
