var phrases = require('./phrases');
var tokens = require('./tokens');
var slack = require('node-slack');

//helper functions to be called by other modules
module.exports =  {
  //tester function
  sayHello : function(){
    return "Hello.";
  },
  //given where the match is, home and away goals - figure out whether we
  //had won or lost the match
  interpretOutcome : function(where, homeGoals, awayGoals){
    //let's prepare our won-tied-lost string
    if (awayGoals == homeGoals)
    {
      return "Tied";
    }
    else if ((where == "Home" && parseInt(homeGoals) < parseInt(awayGoals)) || (where == "Away" && parseInt(homeGoals) > parseInt(awayGoals)))
    {
      return "Lost";
    }
    return "Won";
  },
  //end of interpretOutcome

  // this will be called when we're ready to say something.
  // output depends on the outcom of the match
  sayPhrase : function(outcome){
    if (outcome == "Won"){
      return(phrases.win[Math.floor(Math.random() * phrases.win.length)]);
    }
    else if (outcome == "Tied"){
      return phrases.tie[Math.floor(Math.random() * phrases.tie.length)];
    }
    else if (outcome == "Lost") {
      return phrases.lost[Math.floor(Math.random() * phrases.lost.length)];
    }
    else{
      return phrases.upcoming[Math.floor(Math.random() * phrases.upcoming.length)];
    }
  },
  //end of sayPhrase

  //this helper will pretty-print the outcome of the match
  formatOutcome : function(venue, homeGoals, awayGoals, winOrLose){
    var output = '-- ';
    output += winOrLose + ' that one';
    output += (venue=='Home') ? ' at home' : ' away';
    output += '. It was ' + homeGoals + ':' + awayGoals;
    return output;
  },
  //end of formatOutcome

  //post To Slack
  postToSlack : function (phrase){
    //get the endpoint from tokens file
    var slackToken = process.env.slackURI;

    //if not initialized, just say Hello
    phrase = phrase || this.sayHello();

    //test sender
    var slackSender = new slack(slackToken);
    slackSender.send({
      text : phrase,
      channel: "#football"
    });

    return null;
  },
  //end of postToSlack

  //based on home and away team names, evaluate whether we're playing home or away
  homeOrAway : function(fixture){
    var where = "Away";
    if (fixture.homeTeamName == tokens.myTeamName)
    {
      where = "Home";
    }
    return where;
  },
  //end of homeOrAway

  //figure out who's the opponent
  getOpponent : function(fixture){
    var opponent = fixture.homeTeamName;
    if (opponent == tokens.myTeamName)
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
};
