let thisExtensionId = 'indacognibelkfidjhkjchhmbicnmeif';
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
    createExtensionRow(thisExtension, true);
  });
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
  extensionCell.appendChild(extensionTitle);

  button.id = `${extensionInfo.id}`;
  // extensionRow.id = `${extensionInfo}-row`;

  if (isThisExtension) {
    extensionRow.classList.add('this');
  }

  if (extensionInfo.enabled) {
    checkbox.checked = true;
    // extensionRow.dataset.enabled = true;
    // extensionRow.classList.add('active');
    button.classList.add('active');
  } else {
    checkbox.checked = false;
    // extensionRow.dataset.enabled = false;
    // extensionRow.classList.add('inactive');
    button.classList.add('inactive');
  }
}

function styleExtension(id, active) {
  let extension = document.getElementById(id);
  // let row = document.getElementById(`{id}-row`);

  // if (active) {
  //   row.dataset.enabled = true;
  // } else {
  //   row.dataset.enabled = false;
  // }

  if (active) {
    if (extension.classList.contains('inactive')) {
      extension.classList.remove('inactive');
      // row.classList.remove('inactive');
    }
    extension.classList.add('active');
    // row.classList.add('active');
  } else {
    if (extension.classList.contains('active')) {
      extension.classList.remove('active');
      // row.classList.remove('active');
    }
    extension.classList.add('inactive');
    // row.classList.add('inactive');
  }
}

function allOn() {
  styleExtension('all', true);
  chrome.runtime.sendMessage({type: 'allOn'}, function(allExtensions) {
    for (let i = 0; i < allExtensions.all.length; i++) {
      styleExtension(allExtensions.all[i], true);
    }
  });
}

function allOff() {
  styleExtension('all', false);
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
  let targetElement = document.getElementById(evnt.target.id);
  logMessage({class: targetElement.classList, el: targetElement, tar: evnt.target, id: evnt.target.id})

  if (evnt.target.id === 'all') {
    if (targetElement.classList.contains('active')) {
      allOff(evnt.target.id);
    } else {
      allOn(evnt.target.id);
    }
  } else if (targetElement.classList.contains('active')) {
    oneOff(evnt.target.id);
  } else {
    oneOn(evnt.target.id);
  }
  // else {
    // if (targetElement.dataset.enabled) {
    //   oneOff(evnt.target.id);
    // } else {
    //   oneOn(evnt.target.id);
    // }
    // }
    // sendMessageToBackground(evnt.target.id);

}

window.addEventListener('mouseup', eventHandler);

getAllExtensions();
