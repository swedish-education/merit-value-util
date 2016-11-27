const assert = require("chai").assert;

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
  /*
    Keys are the input (will split into an array of grades)
    Values are the output (first letter = result.guaranteed, second letter = result.possible).
      If either char is "n", the expected value of the corresponding result entry is false.
  */
  const tests = {
    "AAA": "An",
    "AAA": "An",
  };

  for(let inputGrades in tests) {
    let outputGrades = tests[inputGrades];

    let inputGradesArray = inputGrades.split();
    let expectedGuaranteed = outputGrades.slice(0, 1);
    let expectedPossible = outputGrades.slice(1, 1);

    if(expectedGuaranteed === "n") expectedGuaranteed = false;
    if(expectedPossible === "n") expectedPossible = false;

    it(`should grade ${inputGradesArray} with guaranteed '${expectedGuaranteed}' and possible '${expectedPossible || "false"}'`, function() {
      let result = grading.calculateGrade(inputGradesArray);
      
      assert.equal(result.guaranteed, expectedGuaranteed, "result.guaranteed");
      assert.equal(result.possible,   expectedPossible,   "result.possible");
    })
  }
});