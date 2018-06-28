let everyExtension = [];
let thisExtension;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'allGet':
      chrome.management.getAll(function(allExtensions) {
        sendResponse({all: allExtensions});
      });
      break;

    case 'allOn':
      chrome.management.getAll(function(allExtensions) {
        allExtensions.forEach(extension => {
          if (extension.type === 'extension' && extension.enabled && extension.id !== 'indacognibelkfidjhkjchhmbicnmeif') {
            chrome.management.setEnabled(extension.id, true);
          }
        });
      });
      break;

    case 'allOff':
      chrome.management.getAll(function(allExtensions) {
        allExtensions.forEach(extension => {
          if (extension.type === 'extension' && !extension.enabled && extension.id !== 'indacognibelkfidjhkjchhmbicnmeif') {
            chrome.management.setEnabled(extension.id, false);
          }
        });
      });
      break;

    case 'oneOn':
      chrome.management.setEnabled(request.id, true);
      // sendResponse(request.id);
      break;

    case 'oneOff':
      chrome.management.setEnabled(request.id, false);
      // sendResponse(request.id);
      break;

    default:
      console.log('REQUEST: ', request);
  }

  return true;
});
