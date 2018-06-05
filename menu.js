let extensionTable = document.getElementById('extensionTable');

chrome.management.getAll(function(allExtensions) {
  allExtensions.forEach(extension => {
    if (extension.type === 'extension') {
      createExtensionRow(extension);
      // let extensionItem = document.createElement('div');
      // let title = document.createTextNode(extension.shortName);
      // let button = document.createElement('button');

      // button.addEventListener('mouseup', () => sendMessageToBackground(extension.id));

      // if (extension.enabled) {
      //   extensionItem.classList.add('extension-active');
      // } else {
      //   extensionItem.classList.add('extension-inactive');
      // }

      // extensionItem.id = `${extension.id}`;

      // extensionItem.appendChild(title);
      // extensionItem.appendChild(button);
      // extensionTable.appendChild(extensionItem);
    }
  });
});

function createExtensionRow(extensionInfo) {
  let extensionRow = extensionTable.insertRow();
  let cellButton = extensionRow.insertCell();
  let cellTitle = extensionRow.insertCell();
  let button = document.createElement('button');

  button.addEventListener('mouseup', () => sendMessageToBackground(extensionInfo.id));

  cellButton.appendChild(button);

  let extensionTitle = document.createTextNode(extensionInfo.shortName);
  cellTitle.appendChild(extensionTitle);

  extensionRow.id = `${extensionInfo.id}`;

  if (extensionInfo.enabled) {
    extensionRow.classList.add('extension-active');
    button.classList.add('button-active');
    cellTitle.classList.add('title-active');
  } else {
    extensionRow.classList.add('extension-inactive');
    button.classList.add('button-inactive');
    cellTitle.classList.add('title-inactive');
  }
}

function styleExtension(id, active) {
  let extension = document.getElementById(id);
  let extensionButton = extension.firstChild.firstChild;
  let extensionTitle = extension.lastChild;

  if (active) {
    if (extension.classList.contains('extension-inactive')) {
      extension.classList.remove('extension-inactive');
    }
    extension.classList.add('extension-active');

    if (extensionButton.classList.contains('button-inactive')) {
      extensionButton.classList.remove('button-inactive');
    }
    extensionButton.classList.add('button-active');

    if (extensionTitle.classList.contains('title-inactive')) {
      extensionTitle.classList.remove('title-inactive');
    }
    extensionTitle.classList.add('title-active');
  } else {
    if (extension.classList.contains('extension-active')) {
      extension.classList.remove('extension-active');
    }
    extension.classList.add('extension-inactive');

    if (extensionButton.classList.contains('button-active')) {
      extensionButton.classList.remove('button-active');
    }
    extensionButton.classList.add('button-inactive');

    if (extensionTitle.classList.contains('title-active')) {
      extensionTitle.classList.remove('title-active');
    }
    extensionTitle.classList.add('title-inactive');
  }

}

function sendMessageToBackground(extensionId) {
  chrome.management.get(extensionId, function(extensionInfo) {
    chrome.runtime.sendMessage({id: extensionId, enabled: extensionInfo.enabled}, function(response) {
      styleExtension(response.id, response.isActive);
      // let extension = document.getElementById(response.id);
      // if (response.isActive) {
      //   if (extension.classList.contains('extension-inactive')) {
      //     extension.classList.remove('extension-inactive');
      //   }
      //   extension.classList.add('extension-active');
      // } else {
      //   if (extension.classList.contains('extension-active')) {
      //     extension.classList.remove('extension-active');
      //   }
      //   extension.classList.add('extension-inactive');
      // }
    })
  })
}
