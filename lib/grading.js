module.exports.Grades = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  None: false
};

module.exports.calculateGrade = function calculateGrade(knowledgeRequirementGrades) {
  return {
    guaranteed: "E",
    possible: "E"
  };
}