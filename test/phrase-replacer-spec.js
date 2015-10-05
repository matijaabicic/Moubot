var expect = require("chai").expect;
var phraseReplacer = require("../lib/phrase-replacer.js");

describe(phraseReplacer, function(){
  describe("replace", function(phrase, replacements){
    it("should contain replace function", function(){
      var result = phraseReplacer.replace("abc", 'abc');

      expect(result).to.not.equal(null);
    });
  });
});
