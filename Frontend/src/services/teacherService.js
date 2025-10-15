import authService from "./authService";
import Config from "../config/signupApi.json";
import { decodeJwt, getJwt } from "./loginService";

export function getMyTeachers(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/teachers`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function decodeMyTeachers({ teachers }) {
  let newteachers = teachers.map((element) => {
    let { firstName, lastName } = element.teacher.personalInfo;
    let { phoneNumber, email } = element.teacher.account;
    return {
      name: `${firstName} ${lastName}`,
      email: email,
      phoneNumber: phoneNumber,
    };
  });
  return newteachers;
}
// /alhbd/2020-2021/absences
export function getTeacherAbsence(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/absences`;
  console.log(route);
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}
export function decodeTeachersAbsence(absences) {
  absences = absences.filter((absence) => absence.teacherInYearId != null);
  let teacherAbsence = absences.map((element) => {
    let { firstName, lastName } = element.teacher.personalInfo;
    let { date, reason } = element;
    return {
      name: `${firstName} ${lastName}`,
      date: date.toString().slice(0, 10).replace(/-/g, " / "),
      reason: reason,
    };
  });
  return teacherAbsence;
}

export function signUpTeacher(teacher) {
  let newTeacher = mapteacherObjToBackend(teacher);
  console.log(JSON.stringify(newTeacher));
  return authService.post(Config.teacherSignupApi, newTeacher);
}

function mapteacherObjToBackend(teacher) {
  let newTeacher = {
    personalInfo: {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      birthDate: teacher.birthDate,
      residentialAddress: teacher.address,
    },
    certification: teacher.specification,
    account: {
      email: teacher.email,
      password: teacher.password,
      phoneNumber: teacher.phoneNumber,
    },
  };
  return newTeacher;
}

export function registerTeacher(years, teacher, siteName) {
  teacher = mapteacherObjToBackend(teacher);
  console.log(JSON.stringify(teacher));
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/teachers/add`;
  return authService.post(route, teacher, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function registerExistingTeacher(teacher, years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/teachers/addExisting`;
  console.log(JSON.stringify(teacher));
  console.log(route);
  return authService.post(route, teacher, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function sendTeacherClasses(
  teacherInYearId,
  schoolClassIds,
  years,
  siteName
) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/teachers/addInClass`;
  let newObj = {
    teacherInYearId,
    schoolClassIds,
  };
  console.log(JSON.stringify(newObj));
  console.log(route);
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

// Teacher Website
export async function getTeacherSchools(account) {
  let route = `http://localhost:3000/teachers/${account.teacherId}/schools`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${account.teacherId}`) },
    });
    let newArr = [];
    for (let school in data) {
      let schools = data[school].map((element) => {
        return {
          schoolId: element.id,
          schoolName: element.schoolName,
          siteName: element.account.siteName,
        };
      });

      let newObj = {
        years: school,
        schools,
      };

      newArr.push(newObj);
    }

    return newArr;
  } catch (error) {
    return [];
  }
}

export async function getTeacherSchedule(
  { teacherId, startYear, endYear },
  semseter
) {
  let route = `http://localhost:3000/teachers/${teacherId}/${startYear}-${endYear}/semesters/${semseter}/sessions`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    console.log(data);
    return data;
  } catch (error) {
    return [];
  }
}

export function getTeacherName(jwt) {
  try {
    let { fullName } = decodeJwt(jwt);
    return fullName;
  } catch (error) {
    return "";
  }
}

// /teachers/1/alhbd/2020-2021/absences/
export async function getAbsences({ teacherId, startYear, endYear, siteName }) {
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/absences`;
  return authService.get(route, {
    headers: { Authorization: getJwt(`teacher-${teacherId}`) },
  });
}
//   try {
//     let { data } = await authService.get(route, {
//       headers: { Authorization: getJwt(`teacher-${teacherId}`) },
//     });
//     // console.log(data);
//     // let absences = data;
//     let absences = data.map((element) => {
//     let { date, reason } = element;
//     return {
//       date: date.toString().slice(0, 10).replace(/-/g, " / "),
//       reason: reason,
//     };
//   });
//   //  console.log(absences)
//    return absences;
//   } catch (error) {
//     return [];
//   }
// }
export function decodeAbsences(absences) {
  absences = absences.map((element) => {
    let { date, reason } = element;
    return {
      date: date.toString().slice(0, 10).replace(/-/g, " / "),
      reason: reason,
    };
  });
  return absences;
}
export function getInformationProfile(teacherId) {
  let route = `http://localhost:3000/teachers/${teacherId}/info`;
  return authService.get(route, {
    headers: { Authorization: getJwt(`teacher-${teacherId}`) },
  });
}

export function decodeInformationProfile(teacher) {
  let firstName = teacher.teacher.personalInfo.firstName;
  let lastName = teacher.teacher.personalInfo.lastName;
  let birthDate = teacher.teacher.personalInfo.birthDate;
  let residentialAddress = teacher.teacher.personalInfo.residentialAddress;
  let certification = teacher.teacher.certification;
  let email = teacher.email;
  let phoneNumber = teacher.phoneNumber;
  return {
    name: firstName + " " + lastName,
    birthDate: birthDate.toString().slice(0, 10).replace(/-/g, " / "),
    email: email,
    phoneNumber: phoneNumber,
    certification: certification,
    residentialAddress: residentialAddress,
    id: teacher.id,
  };
}
export function getNameFromProfile(teacher) {
  let firstName = teacher.teacher.personalInfo.firstName;
  let lastName = teacher.teacher.personalInfo.lastName;
  return `${firstName} ${lastName}`;
}

// Teacher Classes

export async function getTeacherClasses({
  teacherId,
  startYear,
  endYear,
  siteName,
}) {
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes`;

  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    data = data[0].teacherInClasses.map(
      (element) => element.schoolClass.class.name
    );
    return data;
  } catch (error) {
    return [];
  }
}

// Teacher Classrooms

export async function getTeacherClassrooms(
  { teacherId, startYear, endYear, siteName },
  selectedClass
) {
  selectedClass = selectedClass && selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    data = data.map((element) => element.classroomNumber);
    return data;
  } catch (error) {
    return [];
  }
}

// Teacher Classrooms

export async function getTeacherClassroomsId(
  { teacherId, startYear, endYear, siteName },
  selectedClass
) {
  selectedClass = selectedClass && selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    data = data.map((element) => ({
      classroomNumber: element.classroomNumber,
      classroomId: element.id,
    }));
    return data;
  } catch (error) {
    return [];
  }
}

// Teacher subjects

export async function getTeacherSubjects(
  { teacherId, startYear, endYear, siteName },
  selectedClass,
  selectedClassroom,
  selectedSemester
) {
  selectedClass = selectedClass && selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/semesters/${selectedSemester}/subjects`;
  console.log(route);
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    data = data.map((element) => ({
      id: element.subjectInSemesterId,
      name: element.subjectInSemester.subjectInYear.name,
    }));
    return data;
  } catch (error) {
    return [];
  }
}

// Teacher's students

export async function getTeacherStudents(
  { teacherId, startYear, endYear, siteName },
  selectedClass,
  selectedClassroom
) {
  selectedClass = selectedClass && selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/students`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    data = data.map((element) => {
      let {
        firstName,
        lastName,
      } = element.studentInSchool.student.personalInfo;
      return {
        id: element.id,
        name: `${firstName} ${lastName}`,
        mark: "",
      };
    });
    let map = new Map();
    for (let i = 0; i < data.length; i++) map.set(data[i].id, i);
    return [data, map];
  } catch (error) {
    return [[], new Map()];
  }
}

// Teacher's Marks

export async function teacherSetStudentsMarks(
  { teacherId, startYear, endYear, siteName },
  selectedClass,
  selectedClassroom,
  newObj
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/examMarks/add`;
  console.log(route);
  console.log(JSON.stringify(newObj));
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(`teacher-${teacherId}`) },
  });
}

export async function teacherGetStudentsMarks(
  { teacherId, startYear, endYear, siteName },
  selectedClass,
  selectedClassroom,
  selectedSubject,
  selectedType
) {
  selectedClass = selectedClass && selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/subjects/${selectedSubject}/marks/types/${selectedType}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    data = data.exams;
    data = data.map((element) => {
      return {
        dateOfExam: element.dateOfExam,
        fullMark: element.fullMark,
        marks: element.marks.map((item) => {
          return {
            name: `${item.firstName} ${item.lastName}`,
            mark: item.value,
          };
        }),
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}
