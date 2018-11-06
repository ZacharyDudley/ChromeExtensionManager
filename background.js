let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
let extensionList = {};
let locked = {};
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
  let data;

  switch (request.type) {
    case 'getAll':
      chrome.storage.local.get(['extensions', 'locked', 'allOption', 'thisOption'], function(extensionStorage) {
        if (extensionStorage.extensions) {
          sendResponse(extensionStorage);
        } else {
          chrome.management.getAll(function(extensions) {
            extensions.forEach(extension => {
              if (extension.type === 'extension' && extension.id !== thisExtensionId) {
                extensionList[`${extension.id}`] = extension;
                locked[`${extension.id}`] = false;

                if (extension.enabled) {
                  allExtensionsOff = false;
                } else {
                  allExtensionsOn = false;
                }
              }
            });

            if (allExtensionsOff) {
              allOption.enabled = false;
            } else if (allExtensionsOn) {
              allOption.enabled = true;
            }

            chrome.storage.local.set({
              extensions: extensionList,
              locked: locked,
              allOption: allOption,
              thisOption: thisExtension
            });

            sendResponse({
              extensions: extensionList,
              locked: locked,
              allOption: allOption,
              thisOption: thisExtension
            });
          });
        }
      });
      //   extensionList.sort(function (a, b) {
      //     let nameA = a.shortName.toLowerCase();
      //     let nameB = b.shortName.toLowerCase();
      //     if (nameA < nameB) {
      //       return -1;
      //     } else if (nameA > nameB) {
      //       return 1;
      //     } else {
      //       return 0;
      //     }
      //   });
      break;

    case 'all':
      chrome.storage.local.get(['extensions', 'locked', 'allOption'], function(data) {
        for (extension in data.extensions) {
          if (!data.locked[extension]) {
            chrome.management.setEnabled(extension, request.disable);
            data.extensions[extension].enabled = request.disable;
          }
        }
        data.allOption.enabled = request.disable;
        chrome.storage.local.set({extensions: data.extensions, allOption: data.allOption});
        sendResponse({extensions: data.extensions, locked: data.locked, allOption: data.allOption});
      });
      break;

    case 'one':
      chrome.storage.local.get(['extensions'], function(data) {
        chrome.management.setEnabled(request.id, request.disable);
        data.extensions[request.id].enabled = request.disable;
        chrome.storage.local.set({extensions: data.extensions});
        sendResponse({id: request.id, active: data.extensions[request.id].enabled});
      });
      break;

    case 'lock':
      chrome.storage.local.get(['locked'], function(data) {
        data.locked[request.id] = request.status;
        chrome.storage.local.set({locked: data.locked});
        sendResponse({id: request.id, isLocked: data.locked[request.id]});
      });
      break;

    case 'clear':
      chrome.storage.local.clear();
      chrome.storage.local.get(['extensions', 'locked', 'allOption', 'thisOption'], function(extensionStorage) {
        data = extensionStorage;
      });

    default:
      console.log('DEFAULT: ', request);
  }

  return true;
});
