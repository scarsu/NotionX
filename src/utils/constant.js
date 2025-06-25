export const NOTION_APP_SELECTOR = '#notion-app'
export const NOTION_CONTENT_SELECTOR = '.notion-page-content'
export const NOTION_TOPBAR_SELECTOR = '.notion-topbar>div'
export const NOTION_SCROLLER_SELECTOR = '.notion-scroller'
export const NOTION_WRAPPER_SELECTOR = '.notion-cursor-listener'

export const NOTIONX_STORE_KEY = 'notionx_2.1.4'

export const DEFAULT_OPTS = {
  showDark: true,
  dark: false,
  hotKeys: '⌘+⇧+x',
  width: 220,
  viewKey: 'toc',
  fsmState: 'hide',
  expandStatus: null,
  genFlagList: null,
}

export const DEFAULT_VIEW_KEY = 'toc'
export const MAX_WIDTH = 480
export const MIN_WIDTH = 190
export const EXTENSION_STORAGE_OPTION_KEY = 'notionx_options_2.1.4'
export const CONTENT_DETECT = 'CONTENT_DETECT'
export const COMMENT_STYLE = 'background:rgba(255,212,0,0.14);border-bottom:2px solid rgb(255, 212, 0);padding-bottom:2px'
export const COLORS = [
  {
    value: 'rgb(155, 154, 151)',
    name: 'font-gray',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(100, 71, 58)',
    name: 'font-brown',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(217, 115, 13)',
    name: 'font-orange',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(223, 171, 1)',
    name: 'font-yellow',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(15, 123, 108)',
    name: 'font-green',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(11, 110, 153)',
    name: 'font-blue',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(105, 64, 165)',
    name: 'font-purple',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(173, 26, 114)',
    name: 'font-pink',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(224, 62, 62)',
    name: 'font-red',
    theme: 'light',
    type: 'font'
  },
  {
    value: 'rgb(235, 236, 237)',
    name: 'background-gray',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(233, 229, 227)',
    name: 'background-brown',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(250, 235, 221)',
    name: 'background-orange',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(251, 243, 219)',
    name: 'background-yellow',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(221, 237, 234)',
    name: 'background-green',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(221, 235, 241)',
    name: 'background-blue',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(234, 228, 242)',
    name: 'background-purple',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(244, 223, 235)',
    name: 'background-pink',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgb(251, 228, 228)',
    name: 'background-red',
    theme: 'light',
    type: 'background'
  },
  {
    value: 'rgba(151, 154, 155, 0.95)',
    name: 'font-gray',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(147, 114, 100)',
    name: 'font-brown',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(255, 163, 68)',
    name: 'font-orange',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(255, 220, 73)',
    name: 'font-yellow',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(77, 171, 154)',
    name: 'font-green',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(82, 156, 202)',
    name: 'font-blue',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(154, 109, 215)',
    name: 'font-purple',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(226, 85, 161)',
    name: 'font-pink',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(255, 115, 105)',
    name: 'font-red',
    theme: 'dark',
    type: 'font'
  },
  {
    value: 'rgb(69, 75, 78)',
    name: 'background-gray',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(67, 64, 64)',
    name: 'background-brown',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(89, 74, 58)',
    name: 'background-orange',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(89, 86, 59)',
    name: 'background-yellow',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(53, 76, 75)',
    name: 'background-green',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(54, 73, 84)',
    name: 'background-blue',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(68, 63, 87)',
    name: 'background-purple',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(83, 59, 76)',
    name: 'background-pink',
    theme: 'dark',
    type: 'background'
  },
  {
    value: 'rgb(89, 65, 65)',
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
