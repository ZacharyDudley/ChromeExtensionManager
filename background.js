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

    case 'allOn':
      chrome.storage.local.get(['extensions', 'locked', 'allOption', 'thisOption'], function(extensionData) {
        console.log(extensionData)
      })

        // chrome.management.getAll(function(allExtensions) {
        //   allExtensions.forEach(extension => {
        //     if (extension.type === 'extension' && !extension.enabled && extension.id !== thisExtensionId) {
        //       chrome.management.setEnabled(extension.id, true);
        //       extensionList.push(extension.id);
        //     }
        //   });
        //   allOption.enabled = true;
        //   extensionList.push('all');
        //   sendResponse({all: extensionList});
        // });
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
      chrome.storage.local.get(['extensions'], function(data) {
        chrome.management.setEnabled(request.id, true);
        data.extensions[request.id].enabled = true;
        chrome.storage.local.set({extensions: data.extensions});
        sendResponse({id: request.id});
      });
      break;

    case 'oneOff':
      chrome.storage.local.get(['extensions'], function(data) {
        chrome.management.setEnabled(request.id, false);
        data.extensions[request.id].enabled = false;
        chrome.storage.local.set({extensions: data.extensions});
        sendResponse({id: request.id});
      });
      break;

    case 'one':
      chrome.storage.local.get(['extensions'], function(data) {
        chrome.management.setEnabled(request.id, request.disable);
        data.extensions[request.id].enabled = request.disable;
        chrome.storage.local.set({extensions: data.extensions});
        sendResponse({id: request.id});
      });
      break;

    case 'lock':
      chrome.storage.local.get(['locked'], function(data) {
        data.locked[request.id] = request.status;
        chrome.storage.local.set({locked: data.locked});
        sendResponse({id: request.id});
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
