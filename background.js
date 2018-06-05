chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.id) {
    console.log('REQUEST', request)
    chrome.management.setEnabled(request.id, !request.enabled);
    sendResponse({id: request.id, isActive: !request.enabled});
  }
});
