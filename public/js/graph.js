google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(loadCharts);

var tweetsDataBase = {
  'SeNecesitaEc' : {},
  'SeOfreceEc' : {}
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

function loadTweets(category,hashtag){
  var tweets = tweetsDataBase[hashtag];
  var tweetsIDs = tweets[category];
  console.log(tweetsIDs);
  $("#modalTweets").modal('show');
  var parent = $("#TweetsContainer");
  for(var j in tweetsIDs){
    var container = document.createElement("div");
    $(container).addClass("tweet");
    parent.append(container);
    showTweet(tweetsIDs[j],container);
  }
}

function drawChart(data,container,options,hashtag){
  var view = new google.visualization.DataView(data);
  var chart = new google.visualization.BarChart(container);
  
  var selectHandler = function selectHandler() {
    var selectedItem = chart.getSelection()[0];
    if (selectedItem) {
      var category = data.getFormattedValue(selectedItem.row,0);
      loadTweets(category,hashtag);
    }
  }
  google.visualization.events.addListener(chart, 'select', selectHandler);
  chart.draw(view, options);
}

function saveTweets(response,hashtag){
  tweetsDataBase[hashtag] = response ;  
}

function parseResponse(response){
  var array = [];
  array.push(['Viveres', 'Tweets',]);
  var tweets;
  for(var category in response){
    tweets = response[category];
    console.log(tweets);
    array.push([ category , tweets.length ])
  }
  console.log(array);
  return new google.visualization.arrayToDataTable(array);
}

var prepareOptions = function(hashtag){  
  var options = {    
    title: 'Tweets relacionados con #' + hashtag,
    width: 700,
    height: 600,
    backgroundColor: '#eee',
    bars: 'horizontal',
    bar: {groupWidth: "90%"} ,
    is3D: true
  }

  if (hashtag == "SeNecesitaEc"){
    options.colors= ['#e0440e'];
    options.rect = { color : '#eee' };
  }else{
    options.colors = ['#3ACA57'];
    options.rect = { color : '#eee' }
  }

  return options;    
}

function loadCharts(){
  loadChartsFromHashtags("SeNecesitaEc");
  loadChartsFromHashtags("SeOfreceEc");
}

function loadChartsFromHashtags(hashtag){
  var callback = function(response) {
    if (!$.isEmptyObject(response)){
      saveTweets(response,hashtag);
      var data = parseResponse(response);
      var container = document.getElementById( 'chart' + hashtag );
      var options = prepareOptions(hashtag);
      drawChart(data,container,options,hashtag);
    }
  }
  $.ajax({
    data:  {},
    url:   '/get' + hashtag,
    type:  'get',
    success: callback
  });
}