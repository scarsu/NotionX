import _ from 'lodash'
import { domObserver, mutateKeys, getLocalNotionXState, mask } from '../utils/util'
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
  // content 隐藏帮助按钮
  hideHelpBtn: function (data) {
    const $dom = document.querySelector('.notion-help-button')
    if (!$dom) return
    if (data.value) {
      $dom.style.display = 'none'
    } else {
      $dom.style.display = 'flex'
    }
  },
  // content 隐藏table的New按钮
  hideAddBtn: function (data) {
    const $notion = document.querySelector('.notion-body')
    const currentCompact = $notion.classList.contains('notionx-hide-table-new')
    if (data.value && !currentCompact) {
      $notion.classList.add('notionx-hide-table-new')
    } else if (!data.value && currentCompact) {
      $notion.classList.remove('notionx-hide-table-new')
    }
  },
  // content 禁用插件
  disableNotionX: function (data) {
    Actions.hideNotionXSidebar(data)
  },
  // content 隐藏NotionX的侧边栏
  hideNotionXSidebar: function (data) {
    const $dom = document.querySelector('#notionx')
    if (!$dom) return

    if (data.value) {
      document.querySelector('#notionx').style.display = 'none'
      document.querySelector('#notionx-sidebar-btn').style.display = 'none'
      if (window.notionx) window.notionx.__ob__.stop()
    } else {
      document.querySelector('#notionx').style.display = ''
      document.querySelector('#notionx-sidebar-btn').style.display = ''
      const state = getLocalNotionXState()?.fsmState
      if (state === 'hide') {
        if (window.notionx && window.notionx.__ob__) window.notionx.__ob__.stop()
      } else {
        if (window.notionx && window.notionx.__ob__) window.notionx.__ob__.start()
      }
    }
  },
  // content 隐藏NotionX的暗黑模式按钮
  hideNotionXDarkMode: function (data) {
    const $dom = document.querySelector('#notionx-dark-btn')
    if (!$dom) return

    if (data.value) {
      document.querySelector('#notionx-dark-btn').style.display = 'none'
    } else {
      document.querySelector('#notionx-dark-btn').style.display = 'flex'
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
      iframe.src = 'notion:' + location.pathname
    }
  },
  // content 生成标题序号
  genHeaderNumber: function (data) {
    if (data.event) {
      // 获取所有的header
      var $headers = [...document.querySelectorAll(`.notion-header-block,
        .notion-sub_header-block,
        .notion-sub_sub_header-block`)]
      // 遍历生成序号，固定格式：
      // level1 x.
      // level2 x.x.
      // level3 x.x.x.
      let outermostLevel = 0 // 最外层的level
      let lastPrefix = '' // 上一项的前缀
      let lastLevel = 0 // 上一项的level
      for (let i = 0; i < $headers.length; i++) {
        const $header = $headers[i]
        const level = $header.classList.contains('notion-header-block')
          ? 1 : $header.classList.contains('notion-sub_header-block')
            ? 2 : 3
        let curPrefix = ''
        if (i === 0) {
          outermostLevel = level
          curPrefix = '1.'
        } else {
          if (level < outermostLevel) {
            // 不规范格式，直接停止转换
            break
          }
          if (level === lastLevel) {
            // 同一层级
            curPrefix = leftMoveAndAddSeq(lastPrefix, 0)
          }
          if (level > lastLevel) {
            // 下一层级
            curPrefix = lastPrefix + 1 + '.'
          }
          if (level < lastLevel) {
            // 外层
            if (lastLevel - level === 1) {
              if (lastPrefix.length < 4) break
              curPrefix = leftMoveAndAddSeq(lastPrefix, 1)
            } else if (lastLevel - level === 2) {
              if (lastPrefix.length < 6) break
              curPrefix = leftMoveAndAddSeq(lastPrefix, 2)
            }
          }
        }

        // 删除之前生成的prefix
        const originContent = removeOldPrefix($header.textContent)
        // 更改dom
        const $edit = $header.querySelector('.notranslate[contenteditable=true]')
        $edit.textContent = curPrefix + ' ' + originContent
        // 手动触发input event 以触发notion进行远程更新
        setTimeout(() => {
          $edit.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true,
          }))
        }, 0)
        // 更新变量
        lastPrefix = curPrefix
        lastLevel = level
      }
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
        const $code = $codeBlock.querySelector('[contenteditable]')
        if (!$code) return
        const realH = $code.offsetHeight -
          parseFloat(getComputedStyle($code).getPropertyValue('border-top-width')) -
          parseFloat(getComputedStyle($code).getPropertyValue('border-bottom-width')) -
          parseFloat(getComputedStyle($code).getPropertyValue('padding-top')) -
          parseFloat(getComputedStyle($code).getPropertyValue('padding-bottom'))
        const lineH = parseFloat(getComputedStyle($code).getPropertyValue('line-height'))
        const font = getComputedStyle($code).getPropertyValue('font-family')
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
          $lineNum.style.lineHeight = lineH + 'px'
          $lineNum.style.fontFamily = font
          $lineNum.innerHTML = _inner
        } else {
        // 不存在则创建
          $lineNum = document.createElement('div')
          $lineNum.classList.add('notionx-code-lineNum')
          $lineNum.style.lineHeight = lineH + 'px'
          $lineNum.style.fontFamily = font

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
      const capacity = document.querySelectorAll('.line-numbers.notion-code-block').length
      let interval = 5000
      if (capacity === 0) {
        interval = 5000
      } else if (capacity <= 20) {
        interval = 500
      } else if (capacity <= 100) {
        interval = 1000
      } else if (capacity <= 200) {
        interval = 2000
      }
      window.lineNumOb = domObserver(NOTION_APP_SELECTOR, _.debounce(lineNumShow, interval, { leading: true, trailing: true, maxWait: interval }))
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
  // content 阻止表格溢出
  preventTableOverflow: function (data) {
    const $notion = document.querySelector('.notion-body')
    const prevented = $notion.classList.contains('notionx-prevent-table-overflow')
    if (data.value && !prevented) {
      $notion.classList.add('notionx-prevent-table-overflow')
    } else if (!data.value && prevented) {
      $notion.classList.remove('notionx-prevent-table-overflow')
    }
  },
  // content 设置当前页面所有代码块的语言
  setCodeLang: function (data) {
    if (data.event) {
      const lang = data.value
      if (!lang) return
      mask().show()
      const codeLangTriggers = [...document.querySelectorAll('.notion-code-block>div>div>div>div[role=button]')]
      codeLangTriggers.forEach((e) => {
        e.click()
      })
      setTimeout(() => {
        const langSelectors = [...document.querySelectorAll('.notion-scroller.vertical>div>div>div[role=button][tabindex="0"]>div>div>div')]
        if (langSelectors.length === 0) {
          const langSelectors = [...document.querySelectorAll('.notion-scroller.vertical>div>div>div[role=button][tabindex="0"]>div>div>div')]
          langSelectors.filter((e) => e.textContent.toLowerCase() === lang.toLowerCase()).forEach((e) => {
            e.click()
          })
        }
        langSelectors.filter((e) => e.textContent.toLowerCase() === lang.toLowerCase()).forEach((e) => {
          e.click()
        })
      }, 200)
      setTimeout(() => {
        mask().hide()
      }, 200)
    }
  }
}
export default Actions

// 删除最后gap个数字后seq+1
function leftMoveAndAddSeq (str, gap) {
  const lastNumIndex = str.length - (gap + 1) * 2
  const lastNum = str[lastNumIndex] * 1
  return str.substr(0, lastNumIndex) + (lastNum + 1) + '.'
}

// 删除过去生成的序号
function removeOldPrefix (content) {
  return content.replace(/^(\d\.\d\.\d\.\s)/, '').replace(/^(\d\.\d\.\s)/, '').replace(/^(\d\.\s)/, '')
}
