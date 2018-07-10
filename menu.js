let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
let extensionTable = document.getElementById('extensionTable');

function getAllExtensions() {
  chrome.runtime.sendMessage({type: 'allGet'}, function(allExtensions) {
    if (allExtensions.all.length > 1) {
      createExtensionRow(allExtensions.allOption);
    }

    for (let i = 0; i < allExtensions.all.length; i++) {
        createExtensionRow(allExtensions.all[i]);
    }

    createExtensionRow(allExtensions.thisExtension, true);
  });
}

function createExtensionRow(extensionInfo, isThisExtension = false) {
  let extensionRow = extensionTable.insertRow();
  let extensionCell = extensionRow.insertCell();
  let buttonBackground = document.createElement('label');
  buttonBackground.classList.add('switch');

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  // checkbox.checked = extensionInfo.enabled;

  let button = document.createElement('span');
  button.classList.add('slider');

  buttonBackground.appendChild(checkbox);
  buttonBackground.appendChild(button);
  extensionCell.appendChild(buttonBackground);

  let extensionTitle = document.createTextNode(extensionInfo.shortName);
  extensionCell.appendChild(extensionTitle);

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
  // styleExtension('all', true);
  chrome.runtime.sendMessage({type: 'allOn'}, function(allExtensions) {
    for (let i = 0; i < allExtensions.all.length; i++) {
      styleExtension(allExtensions.all[i], true);
    }
  });
}

function allOff() {
  // styleExtension('all', false);
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
  let checkbox = document.getElementById(evnt.target.id).previousSibling;

  if (evnt.target.id === 'all') {
    if (checkbox.checked) {
      allOff(evnt.target.id);
    } else {
      allOn(evnt.target.id);
    }
  } else if (checkbox.checked) {
    oneOff(evnt.target.id);
  } else {
    oneOn(evnt.target.id);
  }
}

window.addEventListener('mouseup', eventHandler);

getAllExtensions();
