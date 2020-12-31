import NotionX from './core'
import '@/assets/svg'
import './content.less'
import { waitNotionPageReady } from '@/utils/util'
import Actions from '@/utils/Actions'
import { CONTENT_DETECT } from '@/utils/constant'

// 侦测到content后传递消息至background
chrome.runtime.sendMessage({ type: CONTENT_DETECT }, function (response) {
  console.log('content接收到探测响应')
  console.log(response)
})

// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')
  console.log('content接收back消息')
  sendResponse({
    success: true,
    message: '接收成功',
    data: {}
  })
  if (request.type === 'action') {
    // 执行命令
    try {
      Actions[request.data.action].call(window, request.data)
    } catch (e) {
      console.error(`NotionX - content: 执行命令${request.data.action}失败`)
      console.error(e)
    }
  }
  if (request.type === 'actions') {
    console.log('content执行初始化actions')
    // 执行多个命令
    request.data.forEach(a => {
      if (a.scope === 'content') {
        // 页面初始化时需要等到相应dom加载后再执行命令
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

waitNotionPageReady().then(() => {
  if (!window.notionx) window.notionx = new NotionX()
})
