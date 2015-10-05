module.exports = {
  replace : function(phrase, replacements){
    //replacements is a JSON object with defined replacements for each %tag

    var newPhrase = null;

    //first figure out what tokens we need to replace
    //keep them in an array. match anything with a % prefix
    var replacementToken = '[' + phrase.match(/%[a-z]*/g)  +']';

    //then itterate through the array and do the replacements
    

    return newPhrase;
  }
};
