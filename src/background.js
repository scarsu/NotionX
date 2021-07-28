/* eslint-disable no-undef */
import { EXTENSION_STORAGE_OPTION_KEY, CONTENT_DETECT } from '@/utils/constant'
import { ORIGIN_OPTIONS } from '@/store/option'

/**
 * background接收content消息
 * 1. 客户端侦测
 * 2. 客户端变更
 */
let contentTabId = null
const platform = chrome || browser
platform.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === CONTENT_DETECT) { // 初始化：侦测到content后,根据local配置初始化
    if (process.env.NODE_ENV !== 'production') {
      console.log('NotionX: CONTENT_DETECT')
    }
    contentTabId = sender.tab.id
    effectLocal()
  } else if (request.type === 'DARK_MODE') { // 侦测到客户端配置变更后,更新插件存储
    if (process.env.NODE_ENV !== 'production') {
      console.log('NotionX: DARK_MODE_CHANGE_DETECT')
    }
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
  return true
})

/**
 * background发送消息至content
 * 获取background localStorage中的配置，发送至content执行
 */
function effectLocal () {
  let localOptions = window.localStorage.getItem(EXTENSION_STORAGE_OPTION_KEY)
  if (!localOptions) return
  localOptions = JSON.parse(localOptions).filter(i => i.scope === 'content')

  if (contentTabId) {
    platform.tabs.sendMessage(contentTabId, {
      type: 'actions',
      data: localOptions
    })
  } else {
    console.warn('NotionX - background: ', '连接失败')
  }
}
