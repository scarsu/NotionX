export const NOTION_APP_SELECTOR = '#notion-app'
export const NOTION_CONTENT_SELECTOR = '.notion-page-content'
export const NOTION_TOPBAR_SELECTOR = '.notion-topbar>div'
export const NOTION_SCROLLER_SELECTOR = '.notion-scroller'
export const NOTION_WRAPPER_SELECTOR = '.notion-cursor-listener'

export const NOTIONX_STORE_KEY = 'notionx_2.1.1'

export const DEFAULT_OPTS = {
  showDark: true,
  dark: false,
  hotKeys: '⌘+⇧+x',
  width: 220,
  viewKey: 'toc',
  sidebarShow: false,
  expandStatus: null,
  genFlagList: [],
}

export const DEFAULT_VIEW_KEY = 'toc'
export const MAX_WIDTH = 480
export const MIN_WIDTH = 190
export const EXTENSION_STORAGE_OPTION_KEY = 'notionx_options_2.1.1'
export const CONTENT_DETECT = 'CONTENT_DETECT'
export const COMMENT_STYLE = 'background:rgba(255,212,0,0.14);border-bottom:2px solid rgb(255, 212, 0);padding-bottom:2px'
export const COLORS = [
  {
    value: 'rgba(120, 119, 116, 1)',
    name: 'font-gray',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(159, 107, 83, 1)',
    name: 'font-brown',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(217, 115, 13, 1)',
    name: 'font-orange',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(203, 145, 47, 1)',
    name: 'font-yellow',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(68, 131, 97, 1)',
    name: 'font-green',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(51, 126, 169, 1)',
    name: 'font-blue',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(144, 101, 176, 1)',
    name: 'font-purple',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(193, 76, 138, 1)',
    name: 'font-pink',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(212, 76, 71, 1)',
    name: 'font-red',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgba(241, 241, 239, 1)',
    name: 'background-gray',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(244, 238, 238, 1)',
    name: 'background-brown',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(251, 236, 221, 1)',
    name: 'background-orange',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(251, 243, 219, 1)',
    name: 'background-yellow',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(237, 243, 236, 1)',
    name: 'background-green',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(231, 243, 248, 1)',
    name: 'background-blue',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(244, 240, 247, 0.8)',
    name: 'background-purple',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(249, 238, 243, 0.8)',
    name: 'background-pink',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(253, 235, 236, 1)',
    name: 'background-red',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(159, 164, 169, 1)',
    name: 'font-gray',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(212, 150, 117, 1)',
    name: 'font-brown',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(217, 133, 56, 1)',
    name: 'font-orange',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(201, 145, 38, 1)',
    name: 'font-yellow',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(113, 178, 131, 1)',
    name: 'font-green',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(102, 170, 218, 1)',
    name: 'font-blue',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(176, 152, 217, 1)',
    name: 'font-purple',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(223, 132, 209, 1)',
    name: 'font-pink',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(234, 135, 140, 1)',
    name: 'font-red',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgba(60, 65, 68, 1)',
    name: 'background-gray',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(76, 61, 53, 1)',
    name: 'background-brown',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(85, 59, 41, 1)',
    name: 'background-orange',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(79, 64, 41, 1)',
    name: 'background-yellow',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(46, 68, 58, 1)',
    name: 'background-green',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(45, 66, 86, 1)',
    name: 'background-blue',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(69, 58, 91, 1)',
    name: 'background-purple',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(81, 56, 77, 1)',
    name: 'background-pink',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgba(94, 52, 54, 1)',
    name: 'background-red',
    theme: 'dark',
    type: 'background'
  },
]
export const LANGS = [
  { value: 'ABAP', label: 'ABAP' },
  { value: 'Arduino', label: 'Arduino' },
  { value: 'Bash', label: 'Bash' },
  { value: 'BASIC', label: 'BASIC' },
  { value: 'C', label: 'C' },
  { value: 'Clojure', label: 'Clojure' },
  { value: 'CoffeeScript', label: 'CoffeeScript' },
  { value: 'C++', label: 'C++' },
  { value: 'C#', label: 'C#' },
  { value: 'CSS', label: 'CSS' },
  { value: 'Dart', label: 'Dart' },
  { value: 'Diff', label: 'Diff' },
  { value: 'Docker', label: 'Docker' },
  { value: 'Elixir', label: 'Elixir' },
  { value: 'Elm', label: 'Elm' },
  { value: 'Erlang', label: 'Erlang' },
  { value: 'Flow', label: 'Flow' },
  { value: 'Fortran', label: 'Fortran' },
  { value: 'F#', label: 'F#' },
  { value: 'Gherkin', label: 'Gherkin' },
  { value: 'GLSL', label: 'GLSL' },
  { value: 'Go', label: 'Go' },
  { value: 'GraphQL', label: 'GraphQL' },
  { value: 'Groovy', label: 'Groovy' },
  { value: 'Haskell', label: 'Haskell' },
  { value: 'HTML', label: 'HTML' },
  { value: 'Java', label: 'Java' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'JSON', label: 'JSON' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'LaTeX', label: 'LaTeX' },
  { value: 'Less', label: 'Less' },
  { value: 'Lisp', label: 'Lisp' },
  { value: 'LiveScript', label: 'LiveScript' },
  { value: 'Lua', label: 'Lua' },
  { value: 'Makefile', label: 'Makefile' },
  { value: 'Markdown', label: 'Markdown' },
  { value: 'Markup', label: 'Markup' },
  { value: 'MATLAB', label: 'MATLAB' },
  { value: 'Mermaid', label: 'Mermaid' },
  { value: 'Nix', label: 'Nix' },
  { value: 'Objective-C', label: 'Objective-C' },
  { value: 'OCaml', label: 'OCaml' },
  { value: 'Pascal', label: 'Pascal' },
  { value: 'Perl', label: 'Perl' },
  { value: 'PHP', label: 'PHP' },
  { value: 'Plain Text', label: 'Plain Text' },
  { value: 'PowerShell', label: 'PowerShell' },
  { value: 'Prolog', label: 'Prolog' },
  { value: 'Python', label: 'Python' },
  { value: 'R', label: 'R' },
  { value: 'Reason', label: 'Reason' },
  { value: 'Ruby', label: 'Ruby' },
  { value: 'Rust', label: 'Rust' },
  { value: 'Sass', label: 'Sass' },
  { value: 'Scala', label: 'Scala' },
  { value: 'Scheme', label: 'Scheme' },
  { value: 'Scss', label: 'Scss' },
  { value: 'Shell', label: 'Shell' },
  { value: 'SQL', label: 'SQL' },
  { value: 'Swift', label: 'Swift' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'VB.Net', label: 'VB.Net' },
  { value: 'Verilog', label: 'Verilog' },
  { value: 'VHDL', label: 'VHDL' },
  { value: 'Visual Basic', label: 'Visual Basic' },
  { value: 'WebAssembly', label: 'WebAssembly' },
  { value: 'XML', label: 'XML' },
  { value: 'YAML', label: 'YAML' }
]
