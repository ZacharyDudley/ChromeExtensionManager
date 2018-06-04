let extensionList = document.getElementById('extensionList');

chrome.management.getAll(function(allExtensions) {
  allExtensions.forEach(extension => {
    if (extension.type === 'extension') {
      let extensionItem = document.createElement('div');
      let title = document.createTextNode(extension.shortName);
      let button = document.createElement('button');

      extensionItem.id = `${extension.id}`;
      extensionItem.appendChild(title);
      extensionItem.appendChild(button);
      extensionList.appendChild(extensionItem);
    }
  });
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: 'hello'}, function(response) {
    console.log('TAB RESPONSE: ', response)
  })
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('REQ: ', request)
    console.log('SENDER: ', sender)
});

document.addEventListener('load', function() {
  let allButtons = window.document.getElementsByTagName('button');
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function(event) {
      console.log('EVNT: ', event)
    })
  }
})
