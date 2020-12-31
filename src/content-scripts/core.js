/* eslint-disable no-lone-blocks */
import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import {
  domObserver,
  scrollToTop,
  setLocalNotionXState,
  getLocalNotionXState,
  adapterNotionHeader,
  scrollToBlock,
  contentsToGenerate,
} from '../utils/util'
import {
  DEFAULT_OPTS,
  NOTION_WRAPPER_SELECTOR,
  NOTION_APP_SELECTOR,
  // MAX_WIDTH,
  // MIN_WIDTH,
  DEFAULT_VIEW_KEY
} from '../utils/constant'

export default class NotionX {
  // 响应式状态
  #state = new Proxy({}, {
    set: (target, key, newVal) => {
      console.log('捕获到#state变更：')
      console.log('target', target)
      console.log('key', key)
      console.log('newVal', newVal)
      // this.#state.dark 变更 自动更新视图
      if (key === 'dark') {
        setTimeout(() => {
          document.querySelector('#dark-mode-inp').checked = newVal
          if (newVal) {
            $('html').addClass('notionx-dark')
          } else {
            $('html').removeClass('notionx-dark')
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
        cb && cb.call(this, false)
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
      hide: (needUpdate = true) => {
        this.$notionx.removeClass('pinned')
        this.$notionx.removeClass('hover')
        this.$sideBarBtn.removeClass('hover')
        this.$sideBarBtn.removeClass('hide')
        this.#state.fsmState = 'hide'
      },
      // pinned => hover
      hover: (needUpdate = true) => {
        this.$notionx.addClass('hover')
        this.$notionx.removeClass('pinned')
        this.$sideBarBtn.addClass('hover')
        this.$sideBarBtn.removeClass('hide')
        this.#state.fsmState = 'hover'
      }
    }
  }

  constructor () {
    debugger
    this.init()
    return this
  }

  async init () {
    this.mount()
    this.initStates()
    this.initEvents()
    this.notionOb()
  }

  destroy () {
    this.notionOb.disconnect()
    window.notionx = null
  }

  // 合并默认配置 + 获取本地存储配置
  initStates () {
    debugger
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
    adapterNotionStyle.call(this)

    // dom append
    this.$notionx = $(template.notionx)
    this.$sidebar = this.$notionx.find('.notionx-sidebar')
    this.$hiderBtn = this.$notionx.find('.notionx-hider-btn')
    this.$sideHeader = this.$notionx.find('.notionx-header')
    this.$tocWrap = this.$notionx.find('.notionx-view[data-view="toc"]')
    this.$toTopBtn = this.$notionx.find('.to-top-btn')
    this.$optionBtn = this.$notionx.find('.option-btn')
    this.$optionView = this.$notionx.find('.notionx-view-option')
    this.$resizer = this.$notionx.find('.notionx-resizer')
    this.$views = this.$notionx.find('.notionx-views')
    this.$sideBarBtn = $(template.sideBarBtn)
    this.$darkBtn = $(template.darkBtn)
    this.$headerBtnWrap.append(this.$darkBtn)
    this.$headerBtnWrap.append(this.$sideBarBtn)
    this.$notionXWrap.append(this.$notionx)

    function adapterNotionStyle () {
      this.$notionCenter.addClass('notionX-notionCenter')
    }
  }

  // 响应式内容的监听
  initActiveEvents () {
    debugger
    this.$notionx.find('a[data-for-block-id]').click(e => {
      const id = e.currentTarget?.attributes['data-for-block-id']?.value
      id && scrollToBlock(id)
    })
  }

  // event handlers中只更新状态 不接触视图
  initEvents () {
    // 离开页面销毁
    window.addEventListener('beforeunload', () => {
      this.destroy()
    })

    // TODO 需要变更为 sidebar内部滚动至顶部
    this.$toTopBtn.click(scrollToTop)

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

    // option change handler
    // this.$optionView.find('input').change(e => {
    //   const inp = e.currentTarget
    //   const key = inp.name
    //   if (!key) return
    //   this.#state.options[key] = inp.type === 'checkbox' ? inp.checked : inp.value
    // })

    // TODO resizer: adjust sidebar width
    /*
    const _resizer = this.$resizer
    const _sidebar = this.$sidebar
    const _box = this.$notionx
    const _fa = this.$notionXWrap
    this.$resizer.mousedown((e) => {
      _box.addClass('no-transition')
      const box = _box[0]
      const fa = _fa[0]
      const sidebar = _sidebar[0]
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
          sidebar.style.width = `${w}px`
          box.style.width = 'fit-content'
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
        // TODO: 记录宽度
        if (_resizer.releaseCapture) _resizer.releaseCapture()
        _box.removeClass('no-transition')
      }
      if (_resizer.setCapture) _resizer.setCapture()
    }) */
  }

  // notion app observer for update TOC dynamically
  notionOb () {
    renderSideContent.call(this)
    this.notionOb = domObserver(NOTION_APP_SELECTOR, renderSideContent.call(this))

    // update sidebar content (using throttle)
    function renderSideContent () {
      const _self = this
      const $wrap = this.$tocWrap
      return _.debounce(() => {
        performance.mark('notionOb-start')
        const checks = $wrap[0].querySelectorAll('input[type="checkbox"]')
        const expandStatus = [...checks]
          .map(check => check.checked)
        const s = contentsToGenerate(expandStatus)
        $wrap.html(s)
        _self.initActiveEvents()
        performance.mark('notionOb-end')
        performance.measure(
          'notionOb',
          'notionOb-start',
          'notionOb-end',
        )
        const measures = performance.getEntriesByName('notionOb')
        console.log('notionOb spend: ' + measures[measures.length - 1].duration + ' ms') // interval 2000时，20个header页面duration不超过5ms
      }, 2000, { leading: true, trailing: false, maxWait: 2000 })
    }
  }
}
