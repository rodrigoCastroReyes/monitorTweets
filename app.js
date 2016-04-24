var express = require('express');
var Oauth = require('oauth');
var Promise = require('promise');
var jsonfile = require('jsonfile');
jsonfile.spaces = 4;
var fs = require('fs');
var app = express();

var consumer_key = 'MtHsM6e0jpbeRNTNOwKOjcBUF';
var consumer_secret = 'kvhhRaI0b1DpjMm6HPxJCFpdL0ihwCCfLMKas4UQA6qvm13K5K';
var access_token = '115246381-w1E4EqjndQ0LAnCotvldnRGiXWZdk0GbN5QftQQB';
var access_token_secret = 'dc1vaGAVAxnwL8UcZJR9A05Y232DGZXw16SioE7l3yDYK';

var tweetsDataBase = {};

var oauth = new Oauth.OAuth(
	'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
	consumer_key,
	consumer_secret,
	'1.0A',
	null,
	'HMAC-SHA1'
);

function getTweets(url){
	var callback = function (resolve,reject){	
		oauth.get(url,
			access_token,
			access_token_secret,
			function(error,data,res){
				if(error){
					reject(error)
				}
				resolve(data);
			});
	};
	var request = new Promise(callback);
	return request;
}

function contain(tweet, keyword){
	var text = tweet.text;
	if ( text.search(keyword) != -1 ) {
		return true
	}else{
		return false;
	}
}

function proccessTweets(data){
	var parsedData = JSON.parse(data);
	var tweets = parsedData.statuses;
	var categories = {};
	var keywords = ['agua','camion', 'atun','sabanas','leche','panales','velas','pilas','arroz','ropa']
	for(var i in tweets){
		var tweet = tweets[i];
		for(j in keywords){
			var keyword = keywords[j];
			if(contain(tweet,keyword)){
				if (categories[keyword] == null ){
					categories[keyword] = new Array();
				}
				categories[keyword].push(tweet.id_str);
			}
		}
	}
	return categories;
}

function getDataFromTwitter(url, req, res ,callback){
	getTweets(url).then(callback, function(error){
		console.log(error);
		res.json({});
	});
}

app.use(express.static('./public'));

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

app.get('/getSeNecesitaEc',function (req,res){
	//params = { q : '' , result_type : '' , count : '100'}
	var url =  'https://api.twitter.com/1.1/search/tweets.json?q=%23SeNecesitaEC&count=100';
	var callback = function(data){
		data = proccessTweets(data);
		console.log(data);
		//data = { agua: [1,2] , camion: [1,2,3,4,5] , atun : [1] , sabanas : [2,2,12,21,12,12,12] };
		res.json(data);
	}
	getDataFromTwitter(url,req,res,callback);
});

app.get('/getSeOfreceEc', function (req,res){
	var url =  'https://api.twitter.com/1.1/search/tweets.json?q=%23SeOfreceEC&count=100';
	var callback = function(data){
		data = proccessTweets(data);
		//data = { agua: [1,2] , camion: [1,2,3,4,5] , atun : [1] , sabanas : [2,2,12,21,12,12,12] };
		res.json(data);
	}
	getDataFromTwitter(url,req,res,callback);
});

app.get('/getSeNecesitaEcPorID/', function (req,res){
	var id = req.params.id;
	var username = req.params.username;
	console.log(username);
	console.log(id);
	//var url = 'https://api.twitter.com/1/statuses/oembed.json?id=' + id;
	//var url = "https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/Interior/status/463440424141459456"
	var url = "https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/"+ username +"/status/" + id;
	//var url = 'https://api.twitter.com/1.1/statuses/show.json?id=' + id + "&trim_user=true";
	var callback = function(data){
		res.json(data);
	}
	getDataFromTwitter(url,req,res,callback);
});



var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

