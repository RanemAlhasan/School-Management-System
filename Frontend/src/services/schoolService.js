import authService from "./authService";
import Config from "../config/signupApi.json";
import { getJwt, getUser } from "./loginService";

export function signUpSchool(school) {
  let newSchool = {
    schoolName: school.name,
    location: school.location,
    foundationDate: school.openingDate,
    facebookPage: school.facebookPage ? school.facebookPage : null,
    account: {
      siteName: school.siteName,
      email: school.email,
      password: school.password,
      phoneNumber: school.phoneNumber,
    },
  };
  console.log(JSON.stringify(newSchool));
  return authService.post(Config.schoolSignupApi, newSchool);
}

export function getSchoolName() {
  let user = getUser();
  return user ? user.siteName : "";
}

export function sendSchoolInfo(
  { startTime, endTime, numOfBreaks, breakDuration, sessionDuration },
  checkedDays,
  years,
  siteName
) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/generalInfo/add`;

  let newObj = {
    startTime,
    endTime,
    breakFrequency: numOfBreaks,
    breakDuration,
    sessionDuration,
    activeDays: checkedDays,
  };

  console.log(route);
  console.log(JSON.stringify(newObj));

  return authService.patch(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getSchoolInfo(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/generalInfo/get`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    data = {
      breakFrequency: data.breakFrequency,
      breakDuration: data.breakDuration,
      sessionDuration: data.sessionDuration,
      startTime: data.startTime,
      activeDays: data.activeDaysInGeneralInfos
        ? data.activeDaysInGeneralInfos.map((element) => element.dayId)
        : [],
    };
    return data;
  } catch (error) {
    return {};
  }
}

export function sendSchoolContent(schoolContent, types, siteName) {
  schoolContent = schoolContent.map((element, index) => {
    return {
      type: types[index],
      header: element.header,
      body: element.body,
    };
  });
  let route = `http://localhost:3000/${siteName}/contents/add`;
  return authService.post(route, schoolContent, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getDays() {
  let route = `http://localhost:3000/days`;
  try {
    let { data } = await authService.get(route);
    return data;
  } catch (error) {
    return [];
  }
}

export function sendSessions(sessions, classroom, years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/sessions/add`;
  sessions = sessions.map((element) => ({
    subjectInSemesterId: element.subjectId,
    teacherInClassId: element.teacherId,
    dayId: element.dayId,
    startTime: element.startTime,
    endTime: element.endTime,
  }));

  let newObj = {
    classroomId: classroom,
    sessions: sessions,
  };

  console.log(JSON.stringify(newObj));

  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function sendClassExamSchedule(
  schoolClassId,
  schedule,
  years,
  siteName,
  examTypeId
) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/examSchedule/add`;
  let newObj = {
    schoolClassId: schoolClassId,
    examTypeId,
    scheduledExams: schedule,
  };
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export function sendClassroomExamSchedule(
  classroomId,
  schedule,
  years,
  siteName,
  examTypeId
) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/examSchedule/add`;
  let newObj = {
    classroomId: classroomId,
    examTypeId,
    scheduledExams: schedule,
  };
  return authService.post(route, newObj, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getSchoolComplaints(years, siteName) {
  let route = `http://localhost:3000/${siteName}/${years.startYear}-${years.endYear}/announcements`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function getPublicContent(siteName) {
  let route = `http://localhost:3000/${siteName}/contents`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    return data;
  } catch (error) {
    return [];
  }
}

export async function getPublicInfo(siteName) {
  let route = `http://localhost:3000/schools/${siteName}/info`;
  try {
    let { data } = await authService.get(route, {
      headers: { Authorization: getJwt(siteName) },
    });
    console.log(data);
    return data;
  } catch (error) {
    return [];
  }
}

export async function editContent(siteName, content) {
  console.log(content);
  let route = `http://localhost:3000/${siteName}/contents/${content.id}`;
  return authService.patch(route, content, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function deletePublicContent(siteName, id) {
  let route = `http://localhost:3000/${siteName}/contents/${id}`;
  return authService.delete(route, {
    headers: { Authorization: getJwt(siteName) },
  });
}

export async function getRegisteredSchool() {
  let route = `http://localhost:3000/schoolNames`;
  try {
    let { data } = await authService.get(route);
    return data;
  } catch (error) {
    return [];
  }
}
