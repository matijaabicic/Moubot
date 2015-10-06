//unique function taken from http://snipplr.com/view/45323/remove-duplicate-values-from-array/
//probably should be refactored. this only works with small arrays
var unique = function(origArr) {
    var newArr = [],
        origLen = origArr.length,
        found,
        x, y;

    for ( x = 0; x < origLen; x++ ) {
        found = undefined;
        for ( y = 0; y < newArr.length; y++ ) {
            if ( origArr[x] === newArr[y] ) {
              found = true;
              break;
            }
        }
        if ( !found) newArr.push( origArr[x] );
    }
   return newArr;
};

//to avoid regex, simplify things here with endsWith
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//given a phrase that contains a tag, replace all occurences one-by-one
var replaceTag = function(phrase, tag, replacements){
  var result = "";
  var firstTag = false;
  var lastTag = false;
  var i = 0; //tokens index
  var j = 0; //used replacements index
  var replacementIndex = null;

  if (!replacements || replacements.length===0) return phrase.replace(tag, "");

  //first deal with potential tags at the beginning and end of the phrase.
  if (phrase.indexOf(tag)===0){
    result = phrase.replace(tag, replacements[0]);
    firstTag = true;
    //increase replacements index since we used up the first replacement
    j++;
  }

  //end of phrase check
  if (endsWith(result, tag)){
    lastTag = true;
  }

  //split the input string by tag delimiters
  // "some %s thing %s we % say" becomes ['some ',' thing ', ' we ', ' say']
  var resultArray = (firstTag ? result.split(tag) : phrase.split(tag));

  //join the array back with replacement values
  //assuming replacement values contains ['value1', 'value2']
  //we would expect the end string to be
  //"some value1 thing value2 we value1 say" given the fact that we wrap around the replacements by design
  for (i; i < resultArray.length-1; i++){
    replacementIndex = (i+j)%(replacements.length);

    result += resultArray[i] + replacements[replacementIndex];
  }
  //don't forget to add the last word
  if (resultArray.length > 1) result += resultArray[i];

  //lastly, if there was a tag at the end, let's append it
  if (lastTag){
    replacementIndex = (i+1)%(replacements.length);
    result += replacements[replacementIndex];
  }

  //boom! we got our tag of a specific type replaced
  return result;
};

var sanitizeWhiteSpace = function(phrase){
  return phrase.replace("  ", " ");
};

module.exports = {
  replace : function(phrase, replacements){
    //replacements is a JSON object with defined replacements for each %tag
    if (!phrase) return null;

    var newPhrase = phrase;

    //first figure out what tokens we need to replace
    //keep them in an array. match anything with a % prefix
    var tokens = phrase.match(/%[a-z]*/g);
    //in case of a clean, non-tagged phrase - return it.
    if (!tokens){
      return phrase;
    }
    //if we have a tagged phrase, split tags into tokens
    var replacementTokens = tokens.toString().split(',');

    //let's get a unique list of tokens
    var uniqueTokens = unique(replacementTokens);

    //then itterate through the array and do the replacements for each token type
    for (var index in uniqueTokens){
      //trim % from the tag so we can select it from JSON
      var tag = uniqueTokens[index].replace("%", "");
      //take care of null-object edge case
      if (replacements){
        newPhrase = replaceTag(newPhrase, "%"+tag, replacements[tag]);
      }
      else{
        newPhrase = replaceTag(newPhrase, "%"+tag, null);
      }
    }

    //trim double spaces that could have been introduced by empty replacements
    return sanitizeWhiteSpace(newPhrase);
  }
};
