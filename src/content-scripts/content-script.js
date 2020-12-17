import NotionX from './core'
import '@/assets/svg'
import './content.less'
import { waitNotionPageReady } from '../utils/util'

waitNotionPageReady().then(() => {
  if (!window.notionx) window.notionx = new NotionX()
})

chrome.runtime.onConnect.addListener((res) => {
  console.log('contentjs中的 chrome.runtime.onConnect：', res)
  if (res.name === 'myConnect') {
    res.onMessage.addListener(mess => {
      console.log('contentjs中的 res.onMessage.addListener：', mess)
      res.postMessage('哈哈哈，我是contentjs')
    })
  }
})
