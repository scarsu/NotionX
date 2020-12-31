import $ from 'jquery'
import {
  NOTION_SCROLLER_SELECTOR,
  NOTIONX_STORE_KEY,
  COLORS
} from './constant'

/**
 * DOM Observer
 * @param {string} selector The selector of the observed DOM
 * @param {function} cb Callback function executed when the DOM changes
 * @param {array} args arguments for callback
 */
export function domObserver (selector, cb, name) {
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
    if (p !== null) {
      return p
    }
  }
  return '.notion-topbar>div'
}

// 根据blockId获取DOM
export function getBlockNode (id) {
  return document.querySelector(`[data-block-id="${id}"]`)
}

// 显示block
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

//
export function contentsToGenerate (statusArr) {
  return [
    {
      generator: getToc,
      header: 'Table of Content',
      name: 'toc',
    },
    {
      generator: getToggle,
      header: 'Toggle Blocks',
      name: 'toggle',
    },
    {
      generator: getComment,
      header: 'Comments',
      name: 'comment',
    },
    {
      generator: getColorText,
      header: 'Colored Text',
      name: 'color',
    },
  ]
    .map(generateHtml)
    .join('')

  function generateHtml (content, i) {
    const contentStr = content.generator()
    console.log(statusArr)
    return `
    <div class="toggle-box">
      <input type="checkbox" id="notionx-toc-inp-${content.name}" ${statusArr[i] ? 'checked' : ''}/>
      <label for="notionx-toc-inp-${content.name}">
        ${content.header}
      </label>
      <div class="content notionx-view-toc-content-wrap">${contentStr}</div>
    </div>
    `
  }
  function getToc () {
    return [...document.querySelectorAll(
      `.notion-header-block,
      .notion-sub_header-block,
      .notion-sub_sub_header-block
    `)].map(extractInfo)
      .filter(e => e.id && e.level)
      .map(toHtml)
      .join('')

    function extractInfo (e) {
      const id = e.dataset.blockId
      const desc = e.innerText
      return {
        id,
        desc,
        level: e.classList.contains('notion-header-block')
          ? 1
          : e.classList.contains('notion-sub_header-block')
            ? 2
            : 3
      }
    }
    function toHtml (e) {
      return `<li class="level-${e.level}" title="${e.desc}">
        <a href="#" data-for-block-id="${e.id}">${e.desc}</a>
      </li>`
    }
  }
  function getToggle () {
    const levels = []
    return [...document.querySelectorAll('.notion-toggle-block')].map(extractInfo)
      .filter(e => e.id)
      .map(toHtml)
      .join('')
    function extractInfo (e) {
      const id = e.dataset.blockId
      const desc = e.querySelector('[contenteditable="true"]')?.innerText
      const left = e.offsetLeft
      let level = levels.findIndex(i => i === left)
      if (level === -1) {
        levels.push(left)
        levels.sort()
      }
      level = levels.findIndex(i => i === left)
      return {
        id,
        desc,
        level
      }
    }
    function toHtml (e) {
      return `<li class="level-${e.level + 1}" title="${e.desc}">
        <a href="#" data-for-block-id="${e.id}">${e.desc}</a>
      </li>`
    }
  }
  function getComment () {
    return [...document.querySelectorAll('.speechBubble')]
      .map(getBlockElem)
      .map(extractInfo)
      .filter(e => e.id)
      .map(toHtml)
      .join('')
    function getBlockElem (e) {
      return e.closest('[data-block-id]')
    }
    function extractInfo (e) {
      const id = e.dataset.blockId
      const desc = e.querySelector('[contenteditable="true"]')?.innerText
      return {
        id,
        desc
      }
    }
    function toHtml (e) {
      return `<li class="level-1" title="${e.desc}">
        <a href="#" data-for-block-id="${e.id}">${e.desc}</a>
      </li>`
    }
  }
  function getColorText () {
    const theme = document.querySelector('.notion-body').classList.contains('dark') ? 'dark' : 'light'
    const blocks = COLORS
      .filter(i => i.theme === theme)
      .map(selectorFromColor)
      .flatMap(s => [...document.querySelectorAll(s)])
      .map(e => e.closest('[data-block-id]'))
      .filter(i => i)
    return blocks
      .filter(isDistinct)
      .map(extractInfo)
      .map(toHtml)
      .join('')
    function isDistinct (block, i) {
      return blocks.findIndex(blockIdEqual) === i
      function blockIdEqual (b) {
        return b.dataset.blockId === block.dataset?.blockId
      }
    }
    function selectorFromColor (color) {
      return color.type === 'font'
        ? `[style*="color:${color.value.replace(/\s/g, '')}"]`
        : `[style*="background:${color.value.replace(/\s/g, '')}"]`
    }
    function extractInfo (block) {
      const id = block.dataset.blockId
      const child = block.querySelector('[contenteditable]')
      const content = child.innerHTML
      const desc = child.innerText
      return {
        id,
        content,
        desc
      }
    }
    function toHtml (e) {
      return `<li class="level-1" title="${e.desc}">
        <a href="#" data-for-block-id="${e.id}">${e.content}</a>
      </li>`
    }
  }
}
