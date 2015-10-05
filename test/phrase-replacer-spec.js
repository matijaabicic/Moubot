var expect = require("chai").expect;
var phraseReplacer = require("../lib/phrase-replacer.js");

describe(phraseReplacer, function(){
  describe("replace", function(phrase, replacements){
    it("non-tagged phrases should return the same thing", function(){
      var nonTaggedString = "Non-tagged string";
      var result = phraseReplacer.replace(nonTaggedString, 'abc');
      expect(result).to.be.equal(nonTaggedString);
    });
    it("null strings should return null", function(){
      var result = phraseReplacer.replace(null, null);
      expect(result).to.be.equal(null);
    });
  });
});
