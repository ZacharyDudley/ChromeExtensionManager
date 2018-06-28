let extensionTable = document.getElementById('extensionTable');

function getAllExtensions() {
  chrome.runtime.sendMessage({type: 'allGet'}, function(allExtensions) {
    let allOption = {
      id: 'all',
      shortName: 'All Extensions'
    }

    let thisExtension;

    if (allExtensions.all.length > 1) {
      createExtensionRow(allOption);
    }

    for (let i = 0; i < allExtensions.all.length; i++) {
      if (allExtensions.all[i].type === 'extension') {
        if (allExtensions.all[i].id === 'indacognibelkfidjhkjchhmbicnmeif') {
          thisExtension = allExtensions.all[i];
        } else {
          createExtensionRow(allExtensions.all[i]);
        }
      }
    }
    createExtensionRow(thisExtension);
  });
}

function createExtensionRow(extensionInfo) {
  let extensionRow = extensionTable.insertRow();
  let extensionCell = extensionRow.insertCell();
  let buttonBackground = document.createElement('label');
  buttonBackground.classList.add('switch');

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  let button = document.createElement('span');
  button.classList.add('slider');
  button.id = `${extensionInfo.id}`;

  buttonBackground.appendChild(checkbox);
  buttonBackground.appendChild(button);
  extensionCell.appendChild(buttonBackground);

  let extensionTitle = document.createTextNode(extensionInfo.shortName);
  extensionCell.appendChild(extensionTitle);

  if (extensionInfo.enabled) {
    checkbox.checked = true;
    extensionRow.classList.add('extension-active');
  } else {
    checkbox.checked = false;
    extensionRow.classList.add('extension-inactive');
  }
}

function styleExtension(id, active) {
  let extension = document.getElementById(id);

  if (active) {
    if (extension.classList.contains('extension-inactive')) {
      extension.classList.remove('extension-inactive');
    }
    extension.classList.add('extension-active');
  } else {
    if (extension.classList.contains('extension-active')) {
      extension.classList.remove('extension-active');
    }
    extension.classList.add('extension-inactive');
  }
}

function allOn() {
  chrome.runtime.sendMessage({type: 'allOn'}, function(extensionArray) {
    extensionArray.forEach(extension => {
      styleExtension(extension.id, true);
    });
  });
}

function allOff() {
  chrome.runtime.sendMessage({type: 'allOff'}, function(extensionArray) {
    extensionArray.forEach(extension => {
      styleExtension(extension.id, false);
    });
  });
}

function oneOn(extensionId) {
  chrome.runtime.sendMessage({type: 'oneOn', id: extensionId}
  // , function(extensionArray) {
  //   extensionArray.forEach(extension => {
  //     styleExtension(extension.id, true);
  //   }
  // );
  // }
  );
}

function oneOff(extensionId) {
  chrome.runtime.sendMessage({type: 'oneOff', extensionId}
  // , function(extensionArray) {
  //   extensionArray.forEach(extension => {
  //     styleExtension(extension.id, false);
  //   });
  // }
  );
}

function logMessage(message) {
  chrome.runtime.sendMessage({type: 'message', message});
}

function sendMessageToBackground(extensionId) {
  chrome.management.get(extensionId, function(extensionInfo) {
    chrome.runtime.sendMessage({id: extensionId, enabled: extensionInfo.enabled}, function(response) {
      styleExtension(response.id, response.isActive);
    })
  })
}

function eventHandler(evnt) {
  if (evnt.target.id === 'all') {

  } else {

  }
  // sendMessageToBackground(evnt.target.id);
}

window.addEventListener('mouseup', eventHandler);

getAllExtensions();
