import authService from "./authService";
import { getJwt } from "./loginService";
import baseURL from "../config/baseURL.json";

export function addClassrooms(classrooms, years, className, siteName) {
  let newArr = classrooms.map((element) => {
    return {
      classroomNumber: parseInt(element.number),
      studentsNumber: parseInt(element.capacity),
    };
  });
  let resultObj = {
    classrooms: [...newArr],
  };
  className = getConcatName(className);
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/classrooms/add`;
  console.log(route);
  return authService.post(route, resultObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function getClassrooms(years, className, siteName) {
  className = getConcatName(className);
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/classrooms`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

function getConcatName(name) {
  let newName = name.split(" ");
  return newName.length === 1 ? newName[0] : newName[0] + "_" + newName[1];
}

export function decodeClassrooms({ classrooms }) {
  classrooms = classrooms.map((element) => [
    `Classroom number is ${element.classroomNumber}`,
    `Capacity is ${element.studentsNumber}`,
  ]);
  return classrooms;
}

export function decodeClassroomsNumber({ classrooms }) {
  classrooms = classrooms.map((element) => element.classroomNumber);
  classrooms = classrooms.sort((a, b) => {
    if (a < b) return -1;
    return 1;
  });
  return classrooms;
}

export function getClassroomsInSort(years, className, siteName) {
  className = getConcatName(className);
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/classrooms`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function showClassroomsInSort(years, className, siteName) {
  try {
    let { data } = await getClassroomsInSort(years, className, siteName);
    let classrooms = data.classrooms;
    classrooms = classrooms.map((element) => ({
      number: element.classroomNumber,
      capacity: element.studentsNumber,
    }));
    return classrooms;
  } catch (error) {
    return [];
  }
}

export function sendAutomaticSortedStudents(
  years,
  className,
  sortType,
  students,
  siteName
) {
  className = className.replace(" ", "_");
  students = students.map((element) => {
    return {
      studentsNumber: element.studentsCount,
      classroomNumber: element.number,
    };
  });
  console.log(JSON.stringify(students));
  let route = `${baseURL.baseURL}/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/sortStd/auto/${sortType}`;
  console.log(route);
  console.log(JSON.stringify(students));
  return authService.patch(route, students, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getClassroomsDeletion(
  selectedClass,
  siteName,
  { startYear, endYear }
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms`;
  console.log(route);
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.classrooms.map((element) => ({
      number: element.classroomNumber,
      id: element.id,
    }));
    return data;
  } catch (error) {
    return [];
  }
}

export function deleteClassroom(
  selectedClass,
  number,
  siteName,
  { startYear, endYear }
) {
  let route = `http://localhost:3000/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms/${number}`;
  return authService.delete(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}
