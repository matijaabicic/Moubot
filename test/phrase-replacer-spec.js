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
    it("simple string with one tag", function(){
      var result = phraseReplacer.replace("test %s test", {"s":["test"]});
      expect(result).to.be.equal("test test test");
    });
    it("simple string with multiple tags of one kind", function(){
      var result = phraseReplacer.replace("test %s %s test", {"s":["test", "test"]});
      expect(result).to.be.equal("test test test test");
    });
    it("one type of tags, more replacements than placeholders", function(){
      var result = phraseReplacer.replace("test %s test", {"s":["test", "test"]});
      expect(result).to.be.equal("test test test");
    });
    it("two different tag types", function(){
      var result = phraseReplacer.replace("test %s %t test", {"s":["test1", "test2"], "t": ["test3"]});
      expect(result).to.be.equal("test test1 test3 test");
    });
    it("no placeholders", function(){
      var result = phraseReplacer.replace("test test", {"s":["test"]});
      expect(result).to.be.equal("test test");
    });
    it("no replacements of correct type", function(){
      var result = phraseReplacer.replace("test %s test", {"t":["test"]});
      expect(result).to.be.equal("test test");
    });
    it("no replacements - empty array", function(){
      var result = phraseReplacer.replace("test %t test", {"t":[]});
      expect(result).to.be.equal("test test");
    });
    it("no replacements - empty json", function(){
      var result = phraseReplacer.replace("test %s test", {});
      expect(result).to.be.equal("test test");
    });
    it("no replacements - null object", function(){
      var result = phraseReplacer.replace("test %s test", null);
      expect(result).to.be.equal("test test");
    });
    it("tag is at the beginning of the phrase", function(){
      var result = phraseReplacer.replace("%s test", {"s":["test"]});
      expect(result).to.be.equal("test test");
    });
    it("tag is at the end of the phrase", function(){
      var result = phraseReplacer.replace("test %s", {"s":["test"]});
      expect(result).to.be.equal("test test");
    });
    it("phrase only contains a tag and nothing else", function(){
      var result = phraseReplacer.replace("%s", {"s":["test"]});
      expect(result).to.be.equal("test");
    });
    it("phrase contains columns", function(){
      var result = phraseReplacer.replace("test %s test", {"s":["2:2"]});
      expect(result).to.be.equal("test 2:2 test");
    });
  });
});
