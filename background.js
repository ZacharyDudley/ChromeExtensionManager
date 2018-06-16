let allExtensions = [];
let thisExtension = {};

chrome.runtime.onInstalled.addListener(function() {
  chrome.management.getAll(function(extensions) {
    extensions.forEach(element => {
      if (element.type === 'extension') {
        if (element.id === 'indacognibelkfidjhkjchhmbicnmeif') {
          thisExtension = element;
        } else {
          allExtensions.push(element);
        }
      }
    })

    // chrome.runtime.sendMessage({type: 'init', data: allExtensions})
  });
});

chrome.management.onInstalled.addListener(function(extensionInfo) {
  if (extensionInfo.type === 'extension') {
    allExtensions.push(extensionInfo);
  }
});

chrome.management.onUninstalled.addListener(function(extensionId) {
  for (let i = 0; i < allExtensions.length; i++) {
    if (allExtensions[i].id === extensionId) {
      allExtensions.splice(i, 1);
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'getAll':
      sendResponse({type: 'allExtensions', data: allExtensions});
      return;

    case 'toggle':
      chrome.management.get(request.id, function(extensionInfo) {
        chrome.management.setEnabled(extensionInfo.id, !extensionInfo.enabled);

        for (let i = 0; i < allExtensions.length; i++) {
          if (allExtensions[i].id === extensionInfo.id) {
            allExtensions[i].enabled = !extensionInfo.enabled;
          }
        }
      });
      return;

    default:
      console.log('REQUEST: ', request);
  }
});
