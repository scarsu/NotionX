export const NOTION_APP_SELECTOR = '#notion-app'
export const NOTION_SCROLLER_SELECTOR = '.notion-scroller'
export const NOTION_WRAPPER_SELECTOR = '.notion-cursor-listener'

export const NOTIONX_STORE_KEY = 'notionx'

export const DEFAULT_OPTS = {
  showDark: true,
  dark: false,
  hotKeys: '⌘+⇧+x',
  width: 220,
  pinned: false
}

export const VIEW_STATE = {
  HIDE: 'hide',
  HOVER: 'hover',
  PINNED: 'pinned'
}

export const MAX_WIDTH = 480
export const MIN_WIDTH = 190
export const DEFAULT_VIEW_KEY = 'toc'
export const EXTENSION_STORAGE_OPTION_KEY = 'notionx_options'
export const CONTENT_DETECT = 'CONTENT_DETECT'

export const ORIGIN_OPTIONS = [
  {
    action: 'changeLang',
    name: 'changeLang',
    desc: 'changeLangDesc',
    value: 'en',
    type: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'zh-cn', label: '中文' },
    ],
    hide: false,
    scope: 'popup',
  },
  {
    action: 'hideComments', // 命令名称/处理函数
    type: 'switch', // 配置类型
    name: 'hideComments', // 配置项名称
    desc: 'hideCommentsDesc', // 配置项描述
    value: false, // 值
    hide: false, // 不再显示此配置项
    scope: 'content', // 作用域
    pageCheckSelector: '.notion-page-content', // 页面初始化时需要等到此dom加载后再执行命令
  },
  {
    action: 'toggleDark',
    name: 'toggleDark',
    desc: 'toggleDarkDesc',
    value: false,
    type: 'switch',
    hide: false,
    scope: 'content',
  },
  {
    action: 'hideToc',
    name: 'hideToc',
    desc: 'hideTocDesc',
    value: false,
    type: 'switch',
    hide: false,
    scope: 'content',
  },
  {
    action: 'toggleCompact',
    name: 'toggleCompact',
    desc: 'toggleCompactDesc',
    value: false,
    type: 'switch',
    hide: false,
    scope: 'content',
  },
  {
    action: 'toggleCodeLineNum',
    name: 'toggleCodeLineNum',
    desc: 'toggleCodeLineNumDesc',
    value: false,
    type: 'switch',
    hide: false,
    scope: 'content',
  },
  {
    action: 'openInDesktop',
    name: 'openInDesktop',
    desc: 'openInDesktopDesc',
    value: null,
    type: 'button',
    hide: false,
    scope: 'content',
    needLoading: 2000
  },
  {
    action: 'resetOptions',
    name: 'resetOptions',
    desc: 'resetOptionsDesc',
    value: null,
    type: 'button',
    hide: false,
    scope: 'all',
  },
  {
    action: 'showScrollToTop',
    name: 'showScrollToTop',
    desc: 'showScrollToTopDesc',
    value: false,
    type: 'switch',
    hide: false,
    scope: 'content',
  },
  {
    action: 'preventTableOverflow',
    name: 'preventTableOverflow',
    desc: 'preventTableOverflowDesc',
    value: false,
    type: 'switch',
    hide: false,
    scope: 'content',
  },
  // {
  //   action: 'copyToken',
  //   name: 'copyToken',
  //   desc: 'copyTokenDesc',
  //   value: null,
  //   type: 'button',
  //   hide: false,
  //   scope: 'content',
  // },
]
