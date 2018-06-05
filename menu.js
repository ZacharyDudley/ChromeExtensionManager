let extensionList = document.getElementById('extensionList');

chrome.management.getAll(function(allExtensions) {
  allExtensions.forEach(extension => {
    if (extension.type === 'extension') {
      let extensionItem = document.createElement('div');
      let title = document.createTextNode(extension.shortName);
      let button = document.createElement('button');

      button.addEventListener('mouseup', () => sendMessageToBackground(extension.id));

      extensionItem.id = `${extension.id}`;
      extensionItem.appendChild(title);
      extensionItem.appendChild(button);
      extensionList.appendChild(extensionItem);
    }
  });
});

function sendMessageToBackground(extensionId) {
  chrome.management.get(extensionId, function(extensionInfo) {
    chrome.runtime.sendMessage({id: extensionId, enabled: extensionInfo.enabled}, function(response) {
      console.log('MENU SCRIPT')
    })
  })
}
