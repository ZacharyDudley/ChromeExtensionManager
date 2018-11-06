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

  styleExtension(extensionInfo.id, extensionInfo.enabled, lockStatus);
}

function styleExtension(id, isActive, lockStatus) {
  let button = document.getElementById(id);
  let row = button.parentElement.parentElement.parentElement;
  let checkbox = button.previousSibling;

  if (isActive) {
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

  checkbox.checked = isActive;

  if (id !== thisExtensionId && id !== 'all') {
    styleLock(id, lockStatus);
  }
}

function styleLock(id, isLocked) {
  let row = document.querySelector(`tr[data-id=${id}]`);
  let toggle = document.querySelector(`[data-toggle=${id}]`);

  if (isLocked) {
    toggle.disabled = true;
    row.dataset.lock = 'true';
  } else {
    toggle.disabled = false;
    row.dataset.lock = 'false';
  }
}

function clickToggleAll(event) {
  chrome.runtime.sendMessage({type: 'all', disable: event.target.checked}, function(data) {
    for (extension in data.extensions) {
      styleExtension(extension, data.extensions[extension].enabled, data.locked[extension]);
    }
    styleExtension('all', data.allOption.enabled);
  });
}

function clickToggle(event) {
  chrome.runtime.sendMessage({type: 'one', id: event.target.dataset.toggle, disable: event.target.checked}, function(data) {
    styleExtension(data.id, data.active, false);
  });
}

function clickLockbox(event) {
  chrome.runtime.sendMessage({type: 'lock', id: event.target.dataset.lock, status: event.target.checked}, function(data) {
    styleLock(data.id, data.isLocked);
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
