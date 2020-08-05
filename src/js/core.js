import $ from 'jquery'
import _ from 'lodash'
import template from './template'
import './svg'
import { DomObserver, notionxLocalStore, scrollToTop } from './util'
import { DEFAULT_OPTS, NOTION_WRAPPER_SELECTOR, NOTION_APP_SELECTOR, VIEW_STATE } from './constant'

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
    this.initFSM()
    this.initView()
    // this.notionOb()
  }

  initFSM () {
    this.fsm = {
      [VIEW_STATE.HIDE]: {
        name: VIEW_STATE.HIDE,
        [VIEW_STATE.HIDE]: () => {},
        [VIEW_STATE.HOVER]: () => {
          this.$notionx.removeClass('pinned')
          this.$notionx.addClass('hover')
          this.curState = this.fsm[VIEW_STATE.HOVER]
        },
        [VIEW_STATE.PINNED]: () => {
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
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
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        [VIEW_STATE.PINNED]: () => {
          this.$notionx.removeClass('hover')
          this.$notionx.addClass('pinned')
          this.$sideBarBtn.addClass('hide')
          this.curState = this.fsm[VIEW_STATE.PINNED]
        }
      },
      [VIEW_STATE.PINNED]: {
        name: VIEW_STATE.PINNED,
        [VIEW_STATE.PINNED]: () => {},
        [VIEW_STATE.HIDE]: () => {
          this.$notionx.removeClass('pinned')
          this.$notionx.removeClass('hover')
          this.$sideBarBtn.removeClass('hide')
          this.curState = this.fsm[VIEW_STATE.HIDE]
        },
        [VIEW_STATE.HOVER]: () => {
          this.$notionx.addClass('hover')
          this.$notionx.removeClass('pinned')
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
    this.$document = $(document)
    this.$notionXWrap = $(NOTION_WRAPPER_SELECTOR)
    this.$headerBtnWrap = this._adapterNotionHeader()

    // append
    this.$notionx = $(template.notionx)
    this.$sidebar = this.$notionx.find('.notionx-sidebar')
    this.$hiderBtn = this.$notionx.find('.notionx-hider-btn')
    this.$sideBarBtn = $(template.sideBarBtn)
    this.$darkBtn = $(template.darkBtn)

    this.initEvents()

    // dom
    this.$headerBtnWrap.append(this.$darkBtn)
    this.$headerBtnWrap.append(this.$sideBarBtn)
    this.$notionXWrap.append(this.$notionx)
  }

  initEvents () {
    this.$darkBtn.find('label').click(e => {
      e.stopPropagation()
      const oldChecked = $(e.currentTarget).parent().find('input')[0].checked
      if (!oldChecked) {
        $('html').addClass('dark')
      } else {
        $('html').removeClass('dark')
      }
    })
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
    this.notionOb = DomObserver(NOTION_APP_SELECTOR, this.renderToc)
  }

  patchToc () {
    const $ul = this.$notionx.find('.notionx-view-toc')
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
    this.$notionx.show()
    var $li = $(`
    <li class="level-1">
      <a class="toTopBtn" href="#">TOP</a>
    </li>
    `)
    $li.click(scrollToTop)
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
    console.log($ul, liStr)
    $ul.html(liStr)
    $ul.append($li)
  }

  // 性能控制，防抖
  renderToc () {
    _.throttle(function (MutationRecords, observer) {
      this.patchToc()
    }, 500)
  }
}
