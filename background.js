let allExtensions = [];
let thisExtension = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('SENT REQ: ', request)
  switch (request.type) {
    case 'getAll':
      chrome.management.getAll(function(extensions) {
        extensions.forEach(element => {
          if (element.type === 'extension') {
            if (element.id === 'indacognibelkfidjhkjchhmbicnmeif') {
              thisExtension = element;
            } else {
              allExtensions.push(element);
            }
          }
        });
        console.log(allExtensions);
        sendResponse(allExtensions);
      });
      return;

    case 'getOne':
      chrome.management.get(request.id, function(extensionInfo) {
        console.log('RES: ', extensionInfo);
        sendResponse(extensionInfo);
      });
      return;

    case 'getThis':

      return;

    case 'onAll':
      break;

    case 'offAll':
      break;

    case 'onOne':
      chrome.management.setEnabled(request.id, true);
      break;

    case 'offOne':
      chrome.management.setEnabled(request.id, false);
      break;

    default:
      console.log('REQUEST: ', request);
      break;
  }
  //   sendResponse({id: request.id, isActive: !request.enabled});
});
