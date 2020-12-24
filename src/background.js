/* eslint-disable no-undef */
import { EXTENSION_STORAGE_OPTION_KEY, CONTENT_DETECT } from '@/utils/constant'

let contentTabId = null
// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')
  // 侦测到content后,根据local配置初始化
  if (request.type === CONTENT_DETECT) {
    contentTabId = sender.tab.id
    effectLocal()
  }
  sendResponse({
    success: true,
    message: '接收成功',
    data: {}
  })
  return true
})

// 初始获取local配置并生效
function effectLocal () {
  let localOptions = window.localStorage.getItem(EXTENSION_STORAGE_OPTION_KEY)
  if (!localOptions) return
  localOptions = JSON.parse(localOptions).filter(i => i.scope === 'content')
  // 发送消息至content执行命令
  if (contentTabId) {
    chrome.tabs.sendMessage(contentTabId, {
      type: 'actions',
      data: localOptions
    }, function (response) {
      if (response && response.success) {
        console.log(response.message)
      } else {
        console.warn('NotionX - background : ', '连接失败')
      }
    })
  } else {
    console.warn('NotionX - background: ', '连接失败')
  }
}
