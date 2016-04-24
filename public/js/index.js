
function init(){   
  //var tweet = document.getElementById("tweet");
  //var id = tweet.getAttribute("tweetID");
  //showTweet(id,tweet);
}

function showTweet(id,container){
  twttr.widgets.createTweet(id, container , {
      conversation : 'none',    // or all
      cards        : 'hidden',  // or visible 
      linkColor    : '#cc0000', // default is blue
      theme        : 'light'    // or dark
  })
  .then (function (el) {
    el.contentDocument.querySelector(".footer").style.display = "none";
  }); 
}

window.addEventListener('load',init,false);