import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import { DomObserver, scrollToTop } from '../utils/util'
import {
  DEFAULT_OPTS,
  NOTIONX_STORE_KEY,
  NOTION_WRAPPER_SELECTOR,
  NOTION_APP_SELECTOR,
  VIEW_STATE,
  // MAX_WIDTH,
  // MIN_WIDTH,
  DEFAULT_VIEW_KEY
} from '../utils/constant'

export default class NotionX {
  constructor () {
    this.reset()
    this.init()
    return this
  }

  reset () {
    this.viewKey = DEFAULT_VIEW_KEY
    this.initOptions()
  }

  async init () {
    this.initNotionxFSM()
    this.initView()
    this.setView(this.viewKey)
    this.notionOb()
  }

  destroy () {
    this.notionOb.disconnect()
    window.notionx = null
  }

  // 更新当前配置至本地存储
  updateLocal (options) {
    localStorage.setItem(
      NOTIONX_STORE_KEY,
      JSON.stringify(options || this.options)
    )
  }

  // 合并 默认配置 + 本地存储的配置
  initOptions () {
    const options = DEFAULT_OPTS
    const localOptions = JSON.parse(
      localStorage.getItem(NOTIONX_STORE_KEY) || '{}'
    )
    for (const key of Object.keys(DEFAULT_OPTS)) {
      if (
        localOptions[key] !== undefined &&
        localOptions[key] !== null &&
        localOptions[key] !== ''
      ) {
        options[key] = localOptions[key]
      }
    }
    this.updateLocal(options)

    this.options = new Proxy(options, {
      get: (obj, key) => {
        const ret = Reflect.get(obj, key)
        return ret
      },
      set: (obj, key, value) => {
        const ret = Reflect.set(obj, key, value)
        // 同步本地存储
        this.updateLocal()
        return ret
      }
    })
  }

  // states(hover,pinned,hide) machine
  initNotionxFSM () {
    this.fsm = {
      /* ================= hide ============= */
      [VIEW_STATE.HIDE]: {
        name: VIEW_STATE.HIDE,
        [VIEW_STATE.HIDE]: () => {},
        // hide => hover
        [VIEW_STATE.HOVER]: () => {
          this.$notionx.removeClass('pinned')
          this.$notionx.addClass('hover')
          this.$sideBarBtn.addClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        },
        // hide => pinned
        [VIEW_STATE.PINNED]: () => {
          // TODO store
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.addClass('hide')
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      /* ================= hover ============= */
      [VIEW_STATE.HOVER]: {
        name: VIEW_STATE.HOVER,
        [VIEW_STATE.HOVER]: () => {},
        // hover => hide
        [VIEW_STATE.HIDE]: () => {
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        // hover => pinned
        [VIEW_STATE.PINNED]: () => {
          // TODO store
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.addClass('hide')
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      /* ================= pinned状态 ============= */
      [VIEW_STATE.PINNED]: {
        name: VIEW_STATE.PINNED,
        [VIEW_STATE.PINNED]: () => {},
        // pinned => hide
        [VIEW_STATE.HIDE]: () => {
          // TODO store
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        // pinned => hover
        [VIEW_STATE.HOVER]: () => {
          // TODO store
          this.$notionx.addClass('hover')
          this.$notionx.removeClass('pinned')
          this.$sideBarBtn.addClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        }
      }
    }
    // default state：hide
    this.curState = this.fsm[VIEW_STATE.HIDE]
  }

  // change view content
  setView (key) {
    const viewKey = key || this.viewKey
    const views = this.$views.find('.notionx-view')
    for (let i = 0; i < views.length; i++) {
      if (viewKey === views[i].dataset.view) {
        views[i].classList.remove('hide')
      } else {
        views[i].classList.add('hide')
      }
    }
  }

  // init dom/style/event
  initView () {
    // inject
    this.$html = $('html')
    this.$notionApp = $('#notion-app')
    this.$notionCenter = this.$notionApp.find('.notion-frame')
    this.$document = $(document)
    this.$notionXWrap = $(NOTION_WRAPPER_SELECTOR)
    this.$headerBtnWrap = this._adapterNotionHeader()
    this._adapterNotionStyle()

    // dom append
    this.$notionx = $(template.notionx)
    this.$sidebar = this.$notionx.find('.notionx-sidebar')
    this.$hiderBtn = this.$notionx.find('.notionx-hider-btn')
    this.$sideHeader = this.$notionx.find('.notionx-header')
    this.$tocWrap = this.$notionx.find('.notionx-view-toc-content-wrap')
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

    // event
    this.initEvents()

    // TODO options takes effect in view
    for (const key in this.options) {
      const inp = this.$optionView.find(`input[name=${key}]`)[0]
      if (inp !== undefined) {
        if (inp.type === 'checkbox') {
          inp.checked = this.options[key]
        } else {
          inp.value = this.options[key]
        }
      }
    }
  }

  initEvents () {
    // TODO
    // observer.disconnect()

    window.addEventListener('beforeunload', () => {
      window.notionx = null
    })

    // scroll To Top
    this.$toTopBtn.click(scrollToTop)

    // dark mode
    this.$darkBtn.find('label').click(e => {
      e.stopPropagation()
      const oldChecked = $(e.currentTarget)
        .parent()
        .find('input')[0].checked
      if (!oldChecked) {
        this.options.dark = true
        $('html').addClass('notionx-dark')
      } else {
        this.options.dark = false
        $('html').removeClass('notionx-dark')
      }
    })

    // change view
    this.$optionBtn.click(() => {
      if (this.viewKey === 'option') {
        this.viewKey = DEFAULT_VIEW_KEY
        this.$optionBtn.removeClass('active')
      } else {
        this.viewKey = 'option'
        this.$optionBtn.addClass('active')
      }
      this.setView()
    })

    // sideBar & button handler
    this.$sideBarBtn.hover(
      // mouseover
      e => {
        if (this.curState.name === VIEW_STATE.HOVER) {
          return
        }
        this.curState[VIEW_STATE.HOVER](e)
      },
      // mouseout
      e => {
        if (this.curState.name === VIEW_STATE.PINNED) {
          return
        }
        this.curState[VIEW_STATE.HIDE](e)
      }
    )
    this.$sidebar.hover(
      // mouseover
      e => {
        if (this.curState.name === VIEW_STATE.PINNED) {
          return
        }
        this.curState[VIEW_STATE.HOVER](e)
      },
      // mouseout
      e => {
        if (this.curState.name === VIEW_STATE.PINNED) {
          return
        }
        this.curState[VIEW_STATE.HIDE](e)
      }
    )
    this.$sideBarBtn.click(e => {
      this.curState[VIEW_STATE.PINNED](e)
    })
    this.$hiderBtn.click(e => {
      this.curState[VIEW_STATE.HIDE](e)
    })
    this.$hiderBtn.click(e => {
      this.curState[VIEW_STATE.HIDE](e)
    })

    // TODO option change handler
    const inpChange = e => {
      const inp = e.currentTarget
      const key = inp.name
      if (!key) return
      if (inp.type === 'checkbox') {
        this.optionChange(key, inp.checked)
      } else {
        this.optionChange(key, inp.value)
      }
    }
    this.$optionView.find('input').change(inpChange)

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

  // option change
  optionChange (key, newValue) {
    if (key === 'showDark') {
      this.options[key] = newValue
      this.toggleDark(newValue)
    }
  }

  // show/hide dark mode button
  toggleDark (flag) {
    this.$darkBtn[0].style.display = flag ? 'inherit' : 'none'
  }

  // change original notion layout
  _adapterNotionStyle () {
    this.$notionCenter.addClass('notionX-notionCenter')
  }

  // adapt to various page situations and find our button's container
  _adapterNotionHeader = () => {
    const siblings = ['.notion-topbar-share-menu', '.notion-topbar-more-button']
    const $el = $(siblings.find(i => $(i).length > 0)).parent()
    if ($el.length > 0) {
      return $el
    }

    return $('.notion-topbar>div')
  }

  // notion app observer for update TOC dynamically
  notionOb () {
    this.notionOb = DomObserver(NOTION_APP_SELECTOR, this.renderToc())
  }

  // update TOC (using throttle)
  renderToc = () => {
    const $wrap = this.$tocWrap
    return _.throttle(() => {
      // console.log(MutationRecords, observer);
      const hs = $(
        '.notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block'
      ).map((i, e) => {
        let dataBlockId = e.attributes['data-block-id'].value
        dataBlockId = dataBlockId.replace(/-/g, '')
        const href = `${window.location.pathname}#${dataBlockId}`
        return {
          desc: e.innerText,
          href,
          level: e.classList.contains('notion-header-block')
            ? 1
            : e.classList.contains('notion-sub_header-block')
              ? 2
              : 3
        }
      })
      let liStr = ''
      for (let i = 0, l = hs.length; i < l; i++) {
        if (!hs[i].desc || !hs[i].level) continue
        liStr +=
          `<li class="level-${hs[i].level}" title="${hs[i].desc}">` +
          `<a href="${hs[i].href}">${hs[i].desc}</a>` +
          '</li>'
      }
      $wrap.html(liStr)
    }, 2000)
  }
}
