let extensionTable = document.getElementById('extensionTable');

let requestSelf = {
  type: 'getOne',
  id: 'indacognibelkfidjhkjchhmbicnmeif'
};

// function sendMessageToBackground(extensionId) {
//   chrome.management.get(extensionId, function(extensionInfo) {
//     chrome.runtime.sendMessage({id: extensionId, enabled: extensionInfo.enabled}, function(response) {
//       styleExtension(response.id, response.isActive);
//     })
//   })
// }


// chrome.management.getAll(function(allExtensions) {
//   let thisExtension = {};
//   let allOption = {
//     id: 'all',
//     shortName: 'All Extensions'
//   }

//   if (allExtensions.length > 1) {
//     createExtensionRow(allOption);
//   }

//   allExtensions.forEach(extension => {
//     if (extension.type === 'extension') {
//       if (extension.id === 'indacognibelkfidjhkjchhmbicnmeif') {
//         thisExtension = extension;
//       } else {
//         createExtensionRow(extension);
//       }
//     }
//   });
//   createExtensionRow(thisExtension);
// });

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

function sendRequest(request) {
  chrome.runtime.sendMessage(request, function(response) {
    // chrome.runtime.sendMessage(response);

    // response.foreach(el => {
    //   createExtensionRow(el);
    // });

    createExtensionRow(response);
    // styleExtension(response.id, response.isActive);
  });
};

function eventHandler(evnt) {
  sendMessageToBackground(evnt.target.id);
};

window.addEventListener('mouseup', eventHandler);

sendRequest(requestSelf);
