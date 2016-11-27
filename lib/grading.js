/*global Grades*/

const Grades = module.exports.Grades = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  None: false
};

module.exports.calculateGrade = function calculateGrade(knowledgeRequirementGrades) {


  let gradeMap = new Map();

  for(let grade of knowledgeRequirementGrades) {
    if("ACEF".indexOf(grade) < 0) throw new Error("${grade} is not a valid grade");
    if(gradeMap.has(grade)) {
      gradeMap.set(grade, gradeMap.get(grade) + 1);
    } else {
      gradeMap.set(grade, 1);
    }
  }

  if(gradeMap.has("F")) {
    return {
      guaranteed: "F",
      possible: false
    }
  }

  let uniqueGrade = gradeMap.entries().next().value[0];
  function isUniqueGrade() {
    for (let key of gradeMap.keys()) {
      if(key !== uniqueGrade) {
        return false;
      }
    }
  return true;
  }

  if(isUniqueGrade()) {
    return {
      guaranteed: uniqueGrade,
      possible: false
    }
  }

  let lowestGrade = gradeMap.entries().next().value[0];
  for (let key of gradeMap.keys()) {
    if(lowestGrade < key) {
      lowestGrade = key;
    }
  }

  for (let key of gradeMap.keys()) {
    if(key < lowestGrade) {
      if(lowestGrade === "E") {
        return {
        guaranteed: lowestGrade,
        possible: "D"
        }
      }
      if(lowestGrade === "C") {
        return {
          guaranteed: lowestGrade,
          possible: "B"
        }
      }
    }  
  }
  return {
    guaranteed: lowestGrade,
    possible: false
  };
}