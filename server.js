// add http module and client
var http = require('http');
var express = require('express');
var request = require('request');
var tokens = require('./tokens');
var callback = require('./callback');
var settings = require('./settings');
var ua = require('universal-analytics');

//set the global variable to hold the time to next match
global.nextMatch = null;
global.nextOpponent = null;

//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = settings.serverPort;

//initialize Google Analytics
var visitor = ua(settings.GA);

//initiate the express web app
var app = express();
app.use(express.static(__dirname + '/web'));
app.use(ua.middleware(settings.GA));
app.use(allowCrossDomain);

//function to help with cross-site scripting
function allowCrossDomain(req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}

//api call that returns the infomation about the next match. this needs to
//be tidyed up.
app.get('/api', function(req, res){
  //google pageview tracking
  visitor.pageview("/api").send();
  res.send('Next Chelsea match is ' + (nextMatch || 'not scheduled') + '.');
});

//early slack api. only knows how to respond with the time left until the next match
app.get('/api/slack', function(req, res){
  var originHost = req.headers.host;

  //exclude local api requests from Google Analytics tracking
  if(settings.gaIgnoreHosts.indexOf(req.header.host)!=-1){
    console.log('tracking request in analytics.');
    visitor.pageview("/api/slack").send();
  }

  //construc the response
  var jsonResponse = {};
  jsonResponse.text = 'Next Chelsea match is ' + (nextMatch || 'not scheduled' + '.');
  jsonResponse.nextMatchDate = nextMatch;
  jsonResponse.nextOpponent = nextOpponent;
  //console.log(req);
  res.send(jsonResponse);
});

//let's define options for our recurrent http request
var options = {
  url: tokens.resultsEndpoint,
  headers: {
    'X-Auth-Token' : process.env.resultsToken
  }
};


var server = app.listen(process.env.PORT || PORT, function(){
  console.log("Server started at localhost:%s", PORT);

  //keep a track of last matchday commented, to avoid duplicates.
  //this needs refactoring
  global.lastPreMatchComment = null;
  global.lastPostMatchComment = null;

  //set up a timer.
  setInterval(function(){
    console.log("Tick...next match is " + (nextMatch || "not scheduled.") );
    request(options, callback.callback);
  }, settings.pingInteralInMilliseconds);
});
