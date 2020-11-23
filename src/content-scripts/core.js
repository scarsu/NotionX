import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import {
  DomObserver,
  scrollToTop
} from '../utils/util'
import {
  DEFAULT_OPTS,
  NOTIONX_STORE_KEY,
  NOTION_WRAPPER_SELECTOR,
  NOTION_APP_SELECTOR,
  VIEW_STATE,
  MAX_WIDTH,
  MIN_WIDTH,
  DEFAULT_VIEW_KEY
} from '../utils/constant'

export default class NotionX {
  constructor () {
    this.reset()
    this.init()
    return this
  }

  reset () {
    // 重置操作
    // 配置处理：默认配置 + 从localStorage获取本地配置
    this.viewKey = DEFAULT_VIEW_KEY
    this.initOptions()
    this.options.showDark = false
  }

  async init () {
    this.viewKey = DEFAULT_VIEW_KEY
    this.initNotionxFSM()
    this.initView()
    this.notionOb()
  }

  // 更新当前配置至本地存储
  updateLocal (options) {
    localStorage.setItem(NOTIONX_STORE_KEY, JSON.stringify(options || this.options))
  }

  // 合并 默认配置 + 本地存储的配置
  initOptions () {
    const options = DEFAULT_OPTS
    const localOptions = JSON.parse(localStorage.getItem(NOTIONX_STORE_KEY) || '{}')
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

  // 视图状态状态机
  initNotionxFSM () {
    this.fsm = {
      /* ================= hide状态 ============= */
      [VIEW_STATE.HIDE]: {
        name: VIEW_STATE.HIDE,
        [VIEW_STATE.HIDE]: () => {},
        // hide => hover
        [VIEW_STATE.HOVER]: () => {
          console.log('hide => hover')
          this.$notionx.removeClass('pinned')
          this.$notionx.addClass('hover')
          this.$sideBarBtn.addClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        },
        // hide => pinned
        [VIEW_STATE.PINNED]: () => {
          console.log('hide => pinned')
          // TODO store存储
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.addClass('hide')
          // setTimeout(function () {
          //   this.$notionx.css('width', 'fit-content')
          // }, 200)
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      /* ================= hover状态 ============= */
      [VIEW_STATE.HOVER]: {
        name: VIEW_STATE.HOVER,
        [VIEW_STATE.HOVER]: () => {},
        // hover => hide
        [VIEW_STATE.HIDE]: () => {
          console.log('hover => hide')
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        // hover => pinned
        [VIEW_STATE.PINNED]: () => {
          console.log('hover => pinned')
          // TODO store存储
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.addClass('hide')
          // this.$notionx.css('width', 'fit-content')
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      /* ================= pinned状态 ============= */
      [VIEW_STATE.PINNED]: {
        name: VIEW_STATE.PINNED,
        [VIEW_STATE.PINNED]: () => {},
        // pinned => hide
        [VIEW_STATE.HIDE]: () => {
          console.log('pinned => hide')
          // TODO store存储
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          // this.$notionx.css('width', '0');
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        // pinned => hover
        [VIEW_STATE.HOVER]: () => {
          console.log('pinned => hover')
          // TODO store存储
          this.$notionx.addClass('hover')
          this.$notionx.removeClass('pinned')
          this.$sideBarBtn.addClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        }
      }
    }
    // 初始默认状态：hide
    this.curState = this.fsm[VIEW_STATE.HIDE]
  }

  // 切换视图内容
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

  // 初始化视图 + 事件
  // sidebar按钮: hover/click事件，显示隐藏sidebar，动效
  // header: 点击显示setting模块(隐藏暗黑模式按钮)
  // footer: 作者,论坛,开源仓库,关于
  initView () {
    // inject
    this.$html = $('html')
    this.$notionApp = $('#notion-app')
    this.$notionCenter = this.$notionApp.find('.notion-frame')
    this.$document = $(document)
    this.$notionXWrap = $(NOTION_WRAPPER_SELECTOR)
    this.$headerBtnWrap = this._adapterNotionHeader()
    // 变更notion源样式
    this._adapterNotionStyle()

    // append
    this.$notionx = $(template.notionx)
    this.$sidebar = this.$notionx.find('.notionx-sidebar')
    this.$hiderBtn = this.$notionx.find('.notionx-hider-btn')
    this.$sideHeader = this.$notionx.find('.notionx-header')
    this.$tocWrap = this.$notionx.find('.notionx-view-toc-content-wrap')
    this.$toTopBtn = this.$notionx.find('.to-top-btn')
    this.$optionBtn = this.$notionx.find('.option-btn')
    this.$resizer = this.$notionx.find('.notionx-resizer')
    this.$views = this.$notionx.find('.notionx-views')
    this.$sideBarBtn = $(template.sideBarBtn)
    this.$darkBtn = $(template.darkBtn)

    this.initEvents()
    this.setView(this.viewKey)

    // dom
    this.$headerBtnWrap.append(this.$darkBtn)
    this.$headerBtnWrap.append(this.$sideBarBtn)
    this.$notionXWrap.append(this.$notionx)
  }

  initEvents () {
    // TODO 页面离开后关闭页面
    // observer.disconnect()

    // 去顶部按钮
    this.$toTopBtn.click(scrollToTop)

    // 暗黑模式开关
    this.$darkBtn.find('label').click((e) => {
      e.stopPropagation()
      const oldChecked = $(e.currentTarget).parent().find('input')[0].checked
      if (!oldChecked) {
        // TODO store存储
        $('html').addClass('notionx-dark')
      } else {
        // TODO store存储
        $('html').removeClass('notionx-dark')
      }
    })

    // 设置视图
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

    // 切换边栏按钮
    this.$sideBarBtn.hover(
      // mouseover
      (e) => {
        if (this.curState.name === VIEW_STATE.HOVER) {
          return
        }
        this.curState[VIEW_STATE.HOVER](e)
      },
      // mouseout
      (e) => {
        if (this.curState.name === VIEW_STATE.PINNED) {
          return
        }
        this.curState[VIEW_STATE.HIDE](e)
      }
    )
    this.$sidebar.hover(
      // mouseover
      (e) => {
        if (this.curState.name === VIEW_STATE.PINNED) {
          return
        }
        this.curState[VIEW_STATE.HOVER](e)
      },
      // mouseout
      (e) => {
        if (this.curState.name === VIEW_STATE.PINNED) {
          return
        }
        this.curState[VIEW_STATE.HIDE](e)
      }
    )
    this.$sideBarBtn.click((e) => {
      this.curState[VIEW_STATE.PINNED](e)
    })
    this.$hiderBtn.click((e) => {
      this.curState[VIEW_STATE.HIDE](e)
    })
    this.$hiderBtn.click((e) => {
      this.curState[VIEW_STATE.HIDE](e)
    })

    // 设置模块切换
    // this.$sideHeader.click((e) => {
    //   // TODO 显示设置模块
    //   console.log(e);
    // });

    // resizer
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
    })
  }

  _adapterNotionStyle () {
    this.$notionCenter.addClass('notionX-notionCenter')
  }

  // 适配各种page情况，找出按钮容器
  _adapterNotionHeader=() => {
    const siblings = [
      '.notion-topbar-share-menu',
      '.notion-topbar-more-button'
    ]
    const $el = $(siblings.find((i) => $(i).length > 0)).parent()
    if ($el.length > 0) {
      return $el
    }

    return $('.notion-topbar>div')
  }

  // 创建notion app观察者，动态更新toc
  notionOb () {
    this.notionOb = DomObserver(NOTION_APP_SELECTOR, this.renderToc())
  }

  // 性能控制，防抖
  renderToc=() => _.throttle(() => {
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
          `<li class="level-${
          hs[i].level
        }" title="${
          hs[i].desc
        }">` +
          `<a href="${
            hs[i].href
          }">${
            hs[i].desc
          }</a>` +
          '</li>'
    }
    window.notionx.$tocWrap.html(liStr)
  }, 2000)
}
