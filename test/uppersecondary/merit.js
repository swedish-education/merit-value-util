const assert = require("chai").assert;

describe("uppersecondary.merit", function() {
  const merit = require("../../lib.js").uppersecondary.merit;

  describe("getSubjectLevelsOfStudy(courseMappings, passedCoursesSet, specialRequirementsSet)", function() {
    it("should return properly", function() {
      for(let type in merit.Courses) {
        if(!merit.Courses.hasOwnProperty(type)) continue;

        let currentCourses = new Set();
        let currentLevels = new Set();
        for(let code in merit.Courses[type]) {
          if(!merit.Courses[type].hasOwnProperty(code)) continue;
          currentCourses.add(code);
          
          let currentRequirements = new Set();
          for(let code in merit.Courses[type]) {
            if(!merit.Courses[type].hasOwnProperty(code)) continue;
            currentRequirements.add(code);
          
            let [levels, requirementLevel] = merit.getSubjectLevelsOfStudy(merit.Courses[type], currentCourses, currentRequirements);
            assert.equal(requirementLevel, merit.Courses[type][code]);
          }
        }
      }
    });
  });

  describe("getMeritPoints(passedCourses, specialRequirements)", function() {
    const testCases = [
      { passed: ["MATMAT03b"], requirements: [], expected: 0.5 },
      { passed: ["MATMAT03c"], requirements: [], expected: 0.5 },
      { passed: ["MATMAT04"], requirements: [], expected: 0.5 },
      { passed: ["MATMAT05"], requirements: [], expected: 1 },
      { passed: ["MATMAT00S"], requirements: [], expected: 0.5 },
      { passed: ["MATMAT00S", "MATMAT00S"], requirements: [], expected: 1.0 },
      { passed: ["MATMAT00S", "MATMAT00S", "MATMAT00S"], requirements: [], expected: 1.5 },
      { passed: ["MATMAT00S", "MATMAT00S", "MATMAT00S", "MATMAT00S"], requirements: [], expected: 1.5 },
      
      { passed: ["MATMAT03b"], requirements: ["MATMAT03c"], expected: 0 },
      { passed: ["MATMAT03c"], requirements: ["MATMAT03c"], expected: 0 },
      { passed: ["MATMAT03b"], requirements: ["MATMAT03b"], expected: 0 },
      { passed: ["MATMAT03c"], requirements: ["MATMAT03b"], expected: 0 },
      { passed: ["MATMAT03b"], requirements: ["MATMAT03"], expected: 0 },
      { passed: ["MATMAT03c"], requirements: ["MATMAT03"], expected: 0 },

      { passed: ["MATMAT03", "MATMAT04"], requirements: ["MATMAT04"], expected: 0 },
      { passed: ["MATMAT03", "MATMAT04", "MATMAT05"], requirements: ["MATMAT05"], expected: 0 },

      { passed: ["MODXXX03", "MODXXX04"], requirements: ["MODXXX04"], expected: 0 },
      { passed: ["MODXXX03", "MODXXX04", "MODXXX05"], requirements: ["MODXXX05"], expected: 0 },

      { passed: ["ENGENG07", "MATMAT04", "MATMAT05", "MATMAT00S"], requirements: ["MATMAT04"], expected: 2.5 },
      { passed: ["ENGENG07", "MATMAT05", "MATMAT00S"], requirements: ["MATMAT04"], expected: 2.5 },
      { passed: ["ENGENG07", "MATMAT05"], requirements: ["MATMAT04"], expected: 2.0 },

      { passed: ["ENGENG07"], requirements: [], expected: 1 },
      { passed: ["ENGENG07", "ENGENG07"], requirements: [], expected: 1 },
      { passed: ["ENGENG07"], requirements: ["ENGENG07"], expected: 0 },

      { passed: ["MODXXX03"], requirements: [], expected: 0.5 },
      { passed: ["MODXXX04"], requirements: [], expected: 1 },
      { passed: ["MODXXX05"], requirements: [], expected: 0.5 },

      { passed: ["MODXXX03"], requirements: ["MODXXX03"], expected: 0 },
      { passed: ["MODXXX03", "MODXXX04"], requirements: ["MODXXX04"], expected: 0 },
      { passed: ["MODXXX03", "MODXXX04", "MODXXX05"], requirements: ["MODXXX05"], expected: 0 }
    ];

    describe("exceptions", function() {
      it(`should fail if not passed iterables`, function() {
        assert.throws(function() {
          merit.getMeritPoints(2, ["iterable"])
        });
        assert.throws(function() {
          merit.getMeritPoints(["iterable"], 3)
        });
        assert.throws(function() {
          merit.getMeritPoints(false, false)
        });
      });
      it(`should not fail if passed iterables`, function() {
        assert.doesNotThrow(function() {
          merit.getMeritPoints(["iterable"], new Set());
        });
        assert.doesNotThrow(function() {
          merit.getMeritPoints(new Map(), "iterable string");
        });
      });
    })
    it(`should return expected values`, function() {
      for(let testCase of testCases) {
        let result = merit.getMeritPoints(testCase.passed, testCase.requirements);

        assert.equal(result, testCase.expected, `passed courses ${testCase.passed}, requirements ${testCase.requirements}`);
      }
    });
  });
});