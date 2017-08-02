
/***** SET UP ******/

/* import fonts */
var fonts = document.createElement("link");
fonts.setAttribute("href", "https://fonts.googleapis.com/icon?family=Material+Icons");
fonts.setAttribute("rel","stylesheet");
document.querySelector("head").appendChild(fonts);

$("div.goldvertisement").hide(); //hide daily reddit gold goal bar



/***** LAZY LOAD *****/
chrome.storage.sync.get("lazyload", function(data){ //check user feature settings in popup
if (data.lazyload) {  

    var numPostsOnPage = 25;
    var numPostsToLoad = 25;
    var lastRank;
    var lastID = "";

    //hide prev and next buttons at bottom of page
    $(".nav-buttons").hide();

    //extract ID value from reddit post 
    function extractID(post) {
        var id = post.getAttribute("id");
        return ( id.slice(6) );  //get rid of extraneous chars
    }

    /* get the last post's id from current page */
    function getLastPostID(page_url) {
        $.ajax({  
                url: page_url,

                success: function(data) { 
                            //make data jQuery compatible 
                            var response = $('<html />').html(data);
                            //get all posts from current page
                            var redditPosts = $(response).find(".content #siteTable .thing");
                            lastID = extractID(redditPosts[redditPosts.length-1]);
                        },

                async: false 
             });
    }

    /* fetch posts from next page and append to current page */
    function lazyLoad(subreddit) {
        var URL = "https://www.reddit.com" + subreddit + "/?count=" + lastRank + "&after=" + lastID;
        $.ajax({
                    url: URL, 
                    success: function(data) {
                                var response = $('<html />').html(data);
                                var redditPosts = $(response).find(".content #siteTable .thing");
                                for (var i=0; i<redditPosts.length; i++) {
                                    document.querySelector(".content #siteTable").appendChild(redditPosts[i]);
                                }
        

                                /* enable Mouse Over Events to newly appended posts */
                                chrome.storage.sync.get("hover", function(data){ //check user feature settings in popup
                                    if (data.hover) {
                                        var expButtonArray = document.querySelectorAll(".expando-button");
                                        var expandoArray = document.querySelectorAll(".expando");

                                        function expandToggle(expButton,index) {
                                            expandoArray[index].setAttribute("style", "display:block");
                                            expButton.classList.toggle("expanded");
                                            expButton.classList.toggle("collapsed");
                                            expButton.click();   
                                        }

                                        for (let i=0; i<expButtonArray.length; i++) {
                                            expButtonArray[i].addEventListener("mouseover", 
                                                                function(){expandToggle(this,i)}
                                                                , false);
                                        }
                                }});
                                

                                /* enable Tab Handling Events to newly appended posts */
                                chrome.storage.sync.get("tab", function(data){ //check user feature settings in popup
                                    if (data.tab) { 
                                
                                        /* open main-post links and comments in new tab */
                                        var postLinksArray = document.querySelectorAll(".content #siteTable .thing p.title"); 
                                        var commentsArray = document.querySelectorAll(".flat-list.buttons li.first");

                                        function newTab(url) {
                                            var tab = open(url, "_blank")
                                            tab.focus();
                                        }

                                        for (let i=0; i<commentsArray.length; i++) {
                                            commentsArray[i].onclick = function(){
                                                                            newTab(this.querySelector("a"));
                                                                            return false;
                                                                       }
                                            postLinksArray[i].onclick = function(){
                                                                            newTab(this.querySelector("a"));
                                                                            return false;
                                                                       }
                                        };

                                }});
                            },

                    async:false
                });
        
        //update
        lastRank += numPostsOnPage;
        getLastPostID(URL);
    }

    /* initial set-up */
    var currentURL;
    chrome.runtime.sendMessage({incoming: "reddit"}, function(response) {
        currentURL = response.link;

        /* set up lastRank/count# */
        if (/\d/.test(currentURL)) {
            lastRank = parseInt((currentURL).slice(30)) + numPostsOnPage;
        }
        else {
            lastRank = 25;
        } 
            
        /* parse subreddit if any */
        var subreddit = "";
        var index = currentURL.indexOf("/r/");
        if (index !== -1) {
            subreddit = currentURL.slice(index);
            var endIndex = subreddit.lastIndexOf("/");
            subreddit = subreddit.slice(0,endIndex);
        }
        
        /* don't allow lazyload on comment pages */
        if (/\/comments\//.test(currentURL)){
            true;
        }
        else {

            /* create lazy load button */
            var LLbutton = document.createElement("a");
            LLbutton.setAttribute("class","lazy-load btn flow-text red"); 
            var LLbuttonContent = document.createTextNode("next page");
            LLbutton.appendChild(LLbuttonContent);
            document.querySelector("body").appendChild(LLbutton);

            $("a.lazy-load").on("click", function(){ 
                                            lazyLoad(subreddit); 
                                        });
            $("a.lazy-load").on("mouseenter mouseleave", function(){ $(this).toggleClass("red");
                                                                 $(this).toggleClass("red accent-2"); });
            $("a.lazy-load").hide();
            getLastPostID(currentURL);
        }
    });

    /* animation */
    $(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() > $(document).height() - 400) {
            $("a.lazy-load").fadeIn();
       }
       else {
            $("a.lazy-load").fadeOut();
       }
    });

    /* keyboard shortcut */
    $(document).keydown(function(event) {
        
        //prevent action when using keys to type
        if (event.target.value != null) return;

        //lazy-load with 'spacebar'
        if (event.keyCode == 32) {
          event.preventDefault();
          $("a.lazy-load").click();
        };

        //close reddit tabs opened by extension with 'x' 
        if (event.keyCode == 88) {
          event.preventDefault();
          window.close(); 
        }
    });

}});



/***** COMMENT LIFT *****/
var parentComments = document.querySelectorAll(".sitetable.nestedlisting > .comment > .entry");

for (let i=0; i<parentComments.length; i++) {
    parentComments[i].setAttribute("style","padding:4px;");
    parentComments[i].classList.add("z-depth-2");
}



/***** BACK TO TOP *****/
chrome.storage.sync.get("scrollTop", function(data){ //check user feature settings in popup
    if (data.scrollTop) {

        /* create back to top button */
        var button = document.createElement("a");
        button.setAttribute("class","up-button btn-floating btn-large red material-icons"); 
        var buttonContent = document.createTextNode("arrow_upward");
        button.appendChild(buttonContent);
        document.querySelector("body").appendChild(button);

        //action
        $("a.up-button").on("click", function() { window.scrollTo(0,0); });

        //pulse animation
        $("a.up-button").on("mouseenter mouseleave", function() { $(this).toggleClass("pulse");
                                                                  $(this).toggleClass("red");
                                                                  $(this).toggleClass("red accent-2"); });

        /* fade button on scroll */
        $(window).scroll( function() { 
              if ($(window).scrollTop() > 300) 
                {$('a.up-button').fadeIn("slow");}
              else {
                $('a.up-button').fadeOut("slow");
              }
            });

}});



/***** MOUSE OVER (for initial posts on homepage) *****/
chrome.storage.sync.get("hover", function(data){ //check user feature settings in popup
    if (data.hover) {

        var expButtonArray = document.querySelectorAll(".expando-button");
        var expandoArray = document.querySelectorAll(".expando");

        function expandToggle(expButton,index) {
            expandoArray[index].setAttribute("style", "display:block");
            expButton.classList.toggle("expanded");
            expButton.classList.toggle("collapsed");
            expButton.click();   
        }

        for (let i=0; i<expButtonArray.length; i++) {
            expButtonArray[i].addEventListener("mouseover", 
                                function(){expandToggle(this,i)}
                                , false);
        }

}});



/***** TAB HANDLING (for initial posts on homepage) *****/ 
chrome.storage.sync.get("tab", function(data){ //check user feature settings in popup
    if (data.tab) { 

        /* open main-post links and comments in new tab */
        var postLinksArray = document.querySelectorAll(".content #siteTable .thing p.title"); 
        var commentsArray = document.querySelectorAll(".flat-list.buttons li.first");

        function newTab(url) {
            var tab = open(url, "_blank")
            tab.focus();
        }

        for (let i=0; i<commentsArray.length; i++) {
            commentsArray[i].onclick = function(){
                                            newTab(this.querySelector("a"));
                                            return false;
                                       }
            postLinksArray[i].onclick = function(){
                                            newTab(this.querySelector("a"));
                                            return false;
                                       }
        };

}});



