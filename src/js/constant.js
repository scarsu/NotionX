export const NOTION_APP_SELECTOR = '#notion-app'
export const NOTION_PAGE_READY_SELECTOR = '.notion-topbar'
export const NOTION_SCROLLER_SELECTOR = '.notion-scroller'
export const NOTION_WRAPPER_SELECTOR = '.notion-cursor-listener'

export const NOTIONX_STORE_KEY = 'notionx'
export const STORE = {
  SHOW_DARK: 'showDark',
  HOTKEYS: 'hotKeys',
  WIDTH: 'width',
  PINNED: 'pinned'
}

export const DEFAULT_OPTS = {
  SHOW_DARK: true,
  HOTKEYS: '⌘+⇧+x',
  WIDTH: 220,
  PINNED: false
}

export const VIEW_STATE = {
  HIDE: 'hide',
  HOVER: 'hover',
  PINNED: 'pinned'
}

export const EVENT = {
  HOVER: 'notionx:hover',
  PINNED: 'notionx:pinned',
  UNPIN: 'notionx:unpin',
  HIDE: 'notionx:hide',
  SHOW_DARK: 'notionx:showDark',
  HIDE_DARK: 'notionx:hideDark'
}
