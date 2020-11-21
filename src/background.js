/* eslint-disable no-undef */
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Hello from the background');
  console.log(request, sender, sendResponse);

  browser.tabs.executeScript({
    file: 'content-script.js',
  });
});
