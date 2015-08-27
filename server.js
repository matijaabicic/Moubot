// add http module and client
var http = require('http');
var request = require('request');
var moment = require('moment');
var tokens = require('./tokens');


//let the server port be configurable. it really doesn't matter since this
//is a listening port. Moubot v1 does not listen.
var PORT = 8080;

//these variables are to be externalized at a later point
var resultsEndpoint = tokens.resultsEndpoint;
var resultsToken = tokens.resultsToken;
var myTeamName = tokens.myTeamName;

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


function callback(error, response, body){
  if (!error && response.statusCode==200)
  {
    //We will need the date when deetrmining when to say something
    //We want Moubot to speak when there is a match and be silent otherwise
    var RightNow = moment.utc();

    var data = JSON.parse(body);
    //console.log(data);
    for (index in data.fixtures)
    {
      //pick up the match date time and set the flag to utc
      var matchDateTime = moment(data.fixtures[index].date);
      matchDateTime.utc();

      //let's figure out the match details. this will need refactoring, but let's just get it to work right now
      var opponent = data.fixtures[index].homeTeamName;
      var where = "Away";
      var homeGoals = data.fixtures[index].result.goalsHomeTeam;
      var awayGoals = data.fixtures[index].result.goalsAwayTeam;
      if (opponent == myTeamName)
      {
        opponent = data.fixtures[index].awayTeamName;
        where = "Home";
      }

        console.log('Matchday: ' + data.fixtures[index].matchday + ' against ' + opponent + ' (' + where + ') is ' + RightNow.to(matchDateTime));
        console.log('-- Date : ' + matchDateTime.format("dddd, MMMM Do YYYY, h:mm:ss a z"));
        if (matchDateTime.isBefore(RightNow))
        {
          //let's prepare our won-tied-lost string
          var winOrLose = "Won";
          if (awayGoals == homeGoals)
          {
            winOrLose = "Tied";
          }
          else if ((where == "Home" && parseInt(homeGoals) < parseInt(awayGoals)) || (where == "Away" && parseInt(homeGoals) > parseInt(awayGoals)))
          {
            winOrLose = "Lost";
          }

          console.log('-- ' + winOrLose + ' that one at ' + where + '. It was ' + homeGoals + ':' + awayGoals);
        }
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
