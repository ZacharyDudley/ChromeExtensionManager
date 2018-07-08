let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
let extensionList = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log('REQUEST: ', request);
  extensionList = [];

  switch (request.type) {
    case 'allGet':
      chrome.management.getAll(function(allExtensions) {
        sendResponse({all: allExtensions});
      });
      break;

    case 'allOn':
      console.log('ALL - ON', request)
      chrome.management.getAll(function(allExtensions) {
        allExtensions.forEach(extension => {
          if (extension.type === 'extension' && !extension.enabled && extension.id !== thisExtensionId) {
            chrome.management.setEnabled(extension.id, true);
            extensionList.push(extension.id);
          }
        });
        sendResponse({all: extensionList});
      });
      break;

    case 'allOff':
      console.log('ALL - OFF', request)
      chrome.management.getAll(function(allExtensions) {
        allExtensions.forEach(extension => {
          if (extension.type === 'extension' && extension.enabled && extension.id !== thisExtensionId) {
            chrome.management.setEnabled(extension.id, false);
            extensionList.push(extension.id);
          }
        });
        sendResponse({all: extensionList});
      });
      break;

    case 'oneOn':
      console.log('ONE - ON', request)
      chrome.management.setEnabled(request.id, true);
      sendResponse({id: request.id});
      break;

    case 'oneOff':
      console.log('ONE - OFF', request)
      chrome.management.setEnabled(request.id, false);
      sendResponse({id: request.id});
      break;

    default:
      console.log('DEFAULT: ', request);
  }

  return true;
});
