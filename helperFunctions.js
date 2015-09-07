var phrases = require('./phrases');

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
      if (phrases.win.length == 1){
        return phrases.win[0];
      }
      else {
        return(phrases.win[Math.floor(Math.random() * phrases.win.length)]);
      }
    }
    else if (outcome == "Tied"){
      if (phrases.tie.length == 1){
        return phrases.tie[0];
      }
      else {
        return phrases.tie[Math.floor(Math.random() * phrases.tie.length)];
      }
    }
    else {
      if (phrases.tie.length == 1){
         return phrases.lost[0];
      }
      else {
        return phrases.lost[Math.floor(Math.random() * phrases.lost.length)];
      }
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
  }
};
