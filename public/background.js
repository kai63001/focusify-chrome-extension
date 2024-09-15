/* global chrome */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    importBookmarks();
  }
});

function importBookmarks() {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    const bookmarks = processBookmarks(bookmarkTreeNodes[0]);
    chrome.storage.local.set({ importedBookmarks: bookmarks }, () => {
      console.log("Bookmarks imported successfully");
    });
  });
}

function processBookmarks(node) {
  let result = [];
  if (node.children) {
    node.children.forEach((child) => {
      if (child.url) {
        result.push({
          type: "link",
          name: child.title,
          url: child.url,
        });
      } else if (child.children) {
        result.push({
          type: "folder",
          name: child.title,
          children: processBookmarks(child),
        });
      }
    });
  }
  return result;
}
