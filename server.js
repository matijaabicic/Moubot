// add http module and client
var http = require('http');
var request = require('request');
var tokens = require('./tokens');
var callback = require('./callback');
var settings = require('./settings');


//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = 8080;

//these variables are to be externalized at a later point
var resultsEndpoint = tokens.resultsEndpoint;
var resultsToken = tokens.resultsToken;
var callback = callback.callback;

//pick up settings into local variables
var pingInterval = settings.interval;

//receiving and responding to requests
function handleRequest(request, response){
  //no interaction with the server just yet.
  response.end('No interaction allowed.');
}

var server = http.createServer(handleRequest);

//let's define options for our recurrent http request
var options = {
  url: resultsEndpoint,
  headers: {
    'X-Auth-Token' : resultsToken
  }
};


//spin up the listener
server.listen(PORT, function(){
  //callback when server is successfully listening
  console.log("Server started at localhost:%s", PORT);

  //set up a timer.
  setInterval(function(){
    request(options, callback);
  }, pingInterval);
} );
