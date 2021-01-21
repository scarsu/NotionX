/* eslint-disable no-undef */
import { EXTENSION_STORAGE_OPTION_KEY, CONTENT_DETECT } from '@/utils/constant'
import { ORIGIN_OPTIONS } from '@/store/option'

let contentTabId = null
// 接收消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === CONTENT_DETECT) {
    // 初始化：侦测到content后,根据local配置初始化
    contentTabId = sender.tab.id
    effectLocal()
  } else if (request.type === 'DARK_MODE') {
    // 侦测到客户端配置变更后,更新插件存储
    let localOptions = window.localStorage.getItem(EXTENSION_STORAGE_OPTION_KEY)
    if (localOptions === null) {
      localOptions = ORIGIN_OPTIONS
    } else {
      localOptions = JSON.parse(localOptions)
    }
    localOptions.forEach(i => {
      if (i.action === 'toggleDark') {
        i.value = request.value
      }
    })
    window.localStorage.setItem(EXTENSION_STORAGE_OPTION_KEY, JSON.stringify(localOptions))
  }
  sendResponse({
    success: true,
    message: '接收成功',
    data: {}
  })
  return true
})

// 初始获取local-content配置并生效
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
        if (NODE_ENV !== 'production') console.log(response.message)
      } else {
        console.warn('NotionX - background : ', '连接失败')
      }
    })
  } else {
    console.warn('NotionX - background: ', '连接失败')
  }
}
