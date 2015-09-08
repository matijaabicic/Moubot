var moment  = require('moment');
var helper  = require('./helperFunctions');
var settings = require('./settings');

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
    //debug only
    RightNow = moment.utc('2015-08-08T18:15');
    var data = JSON.parse(body);
    //console.log(data);
    for (index in data.fixtures)
    {
      //pick up the match date time and set the flag to utc
      var matchDateTime = moment(data.fixtures[index].date);
      matchDateTime.utc();
      var matchStatus = data.fixtures[index].status;

      //let's figure out the match details. this will need refactoring, but let's just get it to work right now
      var where = helper.homeOrAway(data.fixtures[index]);
      var opponent = helper.getOpponent(data.fixtures[index]);
      var homeGoals = helper.getHomeGoals(data.fixtures[index]);
      var awayGoals = helper.getAwayGoals(data.fixtures[index]);

      //only comment on the match that is about to start in 5 minutes
      //also, we don't want to comment on a match we already commented on
      if (settings.postBeforeTheMatch &&
          (RightNow.to(matchDateTime) == settings.preMatchWindowInMinutes) &&
          !(moment(global.lastPreMatchComment).isSame(moment(matchDateTime))))
      {
        //remember this match date time so we don't keep saying things about it
        global.lastPreMatchComment = matchDateTime;

        //say the "upcoming" phrase
        var output = where + ' match vs. ' + opponent + '. ';
        output += helper.sayPhrase("upcoming");
        //console.log(output);
        helper.postToSlack(helper.sayPhrase("upcoming"));
      }
        //debug help
        //console.log('Matchday: ' + data.fixtures[index].matchday + ' against ' + opponent + ' (' + where + ') is ' + RightNow.to(matchDateTime));
        //console.log('-- Date : ' + matchDateTime.format("dddd, MMMM Do YYYY, h:mm:ss a z"));
      //post-match banter
      if (settings.postAfterTheMatch &&
          (RightNow.to(matchDateTime) == settings.postMatchWindowInHours) &&
          !(moment(global.lastPostMatchComment).isSame(moment(matchDateTime))))
      {
        global.lastPostMatchComment = matchDateTime;
        //let's prepare our won-tied-lost string
        var winOrLose = helper.interpretOutcome(where, homeGoals, awayGoals);

        //get the smart-ass phrases and say it
        //console.log(helper.sayPhrase(winOrLose));
        helper.postToSlack(helper.sayPhrase("winOrLose"));
      }
    }
  }
  else {
    console.error();
  }
};


  exports.callback = callback;
