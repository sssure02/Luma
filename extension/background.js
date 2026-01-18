// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lumaRead",
    title: "Luma: Explain Social Cues (Read)",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "lumaWrite",
    title: "Luma: Check Tone & Rewrite (Write)",
    contexts: ["selection", "editable"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const mode = info.menuItemId === "lumaRead" ? "read" : "write";
  // This sends the data TO the content script
  chrome.tabs.sendMessage(tab.id, {
    action: "openLuma",
    text: info.selectionText || "",
    mode: mode
  });
});