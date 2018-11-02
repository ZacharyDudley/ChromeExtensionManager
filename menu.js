let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
let extensionTable = document.getElementById('extensionTable');

function retreiveExtenstions() {
  chrome.storage.local.get(['extensionList'], function(extensionList) {
    if (Object.keys(extensionList).length > 0) {
      createExtensionGrid(extensionList);
    } else {
      getExtensionsFromBackground();
    }
  });
}

function getExtensionsFromBackground() {
  chrome.runtime.sendMessage({type: 'getAll'}, function(allExtensions) {
    storeExtensions(allExtensions);
    createExtensionGrid(allExtensions);
  });
}

function storeExtensions(extensions) {
  chrome.storage.local.set({extensionList: extensions});
}

function createExtensionGrid(extensions) {
  if (extensions.extensionList.all.length > 1) {
    createExtensionRow(extensions.extensionList.allOption);
  }
  for (let i = 0; i < extensions.extensionList.all.length; i++) {
    createExtensionRow(extensions.extensionList.all[i]);
  }
  createExtensionRow(extensions.extensionList.thisExtension, true);
}

function createExtensionRow(extensionInfo, isThisExtension = false) {
  let extensionRow = extensionTable.insertRow();
  let extensionCell = extensionRow.insertCell();
  let buttonBackground = document.createElement('label');
  buttonBackground.classList.add('switch');

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  let button = document.createElement('span');
  button.classList.add('slider');

  buttonBackground.appendChild(checkbox);
  buttonBackground.appendChild(button);
  extensionCell.appendChild(buttonBackground);

  let extensionTitle = document.createTextNode(extensionInfo.shortName);
  let title = document.createElement('p');
  title.appendChild(extensionTitle);
  extensionCell.appendChild(title);

  // LOCK BOX
  let lockBox = document.createElement('input');
  lockBox.type = 'checkbox';
  lockBox.id = `lock-${extensionInfo.id}`;
  lockBox.classList.add('lockbox');
  extensionCell.appendChild(lockBox);

  button.id = `${extensionInfo.id}`;

  if (isThisExtension) {
    extensionRow.classList.add('this');
  }

  styleExtension(extensionInfo.id, extensionInfo.enabled);
}

function styleExtension(id, active) {
  let button = document.getElementById(id);
  let row = button.parentElement.parentElement.parentElement;
  let checkbox = button.previousSibling;

  if (active) {
    if (button.classList.contains('inactive')) {
      button.classList.remove('inactive');
      row.classList.remove('inactiveRow');
    }
    button.classList.add('active');
    row.classList.add('activeRow');
  } else {
    if (button.classList.contains('active')) {
      button.classList.remove('active');
      row.classList.remove('activeRow');
    }
    button.classList.add('inactive');
    row.classList.add('inactiveRow');
  }

  checkbox.checked = active;
}

function allOn() {
  chrome.runtime.sendMessage({type: 'allOn'}, function(allExtensions) {
    for (let i = 0; i < allExtensions.all.length; i++) {
      styleExtension(allExtensions.all[i], true);
    }
  });
}

function allOff() {
  chrome.runtime.sendMessage({type: 'allOff'}, function(allExtensions) {
    for (let i = 0; i < allExtensions.all.length; i++) {
      styleExtension(allExtensions.all[i], false);
    }
  });
}

function oneOn(extensionId) {
  chrome.runtime.sendMessage({type: 'oneOn', id: extensionId}, function(extension) {
    styleExtension(extension.id, true);
  });
}

function oneOff(extensionId) {
  chrome.runtime.sendMessage({type: 'oneOff', id: extensionId}, function(extension) {
    styleExtension(extension.id, false);
  });
}

function logMessage(message) {
  chrome.runtime.sendMessage({type: 'message', message});
}

function eventHandler(evnt) {
  if (evnt.target.id) {
    let checkbox = document.getElementById(evnt.target.id).previousSibling;
    let lockbox = document.getElementById(evnt.target.id).parentElement.nextSibling.nextSibling;

    if (evnt.target.id === 'all') {
      if (checkbox.checked) {
        allOff(evnt.target.id);
      } else {
        allOn(evnt.target.id);
      }
    } else if (lockbox.checked) {
      checkbox.disabled = true;
    } else if (checkbox.checked) {
      oneOff(evnt.target.id);
    } else if (!checkbox.checked) {
      oneOn(evnt.target.id);
    }
  }
}

window.addEventListener('mouseup', eventHandler);

retreiveExtenstions();
