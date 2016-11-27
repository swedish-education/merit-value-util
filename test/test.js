const assert = require("chai").assert;

require("./uppersecondary/merit.js");

describe("grading", function() {
  const grading = require("../lib.js").grading;

  describe("api", function() {
    it("should share grading in lib.uppersecondary", function() {
      assert.deepEqual(require("../lib.js").uppersecondary.grading, grading);
    });
    it("should share grading in lib.compulsory", function() {
      assert.deepEqual(require("../lib.js").compulsory.grading, grading);
    });
  });
  

  describe("calculateGrade(knowledgeRequirementGrades)", function() {
    /*
      Keys are the input (will split into an array of grades)
      Values are the output (first letter = result.guaranteed, second letter = result.possible).
        If either char is "n", the expected value of the corresponding result entry is false.
    */
    const tests = {
      /*
      When all grades are equal
      */
      "AAAAA": "An",
      "AAAA": "An",
      "AAA": "An",
      "CCCCC": "Cn",
      "CCCC": "Cn",
      "CCC": "Cn",
      "EEEEE": "En",
      "EEEE": "En",
      "EEE": "En",

      /*
      When it's presumed that C is the result but there's a possibility for B
      */
      "AAAAC": "CB",
      "AAACC": "CB",
      "AACCC": "CB",
      "ACCCC": "CB",
      "AAAC": "CB",
      "AACC": "CB",
      "ACCC": "CB",
      "AAC": "CB",
      "ACC": "CB",

      /*
      When it's presumed that E is the result but there's a possibility for D or higher
      */
      "AAEEE": "ED",
      "ACEEE": "ED",
      "AEEEE": "ED",
      "AAEE": "ED",
      "AEEE": "ED",
      "CCEEE": "ED",
      "CEEEE": "ED",
      "CCEE": "ED",
      "CEEE": "ED",
      "CEE": "ED",
      "AAAAE": "ED",
      "AAAEE": "ED",
      "AAACE": "ED",
      "AACCE": "ED",
      "ACCCE": "ED",
      "AACEE": "ED",
      "ACCEE": "ED",
      "AAAE": "ED",
      "AACE": "ED",
      "ACCE": "ED",
      "ACEE": "ED",
      "CCCCE": "ED",
      "CCCEE": "ED",
      "CCCE": "ED",
      "ACE": "ED",
      "AEE": "ED",
      "AAE": "ED",
      "CCE": "ED",

      /*
      The cases when F is the result
      */
      "AAF": "Fn",
      "ACF": "Fn",
      "AEF": "Fn",
      "AFF": "Fn",
      "CCF": "Fn",
      "CEF": "Fn",
      "CFF": "Fn",
      "EEF": "Fn",
      "EFF": "Fn",
      "FFF": "Fn"
    };

    for(let inputGrades in tests) {
      let outputGrades = tests[inputGrades];

      let inputGradesArray = inputGrades.split("");
      let expectedGuaranteed = outputGrades.slice(0, 1);
      let expectedPossible = outputGrades.slice(1, 2);

      if(expectedGuaranteed === "n") expectedGuaranteed = false;
      if(expectedPossible === "n") expectedPossible = false;

      it(`should grade ${inputGradesArray} with guaranteed '${expectedGuaranteed}' and possible '${expectedPossible || "false"}'`, function() {
        let result = grading.calculateGrade(inputGradesArray);
        
        assert.equal(result.guaranteed, expectedGuaranteed, "result.guaranteed");
        assert.equal(result.possible,   expectedPossible,   "result.possible");
      })
    }
  });
});