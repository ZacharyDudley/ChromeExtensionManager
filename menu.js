// let extensionArray = [];
let extensionList = document.getElementById('extensionList');

chrome.management.getAll(function(allExtensions) {
  allExtensions.forEach(extension => {
    if (extension.type === 'extension') {
      let extensionItem = document.createElement('div');
      let title = document.createTextNode(extension.shortName);
      let button = document.createElement('button');

      extensionItem.id = `${extension.id}`;
      button.addEventListener('click', (event) => {
        console.log('EVENT', event);
      });

      extensionItem.appendChild(title);
      extensionItem.appendChild(button);
      // extensionArray.push(extension);
      extensionList.appendChild(extensionItem);
    }
  });
});

// function toggleActive(extensionId) {
//   if () {
//     // IF ACTIVE
//     chrome.management.setEnabled(extensionId, false);
//   } else {
//     chrome.management.setEnabled(extensionId, true);
//   }
// };
