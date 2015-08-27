// add http module and client
var http = require('http');
var request = require('request');
var tokens = require('./tokens');


//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = 8080;

//these variables are to be externalized at a later point
var resultsEndpoint = tokens.resultsEndpoint;
var resultsToken = tokens.resultsToken;

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

//helper function to figure out the difference between two dates in units of time
var DateDiff = {
  inHours: function(date1, date2){
    var t1 = date1.getTime();
    var t2 = date2.getTime();

    return parseInt((t2-t1)/(1000*3600));
  }
};

function callback(error, response, body){
  if (!error && response.statusCode==200)
  {
    //We will need the date when deetrmining when to say something
    //We want Moubot to speak when there is a match and be silent otherwise
    var RightNow = new Date();

    console.log(RightNow);

    var data = JSON.parse(body);
    //console.log(data);
    for (index in data.fixtures)
    {
      //if (DateDiff.inHours(Date(data.fixtures[index].date), Date(RightNow)) < 72)
      //{
        console.log('Matchday: ' + data.fixtures[index].matchday);
        console.log('-- Date : ' + data.fixtures[index].date);
        //console.log(DateDiff.inHours(Date(data.fixtures[index].date), Date(RightNow)));
      //}
    }
    //console.log(data.fixtures);
  }
  else {
    console.error();
  }
}

//spin up the listener
server.listen(PORT, function(){
  //callback when server is successfully listening
  console.log("Server started at localhost:%s", PORT);

  //set up a timer.
  setInterval(function(){
    request(options, callback);
  }, 1000);
} );
