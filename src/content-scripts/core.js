/* eslint-disable no-lone-blocks */
import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import {
  domObserver,
  sideBarScrollToTop,
  setLocalNotionXState,
  getLocalNotionXState,
  adapterNotionHeader,
  scrollToBlock,
  hideNotionRightSide,
} from '../utils/util'
import {
  DEFAULT_OPTS,
  NOTION_WRAPPER_SELECTOR,
  MAX_WIDTH,
  MIN_WIDTH,
  COLORS,
} from '../utils/constant'

export default class NotionX {
  // reactive states
  #state = new Proxy({}, {
    set: (target, key, newVal) => {
      try {
        // this.#state.dark 变更 自动更新视图暗黑模式
        if (key === 'dark') {
          setTimeout(() => {
            if (document.querySelector('#dark-mode-inp')) {
              document.querySelector('#dark-mode-inp').checked = newVal
              if (newVal) {
                $('body.notion-body').addClass('dark')
              } else {
                $('body.notion-body').removeClass('dark')
              }
            }
          }, 0)
        }
        if (key === 'sidebarShow') {
          if (!this.__ob__) {
            this.__ob__ = this.initNotionOb()
          }
          if (newVal) {
            this.__ob__.start()
          } else {
            this.__ob__.stop()
          }
        }
        // this.#state.width 变更 自动更新sidebar宽度css变量
        if (key === 'width') {
          if (this.__ob__ && this.#state.showSidebar) {
            this.$notionx[0].style.setProperty('--sidebarWidth', newVal + 'px')
          }
        }
        // sidebar 响应式内容启用/禁用状态genFlagList
        if (key === 'genFlagList') {
          if (this.__ob__) {
            this.__ob__.update()
          }
        }
      } catch (e) {
        console.error(e)
      }

      // 变更自动同步本地存储
      const ret = Reflect.set(target, key, newVal)
      setLocalNotionXState(this.#state)
      return ret
    }
  })

  constructor () {
    this.init()
    return this
  }

  init () {
    try {
      if (this.mount()) {
        this.initStates()
        this.initEvents()
      } else {
        console.error('NotionX - mount失败 ')
      }
    } catch (e) {
      console.error(`NotionX - 初始化失败 ${e.message}`)
    }
  }

  // init dom
  mount () {
    try {
      // inject
      this.$html = $('html')
      this.$notionApp = $('#notion-app')
      this.$notionCenter = this.$notionApp.find('.notion-frame')
      this.$document = $(document)
      this.$headerBtnWrap = $(adapterNotionHeader())
      if (this.$headerBtnWrap.length === 0) return false

      // dom append
      this.$sideBarBtn = $(template.sideBarBtn)
      this.$darkBtn = $(template.darkBtn)
      this.$headerBtnWrap.append(this.$darkBtn)
      this.$headerBtnWrap.append(this.$sideBarBtn)
      return true
    } catch {
      return false
    }
  }

  // merge default options and localstorage options
  initStates () {
    const options = DEFAULT_OPTS
    const localState = getLocalNotionXState()
    for (const key of Object.keys(options)) {
      if (localState[key] !== undefined && localState[key] !== null) {
        options[key] = localState[key]
      }
      this.#state[key] = options[key]
    }
    if (!this.#state.genFlagList) {
      this.#state.genFlagList = new Array(this.contentsToGenerate.length).fill(true)
    }
  }

  destroy () {
    if (window.notionx) {
      window.notionx.__ob__ && window.notionx.__ob__.stop()
      window.notionx = null
    }
  }

  // event handlers：only change state, not touch view
  initEvents () {
    // destory before leave page
    window.addEventListener('beforeunload', () => {
      this.destroy()
    })

    // notion native sidebar handler
    const track = eve => {
      const el = eve.currentTarget
      const isActive = !!el.style.backgroundColor
      const notionxActive = this.#state.sidebarShow
      if (isActive && notionxActive) {
        this.#state.sidebarShow = false
      }
    }
    this.$headerBtnWrap.find('.notion-topbar-comments-button').on('click', track)
    this.$headerBtnWrap.find('.notion-topbar-updates-button').on('click', track)

    // Dark Mode toggle handler
    this.$darkBtn.find('label').on('click', e => {
      e.stopPropagation()
      const oldChecked = $(e.currentTarget)
        ?.parent()
        ?.find('input')[0]
        ?.checked
      if (!oldChecked) {
        this.#state.dark = true
      } else {
        this.#state.dark = false
      }
    })

    // sideBar button handler
    this.$sideBarBtn.on('click', e => {
      if (this.#state.sidebarShow) {
        this.#state.sidebarShow = false
      } else {
        this.#state.sidebarShow = true
      }
    })
  }

  // notion app observer for update TOC dynamically
  initNotionOb () {
    this.notionObCount = 0

    // update sidebar content (using throttle)
    // 根据页面总字数 确定节流时间间隔
    const capacity = document.querySelector('.notion-page-content')?.textContent?.length || 0
    let interval = 5000
    if (capacity === 0) {
      interval = 100
    } else if (capacity <= 5000) {
      interval = 500
    } else if (capacity <= 20000) {
      interval = 1000
    } else if (capacity <= 50000) {
      interval = 2000
    }
    return {
      stop: () => {
        this.hideSidebar()

        // observer stop
        if (this.notionOb) this.notionOb.disconnect()
        this.notionOb = null
        this.notionObRunning = false
      },
      start: () => {
        if (!this.notionObRunning) {
          this.showSidebar()

          // observer start
          const cb = () => { this.updateSidebar() }
          this.notionOb = domObserver(
            '#notion-app .notion-frame',
            _.debounce(cb, interval, { leading: false, trailing: true, maxWait: interval })
          )
          this.notionObRunning = true
        } else {
          this.updateSidebar()
        }
      },
      update: () => {
        if (this.notionObRunning) {
          this.updateSidebar()
        }
      },
    }
  }

  showSidebar () {
    // if (!this.#state.sidebarShow) return
    // 隐藏notion 原生 sidebar
    hideNotionRightSide()
    setTimeout(() => {
      this.$notionXWrap = $(NOTION_WRAPPER_SELECTOR)
      this.$notionx = $(template.notionx)
      this.$sidebar = this.$notionx.find('.notionx-sidebar')
      this.$sideHeader = this.$notionx.find('.notionx-header')
      this.$tocWrap = this.$notionx.find('.notionx-view[data-view="toc"] .content')
      this.$toTopBtn = this.$notionx.find('.to-top-btn')
      this.$pageStats = this.$notionx.find('.notionx-page-stats')
      this.$resetBtn = this.$notionx.find('.notionx-reset-btn')
      this.$optionView = this.$notionx.find('.notionx-view-option')
      this.$resizer = this.$notionx.find('.notionx-resizer')
      this.$views = this.$notionx.find('.notionx-views')
      this.$notionXWrap.append(this.$notionx)
      const _self = this
      // if (_self.notionOb === null) return

      if (process.env.NODE_ENV !== 'production') performance.mark('notionOb-start')

      // 事件激活
      this.$notionx.find('a[data-for-block-id]').on('click', e => {
        const id = e.currentTarget?.attributes['data-for-block-id']?.value
        id && scrollToBlock(id)
      })
      this.$notionx.find('div.close-btn').on('click', e => {
        const parentDom = e.currentTarget.closest('.toggle-box')
        parentDom.style.display = 'none'
        const index = parseInt(parentDom.dataset.toggleIndex)
        const arr = this.#state.genFlagList
        this.#state.genFlagList = arr.map((flag, i) => {
          return i === index ? false : flag
        })
        e.stopPropagation()
      })

      // reset all modules in sidebar
      this.$resetBtn.on('click', () => {
        const toggles = [...this.$tocWrap.find('.toggle-box')]
        this.#state.genFlagList = new Array(toggles.length).fill(true)
      })

      // sidebar scroll to top handler
      this.$toTopBtn.on('click', sideBarScrollToTop)

      // resizer handler: adjust sidebar width
      const _resizer = this.$resizer
      const _box = this.$notionx
      const _fa = this.$notionXWrap
      this.$resizer.on('mousedown', (e) => {
        if (!this.#state.sidebarShow) return

        _box.addClass('no-transition')
        const box = _box[0]
        const fa = _fa[0]
        e.stopPropagation()
        e.preventDefault()
        const pos = {
          w: box.offsetWidth,
          x: e.clientX
        }
        fa.onmousemove = (ev) => {
          ev.preventDefault()
          const w = Math.min(Math.max(MIN_WIDTH, pos.x - ev.clientX + pos.w), MAX_WIDTH)

          requestAnimationFrame(() => {
            // 存储新宽度 并更新视图的操作，交给#state的proxy来做
            this.#state.width = w
          })
        }
        fa.onmouseleave = () => {
          fa.onmousemove = null
          fa.onmouseup = null
          if (_resizer.releaseCapture) _resizer.releaseCapture()
          _box.removeClass('no-transition')
        }
        fa.onmouseup = () => {
          fa.onmousemove = null
          fa.onmouseup = null
          if (_resizer.releaseCapture) _resizer.releaseCapture()
          _box.removeClass('no-transition')
        }
        if (_resizer.setCapture) _resizer.setCapture()
      })

      // ob性能统计
      _self.notionObCount++
      if (process.env.NODE_ENV !== 'production') {
        performance.mark('notionOb-end')
        performance.measure(
          'notionOb',
          'notionOb-start',
          'notionOb-end',
        )
        // const measures = performance.getEntriesByName('notionOb')
        // console.log(`notionOb #${_self.notionObCount} spend: ` + measures[measures.length - 1].duration + ' ms') // interval 2000时，20个header页面duration不超过5ms
      }
    }, 0)
  }

  hideSidebar () {
    if (this.$notionx) {
      this.$notionx.remove()
    }
  }

  // 页面内容更新
  contentsToGenerate = [
    {
      generator: this.getToc,
      header: 'Header Blocks',
      name: 'toc',
      className: 'sidebarHeader',
      index: 0
    },
    {
      generator: this.getToggle,
      header: 'Toggle Blocks',
      name: 'toggle',
      className: 'sidebarToggle',
      index: 1
    },
    {
      generator: this.getDataBase,
      header: 'DataBase',
      name: 'dataBase',
      className: 'sidebarDatabase',
      index: 2
    },
    // {
    //   generator: this.getComment,
    //   header: 'Comments',
    //   name: 'comment',
    //   className: 'sidebarComment',
    //   index: 3
    // },
    {
      generator: this.getColorText,
      header: 'Colored Text',
      name: 'color',
      className: 'sidebarColorText',
      index: 4
    },
  ]

  updateSidebar () {
    // 更新页面统计数据
    if (this.$pageStats) {
      let content = document.querySelector('.notion-page-content')?.innerHTML
      if (!content) return
      // 文字内容识别
      content = content.replace(/(<[\w'"\s\-.&/();=:%,]*>)+/g, '*')
      // 英文单词数量
      let words = content.match(/[a-zA-Z]+[\s*]/g)?.length
      // 其他符号字数
      words += content.replace(/([a-zA-Z]+[\s*])|\*/g, '')?.length
      // block数量
      const blocks = document.querySelectorAll('.notion-page-content [data-block-id]').length || '-'
      this.$pageStats.html(`Words:${words};Blocks:${blocks}`)
    }

    return this.contentsToGenerate
      .forEach((content, i) => {
        const $wrap = this.$tocWrap
        // 更新
        let $content = $wrap.find('.' + content.className)
        if ($content.length === 0) {
          $content = $(`
          <div class="toggle-box ${content.className}" style="display:${this.#state.genFlagList[i] ? '' : 'none'}" data-toggle-index="${content.index}">
            <input type="checkbox" class="notionx-toc-inp" id="notionx-toc-inp-${content.name}"/>
            <label for="notionx-toc-inp-${content.name}">
              ${content.header}
            </label>
            <div class="content notionx-view-toc-content-wrap"></div>
            <div class="notionx-icon close-btn">
              <svg aria-hidden="true">
                <use xlink:href="#icon-close"></use>
              </svg>
            </div>
          </div>
          `)
          $wrap.append($content)
        }
        if (this.#state.genFlagList[i]) {
          // 生成
          const contentStr = content.generator()
          $content.find('.notionx-view-toc-content-wrap').html(contentStr)
        }
      })
  }

  getToc () {
    let tocs = [...document.querySelectorAll(
      `.notion-header-block,
      .notion-sub_header-block,
      .notion-sub_sub_header-block
    `)].map(extractInfo)
      .filter(e => e.id && e.level && e.desc)
    tocs = flatLevel(tocs)
    return tocs.map(toHtml)
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
    function flatLevel (arr) {
      const min = arr.reduce((p, c) => {
        return Math.min(p, c.level)
      }, Number.MAX_SAFE_INTEGER)
      return arr.map(i => {
        return {
          ...i,
          level: i.level - min + 1
        }
      })
    }
    function toHtml (e) {
      return `<li class="level-${e.level}" title="${e.desc || ''}">
        <a href="#" data-for-block-id="${e.id}">${e.desc || ''}</a>
      </li>`
    }
  }

  getToggle () {
    const levels = []
    return [...document.querySelectorAll('.notion-toggle-block')].map(extractInfo)
      .filter(e => e.id && e.desc)
      .map(toHtml)
      .join('')
    function extractInfo (e) {
      const id = e.dataset.blockId
      const desc = e.querySelector('[contenteditable][data-content-editable-leaf]')?.innerText
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
      return `<li class="level-${e.level + 1}" title="${e.desc || ''}">
        <a href="#" data-for-block-id="${e.id}">${e.desc || ''}</a>
      </li>`
    }
  }

  /* getComment () {
    return [...document.querySelectorAll('.speechBubble')]
      .map(extractInfo)
      .filter(e => e && e.id && e.desc)
      .map(toHtml)
      .join('')
    function extractInfo (bubble) {
      const e = bubble.closest('[data-block-id]')
      if (!e) return
      const id = e.dataset.blockId
      const desc = e.querySelector('[contenteditable]')?.innerHTML
      const comment = bubble?.nextSibling?.innerText
      return {
        id,
        desc,
        comment,
      }
    }
    function toHtml (e) {
      return `<li class="level-1" title="${e.comment || ''}">
        <a href="#" data-for-block-id="${e.id}">${e.desc || ''}: ${e.comment || ''}</a>
      </li>`
    }
  } */
  getColorText () {
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
      .filter(i => i.id && i.content)
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

  getDataBase () {
    return [...document.querySelectorAll('.notion-collection_view-block [data-content-editable-leaf][contenteditable]')].map(extractInfo)
      .filter(e => e.id && e.desc)
      .map(toHtml)
      .join('')
    function extractInfo (e) {
      const block = e.closest('[data-block-id]')
      const id = block?.dataset.blockId
      const desc = e.innerText
      return {
        id,
        desc,
      }
    }
    function toHtml (e) {
      return `<li class="level-1" title="${e.desc || ''}">
        <a href="#" data-for-block-id="${e.id}">${e.desc || ''}</a>
      </li>`
    }
  }
}
