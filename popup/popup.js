
/* animation for tabs */
$(".tabs .tab a").on("mouseenter mouseleave", function() { $(this).toggleClass("darken-3");
                                                          $(this).toggleClass("darken-1"); });


function newTab(url) {
        var tab = open(url, "_blank")
        tab.focus();
}

/* open suggestions/bugs link in new tab */
document.querySelector("#plug").addEventListener("click", function(){ 
                                 newTab(this.href);
                                 return false;
                               });

/* open more info link in new tab */
document.querySelector("a.more-info").addEventListener("click", function(){ 
                                 newTab(this.href);
                                 return false;
                               });




/* update feature configurations made by user */

window.addEventListener("load", (event) => {
  chrome.storage.sync.get("lazyload", function(data){
        if (data.lazyload) {
            document.querySelector("#lazyload label input").setAttribute("checked","");
        }
        else
            document.querySelector("#lazyload label input").removeAttribute("checked");
        }); 
  chrome.storage.sync.get("scrollTop", function(data){
        if (data.scrollTop) {
            document.querySelector("#scrollTop label input").setAttribute("checked","");
        }
        else
            document.querySelector("#scrollTop label input").removeAttribute("checked");
        });
  chrome.storage.sync.get("hover", function(data){
        if (data.hover) {
            document.querySelector("#hover label input").setAttribute("checked","");
        }
        else
            document.querySelector("#hover label input").removeAttribute("checked");
        });
  chrome.storage.sync.get("tab", function(data){
        if (data.tab) {
            document.querySelector("#tab label input").setAttribute("checked","");
        }
        else
            document.querySelector("#tab label input").removeAttribute("checked");
        });
});

document.querySelector("#lazyload label input").addEventListener("click", 
        function(event){
            if (document.querySelector("#lazyload label input").hasAttribute("checked")) {
                chrome.storage.sync.set({"lazyload": false }); 
            }
            else {
                chrome.storage.sync.set({"lazyload": true });
            }
        });

document.querySelector("#scrollTop label input").addEventListener("click", 
        function(event){
            if (document.querySelector("#scrollTop label input").hasAttribute("checked")) {
                chrome.storage.sync.set({"scrollTop": false }); 
            }
            else {
                chrome.storage.sync.set({"scrollTop": true });
            }
});

document.querySelector("#hover label input").addEventListener("click", 
        function(event){
            if (document.querySelector("#hover label input").hasAttribute("checked")) {
                chrome.storage.sync.set({"hover": false }); 
            }
            else {
                chrome.storage.sync.set({"hover": true });
            }
});

document.querySelector("#tab label input").addEventListener("click", 
        function(event){
            if (document.querySelector("#tab label input").hasAttribute("checked")) {
                chrome.storage.sync.set({"tab": false }); 
            }
            else {
                chrome.storage.sync.set({"tab": true });
            }
});




