/* eslint-disable no-lone-blocks */
import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import {
  domObserver,
  sideBarScrollToTop,
  scrollToTop,
  setLocalNotionXState,
  getLocalNotionXState,
  adapterNotionHeader,
  scrollToBlock,
} from '../utils/util'
import {
  DEFAULT_OPTS,
  NOTION_WRAPPER_SELECTOR,
  NOTION_APP_SELECTOR,
  MAX_WIDTH,
  MIN_WIDTH,
  DEFAULT_VIEW_KEY,
  COLORS,
} from '../utils/constant'

export default class NotionX {
  // 响应式状态
  #state = new Proxy({}, {
    set: (target, key, newVal) => {
      // this.#state.dark 变更 自动更新视图
      if (key === 'dark') {
        setTimeout(() => {
          if (document.querySelector('#dark-mode-inp')) {
            document.querySelector('#dark-mode-inp').checked = newVal
            if (newVal) {
              $('html').addClass('notionx-dark')
            } else {
              $('html').removeClass('notionx-dark')
            }
          }
        }, 0)
      }
      // this.#state.viewKey 变更 自动更新视图
      if (key === 'viewKey') {
        const oldVal = Reflect.get(target, key)
        newVal = newVal || DEFAULT_VIEW_KEY
        if (oldVal !== newVal) {
          const views = this.$views.find('.notionx-view')
          for (let i = 0; i < views.length; i++) {
            const curKey = views[i].dataset.view
            const curShow = !views[i].classList.contains('hide')
            if (newVal === curKey && !curShow) {
              views[i].classList.remove('hide') // 显示
            } else if (newVal !== curKey && curShow) {
              views[i].classList.add('hide') // 隐藏
            }
          }
          if (newVal === 'option') {
            this.$optionBtn.addClass('active')
          } else {
            this.$optionBtn.removeClass('active')
          }
        } else {
          return // 无需更新
        }
      }
      if (key === 'fsmState') {
        newVal = newVal || 'hide'
        const cb = this.#fsm.hide[newVal]
        if (this.__ob__) {
          if (newVal === 'hide') {
            this.__ob__.stop()
          } else {
            this.__ob__.start()
          }
        }
        cb && cb.call(this, false)
      }
      // this.#state.width 变更 自动更新sidebar宽度css变量
      if (key === 'width') {
        this.$notionx[0].style.setProperty('--sidebarWidth', newVal + 'px')
      }
      // 变更自动同步本地存储
      const ret = Reflect.set(target, key, newVal)
      setLocalNotionXState(this.#state)
      return ret
    }
  })

  // fsm状态机 控制sidebar的hide/hover/pinned三种状态
  #fsm = {
    /* ================= hide ============= */
    hide: {
      // hide => hover
      hover: (needUpdate = true) => {
        this.$notionx.removeClass('pinned')
        this.$notionx.addClass('hover')
        this.$sideBarBtn.addClass('hover')
        this.$sideBarBtn.removeClass('hide')
        if (needUpdate) this.#state.fsmState = 'hover'
      },
      // hide => pinned
      pinned: (needUpdate = true) => {
        this.$notionx.removeClass('hover')
        this.$notionx.addClass('pinned')
        this.$sideBarBtn.removeClass('hover')
        this.$sideBarBtn.addClass('hide')
        if (needUpdate) this.#state.fsmState = 'pinned'
      }
    },
    /* ================= hover ============= */
    hover: {
      // hover => hide
      hide: (needUpdate = true) => {
        this.$notionx.removeClass('pinned')
        this.$notionx.removeClass('hover')
        this.$sideBarBtn.removeClass('hover')
        this.$sideBarBtn.removeClass('hide')
        if (needUpdate) this.#state.fsmState = 'hide'
      },
      // hover => pinned
      pinned: (needUpdate = true) => {
        this.$notionx.removeClass('hover')
        this.$notionx.addClass('pinned')
        this.$sideBarBtn.removeClass('hover')
        this.$sideBarBtn.addClass('hide')
        if (needUpdate) this.#state.fsmState = 'pinned'
      }
    },
    /* ================= pinned状态 ============= */
    pinned: {
      // pinned => hide
      hide: () => {
        this.$notionx.removeClass('pinned')
        this.$notionx.removeClass('hover')
        this.$sideBarBtn.removeClass('hover')
        this.$sideBarBtn.removeClass('hide')
        this.#state.fsmState = 'hide'
      },
      // pinned => hover
      hover: () => {
        this.$notionx.addClass('hover')
        this.$notionx.removeClass('pinned')
        this.$sideBarBtn.addClass('hover')
        this.$sideBarBtn.removeClass('hide')
        this.#state.fsmState = 'hover'
      }
    }
  }

  constructor () {
    this.init()
    return this
  }

  async init () {
    try {
      if (this.mount()) {
        this.initStates()
        this.initEvents()
        this.__ob__ = this.initNotionOb()
        this.#state.fsmState = this.#state.fsmState // 强制更新一次
      } else {
        console.warn('NotionX - 初始化失败 NotionX.mount()')
      }
    } catch (e) {
      console.warn(`NotionX - 初始化失败 ${e.message}`)
    }
  }

  destroy () {
    if (this.notionOb) {
      this.notionOb.disconnect()
      this.notionOb = null
      window.notionx = null
    }
  }

  // 合并默认配置 + 获取本地存储配置
  initStates () {
    const options = DEFAULT_OPTS
    const localState = getLocalNotionXState()
    for (const key of Object.keys(options)) {
      if (localState[key] !== undefined && localState[key] !== null) {
        options[key] = localState[key]
      }
      this.#state[key] = options[key]
    }
  }

  // init dom/style
  mount () {
    // inject
    this.$html = $('html')
    this.$notionApp = $('#notion-app')
    this.$notionCenter = this.$notionApp.find('.notion-frame')
    this.$document = $(document)
    this.$notionXWrap = $(NOTION_WRAPPER_SELECTOR)
    this.$headerBtnWrap = $(adapterNotionHeader())
    if (this.$headerBtnWrap.length === 0) return false
    adapterNotionStyle.call(this)

    // dom append
    this.$notionx = $(template.notionx)
    this.$sidebar = this.$notionx.find('.notionx-sidebar')
    this.$hiderBtn = this.$notionx.find('.notionx-hider-btn')
    this.$sideHeader = this.$notionx.find('.notionx-header')
    this.$tocWrap = this.$notionx.find('.notionx-view[data-view="toc"] .content')
    this.$pageTopBtn = this.$notionx.find('.notionx-view[data-view="toc"] .pageTopBtn')
    this.$toTopBtn = this.$notionx.find('.to-top-btn')
    this.$pageStats = this.$notionx.find('.notionx-page-stats')
    this.$optionBtn = this.$notionx.find('.option-btn')
    this.$optionView = this.$notionx.find('.notionx-view-option')
    this.$resizer = this.$notionx.find('.notionx-resizer')
    this.$views = this.$notionx.find('.notionx-views')
    this.$sideBarBtn = $(template.sideBarBtn)
    this.$darkBtn = $(template.darkBtn)
    this.$headerBtnWrap.append(this.$darkBtn)
    this.$headerBtnWrap.append(this.$sideBarBtn)
    this.$notionXWrap.append(this.$notionx)
    return true

    function adapterNotionStyle () {
      this.$notionCenter.addClass('notionX-notionCenter')
    }
  }

  // 响应式内容的监听
  initActiveEvents () {
    this.$notionx.find('a[data-for-block-id]').click(e => {
      const id = e.currentTarget?.attributes['data-for-block-id']?.value
      id && scrollToBlock(id)
    })
    this.$notionx.find('label').click(e => {
      setTimeout(() => {
        const checks = this.$notionx.find('input.notionx-toc-inp')
        const expandStatus = [...checks]
          .map(check => check.checked)
        this.#state.expandStatus = expandStatus
      }, 0)
    })
  }

  // event handlers中只更新状态 不接触视图
  initEvents () {
    // 离开页面销毁
    window.addEventListener('beforeunload', () => {
      this.destroy()
    })

    // sidebar内部滚动至顶部
    this.$toTopBtn.click(sideBarScrollToTop)

    // notion page滚动至顶部
    this.$pageTopBtn.click(scrollToTop)

    // Dark Mode 开关
    this.$darkBtn.find('label').click(e => {
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

    // change view handler
    this.$optionBtn.click(() => {
      if (this.#state.viewKey === 'option') {
        this.#state.viewKey = DEFAULT_VIEW_KEY
      } else {
        this.#state.viewKey = 'option'
      }
    })

    // sideBar & button handler
    {
      this.$sideBarBtn.hover(
      // mouseover
        e => {
          const cb = this.#fsm[this.#state.fsmState].hover
          cb && cb.call(this, e)
        },
        // mouseout
        e => {
          if (this.#state.fsmState === 'pinned') return
          const cb = this.#fsm[this.#state.fsmState].hide
          cb && cb.call(this, e)
        }
      )
      this.$sidebar.hover(
      // mouseover
        e => {
          if (this.#state.fsmState === 'pinned') return
          const cb = this.#fsm[this.#state.fsmState].hover
          cb && cb.call(this, e)
        },
        // mouseout
        e => {
          if (this.#state.fsmState === 'pinned') return
          const cb = this.#fsm[this.#state.fsmState].hide
          cb && cb.call(this, e)
        }
      )
      this.$sideBarBtn.click(e => {
        const cb = this.#fsm[this.#state.fsmState].pinned
        cb && cb.call(this, e)
      })
      this.$hiderBtn.click(e => {
        const cb = this.#fsm[this.#state.fsmState].hide
        cb && cb.call(this, e)
      })
    }

    // resizer: adjust sidebar width
    const _resizer = this.$resizer
    const _box = this.$notionx
    const _fa = this.$notionXWrap
    this.$resizer.mousedown((e) => {
      if (this.#state.fsmState !== 'pinned') return // 非pinned状态禁止调节宽度

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
  }

  // notion app observer for update TOC dynamically
  initNotionOb () {
    this.notionObCount = 0
    // update sidebar content (using throttle)
    // 根据页面总字数 确定节流时间间隔
    const capacity = document.querySelector('.notion-page-content')?.textContent?.length || 0
    let interval = 5000
    if (capacity === 0) {
      interval = 5000
    } else if (capacity <= 5000) {
      interval = 500
    } else if (capacity <= 20000) {
      interval = 1000
    } else if (capacity <= 50000) {
      interval = 2000
    }
    function renderSideContent () {
      const cb = () => { this.realRender() }
      return _.debounce(cb, interval, { leading: true, trailing: true, maxWait: interval })
    }
    return {
      stop: () => {
        this.notionOb = null
      },
      start: () => {
        this.notionOb = domObserver(NOTION_APP_SELECTOR, renderSideContent.call(this))
      },
    }
  }

  realRender () {
    const _self = this

    // 页面统计
    if (this.$pageStats) {
      const words = document.querySelector('.notion-page-content')?.textContent?.replace(/\s/g, '')?.length || '-'
      const blocks = document.querySelectorAll('.notion-page-content [data-block-id]').length || '-'
      this.$pageStats.html(`Words:${words};Blocks:${blocks}`)
    }

    // sidebar生成
    const $wrap = this.$tocWrap
    if (_self.notionOb === null) return
    if (process.env.NODE_ENV !== 'production') performance.mark('notionOb-start')
    const checks = $wrap[0].querySelectorAll('input.notionx-toc-inp') // 获取并更新折叠状态
    let expandStatus = [...checks]
      .map(check => check.checked)
    if (_self.notionObCount === 0 && _self.#state.expandStatus) {
      expandStatus = _self.#state.expandStatus
    } else {
      this.#state.expandStatus = expandStatus
    }
    const s = contentsToGenerate(expandStatus)
    $wrap.html(s)

    // 事件激活
    _self.initActiveEvents()

    // ob性能统计
    _self.notionObCount++
    if (process.env.NODE_ENV !== 'production') {
      performance.mark('notionOb-end')
      performance.measure(
        'notionOb',
        'notionOb-start',
        'notionOb-end',
      )
      const measures = performance.getEntriesByName('notionOb')
      console.log(`notionOb #${_self.notionObCount} spend: ` + measures[measures.length - 1].duration + ' ms') // interval 2000时，20个header页面duration不超过5ms
    }
  }
}

function contentsToGenerate (statusArr) {
  return [
    {
      generator: getToc,
      header: 'Header Blocks',
      name: 'toc',
    },
    {
      generator: getToggle,
      header: 'Toggle Blocks',
      name: 'toggle',
    },
    {
      generator: getDataBase,
      header: 'DataBase',
      name: 'dataBase',
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
    return `
    <div class="toggle-box">
      <input type="checkbox" class="notionx-toc-inp" id="notionx-toc-inp-${content.name}" ${statusArr[i] ? 'checked="true"' : ''}/>
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
      .filter(e => e.id && e.level && e.desc)
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
      return `<li class="level-${e.level}" title="${e.desc || ''}">
        <a href="#" data-for-block-id="${e.id}">${e.desc || ''}</a>
      </li>`
    }
  }
  function getToggle () {
    const levels = []
    return [...document.querySelectorAll('.notion-toggle-block')].map(extractInfo)
      .filter(e => e.id && e.desc)
      .map(toHtml)
      .join('')
    function extractInfo (e) {
      const id = e.dataset.blockId
      const desc = e.querySelector('[contenteditable]')?.innerText
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
  function getComment () {
    return [...document.querySelectorAll('.speechBubble')]
      .map(extractInfo)
      .filter(e => e.id && e.desc)
      .map(toHtml)
      .join('')
    function extractInfo (bubble) {
      const e = bubble.closest('[data-block-id]')
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
  function getDataBase () {
    return [...document.querySelectorAll('.notion-collection_view-block [contenteditable][data-root=true]')].map(extractInfo)
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
