import NotionX from './core'
import { waitNotionPageReady } from './util'

waitNotionPageReady().then(() => {
  window.notionx = new NotionX()
})
