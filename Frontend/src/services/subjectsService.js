import authService from "./authService";
import { getJwt } from "./loginService";

export function getGeneralCategories() {
  return authService.get("http://localhost:3000/categories");
}

export function sendMySubjects(years, selectedClass, subjects, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/${selectedClass}/subjects/add`;

  let newObj = subjects.map((subject) => {
    return {
      categoryId: subject.categoryId,
      name: subject.name,
      subjectInSemesters: subject.checkedSemesters.map((semester) => ({
        semester: semester,
      })),
    };
  });
  newObj = {
    subjects: newObj,
  };
  console.log(JSON.stringify(newObj));
  console.log(route);
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function getMySubjects(years, ClassName, semesternumber, siteName) {
  ClassName = getConcatName(ClassName);
  semesternumber = getConcatNumber(semesternumber);
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/${ClassName}/${semesternumber}/subjects`;
  console.log(route);
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}
function getConcatNumber(semester) {
  if (semester === "First semester") return 1;
  else if (semester === "Second semester") return 2;
}

export function decodeSubject({ subjects }, category) {
  subjects = subjects.map((element) => [
    `Category name : ${category[element.subjectInYear.categoryId - 1]}`,
    `Subject name :  ${element.subjectInYear.name}`,
  ]);
  return subjects;
}

function getConcatName(name) {
  let newName = name.split(" ");
  return newName.length === 1 ? newName[0] : newName[0] + "_" + newName[1];
}

// /alhbd/2020-2021/Second_Grade/subjects
export function getMySubjectsDeletion(years, className, siteName) {
  className = getConcatName(className);
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/${className}/subjects`;
  console.log(route);
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function decodeSubjectsDeletion(subjects) {
  let newsubjects = subjects.subjects.map((element) => {
    return {
      name: element.name,
      id: element.id,
    };
  });
  return newsubjects;
}

// /alhbd/2020-2021/classes/Preschool/1
export function deleteSubject(
  siteName,
  { startYear, endYear },
  className,
  subjectInYearId
) {
  className = className.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${startYear}-${endYear}/classes/${className}/${subjectInYearId}`;
  return authService.delete(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}
