var moment  = require('moment');
var tokens  = require('./tokens');
var phrases = require('./phrases');

//these variables are to be externalized at a later point
var resultsEndpoint = tokens.resultsEndpoint;
var resultsToken = tokens.resultsToken;
var myTeamName = tokens.myTeamName;


var callback = function(error, response, body){
  if (!error && response.statusCode==200)
  {
    //We will need the date when deetrmining when to say something
    //We want Moubot to speak when there is a match and be silent otherwise
    //--
    //-- This needs to be refactored. badly.
    //--
    //--
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
          //and also prepare our output string
          if (awayGoals == homeGoals)
          {
            winOrLose = "Tied";
          }
          else if ((where == "Home" && parseInt(homeGoals) < parseInt(awayGoals)) || (where == "Away" && parseInt(homeGoals) > parseInt(awayGoals)))
          {
            winOrLose = "Lost";
          }
          var output = '-- '
          output += winOrLose + ' that one';
          output += (where=='Home') ? ' at home' : ' away';
          output += '. It was ' + homeGoals + ':' + awayGoals;

          if (winOrLose == "Won"){
            if (phrases.win.length == 1){
              console.log(phrases.win[0]);
            }
            else {
              console.log(phrases.win[Math.floor(Math.random() * phrases.win.length)]);
            }
          }
          else if (winOrLose == "Tied"){
            if (phrases.tie.length == 1){
              console.log(phrases.tie[0]);
            }
            else {
              console.log(phrases.tie[Math.floor(Math.random() * phrases.tie.length)]);
            }
          }
          else {
            if (phrases.tie.length == 1){
              console.log(phrases.lost[0]);
            }
            else {
              console.log(phrases.lost[Math.floor(Math.random() * phrases.lost.length)]);
            }
          }
          console.log(output);

        }
    }
  }
  else {
    console.error();
  }
};


  exports.callback = callback;
