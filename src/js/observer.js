/* eslint-disable no-unused-vars */
// notion视图观察者
export default function notionXObserver (selector, cb, args) {
  const observer = new MutationObserver(args => cb(args))
  const notionApp = document.querySelector(selector)
  const config = {
    childList: true,
    subtree: true
  }
  observer.observe(notionApp, config)
}
