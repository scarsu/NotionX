export const NOTION_APP_SELECTOR = '#notion-app'
export const NOTION_PAGE_READY_SELECTOR = '.notion-topbar'
export const NOTION_SCROLLER_SELECTOR = '.notion-scroller'
export const NOTION_WRAPPER_SELECTOR = '.notion-cursor-listener'

export const NOTIONX_STORE_KEY = 'notionx'
export const STORE = {
  TOKEN: 'octotree.token.local',
  HOVEROPEN: 'octotree.hover_open',
  PR: 'octotree.prdiff_shown',
  HOTKEYS: 'octotree.hotkeys',
  ICONS: 'octotree.icons',
  LAZYLOAD: 'octotree.lazyload',
  POPUP: 'octotree.popup_shown',
  WIDTH: 'octotree.sidebar_width',
  SHOWN: 'octotree.sidebar_shown',
  PINNED: 'octotree.sidebar_pinned',
  HUGE_REPOS: 'octotree.huge_repos'
}

export const DEFAULT_OPTS = {
  SHOW_DARK: true,
  HOTKEYS: '⌘+⇧+x',
  WIDTH: 220,
  PINNED: false
}

export const EVENT = {
  TOGGLE: 'octotree:toggle',
  TOGGLE_PIN: 'octotree:pin',
  LOC_CHANGE: 'octotree:location',
  LAYOUT_CHANGE: 'octotree:layout',
  REQ_START: 'octotree:start',
  REQ_END: 'octotree:end',
  STORE_CHANGE: 'octotree:storeChange',
  VIEW_READY: 'octotree:ready',
  VIEW_CLOSE: 'octotree:close',
  VIEW_SHOW: 'octotree:show',
  FETCH_ERROR: 'octotree:error',
  SIDEBAR_HTML_INSERTED: 'octotree:sidebarHtmlInserted',
  REPO_LOADED: 'octotree:repoLoaded'
}
