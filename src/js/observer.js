const NotionXObserver = function (selector, cb) {
  const observer = new MutationObserver(cb)
  const notionApp = document.querySelector(selector)
  const config = {
    childList: true,
    subtree: true
  }
  observer.observe(notionApp, config)
}
exports.NotionXObserver = NotionXObserver
