// add http module and client
var http = require('http');
var request = require('request');
var tokens = require('./tokens');
var callback = require('./callback');
var settings = require('./settings');

//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = settings.serverPort;

//receiving and responding to requests
function handleRequest(request, response){
  //no interaction with the server just yet.
  response.end('No interactions allowed.');
}

var server = http.createServer(handleRequest);

//let's define options for our recurrent http request
var options = {
  url: tokens.resultsEndpoint,
  headers: {
    'X-Auth-Token' : tokens.resultsToken
  }
};


//spin up the listener
server.listen(PORT, function(){
  //callback when server is successfully listening
  console.log("Server started at localhost:%s", PORT);

  //keep a track of last matchday commented, to avoid duplicates.
  //this needs refactoring
  global.lastPreMatchComment = null;
  global.lastPostMatchComment = null;

  //set up a timer.
  setInterval(function(){
    request(options, callback.callback);
  }, settings.pingInteralInMilliseconds);
} );
