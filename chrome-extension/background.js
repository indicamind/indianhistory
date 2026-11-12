function openOfflineReader() {
  return chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
}

chrome.action.onClicked.addListener(openOfflineReader);
