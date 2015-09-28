// add http module and client
var http = require('http');
var fs = require('fs');
var request = require('request');
var tokens = require('./tokens');
var callback = require('./callback');
var settings = require('./settings');

//set the global variable to hold the time to next match
global.nextMatch = null;
global.nextOpponent = null;

//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = settings.serverPort;
var index = fs.readFileSync('web/index.html');

//receiving and responding to requests
function handleRequest(request, response){
  //no interaction with the server just yet.
  //response.end('Next match is ' + (nextMatch || 'not scheduled') + '.');
  response.end(index);
}

var server = http.createServer(handleRequest);

//let's define options for our recurrent http request
var options = {
  url: tokens.resultsEndpoint,
  headers: {
    'X-Auth-Token' : process.env.resultsToken
  }
};


//spin up the listener
server.listen(process.env.PORT || PORT, function(){
  //callback when server is successfully listening
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
} );
