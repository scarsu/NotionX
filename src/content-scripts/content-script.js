import NotionX from './core'
import '@/assets/svg'
import './content.less'
import { waitNotionPageReady } from '../utils/util'

waitNotionPageReady().then(() => {
  if (!window.notionx) window.notionx = new NotionX()
})
