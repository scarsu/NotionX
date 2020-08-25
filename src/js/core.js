import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import { DomObserver, notionxLocalStore, scrollToTop } from './util'
import { DEFAULT_OPTS, NOTION_WRAPPER_SELECTOR, NOTION_APP_SELECTOR, VIEW_STATE, MAX_WIDTH } from './constant'

export default class NotionX {
  constructor () {
    this.reset()
    this.init()
  }

  reset () {
    // 重置操作
    // 配置处理：默认配置 + 从localStorage获取本地配置
    this.defaultOptions = DEFAULT_OPTS
    this.localOptions = notionxLocalStore.get()
    this.mergeOptions()
  }

  async init () {
    this.initViewFSM()
    this.initView()
    this.notionOb()
  }

  // 视图状态状态机
  initViewFSM () {
    this.fsm = {
      [VIEW_STATE.HIDE]: {
        name: VIEW_STATE.HIDE,
        [VIEW_STATE.HIDE]: () => {},
        [VIEW_STATE.HOVER]: () => {
          this.$notionx.removeClass('pinned')
          this.$notionx.addClass('hover')
          this.$sideBarBtn.addClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        },
        [VIEW_STATE.PINNED]: () => {
          // TODO store存储
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.addClass('hide')
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      [VIEW_STATE.HOVER]: {
        name: VIEW_STATE.HOVER,
        [VIEW_STATE.HOVER]: () => {},
        [VIEW_STATE.HIDE]: () => {
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        [VIEW_STATE.PINNED]: () => {
          // TODO store存储
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.addClass('hide')
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      [VIEW_STATE.PINNED]: {
        name: VIEW_STATE.PINNED,
        [VIEW_STATE.PINNED]: () => {},
        [VIEW_STATE.HIDE]: () => {
          // TODO store存储
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          this.$sideBarBtn.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        [VIEW_STATE.HOVER]: () => {
          // TODO store存储
          this.$notionx.addClass('hover')
          this.$notionx.removeClass('pinned')
          this.$sideBarBtn.addClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        }
      }
    }
    this.curState = this.fsm[VIEW_STATE.HIDE]
  }

  // 合并 默认配置 + 本地配置
  mergeOptions () {
    const keys = Object.keys(this.defaultOptions)
    keys.forEach(key => {
      this.localOptions[key] = this.localOptions[key] || this.defaultOptions[key]
    })
    notionxLocalStore.setAll(this.localOptions)
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
    this.$tocWrap = this.$notionx.find('.notionx-view-toc-wrap')
    this.$toTopBtn = this.$notionx.find('.to-top-btn')
    this.$resizer = this.$notionx.find('.notionx-resizer')
    this.$sideBarBtn = $(template.sideBarBtn)
    this.$darkBtn = $(template.darkBtn)

    this.initEvents()

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
    this.$darkBtn.find('label').click(e => {
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

    // 切换边栏按钮
    this.$sideBarBtn.hover(
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

    // 设置模块切换
    this.$sideHeader.click(e => {
      // TODO 显示设置模块
    })

    // resizer
    this.$resizer.mousedown(e => {
      console.log(MAX_WIDTH)
      const box = this.$notionx
      const fa = this.$notionXWrap
      // 阻止冒泡,避免缩放时触发移动事件
      e.stopPropagation()
      e.preventDefault()
      var pos = {
        w: box.offsetWidth,
        h: box.offsetHeight,
        x: e.clientX,
        y: e.clientY
      }
      fa.onmousemove = function (ev) {
        ev.preventDefault()
        // 设置图片的最小缩放为30*30
        var w = Math.max(30, ev.clientX - pos.x + pos.w)
        var h = Math.max(30, ev.clientY - pos.y + pos.h)
        // console.log(w,h)

        // 设置图片的最大宽高
        w = w >= fa.offsetWidth - box.offsetLeft ? fa.offsetWidth - box.offsetLeft : w
        h = h >= fa.offsetHeight - box.offsetTop ? fa.offsetHeight - box.offsetTop : h
        box.style.width = w + 'px'
        box.style.height = h + 'px'
        // console.log(box.offsetWidth,box.offsetHeight)
      }
      fa.onmouseleave = function () {
        fa.onmousemove = null
        fa.onmouseup = null
      }
      fa.onmouseup = function () {
        fa.onmousemove = null
        fa.onmouseup = null
      }
    })
  }

  _adapterNotionStyle () {
    this.$notionCenter.addClass('notionX-notionCenter')
  }

  // 适配各种page情况，找出按钮容器
  _adapterNotionHeader () {
    const siblings = [
      '.notion-topbar-share-menu',
      '.notion-topbar-more-button'
    ]
    const $el = $(siblings.find(i => $(i).length > 0)).parent()
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
  renderToc () {
    return _.throttle(function (MutationRecords, observer) {
      var hs = $(
        '.notion-header-block,.notion-sub_header-block,.notion-sub_sub_header-block'
      ).map(function (i, e) {
        var dataBlockId = e.attributes['data-block-id'].value
        dataBlockId = dataBlockId.replace(/-/g, '')
        var href = location.pathname + '#' + dataBlockId
        return {
          desc: e.innerText,
          href: href,
          level: e.classList.contains('notion-header-block')
            ? 1
            : e.classList.contains('notion-sub_header-block')
              ? 2
              : 3
        }
      })
      var liStr = ''
      for (var i = 0, l = hs.length; i < l; i++) {
        if (!hs[i].desc || !hs[i].level) continue
        liStr +=
        '<li class="level-' +
        hs[i].level +
        '" title="' +
        hs[i].desc +
        '">' +
        '<a href="' +
        hs[i].href +
        '">' +
        hs[i].desc +
        '</a>' +
        '</li>'
      }
      window.notionx.$tocWrap.html(liStr)
    }, 2000)
  }
}
