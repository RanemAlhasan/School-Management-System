import authService from "./authService";
import Config from "../config/signupApi.json";
import { decodeJwt, getJwt } from "./loginService";

//absence and profile

export function getInformationProfile(studentId) {
  let route = `http://localhost:3000/students/${studentId}/info`;
  return authService.get(route, {
    headers: { Authorization: getJwt(`student-${studentId}`) },
  });
}
export function decodeInformationProfile(student) {
  let firstName = student.student.personalInfo.firstName;
  let lastName = student.student.personalInfo.lastName;
  let birthDate = student.student.personalInfo.birthDate;
  let fatherName = student.student.fatherName;
  let motherName = student.student.motherName;
  let lastSchoolAttended = student.student.lastSchoolAttended;
  let email = student.email;
  let phoneNumber = student.phoneNumber;
  return {
    name: firstName + " " + lastName,
    birthDate: birthDate.toString().slice(0, 10).replace(/-/g, " / "),
    fatherName: fatherName,
    motherName: motherName,
    lastSchoolAttended: lastSchoolAttended,
    email: email,
    phoneNumber: phoneNumber,
    id: student.id,
  };
}
export function getNameFromProfile(student) {
  let firstName = student.student.personalInfo.firstName;
  let lastName = student.student.personalInfo.lastName;
  return `${firstName} ${lastName}`;
}
export function getStudentAbsence(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/absences`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}
export function decodeStudentAbsence(absences) {
  absences = absences.filter((absence) => absence.studentInClassId != null);
  let studentAbsence = absences.map((element) => {
    let { firstName, lastName } = element.student.personalInfo;
    let { studentInClassId, date, reason } = element;
    return {
      id: studentInClassId,
      name: `${firstName} ${lastName}`,
      date: date.toString().slice(0, 10).replace(/-/g, " / "),
      reason: reason,
    };
  });
  return studentAbsence;
}
// get absences for a student
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
export function getAbsences(
  { studentId, startYear, endYear, siteName, parentId },
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/absences`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  return authService.get(route, {
    headers: { Authorization: getJwt(auth) },
  });
}
//end absence and profile
export function signUpStudent(student) {
  let newStudent = getModifiedData(student);
  return authService.post(Config.studentSignupApi, newStudent);
}

export function getModifiedData(student, id) {
  let newStudent = {
    fatherName: student.fatherName,
    motherName: student.motherName,
    lastSchoolAttended: student.lastSchoolAttended,
    schoolClassId: id,
    personalInfo: {
      firstName: student.firstName,
      lastName: student.lastName,
      birthDate: student.birthDate,
      residentialAddress: student.address,
    },
    account: {
      email: student.email,
      password: student.password,
      phoneNumber: student.phoneNumber,
    },
    inLocoParent: {
      account: {
        email: student.parentEmail,
        password: student.parentPassword,
        phoneNumber: student.parentPhoneNumber,
      },
    },
  };
  return newStudent;
}

export function registerStudent(student, years, siteName) {
  console.log(JSON.stringify(student));
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/students/add`;
  return authService.post(route, student, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function registerExistingStudent(student, years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/students/addExisting`;
  console.log(JSON.stringify(student));
  console.log(route);
  return authService.post(route, student, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function getMyStudents(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/students`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function decodeStudents({ students }) {
  console.log(students);
  let newStudents = students.map((element) => {
    let { firstName, lastName } = element.student.personalInfo;
    let { phoneNumber, email } = element.student.account;
    let className = element.studentInClasses[0].schoolClass.class.name;
    let classroomObj = element.studentInClasses[0].classroom;
    return {
      studentId: element.id,
      name: `${firstName} ${lastName}`,
      email: email,
      phoneNumber: phoneNumber,
      className,
      id: element.studentInClasses[0].id,
      createdDate: element.studentInClasses[0].createdAt,
      classroomNumber: classroomObj ? classroomObj.classroomNumber : null,
      capacity: classroomObj ? classroomObj.studentsNumber : null,
    };
  });
  return newStudents;
}

export function getStudentsInClassroom(
  years,
  className,
  classroomNumber,
  siteName
) {
  className = className ? className.replace(" ", "_") : "";
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/classrooms/${classroomNumber}/students`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function getStudentsInClass(years, className, siteName) {
  className = className ? className.replace(" ", "_") : "";
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/students`;
  return authService.get(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function showStudentsInSort(years, className, siteName) {
  try {
    let { data } = await getStudentsInClass(years, className, siteName);
    let students = data.students;
    students = students.map((student) => {
      let { firstName, lastName } = student.student.personalInfo;
      return {
        name: firstName + " " + lastName,
        id: student.studentInClasses[0].id,
      };
    });
    return students;
  } catch (error) {
    return [];
  }
}

export function sendSortedStudents(years, className, sortedStudents, siteName) {
  className = className.replace(" ", "_");

  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/sortStd`;
  console.log(route);
  console.log(JSON.stringify(sortedStudents));
  return authService.post(route, sortedStudents, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function showStudentsInClass(years, className, siteName) {
  try {
    let { data } = await getStudentsInClass(years, className, siteName);
    let students = decodeStudents(data);
    return students;
  } catch (error) {
    return [];
  }
}

export async function showStudentsInClassroom(
  years,
  className,
  classroomNumber,
  siteName
) {
  className = className ? className.replace(" ", "_") : "";
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${className}/classrooms/${classroomNumber}/students`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.students.map((element) => ({
      studentId: element.studentId,
      name:
        element.student.personalInfo.firstName +
        " " +
        element.student.personalInfo.lastName,
    }));
    return data;
  } catch (error) {
    return [];
  }
}

export function layoffStudent(studentId, years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/students/disable`;
  let student = {
    studentId,
  };
  return authService.patch(route, student, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function promoteStudentsClasses(
  years,
  siteName,
  selectedClass,
  students
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${selectedClass}/students/promotion`;
  let stdArr = [];
  for (let student of students) {
    if (student[1]) stdArr.push(student[0]);
  }
  students = {
    studentIds: stdArr,
  };
  console.log(route);
  console.log(JSON.stringify(students));
  return authService.post(route, students, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function sendStudentPayment(
  siteName,
  account,
  studentInClassId,
  value,
  date
) {
  let route = `http://localhost:3000/${siteName}/${account.startYear}-${account.endYear}/students/payments/add`;
  let newObj = {
    studentInClassId,
    value,
    date,
  };
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getStudentPayments(siteName, account, studentId) {
  let route = `http://localhost:3000/${siteName}/${account.startYear}-${account.endYear}/students/${studentId}/payments`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    return data;
  } catch (error) {
    return [];
  }
}
// Student Website

export async function getStudentYears(account, type = "student") {
  let route = `http://localhost:3000/students/${account.studentId}/schools`;
  try {
    let auth =
      type === "student"
        ? `student-${account.studentId}`
        : `parent-${account.parentId}`;
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    data = data.map((element) => {
      return {
        startYear: element.startYear,
        endYear: element.endYear,
        school: element.studentInClasses[0].studentInSchool.school.schoolName,
        siteName:
          element.studentInClasses[0].studentInSchool.school.account.siteName,
        id: element.studentInClasses[0].studentInSchool.school.id,
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function getSiteName(account, type) {
  let data = await getStudentYears(account, type);
  let years = {
    startYear: data[0].startYear,
    endYear: data[0].endYear,
  };
  let siteName = data[0];

  return siteName ? [siteName.siteName, siteName.id, years] : "";
}

function getSchedule(schedule) {
  schedule = schedule.map((element) => {
    return {
      dayName: element.name,
      sessions: element.sessions.map((item) => {
        let { firstName, lastName } = item.teacher.personalInfo;
        return {
          startTime: item.startTime,
          endTime: item.endTime,
          teacher: `${firstName} ${lastName}`,
          subjectName: item.subjectName,
        };
      }),
    };
  });
  return schedule;
}

export async function getStudentSchedule(
  { studentId, parentId, startYear, endYear },
  siteName,
  semester,
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/semesters/${semester}/sessions`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    return getSchedule(data);
  } catch (error) {
    return [];
  }
}

export async function getSchoolSchedule(
  years,
  siteName,
  selectedClass,
  selectedClassroom,
  selectdSemester
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${selectedClass}/classrooms/${selectedClassroom}/semesters/${selectdSemester}/sessions`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`${siteName}`) },
    });
    return getSchedule(data);
  } catch (error) {
    return [];
  }
}

// Announcements
export async function getStudentAnnouncements(
  { studentId, siteName, startYear, endYear, parentId },
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/announcements`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    console.log(data);
    return data;
  } catch (error) {
    return [];
  }
}

export async function getStudentTeachers(
  { studentId, siteName, startYear, endYear, parentId },
  semester,
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/semesters/${semester}/teachers`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    data = data.map((element) => ({
      name:
        element.personalInfo.firstName + " " + element.personalInfo.lastName,
      email: element.account.email,
      phoneNumber: element.account.phoneNumber,
      subjects: element.subjects,
    }));
    return data;
  } catch (error) {
    return [];
  }
}

export async function studentWebsitePayments(
  { startYear, endYear, studentId, siteName, parentId },
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/payments`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    return data;
  } catch (error) {
    return [];
  }
}

export function getStudentName(jwt) {
  try {
    let decodedJwt = decodeJwt(jwt);
    return decodedJwt.fullName;
  } catch (error) {
    return "";
  }
}
