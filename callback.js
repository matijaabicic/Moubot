var moment  = require('moment');
var helper  = require('./lib/helperFunctions');
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
    if (settings.debug)
    {
      RightNow = moment.utc('2015-08-23T15:25:00'); //just after west brom match
    }
    var data = JSON.parse(body);
    //console.log(data);

    //figure out when the next match date is and humanize it.
    //given that fixtures come in order in the JSON response, the first one
    //we find AFTER "right now" is our next fixture.
    for (var index in data.fixtures)
    {
        var nextMatchDate = moment.utc(data.fixtures[index].date);
        if (RightNow.isBefore(moment.utc(data.fixtures[index].date))){
          global.nextMatch = RightNow.to(nextMatchDate);
          global.nextOpponent = helper.getOpponent(data.fixtures[index]);
          break;
        }
    }

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
          // given that Match time Mt, right now time Rt
          // we will post when Match time is in the interval:
          // Mt E (Rt + settings.preMatchWindowInMinutes, Rt+ settings.preMatchWindowCloseTimeInMinutesBeforeMatch)
          // i.e. between settings.preMatchWindowCloseTimeInMinutesBeforeMatch and settings.preMatchWindowCloseTimeInMinutesBeforeMatch before the match
          // default variables are between 5 and 1 minutes before match
          settings.preMatchWindowCloseTimeInMinutesBeforeMatch <= matchDateTime.diff(RightNow, 'minutes') &&
          settings.preMatchWindowInMinutes >= matchDateTime.diff(RightNow, 'minutes') &&
          //also make sure we didn't already rant about this match
          !(moment(global.lastPreMatchComment).isSame(moment(matchDateTime))))
      {
        //remember this match date time so we don't keep saying things about it
        global.lastPreMatchComment = matchDateTime;
        var phraseToSay = helper.sayPhrase("upcoming", data.fixtures[index]);

        //say the "upcoming" phrase
        if (!settings.debug)
        {
          //post the phrase to slack and remember it in a global variable to be accessible to API calls
          helper.postToSlack(phraseToSay);
        }
        else {
          console.log(helper.sayPhrase("upcoming", data.fixtures[index]));
        }
        //remember the last phrase in a global variable
        global.lastPhrase = phraseToSay;
      }
      //post-match banter
      if (settings.postAfterTheMatch &&
          settings.postMatchWindowInHours <= RightNow.diff(matchDateTime, 'hours') &&
          settings.postMatchWindowCloseTimeInHoursAfterMatch >= RightNow.diff(matchDateTime, 'hours') &&
          matchStatus == 'FINISHED' &&
          !(moment(global.lastPostMatchComment).isSame(moment(matchDateTime))))
      {
        global.lastPostMatchComment = matchDateTime;
        //let's prepare our won-tied-lost string
        var winOrLose = helper.interpretOutcome(where, homeGoals, awayGoals);
        var phraseToSayAfterMatch = helper.sayPhrase(winOrLose, data.fixtures[index]);
        //get the smart-ass phrases and say it
        if (!settings.debug){
          helper.postToSlack(phraseToSayAfterMatch);
        }
        else {
          console.log(helper.sayPhrase(winOrLose, data.fixtures[index]));
        }
        //remember the last phrase in a global variable
        global.lastPhrase = phraseToSayAfterMatch;
      }
    }
  }
  else {
    console.error();
  }
};


  exports.callback = callback;
