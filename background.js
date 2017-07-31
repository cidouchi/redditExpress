
/* initial settings */
 chrome.storage.sync.set({"lazyload": true, "scrollTop":true, "hover":true, "tab":true}); 

/* send current URL on active tab to content script */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.incoming == "reddit")
      sendResponse({link: sender.tab.url});
  });



