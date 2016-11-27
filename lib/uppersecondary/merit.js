const Grades = require("../grading.js").Grades;

const Courses = module.exports.Courses = {
  ModernLanguages: {
    "MODXXX03": 3,
    "MODXXX04": 4,
    "MODXXX05": 5,
    "MODXXX06": 6,
    "MODXXX07": 7
  },
  HearingLanguages: {
    "SVTSVT03": 3,
    "SVTSVT04": 4,
    "SVTSVT05": 5,
    "SVTSVT06": 6,
    "SVTSVT07": 7
  },
  English: {
    "ENGENG07": 7
  },
  Mathematics: {
    "MATMAT03": 3,
    "MATMAT03b": 3,
    "MATMAT03c": 3,
    "MATMAT04": 4,
    "MATMAT05": 5,
    "MATMAT00S": 6
  }
}

module.exports.getSubjectLevelsOfStudy = function getSubjectLevelsOfStudy(courseMappings, passedCoursesSet, specialRequirementsSet) {
  if(!(passedCoursesSet != null && typeof passedCoursesSet !== "Set")) throw new Error("passedCoursesSet must be a Set");
  if(!(specialRequirementsSet != null && typeof specialRequirementsSet !== "Set")) throw new Error("specialRequirementsSet must be a Set");

  let requirementLevel = 0;
  let levels = new Set();

  for(let code in courseMappings) {
    if(!courseMappings.hasOwnProperty(code)) continue;

    if(passedCoursesSet.has(code)) {
      levels.add(courseMappings[code]);
    }

    if(specialRequirementsSet.has(code)) {
      requirementLevel = Math.max(courseMappings[code], requirementLevel);
    }
  }
  return [levels, requirementLevel];
}

module.exports.getMeritPoints = function getMeritPoints(passedCourses, specialRequirements = []) {
  if(!(passedCourses != null && typeof passedCourses[Symbol.iterator] === "function")) throw new Error("passedCourses must be iterable");
  if(!(specialRequirements != null && typeof specialRequirements[Symbol.iterator] === "function")) throw new Error("specialRequirements must be iterable");

  const passedCoursesSet = new Set(passedCourses);
  const specialRequirementsSet = new Set(specialRequirements);

  const [modernLanguageLevels, modernLanguageRequirementLevel] = module.exports.getSubjectLevelsOfStudy(Courses.ModernLanguages, passedCoursesSet, specialRequirementsSet); //lowest level of special requirements for entry
  const [hearingLanguageLevels, hearingLanguageRequirementLevel] = module.exports.getSubjectLevelsOfStudy(Courses.HearingLanguages, passedCoursesSet, specialRequirementsSet); //lowest level of special requirements for entry
  const [englishLevels, englishRequirementLevel] = module.exports.getSubjectLevelsOfStudy(Courses.English, passedCoursesSet, specialRequirementsSet);  //lowest level of special requirements for entry
  const [mathematicsLevels, mathematicsRequirementLevel] = module.exports.getSubjectLevelsOfStudy(Courses.Mathematics, passedCoursesSet, specialRequirementsSet); //lowest level of special requirements for entry

  let modernLanguagePoints = 0;
  let hearingLanguagePoints = 0;
  let englishPoints = 0;
  let mathematicsPoints = 0;

  if(modernLanguageLevels.has(3) && modernLanguageRequirementLevel < 3) modernLanguagePoints += 0.5;
  if(modernLanguageLevels.has(4) && modernLanguageRequirementLevel < 4) modernLanguagePoints += 1;
  if(modernLanguageLevels.has(5) && modernLanguageRequirementLevel < 5) modernLanguagePoints += 0.5;

  if(hearingLanguageLevels.has(3) && hearingLanguageRequirementLevel < 3) hearingLanguagePoints += 0.5;
  if(hearingLanguageLevels.has(4) && hearingLanguageRequirementLevel < 4) hearingLanguagePoints += 1;
  if(hearingLanguageLevels.has(5) && hearingLanguageRequirementLevel < 5) hearingLanguagePoints += 0.5;

  if(englishLevels.has(7) && englishRequirementLevel < 7) englishPoints += 1;

  if(mathematicsLevels.has(2) && mathematicsRequirementLevel < 2) mathematicsPoints += 0.5;
  if(mathematicsLevels.has(3) && mathematicsRequirementLevel < 3) mathematicsPoints += 0.5;
  if(mathematicsLevels.has(4) && mathematicsRequirementLevel < 4) mathematicsPoints += 0.5;
  if(mathematicsLevels.has(5) && mathematicsRequirementLevel < 5) mathematicsPoints += 1;
  if(mathematicsLevels.has(6)) mathematicsPoints += 0.5 * (passedCourses.filter(code => code === "MATMAT00S").length);

  return Math.min(2.5, 
    Math.min(1.5, modernLanguagePoints) +
    Math.min(1.5, hearingLanguagePoints) +
    Math.min(1, englishPoints) +
    Math.min(1.5, mathematicsPoints)
  );
}