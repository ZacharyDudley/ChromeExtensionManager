let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
let extensionTable = document.getElementById('extensionTable');

function retreiveExtenstions() {
  chrome.runtime.sendMessage({type: 'getAll'}, function(extensions) {
    createGrid(extensions);
  });
}

function createGrid(extensions) {
  if (Object.keys(extensions.extensions).length > 1) {
    createRow(extensions.allOption, false, false, true);
  }
  for (extension in extensions.extensions) {
    createRow(extensions.extensions[extension], extensions.locked[extension]);
  }
  createRow(extensions.thisOption, false, true);
}

function createRow(extensionInfo, lockStatus, isThisExtension = false, isAllToggle = false) {
  // ROW
  let extensionRow = extensionTable.insertRow();
  let extensionCell = extensionRow.insertCell();

  extensionRow.dataset.id = extensionInfo.id;

  // TOGGLE
  let checkbox = document.createElement('input');
  let button = document.createElement('span');
  let buttonBackground = document.createElement('label');

  checkbox.type = 'checkbox';
  checkbox.setAttribute('data-toggle', extensionInfo.id);
  button.id = `${extensionInfo.id}`;
  button.classList.add('slider');
  buttonBackground.classList.add('switch');
  buttonBackground.appendChild(checkbox);
  buttonBackground.appendChild(button);
  extensionCell.appendChild(buttonBackground);

  if (extensionInfo.id !== 'all') {
    checkbox.onchange = clickToggle;
  } else {
    checkbox.onchange = clickToggleAll;
  }

  // TITLE
  let extensionTitle = document.createTextNode(extensionInfo.shortName);
  let title = document.createElement('p');

  title.appendChild(extensionTitle);
  extensionCell.appendChild(title);

  if (!isThisExtension && !isAllToggle) {
    // LOCKBOX
    let lockbox = document.createElement('input');

    lockbox.type = 'checkbox';
    lockbox.onchange = clickLockbox;
    lockbox.setAttribute('data-lock', extensionInfo.id);
    lockbox.classList.add('lockbox');
    lockbox.checked = lockStatus;
    extensionCell.appendChild(lockbox);
  }

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
  // chrome.runtime.sendMessage({type: 'allOn'}, function(allExtensions) {
  //   for (let i = 0; i < allExtensions.all.length; i++) {
  //     styleExtension(allExtensions.all[i], true);
  //   }
  // });

  chrome.storage.local.get(['extensions', 'locked'], function(extensionStorage) {
    console.log(extensionStorage)
  });
}

function allOff() {
  // chrome.runtime.sendMessage({type: 'allOff'}, function(allExtensions) {
  //   for (let i = 0; i < allExtensions.all.length; i++) {
  //     styleExtension(allExtensions.all[i], false);
  //   }
  // });

  // chrome.storage.local.get(['extensions'], function(extensionStorage) {
  //   if (extensionStorage.extensions) {
  //     createExtensionGrid(extensionStorage.extensions);
  //   } else {
  //     getExtensionsFromBackground();
  //   }
  // });
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

function clickToggleAll(event) {
    allOn();
  // toggleAll(event.target.dataset.toggle, event.target.checked);
}

function clickToggle(event) {
  if (event.target.checked) {
    oneOn(event.target.dataset.toggle);
  } else {
    oneOff(event.target.dataset.toggle);
  }
  // chrome.runtime.sendMessage({type: 'one', id: event.target.dataset.toggle, disable: event.target.checked}, function(extension) {
  //   styleExtension(extension.id, true);
  // });
}

function clickLockbox(event) {
  chrome.runtime.sendMessage({type: 'lock', id: event.target.dataset.lock, status: event.target.checked}, function() {
    let row = document.querySelector(`tr[data-id=${event.target.dataset.lock}]`);
    let toggle = document.querySelector(`[data-toggle=${event.target.dataset.lock}]`);

    // send to STYLE

    if (event.target.checked) {
      toggle.disabled = true;
      row.dataset.lock = 'true';
    } else {
      toggle.disabled = false;
      row.dataset.lock = 'false';
    }
  });
}

function clearAllData() {
  chrome.storage.local.clear();
  chrome.runtime.sendMessage({type: 'clear'}, function(data) {
    console.log(data)
  });
}

// clearAllData();
retreiveExtenstions();
