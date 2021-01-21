import _ from 'lodash'
import { domObserver, mutateKeys } from '../utils/util'
import { NOTION_APP_SELECTOR } from '../utils/constant'
import { ORIGIN_OPTIONS } from '../store/option'
/**
 * 定义所有用户网页行为
 */
const Actions = {
  // content 隐藏页首评论
  hideComments: function (data) {
    const $dom = document.querySelector('.notion-page-view-discussion')
    if (!$dom) return
    if (data.value) {
      $dom.parentElement.style.display = 'none'
    } else {
      $dom.parentElement.style.display = ''
    }
  },
  // content 隐藏NotionX的TOC按钮
  hideNotionXSidebar: function (data) {
    const $dom = document.querySelector('#notionx')
    if (!$dom) return
    if (data.value) {
      document.querySelector('#notionx').style.display = 'none'
      if (window.notionx) window.notionx.__ob__.stop()
    } else {
      document.querySelector('#notionx').style.display = ''
      if (window.notionx) window.notionx.__ob__.start()
    }
  },
  // popup 切换语言
  changeLang: function (data) {
    const $store = this.$store || this
    const commit = $store.commit
    commit('setLang', data.value || 'en')
  },
  // content 在桌面端中打开当前页面
  openInDesktop: function (data) {
    if (data.event) {
      var iframe = document.createElement('iframe')
      var body = document.body
      iframe.style.display = 'none'
      body.appendChild(iframe)
      iframe.addEventListener('load', function (e) {
        console.log('iframe,', e)
      })
      iframe.src = 'notion:' + location.pathname
    }
  },
  // content 切换暗黑模式
  toggleDark: function (data) {
    const $notion = document.querySelector('.notion-body')
    const currentDark = $notion.classList.contains('dark')
    if (
      (data.value && !currentDark) ||
      (!data.value && currentDark)
    ) {
      mutateKeys(true, true, 'L', 76)
    }
  },
  // content 紧凑模式
  toggleCompact: function (data) {
    const $notion = document.querySelector('.notion-body')
    const currentCompact = $notion.classList.contains('notionx-compact')
    if (data.value && !currentCompact) {
      $notion.classList.add('notionx-compact')
    } else if (!data.value && currentCompact) {
      $notion.classList.remove('notionx-compact')
    }
  },
  // content 显示行号
  toggleCodeLineNum: function (data) {
    // 函数: 显示/更新行号
    const lineNumShow = () => {
      const $codeBlocks = document.querySelectorAll('.line-numbers.notion-code-block')
      if (!$codeBlocks) return
      $codeBlocks.forEach($codeBlock => {
        // 计算最新行数
        // const $code = [...$codeBlock.children].find(i => i.classList.contains('notranslate'))
        const $code = $codeBlock.querySelector('[contenteditable]')
        if (!$code) return
        const realH = $code.offsetHeight -
          parseFloat(getComputedStyle($code).getPropertyValue('border-top-width')) -
          parseFloat(getComputedStyle($code).getPropertyValue('border-bottom-width')) -
          parseFloat(getComputedStyle($code).getPropertyValue('padding-top')) -
          parseFloat(getComputedStyle($code).getPropertyValue('padding-bottom'))
        const lineH = parseFloat(getComputedStyle($code).getPropertyValue('line-height'))
        const lineCount = Math.ceil(realH / lineH) // 计算行数
        let _inner = ''
        for (let i = 0; i < lineCount; i++) {
          _inner += `<div>${i + 1}</div>`
        }

        // 先判断是否已经存在行号
        let $lineNum = [...$codeBlock.children].find(i => i.classList.contains('notionx-code-lineNum'))
        // 存在则更新显示
        if ($lineNum) {
          $lineNum.style.display = 'block'
          $lineNum.innerHTML = _inner
        } else {
        // 不存在则创建
          $lineNum = document.createElement('div')
          $lineNum.classList.add('notionx-code-lineNum')

          $lineNum.innerHTML = _inner
          $codeBlock.prepend($lineNum) // 插入DOM
        }
      })
    }
    // 函数: 隐藏行号
    const lineNumHide = () => {
      [...document.querySelectorAll('.notionx-code-lineNum')].forEach(e => {
        e.style.display = 'none'
      })
    }

    // 通过mutationObserver动态更新,用节流函数限制更新次数
    if (data.value) {
      lineNumShow()
      window.lineNumOb = domObserver(NOTION_APP_SELECTOR, _.debounce(lineNumShow, 1000, { leading: true, trailing: false, maxWait: 1000 }))
    } else {
      if (window.lineNumOb) {
        window.lineNumOb.disconnect()
        window.lineNumOb = null
        lineNumHide()
      }
    }
  },
  // content 复制token
  copyToken: function (data) {
    if (data.event) {

    }
  },
  // all 还原全部设置
  resetOptions: function (data) {
    if (data.event) {
      const $store = this.$store || this
      const commit = $store.commit
      commit('updateOptions', { options: ORIGIN_OPTIONS, needEffect: true })
    }
  },
  // content 显示totop按钮
  showScrollToTop: function (data) {
    const $top = document.querySelector('.notionx-totop')
    const exist = !!$top
    const show = !!$top && $top.classList.contains('show')
    if (data.value && !exist) {
      const $sibling = document.querySelector('.notion-help-button') ||
        document.querySelector('#notionx')
      if (!$sibling) return false
      const $p = $sibling.parentElement
      const $totop = document.createElement('div')
      $totop.innerHTML = '⭡'
      $totop.classList.add('notionx-totop')
      $totop.classList.add('show')
      $p.insertBefore($totop, $sibling)
      $totop.addEventListener('click', function () {
        document.querySelector('.notion-scroller.vertical.horizontal').style.scrollBehavior = 'smooth'
        document.querySelector('.notion-scroller.vertical.horizontal').scrollTop = 0
      })
    } else if (data.value && !show) {
      $top.classList.add('show')
    } else if (!data.value && show) {
      $top.classList.remove('show')
    }
  },
  preventTableOverflow: function (data) {
    const $notion = document.querySelector('.notion-body')
    const prevented = $notion.classList.contains('notionx-prevent-table-overflow')
    if (data.value && !prevented) {
      $notion.classList.add('notionx-prevent-table-overflow')
    } else if (!data.value && prevented) {
      $notion.classList.remove('notionx-prevent-table-overflow')
    }
  }
}
export default Actions
