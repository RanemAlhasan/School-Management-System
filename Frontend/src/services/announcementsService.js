import authService from "./authService";
import { getJwt } from "./loginService";

export async function getStudentsAnnouncements(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/students`;

  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    let students = data.students;
    students = students.map((element) => {
      return {
        name:
          element.student.personalInfo.firstName +
          " " +
          element.student.personalInfo.lastName,
        studentId: element.studentInClasses[0].id,
      };
    });
    return students;
  } catch (error) {
    return [];
  }
}

export async function getClassesAnnouncements(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.schoolClasses;
    data = data.map((element) => {
      return {
        schoolClassId: element.id,
        className: element.class.name,
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function getClassroomsAnnouncements(
  years,
  selectedClass,
  siteName
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${selectedClass}/classrooms`;
  console.log(route);
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.classrooms;
    data = data.map((element) => {
      return {
        classroomId: element.id,
        classroomNumber: element.classroomNumber,
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function sendAnnouncements(
  selectedDestination,
  destinationId,
  heading,
  body,
  date,
  attachements,
  years,
  siteName,
  id
) {
  let destination;
  switch (selectedDestination) {
    case "Class":
      destination = "destinationSchoolClassId";
      break;
    case "Classroom":
      destination = "destinationClassroomId";
      break;
    case "Student":
      destination = "destinationStudentInClassId";
      break;
    case "Teacher":
      destination = "destinationTeacherInYearId";
      break;
    default:
  }

  let json = {
    [destination]: destinationId,
    heading,
    body,
    date,
    announcementTypeId: id,
  };

  console.log(JSON.stringify(json));

  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/announcements/add`;
  let metaData = new FormData();

  metaData.append("json", JSON.stringify(json));
  for (let file of attachements) {
    metaData.append("uploads", file);
  }

  return authService.post(route, metaData, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: getJwt(siteName),
    },
  });
}

export async function showTeachersInYear(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/teachers`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.teachers.map((element) => {
      let { firstName, lastName } = element.teacher.personalInfo;
      return {
        name: `${firstName} ${lastName}`,
        id: element.teacherInYears[0].id,
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function showTeachersInClass(selectedClass, years, siteName) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/classes/${selectedClass}/teachers`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = data.teachers.map((element) => {
      let { firstName, lastName } = element.teacher.personalInfo;
      return {
        name: `${firstName} ${lastName}`,
        id: element.teacherInYears[0].teacherInClasses[0].id,
      };
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function sendComplaints(
  heading,
  body,
  attachments,
  siteName,
  id,
  { startYear, endYear, studentId }
) {
  let json = {
    destinationSchoolId: id,
    heading,
    body,
    date: new Date().toDateString(),
    announcementTypeId: 1,
  };

  console.log(JSON.stringify(json));

  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/announcements/add`;
  let metaData = new FormData();

  metaData.append("json", JSON.stringify(json));
  for (let file of attachments) {
    metaData.append("uploads", file);
  }

  return authService.post(route, metaData, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: getJwt(`student-${studentId}`),
    },
  });
}

export async function sendTeacherAnnouncements(
  heading,
  body,
  attachments,
  id,
  { startYear, endYear, teacherId, siteName },
  announcementTypeId
) {
  let json = {
    destinationClassroomId: id,
    heading,
    body,
    date: new Date().toDateString(),
    announcementTypeId,
  };

  console.log(JSON.stringify(json));

  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/announcements/add`;
  let metaData = new FormData();

  metaData.append("json", JSON.stringify(json));
  for (let file of attachments) {
    metaData.append("uploads", file);
  }

  return authService.post(route, metaData, {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: getJwt(`teacher-${teacherId}`),
    },
  });
}

export async function getTeacherAnnouncements({
  teacherId,
  startYear,
  endYear,
  siteName,
}) {
  let route = `http://localhost:3000/teachers/${teacherId}/${siteName}/${startYear}-${endYear}/announcements`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(`teacher-${teacherId}`) },
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function getFile(attachements) {
  try {
    let data = await authService.get(
      `http://localhost:3000/getFile/${attachements}`
    );
    return data.config.url;
  } catch (error) {
    return "";
  }
}

function decodeSchedule(data) {
  return data.map((element) => {
    return element.map((item) => ({
      date: new Date(item.date).toDateString(),
      subject: item.subjectInSemester.subjectInYear.name,
      time: `${item.startTime} - ${item.endTime}`,
      id: item.id,
    }));
  });
}

export async function getExamSchedule(
  account,
  siteName,
  selectedClass,
  selectedClasroom
) {
  selectedClass = selectedClass.replace(" ", "_");
  let route = `http://localhost:3000/${siteName}/${account.startYear}-${account.endYear}/classes/${selectedClass}/classrooms/${selectedClasroom}/examSchedule/get`;
  console.log(route);
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = decodeSchedule(data);

    return data;
  } catch (error) {
    return [];
  }
}

export async function getStudentExamSchedule(
  { startYear, endYear, siteName, studentId, parentId },
  type = "student"
) {
  let route = `http://localhost:3000/students/${studentId}/${siteName}/${startYear}-${endYear}/examSchedule`;
  let auth = type === "student" ? `student-${studentId}` : `parent-${parentId}`;
  console.log(auth);
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(auth) },
    });
    data = decodeSchedule(data);
    return data;
  } catch (error) {
    return [];
  }
}

export async function getExamId() {
  let route = `http://localhost:3000/announcementTypes`;
  try {
    let { data } = await authService.get(route);
    let examId = data.find((element) => element.name === "Exam").id;
    return examId;
  } catch (error) {
    return 1;
  }
}

export async function getHomeworkId() {
  let route = `http://localhost:3000/announcementTypes`;
  try {
    let { data } = await authService.get(route);
    let examId = data.find((element) => element.name === "Homework").id;
    return examId;
  } catch (error) {
    return 1;
  }
}

export async function getScientificId() {
  let route = `http://localhost:3000/announcementTypes`;
  try {
    let { data } = await authService.get(route);
    let examId = data.find((element) => element.name === "Scientific Content")
      .id;
    return examId;
  } catch (error) {
    return 1;
  }
}
