import NotionX from './core'
import '@/assets/svg'
import './content.less'
import { waitNotionPageReady, domObserver } from '@/utils/util'
import Actions from '@/utils/Actions'
import {
  NOTION_TOPBAR_SELECTOR,
  CONTENT_DETECT,
} from '../utils/constant'

const platform = chrome || browser

// content发送消息至background,客户端侦测消息
platform.runtime.sendMessage({ type: CONTENT_DETECT })
if (process.env.NODE_ENV !== 'production') {
  console.log('NotionX: CONTENT_DETECT')
}

// content接收background消息,执行命令
platform.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')
  if (request.type === 'action') {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('NotionX: action,data:', request.data)
      }
      Actions[request.data.action].call(window, request.data)
    } catch (e) {
      console.error(`NotionX - content: 执行命令${request.data.action}失败`)
      console.error(e)
    }
  }
  if (request.type === 'actions') {
    if (process.env.NODE_ENV !== 'production') {
      console.log('NotionX: actions,data:', request.data)
    }
    request.data.forEach(a => {
      if (a.scope === 'content') {
        waitNotionPageReady(a.pageCheckSelector || undefined).then(() => {
          try {
            Actions[a.action].call(window, a)
          } catch (e) {
            console.error(`NotionX - content: 执行命令${a.action}失败`)
            console.error(e)
          }
        })
      }
    })
  }
  return true
})

// 监控dark mode+compact mode 客户端变更，发送消息至background
waitNotionPageReady(NOTION_TOPBAR_SELECTOR).then(() => {
  if (!window.notionx) window.notionx = new NotionX()

  domObserver('.notion-body', mutationList => {
    const value = mutationList[0]?.target?.classList.contains('dark')
    if (value === undefined) return
    platform.runtime.sendMessage({ type: 'DARK_MODE', value })
  }, {
    attributes: true,
    attributeFilter: ['class'],
  })
})
