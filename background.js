let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
let extensionList = [];
let allExtensionsOn = true;
let allExtensionsOff = true;
let allOption = {
  id: 'all',
  shortName: 'All Extensions',
  enabled: false
}
let thisExtension = {
  id: 'indacognibelkfidjhkjchhmbicnmeif',
  shortName: 'CHROME BOSS',
  enabled: true
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  extensionList = [];
  allExtensionsOn = true;
  allExtensionsOff = true;


  switch (request.type) {
    case 'allGet':
      chrome.management.getAll(function(allExtensions) {
        allExtensions.forEach(extension => {
          if (extension.type === 'extension' && extension.id !== thisExtensionId) {
            extensionList.push(extension);
            if (extension.enabled) {
              allExtensionsOff = false;
            } else {
              allExtensionsOn = false;
            }
          }
        });
        extensionList.sort(function (a, b) {
          let nameA = a.shortName.toLowerCase();
          let nameB = b.shortName.toLowerCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        if (allExtensionsOff) {
          allOption.enabled = false;
        } else if (allExtensionsOn) {
          allOption.enabled = true;
        }
        sendResponse({all: extensionList, allOption, thisExtension});
      });
      break;

    case 'allOn':
        chrome.management.getAll(function(allExtensions) {
          allExtensions.forEach(extension => {
            if (extension.type === 'extension' && !extension.enabled && extension.id !== thisExtensionId) {
              chrome.management.setEnabled(extension.id, true);
              extensionList.push(extension.id);
            }
          });
          allOption.enabled = true;
          extensionList.push('all');
          sendResponse({all: extensionList});
        });
      break;

    case 'allOff':
      chrome.management.getAll(function(allExtensions) {
        allExtensions.forEach(extension => {
          if (extension.type === 'extension' && extension.enabled && extension.id !== thisExtensionId) {
            chrome.management.setEnabled(extension.id, false);
            extensionList.push(extension.id);
          }
        });
        allOption.enabled = false;
        extensionList.push('all');
        sendResponse({all: extensionList});
      });
      break;

    case 'oneOn':
      chrome.management.setEnabled(request.id, true);
      sendResponse({id: request.id});
      break;

    case 'oneOff':
      chrome.management.setEnabled(request.id, false);
      sendResponse({id: request.id});
      break;

    default:
      console.log('DEFAULT: ', request);
  }

  return true;
});
