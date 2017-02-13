var phrases = require('./phrases');
var tokens = require('./../tokens');
var slack = require('node-slack');
var settings = require('./../settings');
var replacer = require('./phrase-replacer');

var labels = {
  away: 'Away',
  hello: 'Hello.',
  lost: 'Lost',
  notStarted: 'Not started',
  tied: 'Tied',
  won: 'Won'
};

//helper functions to be called by other modules
module.exports =  {
  //tester function
  sayHello : function(){
    return labels.hello;
  },
  //given where the match is, home and away goals - figure out whether we
  //had won or lost the match
  interpretOutcome : function(where, homeGoals, awayGoals){
    //let's prepare our won-tied-lost string
    //-1 for both teams means the game didn't begin yet.
    if(awayGoals == -1 && homeGoals == -1)
    {
      return labels.notStarted;
    }
    if (awayGoals == homeGoals)
    {
      return labels.tied;
    }
    else if ((where == labels.home && parseInt(homeGoals) < parseInt(awayGoals)) || (where == labels.away && parseInt(homeGoals) > parseInt(awayGoals)))
    {
      return "Lost";
    }
    return "Won";
  },
  //end of interpretOutcome

  // this will be called when we're ready to say something.
  // output depends on the outcom of the match
  sayPhrase : function(outcome, fixture){
    var opponent = this.getOpponent(fixture);
    var result = this.getScore(null, null, fixture);

    //construct the eobject to be passed to replacer
    var replacements = this.buildReplacements(opponent, result);

    if (outcome == "Won"){
      return replacer.replace(phrases.win[Math.floor(Math.random() * phrases.win.length)], replacements);
    }
    else if (outcome == labels.tied){
      return replacer.replace(phrases.tie[Math.floor(Math.random() * phrases.tie.length)], replacements);
    }
    else if (outcome == "Lost") {
      return replacer.replace(phrases.lost[Math.floor(Math.random() * phrases.lost.length)], replacements);
    }
    //in all other cases return upcoming match wording. These are most
    //general anyway, if we missfire, no big deal.
    else{
      return replacer.replace(phrases.upcoming[Math.floor(Math.random() * phrases.upcoming.length)], replacements);
    }
  },
  //end of sayPhrase

  //buildReplacements
  buildReplacements : function(opponent, score){

    if (!(opponent || score)) return null;

    var replacementObject = {};
    var myTeamName = settings.myTeamName;

    if (opponent) replacementObject.o = [opponent];
    if (score) replacementObject.s = [score];
    if (myTeamName) replacementObject.t = [myTeamName];

    return replacementObject;
  },
  //end of buildReplacements

  //this helper will pretty-print the outcome of the match
  formatOutcome : function(venue, homeGoals, awayGoals, winOrLose){
    var output = '-- ';
    output += winOrLose + ' that one';
    output += (venue=='Home') ? ' at home' : ' away';
    output += '. It was ' + this.getScore(homeGoals,awayGoals);
    return output;
  },
  //end of formatOutcome

  //pretty print just the score parseInt
  getScore : function(homeGoals, awayGoals, fixture)
  {
    //two ways of calling the function - by home, away goals explicitly OR
    //by passing a fixture
    if (homeGoals && awayGoals)
    {
      return homeGoals + ":" + awayGoals;
    }
    return fixture.result.goalsHomeTeam + ":" + fixture.result.goalsAwayTeam;
  },
  //end of getScore

  //post To Slack
  postToSlack : function (phrase){
    //get the endpoint from tokens file
    var slackToken = process.env.slackURI;

    //if not initialized, just say Hello
    phrase = phrase || this.sayHello();

    //post it to slack channel
    var slackSender = new slack(slackToken);
    //Implemnented in v2.0.1 - #36, build a switch to disable posting to slack
    if (!settings.disablePostingToSlack) {
      slackSender.send({
        text : phrase,
        channel: settings.slackChannel
      });
    }
    else{
      console.log(phrase);
    }

    return null;
  },
  //end of postToSlack

  //based on home and away team names, evaluate whether we're playing home or away
  homeOrAway : function(fixture){
    var where = labels.away;
    if (fixture.homeTeamName == settings.myTeamName)
    {
      where = labels.home;
    }
    return where;
  },
  //end of homeOrAway

  //figure out who's the opponent
  getOpponent : function(fixture){
    var opponent = fixture.homeTeamName;
    if (opponent == settings.myTeamName)
    {
      opponent = fixture.awayTeamName;
    }
    return opponent;
  },
  //end of getOpponent

  //just return the number of away goals
  getAwayGoals : function(fixture) {
    return fixture.result.goalsAwayTeam;
  },
  //end of getAwayGoals

  //just return the number of home goals
  getHomeGoals : function(fixture){
    return fixture.result.goalsHomeTeam;
  }


  //#18 - helper function to read phrases from moubot.com

};
