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
export function DomObserver (selector, cb) {
  const observer = new MutationObserver((arg) => { cb(arg) })
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
 * 检查notion app加载
 * @param {string} selector 用于判断的函数
 */
export const waitNotionPageReady = (selector = '.notion-topbar') => new Promise((resolve) => {
  const delay = 500
  const f = () => {
    const element = document.querySelector(selector)
    if (element != null && element.children.length > 0) {
      resolve(element)
    } else {
      setTimeout(f, delay)
    }
  }
  f()
})
